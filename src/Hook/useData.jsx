"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { getContract } from "@/Hook/useContract";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { address } = useAccount();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) {
      setUserData(null);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const contract = await getContract();
        const data = await contract.users(address);

        setUserData({
          isClient: data.isClient,
          isFreelancer: data.isFreelancer,
          resume: data.resume,
          reputation: Number(data.reputation),
          completedJobs: Number(data.completedJobs),
          createdAt: Number(data.createdAt),
          exists: data.exists,
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [address]);

  return (
    <UserContext.Provider value={{ userData, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);