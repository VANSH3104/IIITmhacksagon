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
  DialogFooter,
  DialogOverlay
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Briefcase, User, Upload } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { getContract } from "@/Hook/useContract";

export function UpdateProfile() {
  const [profileType, setProfileType] = useState("freelancer");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeString, setResumeString] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFreelancer = profileType === "freelancer";

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    setResumeFile(file);
    setIsLoading(true);

    try {
      const base64String = await convertToBase64(file);
      setResumeString(base64String);
    } catch (error) {
      console.error("File conversion error:", error);
      alert("Error processing file");
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
      alert("Please upload your resume");
      return;
    }

    setIsLoading(true);

    try {
      const contract = await getContract();
      
      console.log("Registering with:", {
        isClient: !isFreelancer,
        isFreelancer,
        resume: isFreelancer ? resumeString : ""
      });

      const tx = await contract.updateProfile(
        !isFreelancer,  // _isClient
        isFreelancer,   // _isFreelancer
        isFreelancer ? resumeString : ""  // _resume
      );

      console.log("Transaction hash:", tx.hash);
      
      await tx.wait();
      console.log("Registration successful");
      setProfileType("freelancer");
      setResumeFile(null);
      setResumeString("");
      
      alert("Profile created successfully!");
    } catch (error) {
        console.error("Registration failed:", error);
        const msg = error?.error?.message ?? error?.shortMessage ?? error?.message ?? "Unknown error";
        alert(`Registration failed: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="fav" size="maxi" className="w-full">
          Update Profile
        </Button>
      </DialogTrigger>
       <DialogOverlay className="bg-white/10 backdrop-blur-xl fixed inset-0 z-40" />
      <DialogContent className="sm:max-w-[425px] backdrop-blur rounded-2xl p-6 shadow-2xl border border-white/20 bg-white/10 z-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Update Your Profile
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Set up your professional profile to get started
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4 text-white">
          <div className="space-y-3">
            <Label className="text-slate-300 font-bold md:text-xl">I am a:</Label>
            <ToggleGroup 
              type="single" 
              value={profileType}
              onValueChange={setProfileType}
              className="grid grid-cols-2 gap-2"
            >
              <ToggleGroupItem 
                value="freelancer" 
                className="data-[state=on]:bg-purple-600 data-[state=on]:text-white data-[state=on]:border-purple-400 border border-slate-700 md:text-lg font-bold"
              >
                <User className="w-4 h-4 mr-2" />
                Freelancer
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="client" 
                className="data-[state=on]:bg-purple-600 data-[state=on]:text-white data-[state=on]:border-blue-400 border border-slate-700 md:text-lg font-bold"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Client
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {isFreelancer && (
            <div className="grid gap-3">
              <Label htmlFor="resume" className="text-slate-300 md:text-xl">
                Resume (PDF, max 2MB)
              </Label>
              <div className="flex items-center gap-2">
                <label 
                  htmlFor="resume"
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md border-2 border-dashed ${
                    resumeFile ? "border-green-500" : "border-slate-700"
                  } bg-slate-800 hover:bg-slate-700/50 cursor-pointer transition-colors`}
                >
                  {isLoading ? (
                    <span className="text-slate-400">Processing...</span>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="md:text-lg text-sm text-slate-400">
                        {resumeFile ? resumeFile.name : "Upload file"}
                      </span>
                    </>
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
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={UpdateUser}
            variant="fav"
            size="lg"
            className="text-white"
            disabled={isLoading || (isFreelancer && !resumeString)}
          >
            {isLoading ? "Processing..." : "Update Profile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
