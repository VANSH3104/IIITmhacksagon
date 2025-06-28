"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Users, Vote, AlertCircle, CheckCircle, XCircle, User, Briefcase, Timer, Loader } from 'lucide-react';
import { getContract } from '@/Hook/useContract';
import { Disputedialog } from './disputepopup.jsx';
export const DisputedViews = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [userVotes, setUserVotes] = useState({});
  const [userReputation] = useState(75);

  const fetchDisputeData = useCallback(async (jobId) => {
    try {
      const contract = await getContract();
      const jobData = await contract.jobs(jobId);
      const disputeData = await contract.disputes(jobId);
      const clientProfile = await contract.users(jobData.client);
      const freelancerProfile = await contract.users(jobData.freelancer);
      
      return {
        jobId: Number(jobData.jobId),
        jobTitle: jobData.jobTitle,
        description: jobData.description,
        client: {
          address: jobData.client,
          reputation: Number(clientProfile.reputation)
        },
        freelancer: {
          address: jobData.freelancer,
          reputation: Number(freelancerProfile.reputation)
        },
        price: jobData.price.toString(),
        raisedBy: disputeData.raisedBy,
        createdAt: Number(disputeData.createdAt) * 1000,
        votingPeriod: 7 * 24 * 60 * 60 * 1000,
        votesForClient: Number(disputeData.votesForClient),
        votesForFreelancer: Number(disputeData.votesForFreelancer),
        resolved: disputeData.resolved
      };
    } catch (err) {
      console.error("Error fetching dispute data:", err);
      return null;
    }
  }, []);

  const loadDisputes = useCallback(async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      const totalJobs = Number(await contract.getTotalJobs());
      const disputedJobIds = [];
      
      for (let i = 1; i <= totalJobs; i++) {
        const job = await contract.jobs(i);
        const jobStatus = Number(job.status);
        if (jobStatus === 3) {
          disputedJobIds.push(i);
        }
      }
      
      const disputePromises = disputedJobIds.map(jobId => fetchDisputeData(jobId));
      const disputesData = await Promise.all(disputePromises);
      
      const validDisputes = disputesData
        .filter(dispute => dispute !== null)
        .sort((a, b) => b.createdAt - a.createdAt);
      
      setDisputes(validDisputes);
    } catch (err) {
      console.error("Error loading disputes:", err);
    } finally {
      setLoading(false);
    }
  }, [fetchDisputeData]);

  const handleVote = useCallback(async (jobId, supportsFreelancer) => {
    if (userReputation < 20) {
      alert("Insufficient reputation to vote (minimum 20 required)");
      return;
    }

    try {
      const contract = await getContract();
      const tx = await contract.voteOnDispute(jobId, supportsFreelancer);
      await tx.wait();
      
      setUserVotes(prev => ({ ...prev, [jobId]: supportsFreelancer }));
      
      setDisputes(prev => prev.map(dispute => {
        if (dispute.jobId === jobId) {
          return {
            ...dispute,
            votesForFreelancer: supportsFreelancer 
              ? dispute.votesForFreelancer + userReputation 
              : dispute.votesForFreelancer,
            votesForClient: !supportsFreelancer 
              ? dispute.votesForClient + userReputation 
              : dispute.votesForClient
          };
        }
        return dispute;
      }));
      
      setTimeout(loadDisputes, 2000);
    } catch (err) {
      console.error("Error voting on dispute:", err);
      alert("Failed to vote. See console for details.");
    }
  }, [userReputation, loadDisputes]);

  const resolveDispute = useCallback(async (jobId) => {
    try {
      const contract = await getContract();
      const tx = await contract.resolveDispute(jobId);
      await tx.wait();
      
      setDisputes(prev => prev.map(dispute => {
        if (dispute.jobId === jobId) {
          return { ...dispute, resolved: true };
        }
        return dispute;
      }));
      
      setTimeout(loadDisputes, 2000);
    } catch (err) {
      console.error("Error resolving dispute:", err);
      alert("Failed to resolve dispute. See console for details.");
    }
  }, [loadDisputes]);

  // Load disputes on component mount and set up refresh
  useEffect(() => {
    loadDisputes();
    const refreshInterval = setInterval(loadDisputes, 100000);
    return () => clearInterval(refreshInterval);
  }, [loadDisputes]);

  // Fast-forward time effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(prev => prev + (1000 * timeMultiplier));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeMultiplier]);

  // Auto-resolve expired disputes
  useEffect(() => {
    const checkAndResolveDisputes = async () => {
      const unresolvedDisputes = disputes.filter(
        dispute => !dispute.resolved && getTimeRemaining(dispute) <= 0
      );

      for (const dispute of unresolvedDisputes) {
        try {
          await resolveDispute(dispute.jobId);
          console.log(`Auto-resolved dispute ${dispute.jobId}`);
        } catch (err) {
          console.error(`Failed to auto-resolve dispute ${dispute.jobId}:`, err);
        }
      }
    };

    const interval = setInterval(checkAndResolveDisputes, 120000);
    return () => clearInterval(interval);
  }, [disputes, resolveDispute]);

  const getTimeRemaining = (dispute) => {
    const elapsed = currentTime - dispute.createdAt;
    const remaining = dispute.votingPeriod - elapsed;
    return Math.max(0, remaining);
  };

  const formatTimeRemaining = (milliseconds) => {
    if (milliseconds <= 0) return "Ended";
    
    const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
    const hours = Math.floor((milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getWinningPercentage = (dispute) => {
    const total = dispute.votesForClient + dispute.votesForFreelancer;
    if (total === 0) return { client: 50, freelancer: 50 };
    
    return {
      client: Math.round((dispute.votesForClient / total) * 100),
      freelancer: Math.round((dispute.votesForFreelancer / total) * 100)
    };
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300 text-sm">Loading disputes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <AlertCircle className="text-red-400 w-5 h-5 sm:w-6 sm:h-6" />
            Dispute Resolution
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">Community-driven dispute resolution</p>
          
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 bg-slate-800 rounded-lg p-2 sm:p-3 ">
            <Timer className="text-blue-400 w-4 h-4" />
            <span className="text-white text-xs sm:text-sm">Speed:</span>
            <div className="flex gap-1">
              {[1, 60, 3600, 86400].map(multiplier => (
                <button
                  key={multiplier}
                  onClick={() => setTimeMultiplier(multiplier)}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                    timeMultiplier === multiplier
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {multiplier === 1 ? '1x' : multiplier === 60 ? '1m' : multiplier === 3600 ? '1h' : '1d'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 overflow-y-auto max-h-[75vh] pr-2">
          {disputes.map(dispute => {
            const timeRemaining = getTimeRemaining(dispute);
            const isVotingEnded = timeRemaining <= 0;
            const hasVoted = userVotes[dispute.jobId] !== undefined;
            const percentages = getWinningPercentage(dispute);
            const freelancerWinning = dispute.votesForFreelancer >= dispute.votesForClient;

            return (
              <div key={dispute.jobId} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="bg-red-500/20 p-1.5 sm:p-2 rounded-full">
                      <AlertCircle className="text-red-400 w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-white">Job #{dispute.jobId}</h3>
                      <p className="text-slate-400 text-xs">By {truncateAddress(dispute.raisedBy)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm sm:text-base font-bold ${isVotingEnded ? 'text-red-400' : 'text-blue-400'}`}>
                      <Clock className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {formatTimeRemaining(timeRemaining)}
                    </div>
                    <p className="text-slate-400 text-xs hidden sm:block">
                      {isVotingEnded ? 'Ended' : 'Remaining'}
                    </p>
                  </div>
                </div>

                <div className="mb-2 sm:mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-1 sm:p-2">
                    <Briefcase className="w-4 h-4 text-white mx-auto mb-1 sm:mb-2" />
                    <h2 className="text-sm sm:text-lg font-bold text-white mb-1 text-center leading-tight">{dispute.jobTitle}</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-3 border-l-2 sm:border-l-4 border-red-400">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="text-red-400 w-4 h-4" />
                      <Disputedialog
                        address={dispute.client.address}
                        triggerButton={
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-white">Client</h4>
                          <p className="text-slate-500 text-xs font-mono truncate">{truncateAddress(dispute.client.address)}</p>
                          <p className="text-slate-400 text-xs">Rep: {dispute.client.reputation}</p>
                        </div>
                        }
                      />
                        
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Votes</span>
                        <span className="text-white font-semibold">{dispute.votesForClient}</span>
                      </div>
                      <div className="bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-red-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentages.client}%` }}
                        />
                      </div>
                      <p className="text-center text-slate-300 text-xs mt-1">{percentages.client}%</p>
                    </div>

                    {!isVotingEnded && !hasVoted && (
                      <button
                        onClick={() => handleVote(dispute.jobId, false)}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded text-xs transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <Vote className="w-3 h-3" />
                        Vote Client
                      </button>
                    )}

                    {hasVoted && userVotes[dispute.jobId] === false && (
                      <div className="w-full bg-red-600 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Voted
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border-l-2 sm:border-l-4 border-green-400">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="text-green-400 w-4 h-4" />
                      <Disputedialog
                      address={dispute.freelancer.address}
                        triggerButton={
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-semibold text-white">Freelancer</h4>
                          <p className="text-slate-500 text-xs font-mono truncate">{truncateAddress(dispute.freelancer.address)}</p>
                          <p className="text-slate-400 text-xs">Rep: {dispute.freelancer.reputation}</p>
                        </div>
                        }
                      />
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Votes</span>
                        <span className="text-white font-semibold">{dispute.votesForFreelancer}</span>
                      </div>
                      <div className="bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentages.freelancer}%` }}
                        />
                      </div>
                      <p className="text-center text-slate-300 text-xs mt-1">{percentages.freelancer}%</p>
                    </div>

                    {!isVotingEnded && !hasVoted && (
                      <button
                        onClick={() => handleVote(dispute.jobId, true)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-3 rounded text-xs transition-all duration-200 flex items-center justify-center gap-1"
                      >
                        <Vote className="w-3 h-3" />
                        Vote Freelancer
                      </button>
                    )}

                    {hasVoted && userVotes[dispute.jobId] === true && (
                      <div className="w-full bg-green-600 text-white font-semibold py-2 px-3 rounded text-xs flex items-center justify-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Voted
                      </div>
                    )}
                  </div>
                </div>

                {isVotingEnded && (
                  <div className="text-center">
                    {!dispute.resolved ? (
                      <button
                        onClick={() => resolveDispute(dispute.jobId)}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 sm:px-6 rounded text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1 mx-auto"
                      >
                        <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                        Resolve
                      </button>
                    ) : (
                      <div className={`inline-flex items-center gap-1 px-3 py-2 rounded font-semibold text-xs sm:text-sm ${
                        freelancerWinning ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      }`}>
                        {freelancerWinning ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />}
                        {freelancerWinning ? 'Freelancer Won' : 'Client Won'}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-3 text-center text-xs text-slate-400">
                  Rep: {userReputation} | 
                  {userReputation < 20 ? ' ❌ Need 20+ to vote' : ' ✅ Can vote'}
                </div>
              </div>
            );
          })}
        </div>

        {disputes.length === 0 && !loading && (
          <div className="text-center py-8 sm:py-12">
            <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No Active Disputes</h3>
            <p className="text-slate-400 text-sm">All disputes resolved!</p>
          </div>
        )}
      </div>
    </div>
  );
};