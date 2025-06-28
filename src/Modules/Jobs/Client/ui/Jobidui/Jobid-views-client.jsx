"use client";
import { useJobStore } from "@/Hook/jobstore";
import { ClientDialog } from "../ClientPop";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getContract } from "@/Hook/useContract";
import { Appliedusers } from "./Appliedusers";
import { FilterJob } from "../../../ui/Jobfilter";
import { Rating } from "../../../Ratting";

export const JobIdViewClient = () => {
  const { currentJobid, mode } = useJobStore();
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilters] = useState(null);

  useEffect(() => {
    if (!currentJobid) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const contract = await getContract();
        const data = await contract.jobs(currentJobid);
        setJobData({
          jobTitle: data.jobTitle,
          description: data.description,
          price: data.price.toString(),
        });
      } catch (err) {
        console.error("Error fetching job data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [currentJobid]);

  const CancelAction = async () => {
    const isConfirmed = window.confirm("Are you sure you want to cancel this job?");
    if (isConfirmed) {
      const contract = await getContract();
      const tx = await contract.cancelJob(currentJobid);
      await tx.wait();
      console.log("Job cancelled successfully.");
    }
  };

  const RaiseDispute = async () => {
    const isConfirmed = window.confirm("Are you sure you want to raise a dispute?");
    if (isConfirmed) {
      const contract = await getContract();
      const tx = await contract.raiseDispute(currentJobid); // replace with actual method
      await tx.wait();
      console.log("Dispute raised.");
    }
  };

  const TakeWork = () => {
    console.log("Work taken.");
  };

  const tag = mode === 1 || mode === 2;

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-6 bg-slate-800/60 border border-slate-700 rounded-xl text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-cols-1 justify-between w-full md:grid md:grid-cols-2 gap-6">
          {tag ? (
            <>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Take Work</h2>
                <Rating
                  triggerButton= {<Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                >
                  Take Work
                </Button>
              }
              jobid={currentJobid}
                 />
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Raise Dispute</h2>
                <Button
                  variant="destructive"
                  onClick={RaiseDispute}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
                >
                  Raise Dispute
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Update Job Details</h2>
                <ClientDialog
                  mode="edit"
                  id={currentJobid}
                  initialData={{
                    title: jobData?.jobTitle,
                    description: jobData?.description,
                    price: jobData?.price,
                  }}
                  triggerButton={
                    <Button
                      variant="fav"
                      size="maxi"
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
                    >
                      Update Job
                    </Button>
                  }
                />
              </div>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold mb-4">Cancel This Job</h2>
                <Button
                  variant="destructive"
                  size="maxi"
                  onClick={CancelAction}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25"
                >
                  Cancel Job
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between items-center">
          <h1 className="text-xl md:text-3xl font-bold">Applied Users</h1>
          {!tag ? (
            <FilterJob Applied={true} onFilterChange={(filter) => setFilters(filter)} />
          ) : (
            <p className="italic text-slate-400">Viewing all applicants. Filtering disabled in this mode.</p>
          )}
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 shadow-md overflow-y-auto max-h-[65vh]">
          <Appliedusers sortFilter={filter} id={currentJobid} />
        </div>
      </div>
    </div>
  );
};