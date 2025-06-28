"use client";
import { useEffect, useState, useCallback } from "react";
import { getContract } from "@/Hook/useContract";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  User,
  Calendar,
  DollarSign,
  Briefcase,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobStore } from "@/Hook/jobstore";
import { useRouter } from "next/navigation";

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

const BATCH_SIZE = 10;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const JobWithFilter = ({
  statusFilter,
  clientFilter,
  freelancerFilter,
  minPrice,
  maxPrice,
}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ethPrice, setEthPrice] = useState(3500);
  const [jobCache, setJobCache] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { setCurrentJobid, setCurrentJobstatus } = useJobStore();
  const router = useRouter();
  const filterJob = useCallback(
    (job) => {
      const matchesStatus =
        statusFilter === undefined || job.status === statusFilter;
      const matchesClient =
        !clientFilter ||
        job.client.toLowerCase() === clientFilter.toLowerCase();
      const matchesFreelancer =
        !freelancerFilter ||
        (job.freelancer !== ZERO_ADDRESS &&
          job.freelancer.toLowerCase() === freelancerFilter.toLowerCase());
      const matchesMinPrice = minPrice === undefined || job.price >= minPrice;
      const matchesMaxPrice = maxPrice === undefined || job.price <= maxPrice;

      return (
        matchesStatus &&
        matchesClient &&
        matchesFreelancer &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    },
    [statusFilter, clientFilter, freelancerFilter, minPrice, maxPrice]
  );

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const contract = await getContract();
      const jobCount = Number(await contract.getTotalJobs());
      setTotalPages(Math.ceil(jobCount / BATCH_SIZE));

      const batchPromises = [];
      const start = (currentPage - 1) * BATCH_SIZE + 1;
      const end = Math.min(currentPage * BATCH_SIZE, jobCount);

      for (let i = start; i <= end; i++) {
        if (jobCache[i]) {
          batchPromises.push(Promise.resolve(jobCache[i]));
        } else {
          batchPromises.push(
            contract
              .getJobDetails(i)
              .then((job) => {
                const formattedJob = {
                  jobId: Number(job[0]),
                  client: job[1],
                  jobTitle: job[2],
                  description: job[3],
                  price: Number(job[4]),
                  status: Number(job[5]),
                  freelancer: job[6],
                  createdAt: Number(job[7]),
                  completedAt: Number(job[8]),
                };
                setJobCache((prev) => ({ ...prev, [i]: formattedJob }));
                return formattedJob;
              })
              .catch((err) => {
                console.error(`Failed to fetch job ${i}:`, err);
                return null;
              })
          );
        }
      }

      const batchResults = await Promise.all(batchPromises);
      const validJobs = batchResults.filter((job) => job !== null);
      const filteredJobs = validJobs.reverse().filter(filterJob);
      setJobs((prev) => [...filteredJobs, ...prev]);
    } catch (err) {
      console.error("Failed to initialize job fetch:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterJob, jobCache]);

  const refreshJobs = useCallback(() => {
    setJobs([]);
    setCurrentPage(1);
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchJobs();
    }
  }, [currentPage, fetchJobs]);

  const formatPrice = (price) => {
    if (ethPrice) {
      return `${price.toFixed(4)}`;
    }
    return `${price.toFixed(4)}`;
  };

  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;
  const formatDate = (timestamp) =>
    new Date(timestamp * 1000).toLocaleDateString();

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 2:
        return <CheckCircle className="w-4 h-4" />;
      case 3:
        return <AlertTriangle className="w-4 h-4" />;
      case 1:
        return <User className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const StatusBadge = ({ status }) => (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusColors[status]}`}
    >
      <StatusIcon status={status} />
      {statusLabels[status]}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <Button
          variant="outline"
          onClick={refreshJobs}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white border-slate-600 px-4 py-2 text-sm sm:text-base"
        >
          {loading ? "Refreshing..." : "Refresh"}
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading && jobs.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-24 sm:h-32 rounded-xl bg-slate-800"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16">
          <Briefcase className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No jobs found
          </h3>
          <p className="text-slate-400">
            Try adjusting your filters to see more results
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={`${job.jobId}`}
              className="group bg-gradient-to-r from-slate-800/80 to-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 sm:p-6 hover:border-slate-600 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 group-hover:text-green-400 transition-colors">
                        {job.jobTitle}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <div className="md:pb-4">
                      <StatusBadge status={job.status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-start sm:items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold">
                        {formatPrice(job.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <User className="w-4 h-4" />
                      <span>Client: </span>
                      <span className="font-mono text-slate-300">
                        {formatAddress(job.client)}
                      </span>
                    </div>

                    {job.freelancer !== ZERO_ADDRESS && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span>Freelancer: </span>
                        <span className="font-mono text-slate-300">
                          {formatAddress(job.freelancer)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-auto mt-4 md:mt-0 flex justify-end md:justify-start">
                  <Button
                    className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-blue-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-pink-500/25"
                    onClick={() => {
                      setCurrentJobid(job.jobId);
                      setCurrentJobstatus(job.status);
                      router.push("/job/jobid");
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {currentPage < totalPages && (
            <div className="flex justify-center pt-8">
              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={loading}
                className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
