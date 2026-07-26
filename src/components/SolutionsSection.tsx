import { Cpu, Layers, Activity, Gauge, Shield, Headphones } from "lucide-react";

export default function SolutionsSection() {
  return (
    <section id="solutions" className="py-20 border-t border-white/5 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Intelligent Business Solutions
        </h2>
        <p className="mt-4 text-slate-300 font-light text-lg">
          Automated pipelines built to remove operational waste, unlock rapid scale, and capture revenue.
        </p>
      </div>

      {/* 6 AI Solutions Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border border-white/5 flex flex-col justify-between group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr from-cyan-400/10 to-transparent blur-xl transition-all group-hover:scale-150" />
          <div>
            <div className="p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-xl w-12 h-12 flex items-center justify-center mb-5 text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.1)]">
              <Cpu className="h-6 w-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-white mb-2 tracking-wide">Revenue Growth Automation</h4>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Increase conversions and sales with AI-powered lead generation and customer engagement.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400/70">
            <span>SYSTEM // REVENUE_GROWTH</span>
            <span>ACTIVE</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border border-white/5 flex flex-col justify-between group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent blur-xl transition-all group-hover:scale-150" />
          <div>
            <div className="p-3 bg-purple-400/10 border border-purple-400/20 rounded-xl w-12 h-12 flex items-center justify-center mb-5 text-purple-400 shadow-[0_0_10px_rgba(157,78,221,0.1)]">
              <Layers className="h-6 w-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-white mb-2 tracking-wide">Customer Support Automation</h4>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Provide instant 24/7 support while reducing operational costs.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-400/70">
            <span>STREAM // SUPPORT_AUTOMATION</span>
            <span>ONLINE</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border border-white/5 flex flex-col justify-between group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-transparent blur-xl transition-all group-hover:scale-150" />
          <div>
            <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-xl w-12 h-12 flex items-center justify-center mb-5 text-pink-400 shadow-[0_0_10px_rgba(255,0,127,0.1)]">
              <Activity className="h-6 w-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-white mb-2 tracking-wide">Business Intelligence</h4>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Turn business data into actionable insights and smarter decisions.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-pink-400/70">
            <span>NODE // INTEL_DASHBOARD</span>
            <span>OPTIMIZED</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border border-white/5 flex flex-col justify-between group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-transparent blur-xl transition-all group-hover:scale-150" />
          <div>
            <div className="p-3 bg-blue-400/10 border border-blue-400/20 rounded-xl w-12 h-12 flex items-center justify-center mb-5 text-blue-400 shadow-[0_0_10px_rgba(58,134,200,0.1)]">
              <Gauge className="h-6 w-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-white mb-2 tracking-wide">Workflow Automation</h4>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Eliminate repetitive tasks and improve team productivity.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-blue-400/70">
            <span>ENGINE // PIPELINE_FLOW</span>
            <span>STABLE</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border border-white/5 flex flex-col justify-between group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr from-cyan-400/10 to-transparent blur-xl transition-all group-hover:scale-150" />
          <div>
            <div className="p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-xl w-12 h-12 flex items-center justify-center mb-5 text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.1)]">
              <Shield className="h-6 w-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-white mb-2 tracking-wide">Predictive Analytics</h4>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Forecast trends, customer behavior, and business opportunities.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400/70">
            <span>GUARD // PREDICTIVE_ENGINE</span>
            <span>RUNNING</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="glass-card glass-card-hover rounded-2xl p-6 relative overflow-hidden border border-white/5 flex flex-col justify-between group">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent blur-xl transition-all group-hover:scale-150" />
          <div>
            <div className="p-3 bg-purple-400/10 border border-purple-400/20 rounded-xl w-12 h-12 flex items-center justify-center mb-5 text-purple-400 shadow-[0_0_10px_rgba(157,78,221,0.1)]">
              <Headphones className="h-6 w-6" />
            </div>
            <h4 className="font-display text-lg font-bold text-white mb-2 tracking-wide">Enterprise AI Systems</h4>
            <p className="text-slate-400 text-sm font-light leading-relaxed">
              Custom AI solutions built specifically for your organization.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-purple-400/70">
            <span>AGENT // ENTERPRISE_CORE</span>
            <span>STANDBY</span>
          </div>
        </div>
      </div>
    </section>
  );
}
