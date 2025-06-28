"use client";
import { JobWithFilter } from "../../ui/Jobsfilterwith";
import { useAccount } from "wagmi";
import { Wallet, Briefcase, Search, X } from "lucide-react";
import { useUser } from "@/Hook/useData";
import { useState } from "react";
import { FilterJob } from "../../ui/Jobfilter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const FreelancerViews = () => {
  const { address } = useAccount();
  const { userData } = useUser();
  const [check, setCheck] = useState(false);
  const [filter, setFilters] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const clearAllFilters = () => {
    setCheck(false);
    setFilters(null);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6 text-white">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Explore Jobs
                </h1>
                <p className="text-slate-300 mt-1">
                  Find opportunities tailored for you
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-xl">
          {/* Controls Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            {/* Left Side Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={check}
                  onCheckedChange={(value) => setCheck(value)}
                  id="your-jobs"
                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <Label htmlFor="your-jobs" className="text-sm font-medium cursor-pointer text-slate-200">
                  Show My Jobs Only
                </Label>
              </div>
            </div>
            
            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              <FilterJob onFilterChange={(filter) => setFilters(filter)} />
              {(check || filter?.status || searchTerm) && (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-2 text-sm bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Active Filters Display */}
          {(check || filter?.status || searchTerm) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="hover:bg-blue-400/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {check && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">
                  My Jobs
                  <button
                    onClick={() => setCheck(false)}
                    className="hover:bg-purple-400/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filter?.status && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-200 rounded-full text-sm">
                  Status Filter
                  <button
                    onClick={() => setFilters(null)}
                    className="hover:bg-emerald-400/30 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Content Section */}
          {address ? (
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto rounded-xl bg-slate-900/30 p-4 space-y-4">
              {check ? (
                <JobWithFilter
                  freelancerFilter={address}
                  statusFilter={filter?.status}
                  searchTerm={searchTerm}
                  cardClassName="w-full"
                />
              ) : (
                <JobWithFilter
                  statusFilter={0}
                  searchTerm={searchTerm}
                  cardClassName="w-full"
                />
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-200 mb-2">
                Wallet Not Connected
              </h3>
              <p className="text-slate-400 max-w-sm mx-auto">
                Please connect your wallet to view and manage your job postings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};