import { useState, useEffect } from "react";
import { 
  Wifi, 
  Battery, 
  Clock, 
  Maximize2, 
  Minimize2, 
  Tv, 
  Laptop, 
  Sparkles,
  Lock,
  Compass
} from "lucide-react";
import { motion } from "motion/react";

interface LaptopFrameProps {
  children: React.ReactNode;
}

export default function LaptopFrame({ children }: LaptopFrameProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Update mock battery & time indicators
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="laptop-frame-wrapper" className="w-full flex flex-col items-center">
      {/* View Options Bar */}
      <div className="mb-6 flex items-center justify-between w-full max-w-5xl px-4 py-2 rounded-xl bg-slate-900/60 border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Laptop className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-300">INTEGRATED VIEWPORT ENGINE</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {isFullscreen ? "Viewing: Expanded Edge-to-Edge" : "Viewing: Mock MacBook Pro Frame"}
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
              isFullscreen 
                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20"
                : "bg-white/5 border-white/10 text-slate-300 hover:border-white/20 hover:text-white"
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Default View</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Laptop Viewport Maximize</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isFullscreen ? (
        /* Flat Edge-to-Edge Desktop Layout */
        <div className="w-full border border-white/5 bg-slate-950/40 rounded-3xl p-6 backdrop-blur-lg">
          {children}
        </div>
      ) : (
        /* Ultra High-Fidelity 3D-feeling Laptop Bezel & Body chassis */
        <div className="w-full max-w-5xl flex flex-col items-center relative transition-all duration-500">
          
          {/* 1. LAPTOP SCREEN LID */}
          <div className="w-full aspect-[16/10] bg-black p-[12px] sm:p-[16px] rounded-t-[2rem] border-x-[5px] border-t-[5px] border-[#2d2e30] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col">
            
            {/* Glossy Reflection overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.04] pointer-events-none z-10" />
            
            {/* Top Bezel Notch with interactive Web camera lens */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[20px] w-[110px] bg-black rounded-b-[10px] z-50 flex items-center justify-center gap-2">
              {/* Camera green light */}
              <div className="h-1.5 w-1.5 rounded-full bg-green-500/80 animate-pulse border border-black" />
              {/* Camera lens */}
              <div className="h-2 w-2 rounded-full bg-[#111] border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full bg-cyan-400/50" />
              </div>
            </div>

            {/* Screen Content Wrapper with integrated Status Indicator Bar */}
            <div className="flex-1 rounded-[12px] bg-slate-950 overflow-hidden border border-white/[0.03] flex flex-col select-none">
              
              {/* Laptop screen Top Menu Bar (Mock OS style) */}
              <div className="h-8 bg-slate-950/90 border-b border-white/5 px-4 flex justify-between items-center text-[10px] font-mono text-slate-400 backdrop-blur z-20">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>STELLAR.OS</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-300">File</span>
                  <span className="text-slate-400 hidden sm:inline">Agent</span>
                  <span className="text-slate-400 hidden sm:inline">Telemetry</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-green-500/20 bg-green-500/10 text-green-400">
                    <Lock className="h-2.5 w-2.5" /> Secure SSL Connection
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Wifi className="h-3 w-3 text-cyan-400" />
                    <span className="text-slate-300">GCP_SATELLITE_LINK</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Battery className="h-3.5 w-3.5 text-green-400" />
                    <span>99%</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{currentTime || "12:00 PM"}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Dashboard Portal content screen */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative bg-slate-950 select-text">
                {children}
              </div>

            </div>

          </div>

          {/* 2. LAPTOP HINGE AND LOWER DECK */}
          <div className="w-full relative z-20">
            {/* Screen connection hinge shadow */}
            <div className="w-full h-[6px] bg-[#1a1b1c] rounded-b-[4px] border-b border-[#0f1011]" />
            
            {/* Lower deck aluminum body casing */}
            <div className="w-[101%] -ml-[0.5%] h-[16px] bg-gradient-to-b from-[#222324] to-[#121314] rounded-b-[12px] border-b-[3px] border-[#0c0d0d] relative shadow-2xl flex justify-center">
              {/* Display opening thumb scoop indentation */}
              <div className="absolute top-0 w-[110px] h-[6px] bg-[#0c0d0d] rounded-b-[8px]" />
            </div>

            {/* Keyboard Deck base perspective mock (adds incredible depth & look) */}
            <div className="w-[104%] -ml-[2%] h-[40px] bg-gradient-to-b from-[#18191a] to-[#0c0d0d] rounded-b-[24px] border-b-[5px] border-[#08090a] relative shadow-2xl flex justify-center">
              {/* Simulated centered space-gray key row & large glass trackpad */}
              <div className="w-[60%] sm:w-[45%] h-full flex flex-col items-center pt-[3px] opacity-80">
                {/* Thin mock Spacebar row */}
                <div className="w-[90%] h-[5px] bg-[#1f2022] rounded-[2px] border-t border-[#333] mb-1" />
                {/* Simulated Glass Trackpad casing */}
                <div className="w-[110px] sm:w-[130px] flex-1 bg-gradient-to-b from-[#1c1d1e] to-[#151617] rounded-t-[6px] border border-[#2d2e30]/80 relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)] cursor-default">
                  {/* Fine subtle border highlight */}
                  <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[#3a3b3d]/30" />
                </div>
              </div>

              {/* Deck side feet/rubber support shadow accents */}
              <div className="absolute bottom-[3px] left-[5%] w-[35px] h-[2px] bg-black/40 rounded-full" />
              <div className="absolute bottom-[3px] right-[5%] w-[35px] h-[2px] bg-black/40 rounded-full" />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
