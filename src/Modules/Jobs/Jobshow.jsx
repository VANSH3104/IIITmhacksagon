"use client";
import { useUser } from "@/Hook/useData";
import { ClientViews } from "./Client/ui/Client-views";
import { FreelancerViews } from "./freelancer/ui/Freelancer-views";

export const JobShow = () => {
  const { userData } = useUser();
  return (
    <div>
      {userData?.isClient ? (
        <ClientViews />
      ) : (
        <div>
          <FreelancerViews />
        </div>
      )}
    </div>
  );
};
