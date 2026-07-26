export default function AudienceSection() {
  return (
    <section id="audience" className="py-20 border-t border-white/5 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Who We Partner With
        </h2>
        <p className="mt-4 text-slate-300 font-light text-lg">
          We engineer custom intelligence architectures tailored for scaling teams, high-frequency workflows, and decision-makers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-44 group hover:border-cyan-400/30 transition-all duration-300">
          <span className="font-mono text-[10px] text-cyan-400">01 // CORPORATE SCALE</span>
          <h4 className="font-display text-lg font-bold text-white">Enterprise Companies</h4>
          <p className="text-xs text-slate-400 font-light">Secure compliance-locked automation systems integrated with existing multi-platform architectures.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-44 group hover:border-purple-400/30 transition-all duration-300">
          <span className="font-mono text-[10px] text-purple-400">02 // LEAN SPEED</span>
          <h4 className="font-display text-lg font-bold text-white">High-Growth Startups</h4>
          <p className="text-xs text-slate-400 font-light">Rapidly establish robust operational loops to keep headcounts ultra-lean while scaling.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-44 group hover:border-pink-500/30 transition-all duration-300">
          <span className="font-mono text-[10px] text-pink-400">03 // STRATEGY</span>
          <h4 className="font-display text-lg font-bold text-white">CEOs & Founders</h4>
          <p className="text-xs text-slate-400 font-light">Eradicate repetitive task noise to let core leaders focus entirely on vision and equity.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-44 group hover:border-blue-400/30 transition-all duration-300">
          <span className="font-mono text-[10px] text-blue-400">04 // OUTSOURCING</span>
          <h4 className="font-display text-lg font-bold text-white">Agencies</h4>
          <p className="text-xs text-slate-400 font-light">Automate multi-client pipeline reports, copy generation, and onboarding handoffs safely.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-44 group hover:border-cyan-400/30 transition-all duration-300">
          <span className="font-mono text-[10px] text-cyan-400">05 // VELOCITY</span>
          <h4 className="font-display text-lg font-bold text-white">E-commerce Businesses</h4>
          <p className="text-xs text-slate-400 font-light">Recover abandoned checkouts and resolve buyer queries instantly using active conversational agents.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-44 group hover:border-purple-400/30 transition-all duration-300">
          <span className="font-mono text-[10px] text-purple-400">06 // CARE QUALITY</span>
          <h4 className="font-display text-lg font-bold text-white">Healthcare Organizations</h4>
          <p className="text-xs text-slate-400 font-light">Streamline appointment management, dynamic charting reviews, and secure administrative steps.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-44 group hover:border-pink-500/30 transition-all duration-300">
          <span className="font-mono text-[10px] text-pink-400">07 // FIDELITY</span>
          <h4 className="font-display text-lg font-bold text-white">Financial Institutions</h4>
          <p className="text-xs text-slate-400 font-light">Speed up compliance scanning, fraud analytics auditing, and risk analysis telemetry.</p>
        </div>

        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-44 group hover:border-blue-400/30 transition-all duration-300">
          <span className="font-mono text-[10px] text-blue-400">08 // HEAVY DISPATCH</span>
          <h4 className="font-display text-lg font-bold text-white">Large-Scale Operations</h4>
          <p className="text-xs text-slate-400 font-light">Synchronize complex physical dispatch routing, material workflows, and system sync ticks.</p>
        </div>
      </div>
    </section>
  );
}
