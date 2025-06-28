"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Download, Loader2, X, ExternalLink, ZoomIn, ZoomOut, RotateCcw, Share2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function ResumeDialog({ resumeString }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');
  const [viewerDimensions, setViewerDimensions] = useState({ width: 0, height: 0 });
  const scrollContainerRef = useRef(null);
  const dialogContentRef = useRef(null);

  // Calculate optimal dimensions based on viewport
  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      
      // Calculate responsive dimensions
      const width = Math.min(vw * 0.85, 1000); // 85% of viewport width, max 1000px
      const height = Math.min(vh * 0.75, 800); // 75% of viewport height, max 800px
      
      setViewerDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoom('in');
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoom('out');
        } else if (e.key === '0') {
          e.preventDefault();
          setZoomLevel(100);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const downloadResume = async () => {
    if (!resumeString) return;
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${resumeString}`;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      await new Promise(resolve => setTimeout(resolve, 1000));
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const openInNewTab = () => {
    // Convert base64 to Blob
    const byteCharacters = atob(resumeString);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);

    // Open in new tab
    window.open(blobUrl, "_blank", "noopener,noreferrer");

    // Optional: Revoke the object URL after some time to free memory
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  };

  const shareResume = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Resume',
          text: 'Check out my professional resume',
          url: `data:application/pdf;base64,${resumeString}`
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`data:application/pdf;base64,${resumeString}`);
      setShowTooltip('Copied to clipboard!');
      setTimeout(() => setShowTooltip(''), 2000);
    }
  };

  const handleZoom = (direction) => {
    setZoomLevel(z => {
      if (direction === 'in') return Math.min(z + 15, 300);
      return Math.max(z - 15, 50);
    });
  };

  // Enhanced pan functionality for PDF viewing
  const handleMouseDown = (e) => {
    if (zoomLevel > 100) {
      setIsDragging(true);
      setStartY(e.clientY);
      document.body.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoomLevel <= 100) return;
    const y = e.clientY;
    const deltaY = startY - y;
    // Custom panning logic can be implemented here
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  // Wheel zoom functionality
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoom('in');
      } else {
        handleZoom('out');
      }
    }
  };

  useEffect(() => {
    const content = scrollContainerRef.current;
    if (content) {
      content.addEventListener('mousemove', handleMouseMove);
      content.addEventListener('mouseup', handleMouseUp);
      content.addEventListener('mouseleave', handleMouseUp);
      content.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (content) {
        content.removeEventListener('mousemove', handleMouseMove);
        content.removeEventListener('mouseup', handleMouseUp);
        content.removeEventListener('mouseleave', handleMouseUp);
        content.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isDragging, zoomLevel]);

  useEffect(() => {
    setZoomLevel(100);
    setEmbedLoaded(false);
  }, [resumeString]);

  if (!resumeString) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`group relative w-full h-14 rounded-xl border-2 border-transparent bg-gradient-to-r from-emerald-800/40 via-cyan-900/40 to-indigo-900/40
            transition-all duration-200 shadow-lg hover:shadow-md hover:border-emerald-500/70 overflow-hidden backdrop-blur-sm
            focus:ring-2 focus:ring-emerald-700/60 focus:ring-offset-2`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="View resume"
          style={{
            boxShadow: isHovered
              ? "0 0 0 1px rgba(16,185,129,0.15), 0 2px 8px 0 rgba(30,41,59,0.18)"
              : undefined,
            transform: isHovered ? "scale(1.01)" : "scale(1)",
            borderColor: isHovered ? "#059669" : "transparent",
            background:
              isHovered
                ? "linear-gradient(90deg, #065f46 0%, #164e63 50%, #312e81 100%)"
                : undefined,
            color: isHovered ? "#fff" : undefined,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/20 via-cyan-900/20 to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="relative z-10 flex items-center justify-center gap-3 px-6 w-full">
            <FileText className={`w-6 h-6 text-emerald-300 group-hover:text-white transition-all duration-150`} />
            <span className="text-base font-semibold text-emerald-100 group-hover:text-white transition-colors duration-150">
              View Resume
            </span>
          </div>
        </Button>
      </DialogTrigger>

      <DialogOverlay className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md" />

      <DialogContent
        ref={dialogContentRef}
        className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-auto h-auto sm:w-[98vw] sm:h-[96vh] sm:max-w-[1400px] sm:max-h-[96vh] backdrop-blur-3xl rounded-2xl sm:rounded-3xl p-0 overflow-hidden border-2 border-white/20 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 shadow-2xl transition-all duration-300"
      >
        <DialogHeader className="px-6 pt-4 pb-3 border-b border-white/10 bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80 backdrop-blur-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Resume Preview
                </DialogTitle>
                <DialogDescription className="text-slate-400/90 text-sm mt-1">
                  Interactive PDF viewer with zoom and navigation controls
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-800/80 rounded-xl px-3 py-2 border border-slate-600/50 shadow-lg backdrop-blur-sm">
                <button
                  onClick={() => handleZoom('out')}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 disabled:text-slate-500 disabled:hover:bg-transparent"
                  disabled={zoomLevel <= 50}
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-mono text-slate-300 w-12 text-center px-2">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => handleZoom('in')}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 disabled:text-slate-500 disabled:hover:bg-transparent"
                  disabled={zoomLevel >= 300}
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-slate-600/50 mx-1"></div>
                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                  aria-label="Reset zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={shareResume}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-white/20"
                    aria-label="Share resume"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  {showTooltip && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                      {showTooltip}
                    </div>
                  )}
                </div>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-400/30 border border-transparent transition-all duration-200"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[calc(100%-100px)]">
          <div
            ref={scrollContainerRef}
            className="relative flex-1 overflow-auto bg-gradient-to-b from-slate-900/50 to-slate-800/50 p-4"
            onMouseDown={handleMouseDown}
            style={{ 
              cursor: isDragging ? 'grabbing' : (zoomLevel > 100 ? 'grab' : 'default'),
              transition: 'cursor 0.2s'
            }}
          >
            {!embedLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-900/95 z-10 backdrop-blur-sm">
                <div className="relative">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
                  <div className="absolute inset-0 w-10 h-10 border-2 border-blue-400/20 rounded-full animate-pulse"></div>
                </div>
                <span className="text-slate-300 text-lg font-medium">Loading resume...</span>
                <div className="w-32 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center min-h-full">
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                className={`transition-all duration-300 ${embedLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              >
                <embed
                  src={`data:application/pdf;base64,${resumeString}#toolbar=0&navpanes=0&scrollbar=1&view=FitV`}
                  type="application/pdf"
                  className="rounded-lg border border-white/20 shadow-2xl"
                  onLoad={() => setEmbedLoaded(true)}
                  style={{
                    display: 'block',
                    width: `${viewerDimensions.width}px`,
                    height: `${viewerDimensions.height}px`,
                    minWidth: '320px',
                    minHeight: '450px',
                    maxWidth: '100%',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    borderRadius: '0.5rem'
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400 flex items-center gap-3">
                <span className="font-medium">Zoom: {zoomLevel}%</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-500">
                  Ctrl+Scroll to zoom • Ctrl+0 to reset
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={openInNewTab}
                className="group relative flex items-center gap-2 border-2 border-slate-600/50 hover:border-slate-400/70 bg-slate-800/50 hover:bg-slate-700/60 text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm overflow-hidden font-medium"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 via-slate-500/20 to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Open in New Tab</span>
                </div>
              </Button>
              <Button
                variant="default"
                onClick={downloadResume}
                disabled={isDownloading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-xl hover:shadow-blue-500/30 transition-all duration-300 font-semibold"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}