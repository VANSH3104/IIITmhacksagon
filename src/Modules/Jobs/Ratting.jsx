"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogOverlay
} from "@/components/ui/dialog";
import { Star, Copy } from "lucide-react";
import clsx from "clsx";
import { getContract } from "@/Hook/useContract";
import { useJobStore } from "@/Hook/jobstore";
import { useUser } from "@/Hook/useData";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Rating({ triggerButton, jobid }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const [workUrl, setWorkUrl] = useState("");
  const [url , seturl] = useState("");
  const { currentJobid } = useJobStore();
  const { userData } = useUser();
  const ETH_PRICE = 3500;
  const isClient = userData?.isClient === true;

  const etherAmount = jobData?.price ? Number(jobData.price) / ETH_PRICE : null;
  const usdAmount = jobData?.price ? Number(jobData.price) : null;

  useEffect(() => {
    if (!jobid) return;

    const fetchJob = async () => {
      try {
        setIsLoading(true);
        const contract = await getContract();
        const data = await contract.jobs(currentJobid);
        setJobData({
          client: data.client,
          freelancer: data.freelancer,
          price: data.price.toString(),
          workUrl: data.workSubmissionUrl || ""
        });
      } catch (err) {
        console.error("Error fetching job data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobid]);

  const handleStarClick = (value) => {
    setRating(value);
  };

  const sendEthWithMetaMask = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      setIsLoading(true);
      const contract = await getContract();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: jobData.freelancer,
        value: ethers.parseEther(etherAmount.toFixed(6)),
      });

      console.log("Transaction sent! Hash:", tx.hash);
      await tx.wait();

      await handleSubmit();
      console.log("Transaction confirmed!");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Transaction failed: " + (err.message || err));
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    try {
      setIsLoading(true);
      const contract = await getContract();
      
      if (!isClient && url !== "") {
        
        const urlTx = await contract.completeJob(jobid, url);
        await urlTx.wait();
      }

      const ratingTx = await contract.giveRating(jobid, rating);
      await ratingTx.wait();

      console.log("All transactions confirmed.");
    } catch (error) {
      console.error("Application failed:", error);
      const msg = error?.error?.message ?? error?.shortMessage ?? error?.message ?? "Unknown error";
      alert(`Application failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!jobData?.workUrl) return;
    navigator.clipboard.writeText(jobData.workUrl);
    toast.success("URL copied to clipboard!");
  };
  console.log("Job Data:", jobData);

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogOverlay className="bg-white/10 backdrop-blur-xl fixed inset-0 z-40" />
      <DialogContent className="sm:max-w-[425px] backdrop-blur rounded-2xl p-6 shadow-2xl border border-white/20 bg-white/10 z-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-700 bg-clip-text text-transparent">
            {isClient ? "Rate the Work" : "Submit Work & Rate Client"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {isClient 
              ? "Please give a rating based on your experience" 
              : "Submit your work URL and rate the client"}
          </DialogDescription>
        </DialogHeader>

        {isClient && jobData && (
          <div className="space-y-4">
            <div className="text-center my-2 text-sm text-slate-300">
              <div>
                <span className="font-medium text-white">Amount:</span>{" "}
                {etherAmount?.toPrecision(5)} ETH (~${usdAmount} USD)
              </div>
            </div>
            
            {jobData.workUrl && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-white">Work URL:</p>
                <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-2">
                 <div className="flex w-full max-w-[300px]">
                    <p className="text-sm text-slate-300 truncate flex-1">
                      {jobData.workUrl}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={copyToClipboard}
                    className="hover:bg-slate-700"
                  >
                    <Copy className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {!isClient && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Work URL</p>
              <Input
                type="url"
                placeholder="https://example.com/work"
                value={url}
                onChange={(e) => seturl(e.target.value)}
                className="bg-slate-800/50 border-slate-700 text-white"
                required
              />
              <p className="text-xs text-slate-400">
                Please provide a URL where we can view the completed work
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 py-4">
          <p className="text-sm text-slate-300">
            {isClient ? "Rate the freelancer's work" : "Rate the client's experience"}
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className={clsx(
                  "w-8 h-8 cursor-pointer transition",
                  (hovered >= star || rating >= star)
                    ? "text-yellow-400"
                    : "text-slate-600"
                )}
                fill={(hovered >= star || rating >= star) ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              disabled={isLoading}
            >
              Close
            </Button>
          </DialogClose>

          <Button
            onClick={isClient ? sendEthWithMetaMask : handleSubmit}
            variant="fav"
            size="lg"
            className="w-full sm:w-auto text-white"
            disabled={isLoading || rating === 0 || (!isClient && !workUrl)}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}