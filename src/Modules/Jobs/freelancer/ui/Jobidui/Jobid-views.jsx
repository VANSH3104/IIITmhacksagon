"use client"
import { useState, useEffect } from "react"
import { useJobStore } from "@/Hook/jobstore"
import { getContract } from "@/Hook/useContract"
import { ApplyJobDialog } from "./ApplyJobDialog"
import { SubmitJob } from "./SubmitJob"

export const JobIdViewFree = () => {
  const { currentJobid , mode } = useJobStore()
  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!currentJobid) return

    const fetchJob = async () => {
      try {
        setLoading(true)
        const contract = await getContract();
        const data = await contract.jobs(currentJobid)
        
        setJobData({
          jobTitle: data.jobTitle,
          description: data.description,
          client: data.client,
          price: data.price.toString(),
          createdAt: new Date(Number(data.createdAt) * 1000).toLocaleDateString()
        })
      } catch (err) {
        console.error("Error fetching job data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [currentJobid])

  const handleSupplyNow = () => {
    console.log("Supply Now clicked for job:", currentJobid)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 h-screen">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl">
          <div className="text-center text-white">Loading job details...</div>
        </div>
      </div>
    )
  }

  if (!jobData) {
    return (
      <div className="flex items-center justify-center p-4 h-screen">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl">
          <div className="text-center text-white">No job selected</div>
        </div>
      </div>
    )
  }
  let tag = mode ===1 || mode ===2 ;
  return (
    <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/40 min-h-screen">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <div className="container mx-auto px-4 py-8 max-h-[60vh] md:max-h-[80vh] overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-2xl p-4 shadow-xl hover:border-slate-500/60 transition-all duration-300">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center break-words">
                {jobData.jobTitle}
              </h2>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-2xl p-6 shadow-xl hover:border-slate-500/60 transition-all duration-300">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"></div>
              <h3 className="text-xl font-semibold text-slate-200">Description</h3>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
              <p className="text-slate-300 leading-relaxed break-words">
                {jobData.description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-2xl p-5 shadow-xl hover:border-emerald-500/40 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-200">Client</h3>
              </div>
              <div className="bg-emerald-900/10 rounded-lg p-3 border border-emerald-800/20">
                <p className="text-slate-300 break-all font-mono text-sm">
                  {jobData.client}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-2xl p-5 shadow-xl hover:border-amber-500/40 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <div className="text-white font-bold">$</div>
                </div>
                <h3 className="text-lg font-semibold text-slate-200">Budget</h3>
              </div>
              <div className="bg-amber-900/10 rounded-lg p-3 border border-amber-800/20">
                <p className="text-slate-300 text-xl md:text-2xl font-bold">
                  ${jobData.price}
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-600/50 rounded-2xl p-5 shadow-xl hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 border-2 border-white rounded-sm"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-200">Posted On</h3>
              </div>
              <div className="bg-purple-900/10 rounded-lg p-3 border border-purple-800/20">
                <p className="text-slate-300 font-semibold">
                  {jobData.createdAt}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end ">
          {!tag ? (<ApplyJobDialog jobId={currentJobid}/>): <SubmitJob/>}

            
          </div>
        </div>
      </div>
    </div>
  )
}