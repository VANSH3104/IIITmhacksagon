"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJobStore } from "@/Hook/jobstore";
import { useUser } from "@/Hook/useData";
import { JobIdViewClient } from "./Client/ui/Jobidui/Jobid-views-client";
import { JobIdViewFree } from "./freelancer/ui/Jobidui/Jobid-views";

export const JobidShow = () => {
  const { userData } = useUser();
  const { currentJobid } = useJobStore();
  const router = useRouter();
    console.log(currentJobid);
  useEffect(() => {
    if (!currentJobid) {
      router.push("/job");
    }
  }, [currentJobid, router]);

  if (!currentJobid) return null;

  return (
    <div>
      {userData?.isClient ? (
        <JobIdViewClient/>
      ) : (
        <div>
        <JobIdViewFree />
        </div>
      )}
    </div>
  );
};