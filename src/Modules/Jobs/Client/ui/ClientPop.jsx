"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle } from "lucide-react";
import { getContract } from "@/Hook/useContract";

export function ClientDialog({
  id,
  mode,
  initialData = { title: "", description: "", usdPrice: "" },
  triggerButton,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [usdPrice, setUsdPrice] = useState(initialData.usdPrice);
  const [ethValue, setEthValue] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  const ETH_RATE = 3500;
  if (mode === "edit") {
    useEffect(() => {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setUsdPrice(initialData.usdPrice);
    }, [initialData]);
  }
  useEffect(() => {
    const usd = parseFloat(usdPrice);
    if (!isNaN(usd)) {
      const eth = usd / ETH_RATE;
      setEthValue(eth.toFixed(6));
    } else {
      setEthValue("0");
    }
  }, [usdPrice]);

  const handleCreate = async () => {
    if (!title || !description || !usdPrice) {
      alert("Please fill out all fields.");
      return;
    }
    try {
      setIsLoading(true);
      const contract = await getContract();
      if (mode === "create") {
        const tx = await contract.createJob(title, description, usdPrice);
        await tx.wait();
        console.log("Transaction confirmed");
      } else {
        const tx = await contract.editJob(id, title, description, usdPrice);
        await tx.wait();
        console.log("Transaction confirmed");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Action failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const isEdit = mode === "edit";
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogOverlay className="bg-black/40 backdrop-blur-xl fixed inset-0 z-40" />
      <DialogContent className="sm:max-w-[430px] backdrop-blur-2xl rounded-2xl p-0 shadow-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90 z-50">
        <DialogHeader className="px-6 pt-6 pb-2 border-b border-white/10 bg-gradient-to-r from-slate-900/80 via-purple-900/80 to-slate-900/80 rounded-t-2xl">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {mode === "create"
              ? "Post a Job"
              : mode === "edit"
              ? "Edit Job"
              : "View Job"}
          </DialogTitle>
          <DialogDescription className="text-slate-400 mt-1">
            Enter job details and budget in USD
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-6 px-6 text-white">
          <div className="grid gap-2">
            <Label
              htmlFor="title"
              className="text-slate-300 font-bold md:text-base"
            >
              Job Title
            </Label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800/80 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all"
              placeholder="e.g. Frontend Developer"
              maxLength={60}
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="text-slate-300 font-bold md:text-base"
            >
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800/80 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all min-h-[80px]"
              placeholder="Describe the job requirements..."
              maxLength={500}
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="usdPrice"
              className="text-slate-300 font-bold md:text-base"
            >
              Price in USD ($)
            </Label>
            <input
              id="usdPrice"
              type="number"
              value={usdPrice}
              onChange={(e) => setUsdPrice(e.target.value)}
              className="bg-slate-800/80 text-white p-2.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-400/40 transition-all"
              placeholder="e.g. 1000"
              min={1}
            />
          </div>

          <div className="flex items-center justify-between text-green-400 font-semibold bg-slate-800/60 rounded-lg px-3 py-2 mt-1">
            <div className="flex items-center gap-2">
              {ethValue !== "0" ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              )}
              <span>{ethValue} ETH</span>
            </div>
            <span className="text-xs text-slate-400">
              (1 ETH = ${ETH_RATE})
            </span>
          </div>
        </div>

        <DialogFooter className="gap-3 px-6 pb-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-slate-700 text-white bg-black hover:bg-slate-900 hover:text-blue-400 transition-all duration-200"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleCreate}
            variant="fav"
            size="lg"
            className="text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-pink-500/20 transition-all"
            disabled={
              isLoading ||
              !title ||
              !description ||
              !usdPrice ||
              ethValue === "0"
            }
          >
            {isLoading
              ? mode === "edit"
                ? "Updating..."
                : "Posting..."
              : mode === "edit"
              ? "Update Job"
              : "Create Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
