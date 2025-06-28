"use client"
import React, { useState, useEffect } from 'react';
import { Filter, DollarSign, Star, Briefcase, User} from 'lucide-react';
import { getContract } from '@/Hook/useContract';
import { ResumeDialog } from '@/Modules/profile/ui/resumePopup';
import { useJobStore } from '@/Hook/jobstore';

export const Appliedusers = ({ sortFilter, id }) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const contract = await getContract();
        const applications = await contract.getJobApplications(id);
        const usersData = await Promise.all(
          applications.map(async (app, applicationIndex) => {
            const data = await contract.users(app.freelancer);
            return {
              id: app.freelancer,
              name: data.name || 'Anonymous',
              applicationIndex,
              proposedAmount: Number(app.bidAmount),
              rating: Number(data.reputation),
              experience: data.completedJobs || '0',
              resume: data.resume,
              createdAt: Number(data.createdAt),
              exists: data.exists,
            };
          })
        );
        setUserData(usersData.filter(user => user.exists));
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load applicants data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const filteredUsers = [...userData].sort((a, b) => {
    switch (sortFilter?.status) {
      case 1: return b.proposedAmount - a.proposedAmount;
      case 2: return a.proposedAmount - b.proposedAmount;
      case 3: return b.rating - a.rating;
      case 4: return a.rating - b.rating;
      default: return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-[64vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[64vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-xl">⚠</span>
          </div>
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[64vh] overflow-y-auto md:px-6 p-4">
      <div className="space-y-6 max-w-6xl mx-auto">
        {filteredUsers.map((user , i) => (
          <div
            key={user.id}
            className="group bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/50 rounded-2xl shadow-xl p-4 sm:p-6 hover:shadow-2xl hover:border-slate-600/50 transition-all duration-300"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                      {user.name}
                    </h3>
                    <p className="text-gray-400 text-sm">Freelancer</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
                    <DollarSign size={16} className="text-green-400" />
                    <span className="font-bold text-green-300 text-base sm:text-lg">
                      {user.proposedAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-start lg:justify-end">
              <div className='w-40'>
                <ViewProfileButton resume={user.resume} />
                </div>
                <HireButton id={id} user={user.id} index={i} />
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-slate-700/40 px-4 py-3 rounded-xl border border-slate-600/30">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Briefcase size={18} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Experience</p>
                  <p className="text-white font-semibold text-sm sm:text-base">{user.experience} jobs completed</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-700/40 px-4 py-3 rounded-xl border border-slate-600/30">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Star size={18} className="text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Rating</p>
                  <div className="flex items-center gap-1">
                    <p className="text-white font-semibold text-sm sm:text-base">{user.rating}</p>
                    <Star size={14} className="text-yellow-400 fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter size={32} className="text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-3">No applicants found</h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto">
              {userData.length === 0
                ? 'No one has applied to this job yet. Share your job posting to get more visibility!'
                : 'Try adjusting your filters to see more results.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ViewProfileButton = ({ resume}) => (
  <ResumeDialog resumeString={resume} />
);

const HireButton = ({ id, user, index }) => {
  const { mode , setIndex } = useJobStore();
  let tag = mode === 1 || mode === 2;
  const AssignJobFun = async (jobid , user , index) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to Assign this job?");
    if (isConfirmed) {
            const contract = await getContract();
            const tx = await contract.assignJob(jobid , user , index);
            await tx.wait();
             setIndex(index);
            alert('Freelancer hired successfully!');
            console.log("Job cancelled successfully.");   
        }
    } catch (error) {
      console.error('Error assigning job:', error);
      alert('Failed to hire freelancer: ' + (error.reason || error.message));
    }
  };

  return (
  <>
    {!tag && (
      <button 
        className="group px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white text-sm rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" 
        onClick={() => AssignJobFun(id, user, index)}
      >
        <span className="flex items-center gap-2">
          <span className="group-hover:scale-110 transition-transform">🎯</span>
          Hire Now
        </span>
      </button>
    )}
  </>
);

};