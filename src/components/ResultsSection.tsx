export default function ResultsSection() {
  return (
    <section id="results" className="py-20 border-t border-white/5 scroll-mt-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Guaranteed Operational Leaps
        </h2>
        <p className="mt-4 text-slate-300 font-light text-lg">
          Unlock structural compounding gains. Our clients achieve significant performance leaps within 30 days of implementation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-6xl mx-auto">
        {/* Metric 1 */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/5 blur-lg pointer-events-none" />
          <div>
            <span className="block font-mono text-[10px] text-cyan-400 uppercase tracking-widest mb-4">Cost Efficiency</span>
            <div className="text-4xl md:text-5xl font-extrabold text-white font-display mb-2 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              60%
            </div>
            <h4 className="text-xs font-semibold text-white mb-1.5 uppercase tracking-wider">Reduce operational costs</h4>
          </div>
          <p className="text-xs text-slate-400 font-light leading-relaxed mt-4">
            Reduce operational costs by up to 60% through structured neural automation.
          </p>
        </div>

        {/* Metric 2 */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-400/5 blur-lg pointer-events-none" />
          <div>
            <span className="block font-mono text-[10px] text-purple-400 uppercase tracking-widest mb-4">Hours Recovered</span>
            <div className="text-4xl md:text-5xl font-extrabold text-white font-display mb-2 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
              100s
            </div>
            <h4 className="text-xs font-semibold text-white mb-1.5 uppercase tracking-wider">Save employee hours</h4>
          </div>
          <p className="text-xs text-slate-400 font-light leading-relaxed mt-4">
            Save hundreds of employee hours monthly by eliminating duplicate checks and manual handoffs.
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 blur-lg pointer-events-none" />
          <div>
            <span className="block font-mono text-[10px] text-pink-400 uppercase tracking-widest mb-4">Loyalty Sync</span>
            <div className="text-4xl md:text-5xl font-extrabold text-white font-display mb-2 bg-gradient-to-r from-white to-pink-300 bg-clip-text text-transparent">
              98%
            </div>
            <h4 className="text-xs font-semibold text-white mb-1.5 uppercase tracking-wider">Improve satisfaction</h4>
          </div>
          <p className="text-xs text-slate-400 font-light leading-relaxed mt-4">
            Keep client-facing responses within seconds and eliminate support backlogs completely.
          </p>
        </div>

        {/* Metric 4 */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-lg pointer-events-none" />
          <div>
            <span className="block font-mono text-[10px] text-blue-400 uppercase tracking-widest mb-4">Flow Rate</span>
            <div className="text-4xl md:text-5xl font-extrabold text-white font-display mb-2 bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
              +3x
            </div>
            <h4 className="text-xs font-semibold text-white mb-1.5 uppercase tracking-wider">Increase efficiency</h4>
          </div>
          <p className="text-xs text-slate-400 font-light leading-relaxed mt-4">
            Boost overall speed and organizational flow through automated integrations.
          </p>
        </div>

        {/* Metric 5 */}
        <div className="glass-card rounded-2xl border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 blur-lg pointer-events-none" />
          <div>
            <span className="block font-mono text-[10px] text-emerald-400 uppercase tracking-widest mb-4">Payroll Cap</span>
            <div className="text-4xl md:text-5xl font-extrabold text-white font-display mb-2 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              100%
            </div>
            <h4 className="text-xs font-semibold text-white mb-1.5 uppercase tracking-wider">Scale without headcount</h4>
          </div>
          <p className="text-xs text-slate-400 font-light leading-relaxed mt-4">
            Scale operations dynamically without increasing linear headcount or administrative payroll.
          </p>
        </div>
      </div>
    </section>
  );
}
