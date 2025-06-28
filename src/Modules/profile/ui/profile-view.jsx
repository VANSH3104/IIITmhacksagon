"use client";

import { useAccount } from "wagmi";
import { ProfileCard } from "./ProfileCard";
import { ProfileDialog } from "./ProfilePopup";
import { UpdateProfile } from "./updateProfile";
import { useUser } from "@/Hook/useData";

export const ProfileView = () => {
  const { address } = useAccount();
  const {userData , loading , error} = useUser();


  if (!address || loading) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold text-purple-100">
            Loading Your Profile
          </h2>
          <p className="text-purple-200">
            Fetching your data from the blockchain...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-4 p-6 bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/20 max-w-md">
          <div className="w-12 h-12 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-300">Error Loading Profile</h2>
          <p className="text-red-200">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  if (!userData?.exists) {
    return (
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6 p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 max-w-md">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Profile Not Found</h2>
          <p className="text-purple-200">
            You haven't created a profile yet. Start by setting up your account!
          </p>
          <ProfileDialog />
        </div>
      </div>
    );
  }


  return (
    <div className="h-full z-10 w-full flex flex-col items-center py-4 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 space-y-4 pt-16">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-purple-200 max-w-2xl mx-auto hidden md:block">
          Manage your professional presence and track your achievements
        </p>
      </div>

      <div className="w-full h-full">
        <div className="bg-white/10 backdrop-blur-lg flex flex-col rounded-2xl p-4 shadow-xl border border-white/20 hover:border-white/30 transition-all duration-300 h-full">
          <ProfileCard {...userData} />
          <div className="flex justify-end p-4">
            <UpdateProfile/>
          </div>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};