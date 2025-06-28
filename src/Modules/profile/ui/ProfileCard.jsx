"use client";
import { GeneratedAvatar } from "@/components/generate-avatar";
import React from "react";
import { Star, Calendar, Briefcase, FileText, Award } from "lucide-react";
import { ResumeDialog } from "./resumePopup";
import { motion } from "framer-motion";

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
        <div key={i} className="relative w-5 h-5">
          <Star className="absolute top-0 left-0 w-5 h-5 text-gray-400/30" />
          {filled && (
            <Star className="absolute top-0 left-0 w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]" />
          )}
          {!filled && half && (
            <Star
              className="absolute top-0 left-0 w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_4px_rgba(250,204,21,0.5)]"
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
    <motion.div
      whileHover={{
        scale: 1.025,
        boxShadow: "0 8px 32px 0 rgba(80,80,120,0.18)",
        borderColor: "#a78bfa",
        transition: { duration: 0.25 },
      }}
      className="w-full h-full mx-auto bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/90 border border-slate-700/50 text-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group hover:border-slate-600"
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-6">
        <motion.div
          whileHover={{ scale: 1.07, rotate: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="flex items-center space-x-5"
        >
          <div className="relative">
            <GeneratedAvatar
              seed={0}
              varient="botttsNeutral"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-slate-600 shadow-lg group-hover:border-slate-500 transition-colors duration-300"
            />
            <motion.div
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <div className="absolute w-5 h-5 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </motion.div>
          </div>

          <div className="flex-1">
            <motion.h3 whileHover={{ scale: 1.08 }} className="mb-2">
              {isClient ? (
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-full text-xs font-medium transition-all duration-300 flex items-center space-x-2 shadow-md shadow-blue-500/20">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Client</span>
                </span>
              ) : (
                <span className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 rounded-full text-xs font-medium transition-all duration-300 flex items-center space-x-2 shadow-md shadow-purple-500/20">
                  <Award className="w-3.5 h-3.5" />
                  <span>Freelancer</span>
                </span>
              )}
            </motion.h3>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.04, backgroundColor: "#312e81" }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="bg-slate-800/40 hover:bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50 transition-all duration-300 group/card"
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex">{renderStars(reputation_star || 0)}</div>
          </div>
          <p className="text-xs uppercase tracking-wider text-slate-400/80 mb-1">
            Reputation
          </p>
          <p className="text-lg font-semibold text-white">
            {reputation ? reputation.toFixed(1) : "N/A"}
            <span className="ml-1 text-sm text-slate-400">/100</span>
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.04, backgroundColor: "#14532d" }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="bg-slate-800/40 hover:bg-slate-700/50 rounded-xl p-4 backdrop-blur-sm border border-slate-700/50 transition-all duration-300 group/card"
        >
          <div className="flex items-center space-x-2 mb-2">
            <Briefcase className="w-5 h-5 text-green-400/90" />
          </div>
          <p className="text-xs uppercase tracking-wider text-slate-400/80 mb-1">
            Completed Jobs
          </p>
          <p className="text-lg font-semibold text-white">
            {completedJobs || 0}
          </p>
        </motion.div>
      </div>

      {resume && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            scale: 1.03,
            boxShadow: "0 2px 16px 0 rgba(80,80,120,0.18)",
          }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <ResumeDialog resumeString={resume} />
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-5 border-t border-slate-700/50 gap-3">
        <motion.div
          whileHover={{ scale: 1.04, color: "#a78bfa" }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="flex items-center space-x-2 text-sm text-slate-400/80"
        >
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>Joined {formatDate(createdAt)}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};