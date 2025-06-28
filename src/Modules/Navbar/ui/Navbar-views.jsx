"use client"

import { useState } from 'react';
import Link from 'next/link';
import { CustomWalletConnector } from '@/Config-connects/connect';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';
import { useUser } from '@/Hook/useData';

export const Navbarviews = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {isConnected} = useAccount();
  const pathname = usePathname();
  const {userData} = useUser();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-[#0f1419] via-[#111727] to-[#141b2d] text-white shadow-2xl z-50 fixed w-full backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <img 
                  src="/logo.svg" 
                  alt="Logo" 
                  width={40} 
                  height={40} 
                  className="h-10 w-10 rounded-full ring-2 ring-purple-500/30 group-hover:ring-purple-400/60 transition-all duration-300 shadow-lg" 
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Free</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">LanceX</span>
              </div>
            </div>

            
            {isConnected && (
              <div className="hidden md:block">
                <div className="ml-10 flex items-center space-x-2">
                  <Link 
                    href="/" 
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      pathname === '/' 
                        ? 'text-purple-300 bg-purple-500/20 shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="relative z-10">Home</span>
                    {pathname === '/' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-purple-600/30 rounded-lg"></div>
                    )}
                  </Link>
                  
                  <Link 
                    href="/profile" 
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      pathname.startsWith('/profile') 
                        ? 'text-purple-300 bg-purple-500/20 shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="relative z-10">Profile</span>
                    {pathname.startsWith('/profile') && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-purple-600/30 rounded-lg"></div>
                    )}
                  </Link>
                  
                  {userData?.isFreelancer ? (
                    <Link 
                      href="/job" 
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                        pathname.startsWith('/job') 
                          ? 'text-purple-300 bg-purple-500/20 shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="relative z-10">Jobs</span>
                      {pathname.startsWith('/job') && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-purple-600/30 rounded-lg"></div>
                      )}
                    </Link>
                  ) : (
                    <Link 
                      href="/job" 
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                        pathname.startsWith('/job') 
                          ? 'text-emerald-300 bg-emerald-500/20 shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="relative z-10">Create Job</span>
                      {pathname.startsWith('/job') && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 rounded-lg"></div>
                      )}
                    </Link>
                  )}
                  
                  <Link 
                    href="/disputed" 
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      pathname.startsWith('/disputed') 
                        ? 'text-red-300 bg-red-500/20 shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="relative z-10">Disputed</span>
                    {pathname.startsWith('/disputed') && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-red-600/30 rounded-lg"></div>
                    )}
                  </Link>
                  
                  <Link 
                    href="/chat" 
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                      pathname.startsWith('/chat') 
                        ? 'text-purple-300 bg-purple-500/20 shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="relative z-10">Chat</span>
                    {pathname.startsWith('/about') && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-purple-600/30 rounded-lg"></div>
                    )}
                  </Link>
                </div>
              </div>
            )}

            {/* Wallet Connector */}
            <div className="hidden md:block">
              <div className="transform hover:scale-105 transition-transform duration-200">
                <CustomWalletConnector/>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 transform hover:scale-110"
              >
                <svg
                  className="h-6 w-6 transition-transform duration-300"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ transform: isSidebarOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-80 bg-gradient-to-b from-[#0f1419] to-[#111727] z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out shadow-2xl border-l border-purple-500/20`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-emerald-500/10">
          <div className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              width={32} 
              height={32} 
              className="h-8 w-8 rounded-full ring-2 ring-purple-500/30" 
            />
            <div className="ml-2">
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Free</span>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">LanceX</span>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-purple-300 p-2 rounded-lg hover:bg-white/5 transition-all duration-200"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="px-4 pt-6 pb-3 space-y-2">
          {isConnected ? (
            <>
              <Link
                href="/"
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === '/' 
                    ? 'text-purple-300 bg-gradient-to-r from-purple-500/20 to-purple-600/20 shadow-lg border border-purple-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={toggleSidebar}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              
              <Link
                href="/profile"
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith('/profile') 
                    ? 'text-purple-300 bg-gradient-to-r from-purple-500/20 to-purple-600/20 shadow-lg border border-purple-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={toggleSidebar}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
              
              {userData?.isFreelancer ? (
                <Link 
                  href="/job" 
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith('/job') 
                      ? 'text-purple-300 bg-gradient-to-r from-purple-500/20 to-purple-600/20 shadow-lg border border-purple-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={toggleSidebar}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                  </svg>
                  Jobs
                </Link>
              ) : (
                <Link 
                  href="/job" 
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith('/job') 
                      ? 'text-emerald-300 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 shadow-lg border border-emerald-500/30' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={toggleSidebar}
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Job
                </Link>
              )}
              
              <Link
                href="/disputed"
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith('/disputed') 
                    ? 'text-red-300 bg-gradient-to-r from-red-500/20 to-red-600/20 shadow-lg border border-red-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={toggleSidebar}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Disputed
              </Link>
              
              <Link
                href="/chat"
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith('/chat') 
                    ? 'text-purple-300 bg-gradient-to-r from-purple-500/20 to-purple-600/20 shadow-lg border border-purple-500/30' 
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
                onClick={toggleSidebar}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Chat
              </Link>
            </>
          ) : null}
          
          {/* Wallet Connector in Sidebar */}
          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <CustomWalletConnector onClick={toggleSidebar} />
          </div>
        </div>
      </div>
    </>
  );
};