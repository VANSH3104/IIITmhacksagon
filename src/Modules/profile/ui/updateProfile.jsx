"use client";
import { useState } from "react";
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
  DialogOverlay
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Briefcase, User, Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getContract } from "@/Hook/useContract";

export function UpdateProfile() {
  const [profileType, setProfileType] = useState("freelancer");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeString, setResumeString] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const isFreelancer = profileType === "freelancer";

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setStatus({ type: "error", message: "Please upload a PDF file" });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setStatus({ type: "error", message: "File size must be less than 2MB" });
      return;
    }

    setResumeFile(file);
    setIsLoading(true);
    setStatus({ type: "loading", message: "Processing resume..." });

    try {
      const base64String = await convertToBase64(file);
      setResumeString(base64String);
      setStatus({ type: "success", message: "Resume uploaded successfully!" });
    } catch (error) {
      console.error("File conversion error:", error);
      setStatus({ type: "error", message: "Error processing file" });
      setResumeFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const UpdateUser = async () => {
    if (isFreelancer && !resumeString) {
      setStatus({ type: "error", message: "Please upload your resume" });
      return;
    }

    setIsLoading(true);
    setStatus({ type: "loading", message: "Updating profile..." });

    try {
      const contract = await getContract();
      
      const tx = await contract.updateProfile(
        !isFreelancer,  // _isClient
        isFreelancer,   // _isFreelancer
        isFreelancer ? resumeString : ""  // _resume
      );

      await tx.wait();
      
      setStatus({ type: "success", message: "Profile updated successfully!" });
      setTimeout(() => {
        setProfileType("freelancer");
        setResumeFile(null);
        setResumeString("");
        setStatus({ type: null, message: "" });
      }, 2000);
    } catch (error) {
      console.error("Update failed:", error);
      const msg = error?.error?.message ?? error?.shortMessage ?? error?.message ?? "Unknown error";
      setStatus({ type: "error", message: `Update failed: ${msg}` });
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIndicator = () => {
    if (!status.type) return null;
    
    const Icon = {
      loading: Loader2,
      success: CheckCircle,
      error: XCircle
    }[status.type];

    const color = {
      loading: "text-blue-400",
      success: "text-green-400",
      error: "text-red-400"
    }[status.type];

    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg ${color} ${
        status.type === 'error' ? 'bg-red-900/20' : 'bg-white/5'
      }`}>
        <Icon className={`w-5 h-5 ${status.type === 'loading' ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium">{status.message}</span>
      </div>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="fav" 
          size="maxi" 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/20 transition-all"
        >
          Update Profile
        </Button>
      </DialogTrigger>
      
      <DialogOverlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
      
      <DialogContent className="sm:max-w-[450px] backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-800/90">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Update Your Profile
          </DialogTitle>
          <DialogDescription className="text-slate-300/80">
            Modify your professional identity
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4 text-white">
          <StatusIndicator />
          
          <div className="space-y-3">
            <Label className="text-slate-300 font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              I am a:
            </Label>
            <ToggleGroup
              type="single"
              value={profileType}
              onValueChange={val => val && setProfileType(val)}
              className="grid grid-cols-2 gap-3"
            >
              <ToggleGroupItem
                value="freelancer"
                className="data-[state=on]:bg-gradient-to-br data-[state=on]:from-purple-600/80 data-[state=on]:to-purple-700/80 data-[state=on]:text-white data-[state=on]:border-purple-400/50 border border-slate-700/50 hover:bg-slate-700/30 transition-all h-12"
              >
                <User className="w-4 h-4 mr-2" />
                Freelancer
              </ToggleGroupItem>
              <ToggleGroupItem
                value="client"
                className="data-[state=on]:bg-gradient-to-br data-[state=on]:from-blue-600/80 data-[state=on]:to-blue-700/80 data-[state=on]:text-white data-[state=on]:border-blue-400/50 border border-slate-700/50 hover:bg-slate-700/30 transition-all h-12"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Client
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {isFreelancer && (
            <div className="grid gap-3">
              <Label htmlFor="resume" className="text-slate-300 flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Resume (PDF, max 2MB)
              </Label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="resume"
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg border-2 border-dashed ${
                    resumeFile ? "border-green-400/50 bg-green-900/10" : "border-slate-700/50 hover:border-slate-600/50"
                  } bg-slate-800/30 hover:bg-slate-700/30 cursor-pointer transition-all`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-slate-400">Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">
                        {resumeFile ? resumeFile.name : "Choose file"}
                      </span>
                    </div>
                  )}
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-slate-700/50 bg-slate-800/70 hover:bg-slate-700/80 text-slate-200 hover:text-white transition-all"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={UpdateUser}
            variant="fav"
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/20 transition-all"
            disabled={isLoading || (isFreelancer && !resumeString)}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}