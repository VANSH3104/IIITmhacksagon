"use client";
import { GeneratedAvatar } from "@/components/generate-avatar";
import React from "react";
import { Star, Calendar, Briefcase, FileText, Award } from "lucide-react";
import { ResumeDialog } from "./resumePopup";

const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const ProfileCard = ({
  isClient,
  isFreelancer,
  resume,
  reputation,
  completedJobs,
  createdAt,
  exists,
}) => {
  if (!exists) return null;

  const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating);
    const half = rating - i > 0 && rating - i < 1;

    return (
      <div key={i} className="relative w-4 h-4">
        <Star className="absolute top-0 left-0 w-4 h-4 text-gray-400" />
        {filled && (
          <Star className="absolute top-0 left-0 w-4 h-4 fill-yellow-400 text-yellow-400" />
        )}
        {!filled && half && (
          <Star
            className="absolute top-0 left-0 w-4 h-4 fill-yellow-400 text-yellow-400"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        )}
      </div>
    );
  });
};
  const reputationValue = Number(reputation ?? 0);
  const reputation_star = (reputationValue / 100) * 5;

  return (
    <div className="w-full h-full  mx-auto bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white p-4 sm:p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <GeneratedAvatar 
              seed={0} 
              varient="botttsNeutral" 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-slate-600 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-slate-800"></div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
              {isClient ? (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-600 hover:bg-blue-700 rounded-full text-xs font-medium transition-colors duration-200 flex items-center space-x-1">
                  <Briefcase className="w-3 h-3" />
                  <span>Client</span>
                </span>
              ) : (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-purple-600 hover:bg-purple-700 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center space-x-1">
                  <Award className="w-3 h-3" />
                  <span>Freelancer</span>
                </span>
              )}
            </h3>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="bg-slate-700/50 rounded-lg p-2 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-1">
            <div className="flex">{renderStars(reputation_star || 0)}</div>
          </div>
          <p className="md:text-lg text-xs text-slate-400">Reputation</p>
          <p className="text-base sm:text-lg font-semibold">{reputation ? reputation.toFixed(1) : "N/A"}</p>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-2 sm:p-5 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-1">
            <Briefcase className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-xs md:text-lg text-slate-400">Completed Jobs</p>
          <p className="text-base sm:text-lg font-semibold">{completedJobs || 0}</p>
        </div>
      </div>
      {resume && (
        <div className="mb-4">
          <ResumeDialog resumeString= {resume} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-slate-700 gap-3">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>Joined {formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};