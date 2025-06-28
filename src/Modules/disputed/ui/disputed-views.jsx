"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Users, Vote, AlertCircle, CheckCircle, XCircle, User, Briefcase, Timer, Loader } from 'lucide-react';
import { getContract } from '@/Hook/useContract';
import { Disputedialog } from './disputepopup.jsx';

export const DisputedViews = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [timeMultiplier, setTimeMultiplier] = useState(1);
  const [userVotes, setUserVotes] = useState({});
  const [userReputation] = useState(75);
  const [votingInProgress, setVotingInProgress] = useState({});
  const [resolvingInProgress, setResolvingInProgress] = useState({});

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
    try {
      setError(null);
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
      setError("Failed to load disputes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchDisputeData]);

  const handleVote = useCallback(async (jobId, supportsFreelancer) => {
    if (userReputation < 20) {
      alert("Insufficient reputation to vote (minimum 20 required)");
      return;
    }

    if (votingInProgress[jobId]) {
      return; // Prevent double voting
    }

    setVotingInProgress(prev => ({ ...prev, [jobId]: true }));

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
      
      // Refresh data after a delay
      setTimeout(loadDisputes, 2000);
    } catch (err) {
      console.error("Error voting on dispute:", err);
      alert("Failed to vote. See console for details.");
    } finally {
      setVotingInProgress(prev => ({ ...prev, [jobId]: false }));
    }
  }, [userReputation, loadDisputes, votingInProgress]);

  const resolveDispute = useCallback(async (jobId) => {
    if (resolvingInProgress[jobId]) {
      return; // Prevent double resolution
    }

    setResolvingInProgress(prev => ({ ...prev, [jobId]: true }));

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
    } finally {
      setResolvingInProgress(prev => ({ ...prev, [jobId]: false }));
    }
  }, [loadDisputes, resolvingInProgress]);

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

    if (disputes.length > 0) {
      const interval = setInterval(checkAndResolveDisputes, 120000);
      return () => clearInterval(interval);
    }
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mb-4 shadow-xl animate-spin">
            <Loader className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Disputes...</h2>
          <p className="text-slate-300">Please wait while we fetch the latest dispute data</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 shadow-xl">
            <XCircle className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Disputes</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              loadDisputes();
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Increase margin-top for more gap below navbar */}
        <div className="mt-16 text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full mb-4 shadow-xl">
            <AlertCircle className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text mb-2 drop-shadow-lg">
            Dispute Resolution
          </h1>
          <p className="text-slate-300 text-base mb-6">Community-powered justice for decentralized work</p>
          <div className="inline-flex flex-wrap items-center gap-4 bg-slate-800/60 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/80 shadow-lg">
            <div className="flex items-center gap-2">
              <Timer className="text-blue-400 w-5 h-5" />
              <span className="text-white font-semibold text-sm">Speed:</span>
              <div className="flex gap-1">
                {[1, 60, 3600, 86400].map(multiplier => (
                  <button
                    key={multiplier}
                    onClick={() => setTimeMultiplier(multiplier)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all transform hover:scale-105 ${
                      timeMultiplier === multiplier
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {multiplier === 1 ? '1x' : multiplier === 60 ? '1m' : multiplier === 3600 ? '1h' : '1d'}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-6 w-px bg-slate-600 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <User className="text-yellow-400 w-5 h-5" />
              <span className="text-white font-semibold text-sm">Your Rep:</span>
              <span className={`font-bold ${userReputation >= 20 ? "text-green-400" : "text-red-400"}`}>{userReputation}</span>
              <span className="ml-2 text-xs">
                {userReputation < 20 ? '❌ Need 20+ to vote' : '✅ Can vote'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
          {disputes.map((dispute, idx) => {
            const timeRemaining = getTimeRemaining(dispute);
            const isVotingEnded = timeRemaining <= 0;
            const hasVoted = userVotes[dispute.jobId] !== undefined;
            const percentages = getWinningPercentage(dispute);
            const freelancerWinning = dispute.votesForFreelancer >= dispute.votesForClient;
            const isVotingLoading = votingInProgress[dispute.jobId];
            const isResolvingLoading = resolvingInProgress[dispute.jobId];

            return (
              <div
                key={dispute.jobId}
                className="bg-gradient-to-br from-slate-800/70 to-slate-900/80 border border-slate-700/60 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.08}s`, animationFillMode: "both" }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-red-500 to-orange-500 p-3 rounded-2xl shadow-lg">
                        <AlertCircle className="text-white w-6 h-6" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                        <span className="text-xs font-bold text-black">{dispute.jobId}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Dispute #{dispute.jobId}</h3>
                      <p className="text-slate-400 text-xs">Raised by <span className="font-mono">{truncateAddress(dispute.raisedBy)}</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold flex items-center gap-2 ${isVotingEnded ? 'text-red-400' : 'text-blue-400'}`}>
                      <Clock className="w-5 h-5" />
                      {formatTimeRemaining(timeRemaining)}
                    </div>
                    <p className="text-slate-400 text-xs">
                      {isVotingEnded ? 'Voting Ended' : 'Time Remaining'}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-white" />
                      <h2 className="text-base font-bold text-white">{dispute.jobTitle}</h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-blue-100">
                      <div className="flex items-center gap-1">
                        <Vote className="w-4 h-4" />
                        <span>{dispute.votesForClient + dispute.votesForFreelancer} total votes</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Client Card */}
                  <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-2xl p-5 border border-red-400/20 hover:scale-[1.02] transition-all duration-300 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-red-500/20 p-2 rounded-lg">
                        <User className="text-red-400 w-5 h-5" />
                      </div>
                      <Disputedialog
                        address={dispute.client.address}
                        triggerButton={
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-white">Client</h4>
                            <p className="text-red-300 text-xs font-mono">{truncateAddress(dispute.client.address)}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle className="text-yellow-400 w-3 h-3" />
                              <span className="text-slate-300 text-xs">Rep: {dispute.client.reputation}</span>
                            </div>
                          </div>
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">Vote Power</span>
                        <span className="text-white font-bold">{dispute.votesForClient}</span>
                      </div>
                      <div className="bg-slate-600/50 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${percentages.client}%` }}
                        />
                      </div>
                      <p className="text-center text-red-300 text-base font-bold mt-2">{percentages.client}%</p>
                    </div>
                    {!isVotingEnded && !hasVoted && (
                      <button
                        onClick={() => handleVote(dispute.jobId, false)}
                        disabled={isVotingLoading || userReputation < 20}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                      >
                        {isVotingLoading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Vote className="w-4 h-4" />
                        )}
                        {isVotingLoading ? 'Voting...' : 'Vote for Client'}
                      </button>
                    )}
                    {hasVoted && userVotes[dispute.jobId] === false && (
                      <div className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                        <CheckCircle className="w-4 h-4" />
                        Vote Cast
                      </div>
                    )}
                  </div>
                  
                  {/* Freelancer Card */}
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-5 border border-green-400/20 hover:scale-[1.02] transition-all duration-300 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-500/20 p-2 rounded-lg">
                        <User className="text-green-400 w-5 h-5" />
                      </div>
                      <Disputedialog
                        address={dispute.freelancer.address}
                        triggerButton={
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-white">Freelancer</h4>
                            <p className="text-green-300 text-xs font-mono">{truncateAddress(dispute.freelancer.address)}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <CheckCircle className="text-yellow-400 w-3 h-3" />
                              <span className="text-slate-300 text-xs">Rep: {dispute.freelancer.reputation}</span>
                            </div>
                          </div>
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">Vote Power</span>
                        <span className="text-white font-bold">{dispute.votesForFreelancer}</span>
                      </div>
                      <div className="bg-slate-600/50 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-green-500 h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${percentages.freelancer}%` }}
                        />
                      </div>
                      <p className="text-center text-green-300 text-base font-bold mt-2">{percentages.freelancer}%</p>
                    </div>
                    {!isVotingEnded && !hasVoted && (
                      <button
                        onClick={() => handleVote(dispute.jobId, true)}
                        disabled={isVotingLoading || userReputation < 20}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                      >
                        {isVotingLoading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Vote className="w-4 h-4" />
                        )}
                        {isVotingLoading ? 'Voting...' : 'Vote for Freelancer'}
                      </button>
                    )}
                    {hasVoted && userVotes[dispute.jobId] === true && (
                      <div className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg">
                        <CheckCircle className="w-4 h-4" />
                        Vote Cast
                      </div>
                    )}
                  </div>
                </div>

                {isVotingEnded && (
                  <div className="text-center">
                    {!dispute.resolved ? (
                      <button
                        onClick={() => resolveDispute(dispute.jobId)}
                        disabled={isResolvingLoading}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-8 rounded-2xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2 mx-auto"
                      >
                        {isResolvingLoading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <Users className="w-5 h-5" />
                        )}
                        {isResolvingLoading ? 'Resolving...' : 'Resolve Dispute'}
                      </button>
                    ) : (
                      <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-lg shadow-lg ${
                        freelancerWinning 
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white' 
                          : 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                      }`}>
                        {freelancerWinning ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                        {freelancerWinning ? 'Freelancer Wins!' : 'Client Wins!'}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base ${
                    userReputation >= 20 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {userReputation >= 20 ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    {userReputation >= 20 ? 'Eligible to vote' : `Need ${20 - userReputation} more reputation to vote`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {disputes.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Active Disputes</h3>
            <p className="text-slate-400 text-lg">All disputes resolved! 🎉</p>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-slate-600::-webkit-scrollbar-thumb {
          background-color: #475569;
          border-radius: 9999px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};