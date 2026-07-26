import { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  Cpu, 
  Zap, 
  Sparkles, 
  RefreshCw, 
  Terminal, 
  Check, 
  Search, 
  MessageSquare, 
  Clock, 
  TrendingUp, 
  Coins, 
  Bot, 
  CheckCircle2, 
  ArrowRight,
  Database,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
  status: "idle" | "running" | "completed" | "error";
  revenuePerMin: number;
  logs: string[];
}

const INITIAL_AGENTS: Agent[] = [
  {
    id: "invoice-bot",
    name: "Invoice Ledger Agent",
    type: "Financial Automation",
    description: "Automatically monitors raw email attachments, extracts billing line items, matches cost-centers, and submits to accounts payable.",
    status: "running",
    revenuePerMin: 1.25,
    logs: [
      "[08:30:12] Monitoring corporate billing inbox...",
      "[08:30:15] FOUND: Attached invoice 'INV_9876_Stellar.pdf'",
      "[08:30:16] AI extraction active: mapping line items (OCR Engine v4.1)",
      "[08:30:18] Extracted metadata: Total $4,120.00 | Tax: $340.00 | Vendor: Stellar Inc.",
      "[08:30:20] Verification check: Matched cost center #8920 (AP APPROVED)",
      "[08:30:21] Ledger sync complete. Saved 25 minutes of manual sorting."
    ]
  },
  {
    id: "lead-scout",
    name: "Autonomous Lead Enrichment Scout",
    type: "Growth Operations",
    description: "Enriches inbound prospects in real-time by crawling public business data, scoring customer size, and preparing customized outreach drafts.",
    status: "running",
    revenuePerMin: 0.85,
    logs: [
      "[08:30:01] Monitoring CRM incoming webhooks...",
      "[08:30:03] INBOUND: New sign-up 'sarah.k@cloudtech.io'",
      "[08:30:05] Crawling tech stack indexes for cloudtech.io...",
      "[08:30:08] AI enrichment complete: Size (Mid-Market) | Stack (AWS, React) | Funding (Series B)",
      "[08:30:09] Generated high-context automated email draft. Sent to SDR queue."
    ]
  },
  {
    id: "sla-compliance",
    name: "Customer Sentiment Guard",
    type: "Support Guard",
    description: "Scans active support tickets via sentiment vectors to detect escalating frustration, auto-routes emergency responses, and alerts accounts leads.",
    status: "idle",
    revenuePerMin: 1.50,
    logs: [
      "[SYSTEM] Guard initialized on feedback channels.",
      "[SYSTEM] Standing by for live sentiment analysis thresholds..."
    ]
  },
  {
    id: "lead-agent",
    name: "Omni-Channel Lead Dispatcher",
    type: "Sales Operations",
    description: "AI triage agent that reads customer requests, classifies product interest, and instantly books/routes qualified meetings.",
    status: "idle",
    revenuePerMin: 2.10,
    logs: [
      "[SYSTEM] Omni-Channel dispatch module connected safely.",
      "[SYSTEM] Connected to Google Calendar API & Routing Rules."
    ]
  }
];

const INITIAL_WORK_ITEMS = [
  { id: "W-981", name: "Invoice Reconciled", detail: "INV_9876_Stellar.pdf ($4,120.00)", status: "Reconciled", badge: "Financial", time: "2 mins ago" },
  { id: "W-980", name: "Sarah K. (CloudTech)", detail: "Enriched: Mid-Market (Series B funding)", status: "Enriched", badge: "Growth", time: "12 mins ago" },
  { id: "W-979", name: "David M. (Enterprise)", detail: "Scheduled Discovery Session with Sales", status: "Routed", badge: "Sales", time: "45 mins ago" },
  { id: "W-978", name: "Feedback Case #412", detail: "Frustrated client resolved via prompt refund", status: "Resolved", badge: "Support", time: "1 hour ago" },
];

