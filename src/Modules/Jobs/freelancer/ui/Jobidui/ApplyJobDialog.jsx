"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DollarSign } from "lucide-react"
import { getContract } from "@/Hook/useContract";

export function ApplyJobDialog({ jobId }) {
  const [bidAmount, setBidAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const resume = "v";
  const applyForJob = async () => {
    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      alert("Please enter a valid bid amount");
      return;
    }

    setIsLoading(true);

    try {
      const contract = await getContract();
      
      console.log("Applying for job:", {
        jobId,
        bidAmount: Number(bidAmount)
      });
      const tx = await contract.applyForJob(
        jobId,
        resume,
        bidAmount
      );

      console.log("Transaction hash:", tx.hash);
      
      await tx.wait();
      console.log("Application successful");
      setBidAmount("");
      
      alert("Job application submitted successfully!");
    } catch (error) {
        console.error("Application failed:", error);
        const msg = error?.error?.message ?? error?.shortMessage ?? error?.message ?? "Unknown error";
        alert(`Application failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button  variant="fav" size="maxi" className="w-full">
          Apply for Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] backdrop-blur rounded-2xl p-6 shadow-2xl border border-white/20 bg-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Apply for Job
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Submit your bid for this job opportunity
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 text-white">
          <div className="space-y-3">
            <Label className="text-slate-300 font-bold md:text-xl">Bid Amount ($)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid amount"
                className="pl-10 w-full px-4 py-2 rounded-md border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={applyForJob}
            variant="fav"
            size="lg"
            className="text-white"
            disabled={isLoading || !bidAmount}
          >
            {isLoading ? "Processing..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}