"use client";
import { JobWithFilter } from "../../ui/Jobsfilterwith";
import { useAccount } from "wagmi";
import { Wallet, Briefcase } from "lucide-react";
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
  return (
    <div className="min-h-screen">
      <div className="p-6 mx-auto text-white">
        <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl max-w-7xl mx-auto hover:border-slate-600/50 transition-all duration-300">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Briefcase className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">All Jobs</h2>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-6 p-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={check}
                    onCheckedChange={(value) => setCheck(value)}
                    id="terms"
                  />
                  <Label htmlFor="terms">Your Jobs</Label>
                </div>
              </div>
              <FilterJob onFilterChange={(filter) => setFilters(filter)} />
            </div>
          </div>
          {address ? (
            <div className="max-h-[80vh] rounded-xl overflow-y-auto ">
              {check ? (
                <JobWithFilter
                  freelancerFilter={address}
                  statusFilter={filter?.status}
                />
              ) : (
                <JobWithFilter statusFilter={0} />
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Wallet Not Connected
              </h3>
              <p className="text-slate-400 max-w-md mx-auto">
                Please connect your wallet to view and manage your job postings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