export default function UserDashboard() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [workItems, setWorkItems] = useState(INITIAL_WORK_ITEMS);
  const [copilotInput, setCopilotInput] = useState("");
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState(false);
  const [activeAgentLogs, setActiveAgentLogs] = useState<string[]>(INITIAL_AGENTS[0].logs);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("invoice-bot");
  const [accumulatedSavings, setAccumulatedSavings] = useState(1420.50);
  const [tasksCompleted, setTasksCompleted] = useState(432);
  const terminalContainerRef = useRef<HTMLDivElement>(null);

  // Simulate revenue savings incrementing for running agents
  useEffect(() => {
    const interval = setInterval(() => {
      let revenueDelta = 0;
      let extraTasks = 0;
      
      setAgents(prev => prev.map(agent => {
        if (agent.status === "running") {
          revenueDelta += agent.revenuePerMin / 20; // 3s intervals
          // Add a random log occasionally
          if (Math.random() > 0.7) {
            extraTasks += 1;
            const newLog = `[${new Date().toLocaleTimeString()}] Automated process executed matching parameters successfully.`;
            const updatedLogs = [...agent.logs, newLog].slice(-12); // keep last 12 logs
            if (agent.id === selectedAgentId) {
              setActiveAgentLogs(updatedLogs);
            }
            return { ...agent, logs: updatedLogs };
          }
        }
        return agent;
      }));

      if (revenueDelta > 0) {
        setAccumulatedSavings(prev => prev + revenueDelta);
      }
      if (extraTasks > 0) {
        setTasksCompleted(prev => prev + extraTasks);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedAgentId]);

  // Scroll terminal logs to bottom without jumping page scroll
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [activeAgentLogs]);

  const toggleAgentStatus = (id: string) => {
    setAgents(prev => prev.map(agent => {
      if (agent.id === id) {
        const nextStatus = agent.status === "running" ? "idle" : "running";
        const logMsg = nextStatus === "running" 
          ? `[${new Date().toLocaleTimeString()}] Operator command: Resume agent thread safely.`
          : `[${new Date().toLocaleTimeString()}] Operator command: Suspend agent operations safely.`;
        
        const updatedLogs = [...agent.logs, logMsg];
        if (agent.id === selectedAgentId) {
          setActiveAgentLogs(updatedLogs);
        }
        return { ...agent, status: nextStatus, logs: updatedLogs };
      }
      return agent;
    }));
  };

  const selectAgent = (agent: Agent) => {
    setSelectedAgentId(agent.id);
    setActiveAgentLogs(agent.logs);
  };

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim() || isCopilotThinking) return;

    setIsCopilotThinking(true);
    setCopilotResponse(null);

    // Dynamic mock response generation based on words in prompt
    setTimeout(() => {
      let response = "";
      const prompt = copilotInput.toLowerCase();

      if (prompt.includes("invoice") || prompt.includes("bill")) {
        response = `🤖 **Invoice Processing Module Active:**
I searched recent raw attachments and detected **2 pending invoices** from *Apex Corp* and *Vector Lab*. 

**Recommended Action Plan:**
1. Parse invoice payloads via **Stellar Vision Node**
2. Map lines to ledger code **AP-503 (Operational Logistics)**
3. Dispatch to manager Sarah Dun for final signature.

*Would you like me to execute this automation thread?*`;
      } else if (prompt.includes("lead") || prompt.includes("sales") || prompt.includes("growth")) {
        response = `🚀 **Growth Scout Insights:**
I have mapped CRM sign-ups from the past 24 hours. **3 mid-market accounts** match your optimal prospect profile:

• **OmniSync Inc.** (150 employees, Cloud Infra Tech)
• **Nova Retail Group** (400 employees, E-Commerce Shopify)
• **FinGuard Labs** (80 employees, Security Ledger)

*Enrichment logs are compiled. SDR outreach drafts have been automatically synthesized in your outbound workspace.*`;
      } else if (prompt.includes("sentiment") || prompt.includes("support")) {
        response = `🛡️ **Sentiment Guardian Triage:**
Scanned active support requests. Ticket **#1209 (Latency Lag on AP-East)** triggered an orange warning.

**Triage Action Executed:**
• Customer satisfaction index fell to **0.34 (Frustrated)**
• Automatically added high-priority routing flag
• Drafted personal response apologizing for network jitter.

*System standby complete. Shield levels intact.*`;
      } else {
        response = `✨ **Stellar Operator Assist:**
I have cross-analyzed your workspace modules. All active cognitive agent threads are performing normally.

**Current Workspace State:**
• **Ledger Agent**: Active and monitoring billing inbox
• **Growth Scout**: Real-time crawling active on CRM signups
• **Pending Override Work**: 0 critical items require manual review.

*Give me a directive such as "Review pending invoice drafts" or "Show me recent growth sign-ups" to coordinate actions.*`;
      }

      setCopilotResponse(response);
      setIsCopilotThinking(false);
      setTasksCompleted(prev => prev + 1);
      
      // Add a work item dynamically
      const newWorkId = `W-${Math.floor(Math.random() * 50) + 900}`;
      const newWork = {
        id: newWorkId,
        name: "Copilot Override Sync",
        detail: copilotInput.length > 40 ? copilotInput.substring(0, 40) + "..." : copilotInput,
        status: "Completed",
        badge: "AI Assist",
        time: "Just now"
      };
      setWorkItems(prev => [newWork, ...prev].slice(0, 4));

    }, 1800);
  };

  const loadPresetPrompt = (preset: string) => {
    setCopilotInput(preset);
  };

  return (
    <div id="user-dashboard-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* COLUMN 1: Left - Workspace Stats & Agent Toggles (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Workspace Quick KPIs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">SAVED REVENUE</span>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-bold font-mono text-cyan-400">
                ${accumulatedSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[9px] font-mono text-cyan-400/70 flex items-center gap-1 mt-1">
              <Coins className="h-3 w-3" /> Auto-Accumulating
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">TASKS COMPLETED</span>
            <span className="text-2xl font-bold font-mono text-purple-400 mt-2">
              {tasksCompleted}
            </span>
            <span className="text-[9px] font-mono text-purple-400/70 flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3" /> 100% Accuracy Rate
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ACTIVE AGENTS</span>
            <span className="text-2xl font-bold font-mono text-indigo-400 mt-2">
              {agents.filter(a => a.status === "running").length} / {agents.length}
            </span>
            <span className="text-[9px] font-mono text-indigo-400/70 flex items-center gap-1 mt-1">
              <Zap className="h-3 w-3 animate-bounce" /> Multi-threading
            </span>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">OPERATIONAL EFFICIENCY</span>
            <span className="text-2xl font-bold font-mono text-pink-400 mt-2">
              9.4x
            </span>
            <span className="text-[9px] font-mono text-pink-400/70 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> Average Acceleration
            </span>
          </div>
        </div>

        {/* AI Agents Control Center */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 relative overflow-hidden flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-indigo-400" />
              <h4 className="font-display font-bold text-white text-base">My Automated Agent Workspace</h4>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/5 text-slate-400">
              OPERATIONAL HUB
            </span>
          </div>

          <p className="text-xs text-slate-400 font-light mb-5">
            Select an active cognitive thread to monitor raw data input, view output streams, or toggle execution states instantly.
          </p>

          {/* Grid of Agent Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                onClick={() => selectAgent(agent)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedAgentId === agent.id 
                    ? "bg-slate-900/60 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                    : "bg-slate-950/20 border-white/5 hover:border-white/10"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-indigo-400/80 tracking-wide uppercase">
                      {agent.type}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAgentStatus(agent.id);
                      }}
                      className={`p-1 rounded-lg transition-all ${
                        agent.status === "running"
                          ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400"
                          : "bg-white/5 hover:bg-white/10 text-slate-400"
                      }`}
                    >
                      {agent.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>
                  </div>
                  <h5 className="font-display font-bold text-sm text-white mt-1.5 flex items-center gap-1.5">
                    {agent.name}
                    {agent.status === "running" && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </h5>
                  <p className="text-[11px] text-slate-400 font-light mt-1.5 leading-relaxed line-clamp-2">
                    {agent.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500">SAVINGS TICK:</span>
                  <span className="text-cyan-400/90 font-semibold">+${agent.revenuePerMin.toFixed(2)}/min</span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Terminal Stream viewport (Integrated inside User Dashboard) */}
          <div className="flex-1 flex flex-col min-h-[220px] bg-slate-950/80 rounded-xl border border-white/5 overflow-hidden">
            <div className="bg-slate-950 px-4 py-2 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-mono text-[10px] text-slate-300">
                  REAL-TIME_LOGS // {agents.find(a => a.id === selectedAgentId)?.name.toUpperCase().replace(/ /g, "_")}
                </span>
              </div>
              <span className="text-[9px] font-mono bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded animate-pulse">
                {agents.find(a => a.id === selectedAgentId)?.status === "running" ? "STREAMING" : "SUSPENDED"}
              </span>
            </div>

            <div ref={terminalContainerRef} className="flex-1 p-4 font-mono text-[10px] text-slate-300 space-y-1.5 overflow-y-auto max-h-[170px] select-text">
              {activeAgentLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith("[SYSTEM") || log.startsWith("[08:") ? "text-slate-300" : "text-cyan-300"}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* COLUMN 2: Right - AI Operator Copilot & Workspace Registry (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* AI Workspace Copilot (Immediate actions on corporate databases) */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 relative overflow-hidden bg-slate-950/40 flex flex-col justify-between min-h-[380px]">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                <h4 className="font-display font-bold text-white text-sm">AI Workspace Copilot</h4>
              </div>
              <span className="h-2 w-2 rounded-full bg-green-500" />
            </div>

            <p className="text-[11px] text-slate-400 font-light mb-4 leading-relaxed">
              Query or coordinate automated systems directly. Ask to reconcile invoices, summarize leads, or audit sentiment.
            </p>

            {/* Quick Actions presets */}
            <div className="mb-4">
              <span className="block text-[9px] font-mono text-slate-500 mb-2 uppercase tracking-wider">COGNITIVE QUICK-JOBS:</span>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => loadPresetPrompt("Reconcile pending invoices and cross-reference billing accounts")}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-indigo-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>◆ Reconciliation audit on raw bills</span>
                  <ArrowRight className="h-3 w-3 text-indigo-400" />
                </button>
                <button 
                  onClick={() => loadPresetPrompt("Enrich incoming lead sign-ups and draft custom outreaches")}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-indigo-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>◆ Enrich mid-market CRM prospects</span>
                  <ArrowRight className="h-3 w-3 text-indigo-400" />
                </button>
                <button 
                  onClick={() => loadPresetPrompt("Verify support backlog for negative client sentiment")}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-indigo-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer flex justify-between items-center"
                >
                  <span>◆ Audit support desk sentiment</span>
                  <ArrowRight className="h-3 w-3 text-indigo-400" />
                </button>
              </div>
            </div>

            {/* Copilot Response output */}
            <AnimatePresence mode="wait">
              {isCopilotThinking ? (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-slate-950/80 border border-white/5 mb-4 flex items-center justify-center gap-3"
                >
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                  <span className="font-mono text-[11px] text-slate-400 animate-pulse">Consulting Workspace Ontologies...</span>
                </motion.div>
              ) : copilotResponse ? (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/10 mb-4 text-xs leading-relaxed text-slate-300 select-text font-mono max-h-[180px] overflow-y-auto whitespace-pre-wrap"
                >
                  {copilotResponse}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <form onSubmit={handleCopilotSubmit} className="relative mt-2">
            <input 
              type="text"
              required
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="Deploy directive: 'Scan AP inboxes'..."
              className="w-full pl-4 pr-12 py-3.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:border-cyan-400 outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={isCopilotThinking}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Live Auto-processed Work Items Registry */}
        <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-cyan-400" />
                <h4 className="font-display font-bold text-white text-sm">Automated Work Registry</h4>
              </div>
              <span className="text-[9px] font-mono text-slate-500">SYNCHRONIZED</span>
            </div>

            <div className="space-y-3">
              {workItems.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between hover:border-cyan-500/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                      <FileText className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-xs text-white">{item.name}</h5>
                      <p className="text-[10px] text-slate-400 font-light mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[9px] font-mono px-1.5 py-0.5 rounded border border-cyan-400/20 bg-cyan-400/5 text-cyan-300">
                      {item.status}
                    </span>
                    <span className="block text-[9px] text-slate-500 font-mono mt-1">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-3 mt-4 border-t border-white/5">
            <span className="text-[10px] font-mono text-slate-500">
              SECURE LEDGER INDEX: DB_STELLAR_WORKSPACE_V12
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
