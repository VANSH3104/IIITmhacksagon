"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import {
  AppWindow,
  Code,
  Loader2,
  Star,
  User,
  Briefcase,
  ExternalLink,
  Copy,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getContract } from "@/Hook/useContract";
import { formatEther } from "viem";
import { formatDistanceToNow } from "date-fns";

export function Disputedialog({ triggerButton, address }) {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [workHistory, setWorkHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const statusLabels = {
    0: "Open",
    1: "Assigned",
    2: "Completed",
    3: "Disputed",
    4: "Cancelled",
  };

  const statusColors = {
    0: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    1: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    2: "bg-green-500/20 text-green-400 border-green-500/30",
    3: "bg-red-500/20 text-red-400 border-red-500/30",
    4: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const contract = await getContract();

        const profile = await contract.getUserProfile(address);
        setUserProfile(profile);

        const jobsAsFreelancer = await contract.getFreelancerJobs(address);
        const jobsAsClient = await contract.getClientJobs(address);

        const allJobIds = [...jobsAsFreelancer, ...jobsAsClient];
        const jobDetailsPromises = allJobIds.map((id) =>
          contract.getJobDetails(id)
        );
        const jobDetails = await Promise.all(jobDetailsPromises);

        const completedJobs = jobDetails.map((job) => ({
          id: job.jobId.toString(),
          title: job.jobTitle,
          description: job.description,
          price: formatEther(job.price),
          status: job.status,
          role: job.freelancer === address ? "Freelancer" : "Client",
          completedAt: job.completedAt
            ? new Date(Number(job.completedAt) * 1000)
            : null,
          workUrl: job.workSubmissionUrl,
          counterparty:
            job.freelancer === address ? job.client : job.freelancer,
        }));

        setWorkHistory(completedJobs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchData();
    }
  }, [address, getContract]);

  const getReputationBadge = (reputation) => {
    const rep = Number(reputation) || 0;
    if (rep >= 90)
      return {
        label: "Excellent",
        color:
          "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      };
    if (rep >= 75)
      return {
        label: "Good",
        color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    if (rep >= 50)
      return {
        label: "Average",
        color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      };
    return {
      label: "New",
      color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
  };

  const reputationBadge = userProfile
    ? getReputationBadge(userProfile.reputation)
    : null;

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogOverlay className="bg-black/60 backdrop-blur-md fixed inset-0 z-40" />
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl p-0 shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/95 via-purple-900/20 to-slate-900/95 z-50">
        <div className="relative bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 p-8 rounded-t-3xl border-b border-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-t-3xl" />
          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-white/10 backdrop-blur">
                <User className="w-6 h-6 text-purple-400" />
              </div>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                User Profile
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-300 text-lg">
              {address ? (
                <div className="flex items-center gap-2 mt-2">
                  <span>Profile for </span>
                  <code className="bg-white/10 px-2 py-1 rounded-lg font-mono text-sm">
                    {address.slice(0, 8)}...{address.slice(-6)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyAddress}
                    className="h-7 w-7 p-0 hover:bg-white/10"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </Button>
                </div>
              ) : (
                "Loading profile..."
              )}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-48 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
              <p className="text-slate-400 animate-pulse">Loading profile data...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Profile and Work History Cards */}
              {/* ... [profile card same as before] ... */}

              {/* Work History */}
              <Card className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">Work History</CardTitle>
                      <CardDescription className="text-slate-400">
                        {workHistory.length > 0
                          ? `📊 ${workHistory.length} completed ${workHistory.length === 1 ? "project" : "projects"}`
                          : "🚀 Ready to start first project"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {workHistory.length > 0 ? (
                    <div className="space-y-4">
                      {workHistory.map((job, index) => (
                        <div
                          key={job.id}
                          className="group border border-slate-700/50 rounded-xl p-5 bg-gradient-to-r from-slate-800/30 to-slate-700/30 hover:from-slate-700/40 hover:to-slate-600/40 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  job.role === "Freelancer"
                                    ? "bg-purple-500/20 text-purple-400"
                                    : "bg-pink-500/20 text-pink-400"
                                }`}
                              >
                                {job.role === "Freelancer" ? (
                                  <Code className="w-5 h-5" />
                                ) : (
                                  <AppWindow className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-lg">
                                  {job.title}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    job.role === "Freelancer"
                                      ? "border-purple-500/50 text-purple-400"
                                      : "border-pink-500/50 text-pink-400"
                                  }`}
                                >
                                  {job.role}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-emerald-400 font-bold text-lg">
                                {job.price} ETH
                              </div>
                              <div className="text-slate-400 text-sm">
                                {job.completedAt
                                  ? formatDistanceToNow(job.completedAt, {
                                      addSuffix: true,
                                    })
                                  : "N/A"}
                              </div>
                            </div>
                          </div>

                          <p className="text-slate-300 mb-2 leading-relaxed">
                            {job.description}
                          </p>

                          <Badge
                            className={`text-sm font-medium border ${
                              statusColors[job.status] ||
                              "bg-slate-500/20 text-slate-300 border-slate-500/30"
                            } mb-4`}
                          >
                            {statusLabels[job.status] || "Unknown"}
                          </Badge>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-600/30">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-slate-400">Counterparty:</span>
                              <code className="bg-slate-700/50 px-2 py-1 rounded text-slate-300 font-mono">
                                {job.counterparty?.slice(0, 6)}...{job.counterparty?.slice(-4)}
                              </code>
                            </div>

                            {job.workUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                              >
                                <a
                                  href={job.workUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  View Work
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Briefcase className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-400 text-lg mb-2">No completed projects yet</p>
                      <p className="text-slate-500 text-sm">This user is ready to start their freelancing journey!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}