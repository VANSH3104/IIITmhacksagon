"use client";

import { useAccount } from "wagmi";
import { ProfileCard } from "./ProfileCard";
import { ProfileDialog } from "./ProfilePopup";
import { UpdateProfile } from "./updateProfile";
import { useUser } from "@/Hook/useData";
import { motion, AnimatePresence } from "framer-motion";

export const ProfileView = () => {
  const { address } = useAccount();
  const { userData, loading, error } = useUser();

  if (!address || loading) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6 p-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/30 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl max-w-md">
          <div className="w-16 h-16 mx-auto border-4 border-purple-300 border-t-transparent rounded-full animate-spin flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-pink-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
            Loading Your Profile
          </h2>
          <p className="text-purple-100/80 font-light">
            Fetching your data from the blockchain...
          </p>
          <div className="pt-2">
            <div className="h-1.5 w-full bg-purple-900/50 rounded-full overflow-hidden">
              <div className="animate-pulse h-full bg-gradient-to-r from-purple-400 to-pink-400 w-1/2 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="relative z-10 flex items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-6 p-8 bg-gradient-to-br from-red-900/40 to-rose-900/30 backdrop-blur-lg rounded-3xl border border-red-400/20 shadow-2xl max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center shadow-inner">
            <svg 
              className="w-8 h-8 text-red-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-200 to-rose-200 bg-clip-text text-transparent">
            Error Loading Profile
          </h2>
          <p className="text-red-100/80 font-light">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/30 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!userData?.exists) {
    return (
      <motion.div
        className="relative z-10 flex items-center justify-center min-h-[80vh]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-6 p-8 bg-gradient-to-br from-purple-900/50 to-indigo-900/30 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl max-w-md">
          <motion.div
            className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
          >
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            Profile Not Found
          </h2>
          <p className="text-purple-100/80 font-light">
            You haven't created a profile yet. Start by setting up your account!
          </p>
          <div className="pt-2">
            <ProfileDialog />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="h-full z-10 w-full flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="text-center mb-6 space-y-2 pt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent leading-tight">
          Your Professional Profile
        </h1>
        <motion.p
          className="text-purple-100/80 max-w-2xl mx-auto text-base font-light hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Showcase your achievements and manage your digital identity
        </motion.p>
      </motion.div>

      <motion.div
        className="w-full max-w-6xl"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <motion.div
          className="bg-gradient-to-br from-white/5 via-purple-900/10 to-pink-900/10 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <AnimatePresence>
            <motion.div
              key={userData?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <ProfileCard {...userData} />
            </motion.div>
          </AnimatePresence>
          <motion.div
            className="flex justify-end pt-2 mt-2 border-t border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          >
            <UpdateProfile />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};