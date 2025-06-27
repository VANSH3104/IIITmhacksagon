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
    <nav className="bg-[#111727] text-white shadow-lg z-50 fixed w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
          <img src="/logo.svg " alt="Logo" width={40} height={40} className="h-8 w-8 rounded-full" />
            {/* replace by image in future */}
            <span className="ml-2 text-purple-500 text-xl font-semibold">Free</span>
            <span className="text-xl text-emerald-400 font-semibold">LanceX</span>
          </div>

          { isConnected && (
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/' ? 'text-purple-400' : 'hover:text-purple-400'}`}>
                Home
              </Link>
              <Link href="/profile" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/profile') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
                Profile
              </Link>
              {userData?.isFreelancer ? (
                <Link href="/job" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/job') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
                Jobs
              </Link>
              ): (
                <Link href="/job" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/job') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
                Create-Job
              </Link>
              )}
              <Link href="/disputed" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/disputed') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
                Disputed
              </Link>
              <Link href="/about" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/about') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
                About
              </Link>
            </div>
          </div> )}

          {/* CTA Button */}
          <div className="hidden md:block">
            <CustomWalletConnector/>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-purple-500 focus:outline-none"
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
                  d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-64 bg-[#111727] z-50 transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-gray-300"
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
        <div className="grid px-2 pt-2 pb-3 space-y-1 sm:px-2  ">
          {isConnected ? (
            <>
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname ==='/' ? 'text-purple-400' : 'hover:text-purple-400'}`}
                onClick={toggleSidebar}
              >
                Home
              </Link>
              <Link
                href="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/profile') ? 'text-purple-400' : 'hover:text-purple-400'}`}
                onClick={toggleSidebar}
              >
                Profile
              </Link>
              {userData?.isFreelancer ? (
                <Link href="/job" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/job') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
                Jobs
              </Link>
              ): (
                <Link href="/job" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/job') ? 'text-purple-400' : 'hover:text-purple-400'}`}>
                Create-Job
              </Link>
              )}
              <Link
                href="/disputed"
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/disputed') ? 'text-purple-400' : 'hover:text-purple-400'}`}
                onClick={toggleSidebar}
              >
                Disputed
              </Link>
              <Link
                href="/about"
                className={`px-3 py-2 rounded-md text-sm font-medium ${pathname.startsWith('/about') ? 'text-purple-400' : 'hover:text-purple-400'}`}
                onClick={toggleSidebar}
              >
                About
              </Link>
            </>
          ) : null}
          <div className="mt-4">
            <CustomWalletConnector onClick={toggleSidebar} />
          </div>
        </div>
      </div>
    </nav>
  );
};