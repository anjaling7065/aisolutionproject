import { motion } from "motion/react";

export default function ProblemSection() {
  return (
    <section id="problem" className="py-20 border-t border-white/5 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Businesses Lose Thousands of Dollars Every Month
        </h2>
        <p className="mt-4 text-slate-300 font-light text-lg">
          Silent operational leaks drain your margins daily. Traditional manual setups are simply too slow to adapt.
        </p>
      </div>

      {/* Interactive Loss Monitor Dashboard */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl mx-auto rounded-2xl glass-card overflow-hidden border border-white/10 p-1 relative shadow-[0_0_50px_rgba(239,68,68,0.05)] mb-12"
      >
        {/* Window control bar with diagnostic alarm style */}
        <div className="bg-slate-950/80 px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-red-500 animate-pulse" />
            <span className="h-3.5 w-3.5 rounded-full bg-yellow-500/75" />
            <span className="h-3.5 w-3.5 rounded-full bg-green-500/75" />
            <span className="ml-3 font-mono text-[11px] text-red-400 tracking-widest uppercase">STELLAR_LEAKAGE_MONITOR // ACTIVE_DIAGNOSTICS</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] font-mono text-red-400">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping mr-1" />
              REVENUE_DRAIN_DETECTOR
            </span>
          </div>
        </div>

        {/* Inner dynamic view of problem statement */}
        <div className="bg-slate-950/50 p-6 md:p-8 min-h-[300px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Backglow element (danger red) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-red-500/5 blur-[80px]" />
          
          {/* Left Column: Five Core Sinks */}
          <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center space-y-6">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              Where is Your Capital Going?
            </h3>
            <p className="text-slate-300 font-light leading-relaxed">
              Our core diagnostics scan your business model for structural friction. When operations are manual, you don't just lose time—you lose conversion speed, client loyalty, and raw scale.
            </p>
            
            {/* Live telemetry row displaying real-world loss metrics */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="border border-red-500/20 rounded-xl bg-red-950/10 p-3 font-mono">
                <span className="block text-[10px] text-red-400 uppercase tracking-wider">Average Monthly Leak</span>
                <span className="text-xl font-semibold text-red-400 animate-pulse">$14,820+</span>
              </div>
              <div className="border border-white/5 rounded-xl bg-white/2 p-3 font-mono">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Manual Inefficiency</span>
                <span className="text-xl font-semibold text-purple-400">42% Speed Loss</span>
              </div>
            </div>
          </div>

          {/* Right Column visual: Core Friction Matrix */}
          <motion.div 
            whileHover={{ scale: 1.025 }}
            className="relative w-full md:w-1/2 h-64 md:h-80 border border-red-500/20 rounded-xl bg-slate-950/75 overflow-hidden group shadow-[0_0_40px_rgba(239,68,68,0.03)] p-6 flex flex-col justify-between"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="font-mono text-[10px] text-slate-400 border-b border-white/5 pb-2 mb-4 flex justify-between">
              <span>OPERATIONAL_FRICTION_MATRIX</span>
              <span className="text-red-400 animate-pulse">● DETECTING_ERRORS</span>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 bg-white/2 p-2 rounded border border-white/5">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> 
                  Repetitive Manual Tasks
                </span>
                <span className="text-red-400 font-bold">HIGH DRAIN</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 bg-white/2 p-2 rounded border border-white/5">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> 
                  Slow Customer Support
                </span>
                <span className="text-red-400 font-bold">24h+ Delays</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-300 bg-white/2 p-2 rounded border border-white/5">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> 
                  Missed Sales Leads
                </span>
                <span className="text-red-400 font-bold">35% Abandoned</span>
              </div>
            </div>

            <div className="mt-4 text-[9px] font-mono text-slate-500 flex justify-between items-center">
              <span>SCANNING DELTA_VECTORS...</span>
              <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded">Friction Detected</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 5 Problem Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
        <div className="glass-card hover:border-red-500/30 rounded-xl p-5 border border-white/5 relative overflow-hidden group">
          <span className="absolute top-2 right-2 text-[10px] font-mono text-red-500/60 font-bold">01 // WASTE</span>
          <h4 className="font-display font-bold text-white text-sm mb-1.5">Repetitive manual tasks</h4>
          <p className="text-slate-400 text-xs font-light leading-relaxed">
            Wasting expensive specialist hours on copying data, running standard spreadsheets, and managing basic logistics.
          </p>
        </div>

        <div className="glass-card hover:border-red-500/30 rounded-xl p-5 border border-white/5 relative overflow-hidden group">
          <span className="absolute top-2 right-2 text-[10px] font-mono text-red-500/60 font-bold">02 // CHURN</span>
          <h4 className="font-display font-bold text-white text-sm mb-1.5">Slow customer support</h4>
          <p className="text-slate-400 text-xs font-light leading-relaxed">
            Losing loyal customers and modern conversions due to long email response queues and lack of instant, 24/7 engagement.
          </p>
        </div>

        <div className="glass-card hover:border-red-500/30 rounded-xl p-5 border border-white/5 relative overflow-hidden group">
          <span className="absolute top-2 right-2 text-[10px] font-mono text-red-500/60 font-bold">03 // LOSS</span>
          <h4 className="font-display font-bold text-white text-sm mb-1.5">Missed sales leads</h4>
          <p className="text-slate-400 text-xs font-light leading-relaxed">
            Failing to capture high-intent leads on weekends or off-hours when active response latency spikes.
          </p>
        </div>

        <div className="glass-card hover:border-red-500/30 rounded-xl p-5 border border-white/5 relative overflow-hidden group">
          <span className="absolute top-2 right-2 text-[10px] font-mono text-red-500/60 font-bold">04 // SILOS</span>
          <h4 className="font-display font-bold text-white text-sm mb-1.5">Poor data insights</h4>
          <p className="text-slate-400 text-xs font-light leading-relaxed">
            Operating blindly without cross-referencing multi-channel reports, trends, or tracking operational metrics.
          </p>
        </div>

        <div className="glass-card hover:border-red-500/30 rounded-xl p-5 border border-white/5 relative overflow-hidden group">
          <span className="absolute top-2 right-2 text-[10px] font-mono text-red-500/60 font-bold">05 // FRICTION</span>
          <h4 className="font-display font-bold text-white text-sm mb-1.5">Inefficient workflows</h4>
          <p className="text-slate-400 text-xs font-light leading-relaxed">
            Teams working in silos with delayed handoffs, custom manual scripts, and zero automated integrations.
          </p>
        </div>
      </div>
    </section>
  );
}
