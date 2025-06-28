"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FileText, Download } from "lucide-react"

export function ResumeDialog({ resumeString }) {
  const downloadResume = () => {
    if (!resumeString) return
    
    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${resumeString}`
    link.download = 'resume.pdf'
    link.setAttribute('aria-label', 'Download resume PDF')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!resumeString) {
    return null
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="w-full bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/90 transition-colors duration-200"
          aria-label="View resume"
        >
          <div className="flex items-center justify-center space-x-2 p-3 sm:p-4">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="text-xs sm:text-sm text-slate-300">Resume Available</span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 z-40 bg-white/20 backdrop-blur" />
      <DialogContent className="sm:max-w-[90%] lg:max-w-[80%] h-[85vh] md:h-[90vh] max-w-[95vw] backdrop-blur rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/20 bg-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Resume Preview
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-sm sm:text-base">
            View or download resume document
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-[calc(100%-80px)] gap-4">
          <div className="flex-1 border border-gray-600/30 rounded-lg overflow-hidden bg-white/5">
            <iframe 
              src={`data:application/pdf;base64,${resumeString}#toolbar=0`} 
              className="w-full h-full md:min-h-[560px] min-h-[500px]"
              title="Resume Preview"
              aria-label="Resume preview"
              loading="lazy"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto text-white">
                Close
              </Button>
            </DialogClose>
            <Button 
                variant="fav"
              onClick={downloadResume}
              className="w-full sm:w-auto text-white"
            >
              <Download className="w-4 h-4 mr-2 " />
              <span>Download Resume</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}