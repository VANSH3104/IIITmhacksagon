"use client";
import { ClientDialog } from "./ClientPop";
import { Button } from "@/components/ui/button";
import { JobWithFilter } from "../../ui/Jobsfilterwith";
import { useAccount } from "wagmi";
import { Plus, Wallet, Briefcase, User } from "lucide-react";
import { useUser } from "@/Hook/useData";
import { FilterJob } from "../../ui/Jobfilter";
import { useState } from "react";

export const ClientViews = () => {
  const { address } = useAccount();
  const { userData } = useUser();
  const [filter, setFilters] = useState(null);
  console.log(filter, "filter");
  return (
    <div className="min-h-screen">
      <div className="p-6 mx-auto text-white">
        <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Client Dashboard
              </h1>
              <p className="text-slate-400 mt-1">Manage your job postings</p>
            </div>
          </div>

          <ClientDialog
            mode="create"
            triggerButton={
              <Button
                variant="fav"
                size="maxi"
                className="flex items-center gap-2 text-white shadow-lg hover:shadow-cyan-500/25 px-6 py-3 rounded-lg font-medium transition-all duration-200"
              >
                <Plus className="w-5 h-5" />
                Create Job
              </Button>
            }
          />
        </div>

        <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-8 shadow-2xl max-w-7xl mx-auto hover:border-slate-600/50 transition-all duration-300">
          <div className="flex justify-between">
            <div className="flex gap-3">
              <Briefcase className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">
                Your Job Listings
              </h2>
            </div>
            <div>
              <FilterJob onFilterChange={(filter) => setFilters(filter)} />
            </div>
          </div>

          {address ? (
            <div className="max-h-[60vh] rounded-xl overflow-y-auto ">
              <JobWithFilter
                clientFilter={address}
                statusFilter={filter?.status}
              />
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
