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
  console.log(initialData, "data");
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogOverlay className="bg-white/10 backdrop-blur-xl fixed inset-0 z-40" />
      <DialogContent className="sm:max-w-[425px] backdrop-blur rounded-2xl p-6 shadow-2xl border border-white/20 bg-white/10 z-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-700 bg-clip-text text-transparent">
            {mode === "create"
              ? "Post a Job"
              : mode === "edit"
              ? "Edit Job"
              : "View Job"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {"Enter job details and budget in USD"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4 text-white">
          <div className="grid gap-2">
            <Label
              htmlFor="title"
              className="text-slate-300 font-bold md:text-lg"
            >
              Job Title
            </Label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 text-white p-2 rounded-md border border-slate-700 focus:outline-none"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="text-slate-300 font-bold md:text-lg"
            >
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 text-white p-2 rounded-md border border-slate-700 focus:outline-none"
            />
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="usdPrice"
              className="text-slate-300 font-bold md:text-lg"
            >
              Price in USD ($)
            </Label>
            <input
              id="usdPrice"
              type="number"
              value={Number(usdPrice)}
              onChange={(e) => setUsdPrice(e.target.value)}
              className="bg-slate-800 text-white p-2 rounded-md border border-slate-700 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-green-400 font-semibold">
            <div className="flex items-center gap-2">
              {ethValue !== "0" ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              )}
              <span>{ethValue} ETH</span>
            </div>
            <span className="text-sm text-slate-400">
              (1 ETH = ${ETH_RATE})
            </span>
          </div>
        </div>

        {!isEdit ? (
          <DialogFooter className="gap-3">
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
              onClick={handleCreate}
              variant="fav"
              size="lg"
              className="text-white"
              disabled={
                isLoading ||
                !title ||
                !description ||
                !usdPrice ||
                ethValue === "0"
              }
            >
              {isLoading ? "Processing..." : "Create Job"}
            </Button>
          </DialogFooter>
        ) : (
          <DialogFooter className="gap-3">
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
              onClick={handleCreate}
              variant="fav"
              size="lg"
              className="text-white"
              disabled={
                isLoading ||
                !title ||
                !description ||
                !usdPrice ||
                ethValue === "0"
              }
            >
              {isLoading ? "Processing..." : "Update Job"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
