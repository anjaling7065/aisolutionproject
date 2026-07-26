import { useState, useEffect } from "react";
import { 
  Cpu, 
  Zap, 
  RefreshCw, 
  Shield, 
  Activity, 
  Sliders, 
  Layers, 
  Wrench, 
  Play, 
  Trash2, 
  BarChart4, 
  AlertTriangle, 
  Gauge, 
  Power,
  Server
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FleetNode {
  id: string;
  name: string;
  load: number;
  status: "active" | "standby" | "overloaded" | "offline";
  cores: number;
  maxThroughput: number; // requests/sec
}

const INITIAL_NODES: FleetNode[] = [
  { id: "node-aether", name: "Aether Reasoning Engine", load: 45, status: "active", cores: 64, maxThroughput: 1200 },
  { id: "node-vector", name: "Vector Index Shard [01]", load: 68, status: "active", cores: 32, maxThroughput: 4500 },
  { id: "node-firewall", name: "PII Security Guard v4.2", load: 12, status: "standby", cores: 16, maxThroughput: 800 },
  { id: "node-stream", name: "Chronological Event Bus", load: 88, status: "active", cores: 48, maxThroughput: 3500 }
];

interface SysLog {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  type: "info" | "warning" | "success" | "critical";
}

const INITIAL_SYS_LOGS: SysLog[] = [
  { id: "L-1", timestamp: "08:31:02", source: "AETHER_CORE", message: "Optimized 4 cognitive attention heads successfully.", type: "success" },
  { id: "L-2", timestamp: "08:31:05", source: "VECTOR_SHARD", message: "Cosine index cluster synchronized with 99.9% consistency.", type: "info" },
  { id: "L-3", timestamp: "08:31:08", source: "PII_FIREWALL", message: "BLOCKED: Scrapped 3 instances of credit card data from invoice upload.", type: "warning" },
  { id: "L-4", timestamp: "08:31:12", source: "SYSTEM_BUS", message: "High frequency queue backlog reaching threshold limit.", type: "info" }
];

export default function AdminDashboard() {
  const [nodes, setNodes] = useState<FleetNode[]>(INITIAL_NODES);
  const [sysLogs, setSysLogs] = useState<SysLog[]>(INITIAL_SYS_LOGS);
  const [swarmCapacity, setSwarmCapacity] = useState(48);
  const [thinkingDepth, setThinkingDepth] = useState<"low" | "medium" | "high">("medium");
  const [tokenLimit, setTokenLimit] = useState(1000000);
  const [serverLoad, setServerLoad] = useState(53.2);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [customLogsCounter, setCustomLogsCounter] = useState(0);

  // Dynamic system telemetry simulation
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate dynamic average server load based on nodes
      setNodes(prev => prev.map(node => {
        if (node.status === "active") {
          const delta = (Math.random() * 12 - 6);
          const nextLoad = Math.max(10, Math.min(100, node.load + delta));
          let status: FleetNode["status"] = node.status;
          if (nextLoad > 85) status = "overloaded";
          else if (nextLoad < 15) status = "standby";
          else status = "active";
          return { ...node, load: Math.round(nextLoad), status };
        }
        return node;
      }));

      // Random logs generator
      if (Math.random() > 0.6) {
        const sources = ["AETHER_CORE", "VECTOR_SHARD", "PII_FIREWALL", "SYSTEM_BUS", "CRON_ORCHESTRATOR"];
        const types: Array<"info" | "warning" | "success" | "critical"> = ["info", "warning", "success"];
        const source = sources[Math.floor(Math.random() * sources.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let message = "Routine maintenance cycle completed safely.";
        if (source === "AETHER_CORE") {
          message = `Allocated ${Math.floor(Math.random() * 20) + 10} autonomous decision sub-agents dynamically.`;
        } else if (source === "VECTOR_SHARD") {
          message = `Indexed ${Math.floor(Math.random() * 500) + 200} vector dimensions into memory partition.`;
        } else if (source === "PII_FIREWALL") {
          message = "No security breaches. Masked all social security records.";
        } else if (source === "SYSTEM_BUS") {
          message = `Flushed stream backlog of ${Math.floor(Math.random() * 100) + 50} message packets.`;
        }

        const newLog: SysLog = {
          id: `L-D-${customLogsCounter}`,
          timestamp: new Date().toLocaleTimeString(),
          source,
          message,
          type
        };

        setSysLogs(prev => [newLog, ...prev].slice(0, 8));
        setCustomLogsCounter(c => c + 1);
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [customLogsCounter]);

  // Recalculate average load
  useEffect(() => {
    const totalLoad = nodes.reduce((acc, curr) => {
      if (curr.status === "offline") return acc;
      return acc + curr.load;
    }, 0);
    const activeNodes = nodes.filter(n => n.status !== "offline").length;
    if (activeNodes > 0) {
      setServerLoad(Number((totalLoad / activeNodes).toFixed(1)));
    }
  }, [nodes]);

  const triggerSystemDiagnostic = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Reset all nodes to healthy bounds
      setNodes(prev => prev.map(n => ({
        ...n,
        load: Math.floor(Math.random() * 30) + 30,
        status: "active"
      })));
      // Add success log
      const diagnosticLog: SysLog = {
        id: `DIAG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        source: "GLOBAL_SYSTEM",
        message: "Full system diagnosis complete. All 4 hardware shards reports 100% operational efficiency.",
        type: "success"
      };
      setSysLogs(prev => [diagnosticLog, ...prev]);
    }, 1500);
  };

  const dispatchTestJob = () => {
    const alertLog: SysLog = {
      id: `TEST-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      source: "OPERATOR",
      message: `DISPATCHED_TEST_SWARM: Simulating high-concurrency client load (${swarmCapacity} threads).`,
      type: "info"
    };
    setSysLogs(prev => [alertLog, ...prev]);

    // Spurt nodes loads
    setNodes(prev => prev.map(n => {
      if (n.status !== "offline") {
        return { ...n, load: Math.min(100, n.load + 15) };
      }
      return n;
    }));
  };

  const toggleNodeState = (id: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === id) {
        const nextStatus = n.status === "offline" ? "active" : "offline";
        const message = nextStatus === "active" 
          ? `Node ${n.name} powered ON and synchronized with cluster.`
          : `Node ${n.name} gracefully powered down by administrator command.`;
        
        const log: SysLog = {
          id: `NODE-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          source: "ADMINISTRATOR",
          message,
          type: nextStatus === "active" ? "success" : "warning"
        };
        setSysLogs(prev => [log, ...prev]);
        return { ...n, status: nextStatus, load: nextStatus === "offline" ? 0 : 40 };
      }
      return n;
    }));
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "success": return "text-green-400 border-green-500/20 bg-green-500/5";
      case "warning": return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      case "critical": return "text-red-400 border-red-500/20 bg-red-500/5";
      default: return "text-cyan-400 border-cyan-500/20 bg-cyan-500/5";
    }
  };

  return (
    <div id="admin-dashboard-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* COLUMN 1: Global Settings & Control Deck (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Global Agent Swarm Configuration */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <Sliders className="h-5 w-5 text-purple-400" />
            <h4 className="font-display font-bold text-white text-base">Global Swarm Configuration</h4>
          </div>

          <p className="text-xs text-slate-400 font-light mb-6">
            Tune maximum autonomous parallel thread limits, allocate system constraints, and modify deep reasoning models.
          </p>

          <div className="space-y-6">
            {/* Swarm Threads limit slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Max Swarm Capacity [Concurrency]:</span>
                <span className="text-purple-400 font-bold">{swarmCapacity} Agent Threads</span>
              </div>
              <input 
                type="range"
                min="10"
                max="120"
                step="5"
                value={swarmCapacity}
                onChange={(e) => setSwarmCapacity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span>10 (Minimum)</span>
                <span>60 (Standard)</span>
                <span>120 (Max Load)</span>
              </div>
            </div>

            {/* Token memory limit slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Max Semantic Token Window:</span>
                <span className="text-cyan-400 font-bold">{(tokenLimit / 1000).toLocaleString()}K tokens</span>
              </div>
              <input 
                type="range"
                min="50000"
                max="2000000"
                step="50000"
                value={tokenLimit}
                onChange={(e) => setTokenLimit(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
                <span>50K (Fast)</span>
                <span>1M (Heavy logic)</span>
                <span>2M (Context Max)</span>
              </div>
            </div>

            {/* Thinking depth selector (Standard Cognitive level controls) */}
            <div>
              <span className="block text-xs font-mono text-slate-300 mb-2">Cognitive Reasoning Intensity:</span>
              <div className="grid grid-cols-3 gap-2.5">
                {(["low", "medium", "high"] as const).map((depth) => (
                  <button
                    key={depth}
                    onClick={() => setThinkingDepth(depth)}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-medium border capitalize transition-all cursor-pointer ${
                      thinkingDepth === depth 
                        ? "bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border-purple-400 text-purple-300 shadow-[0_0_15px_rgba(157,78,221,0.15)]"
                        : "border-white/5 bg-slate-950/40 text-slate-400 hover:border-white/10"
                    }`}
                  >
                    {depth} Depth
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 font-light mt-2 italic leading-relaxed">
                {thinkingDepth === "low" && "★ Low Reasoning: Lowers latency, optimizes simple text routing procedures."}
                {thinkingDepth === "medium" && "★ Medium Reasoning: Perfect balance of speed & structural formatting."}
                {thinkingDepth === "high" && "★ High Reasoning: Deep logic evaluation for massive database reconciliations."}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/5 flex gap-3">
            <button 
              onClick={dispatchTestJob}
              className="flex-1 py-3 px-4 rounded-xl font-medium text-white text-xs bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="h-4 w-4" /> Dispatch Concurrency Test
            </button>
            <button 
              onClick={triggerSystemDiagnostic}
              disabled={isRefreshing}
              className="py-3 px-4 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-slate-300 text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} /> Diagnostic
            </button>
          </div>

        </div>

        {/* Global Operational Health Monitoring (SVG Line Telemetry Graph) */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <h4 className="font-display font-bold text-white text-sm">Cluster Performance Stream</h4>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">{serverLoad}% Avg Load</span>
          </div>

          {/* Fully Custom SVG line chart (Dynamic, matches styling beautifully) */}
          <div className="h-32 w-full mt-2 relative">
            <svg viewBox="0 0 400 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              
              {/* Gradient fill */}
              <path 
                d={`M 0,120 L 0,${120 - serverLoad * 0.9} L 80,${85 - serverLoad * 0.2} L 160,${95 - serverLoad * 0.3} L 240,${110 - serverLoad * 0.6} L 320,${75 - serverLoad * 0.1} L 400,${120 - serverLoad * 0.8} L 400,120 Z`} 
                fill="url(#chart-glow)" 
              />

              {/* Vector connection path */}
              <path 
                d={`M 0,${120 - serverLoad * 0.9} Q 40,${90 - serverLoad * 0.4} 80,${85 - serverLoad * 0.2} T 160,${95 - serverLoad * 0.3} T 240,${110 - serverLoad * 0.6} T 320,${75 - serverLoad * 0.1} T 400,${120 - serverLoad * 0.8}`} 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="2.5" 
                className="transition-all duration-1000"
              />

              {/* Glowing anchor nodes */}
              <circle cx="160" cy={95 - serverLoad * 0.3} r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" className="animate-pulse" />
              <circle cx="320" cy={75 - serverLoad * 0.1} r="4" fill="#a78bfa" stroke="#ffffff" strokeWidth="1" />
            </svg>
            <div className="absolute inset-x-0 bottom-0 flex justify-between font-mono text-[9px] text-slate-500 pt-1">
              <span>08:15</span>
              <span>08:20</span>
              <span>08:25</span>
              <span>08:30 [CURRENT]</span>
            </div>
          </div>
        </div>

      </div>

      {/* COLUMN 2: Node Grid & Active Systems Registry (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Fleet Hardware Compute Nodes */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/40">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <h4 className="font-display font-bold text-white text-base">Cluster Infrastructure Fleet</h4>
            </div>
            <span className="text-[9px] font-mono text-cyan-400/80 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              AUTO-SCALING ENABLED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map((node) => (
              <div 
                key={node.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all relative overflow-hidden group"
              >
                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="font-mono text-[9px] text-slate-500 uppercase">SYS_INDEX // {node.id.toUpperCase()}</span>
                    <button 
                      onClick={() => toggleNodeState(node.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        node.status === "offline"
                          ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          : "bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h5 className="font-display font-bold text-sm text-white flex items-center gap-2">
                    {node.name}
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      node.status === "active" ? "bg-cyan-400" :
                      node.status === "overloaded" ? "bg-amber-400 animate-ping" :
                      node.status === "standby" ? "bg-indigo-400" : "bg-slate-600"
                    }`} />
                  </h5>

                  {/* Load bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>Compute Workload:</span>
                      <span className={node.status === "overloaded" ? "text-amber-400" : "text-cyan-400"}>{node.load}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          node.status === "overloaded" ? "bg-amber-400" :
                          node.status === "standby" ? "bg-indigo-400" : "bg-cyan-400"
                        }`}
                        style={{ width: `${node.load}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">HW CORE_THREAD:</span>
                    <span className="text-slate-300 font-semibold">{node.cores} cores vCPU</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">MAX_BOUND RATE:</span>
                    <span className="text-slate-300 font-semibold">{node.maxThroughput.toLocaleString()}/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Agent Control Audit Logs Feed */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/20 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-400" />
                <h4 className="font-display font-bold text-white text-sm">Cluster Cybersecurity & Audit Feed</h4>
              </div>
              <span className="text-[9px] font-mono text-slate-500">LIVE SYSTEM SOCKET</span>
            </div>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
              {sysLogs.map((log) => (
                <div 
                  key={log.id} 
                  className={`p-3 rounded-xl border font-mono text-[10px] flex items-start gap-3 transition-colors ${getLogColor(log.type)}`}
                >
                  <div className="p-1 rounded bg-white/5 border border-white/10">
                    {log.type === "warning" ? <AlertTriangle className="h-3.5 w-3.5" /> : <Cpu className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
                      <span className="font-semibold text-white">[{log.source}]</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="leading-relaxed mt-1 text-slate-200">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-3 mt-4 border-t border-white/5">
            <span className="text-[10px] font-mono text-slate-500">
              STELLAR GLOBAL ORCHESTRATION SYSTEM v4.9.1 // KEY: CRYPTO_SYNC_OK
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
