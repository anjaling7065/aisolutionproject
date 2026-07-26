import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Cpu, 
  Layers, 
  Activity, 
  Shield, 
  Send, 
  RefreshCw, 
  Play, 
  Check, 
  Sliders, 
  Zap, 
  Workflow, 
  ArrowRight, 
  Terminal, 
  CheckCircle2, 
  Network,
  Database,
  Bot,
  UserCheck,
  Lock,
  ArrowUpRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

// Auth & Context Imports
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import UserLiveDashboard from "./components/UserLiveDashboard";
import AdminLiveDashboard from "./components/AdminLiveDashboard";

// Landing Page Imports
import Header from "./components/Header";
import CustomCursor from "./components/CustomCursor";
import ThreeParticlesBackground from "./components/ThreeParticlesBackground";
import ProblemSection from "./components/ProblemSection";
import SolutionsSection from "./components/SolutionsSection";
import ResultsSection from "./components/ResultsSection";
import AudienceSection from "./components/AudienceSection";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import LaptopFrame from "./components/LaptopFrame";

interface Message {
  id: string;
  sender: "user" | "stellar-ai" | "system";
  content: string;
  timestamp: Date;
}

// SECURE PROTECTED ROUTES COMPONENT
function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: "user" | "admin" }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-xs text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
          <span>Synchronizing Node Tunnel...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <>{children}</>;
}

// LOGIN WRAPPER COMPONENT
function LoginPageWrapper() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSuccess = () => {
    const storedUser = localStorage.getItem("stellar_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 relative overflow-hidden flex flex-col justify-between">
      <ThreeParticlesBackground count={180} speedMultiplier={0.6} colorTheme="cyan-purple" repulsionForce={1.2} />
      <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />
      <div className="relative z-10 py-12 flex-1 flex items-center justify-center">
        <LoginPage 
          onNavigateToRegister={() => navigate("/register")}
          onNavigateToForgotPassword={() => navigate("/forgot-password")}
          onSuccess={handleSuccess}
        />
      </div>
      <footer className="border-t border-white/5 bg-slate-950/80 py-4 relative z-10 font-mono text-[10px] text-slate-500 text-center">
        // © 2026 STELLAR AI SECURE CONSOLE HANDSHAKE
      </footer>
    </div>
  );
}

// REGISTER WRAPPER COMPONENT
function RegisterPageWrapper() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 relative overflow-hidden flex flex-col justify-between">
      <ThreeParticlesBackground count={180} speedMultiplier={0.6} colorTheme="cyan-purple" repulsionForce={1.2} />
      <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />
      <div className="relative z-10 py-12 flex-1 flex items-center justify-center">
        <RegisterPage 
          onNavigateToLogin={() => navigate("/login")}
          onSuccess={handleSuccess}
        />
      </div>
      <footer className="border-t border-white/5 bg-slate-950/80 py-4 relative z-10 font-mono text-[10px] text-slate-500 text-center">
        // © 2026 STELLAR AI DATABASE PROVISIONING LINK
      </footer>
    </div>
  );
}

// FORGOT PASSWORD WRAPPER COMPONENT
function ForgotPasswordPageWrapper() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 relative overflow-hidden flex flex-col justify-between">
      <ThreeParticlesBackground count={180} speedMultiplier={0.6} colorTheme="cyan-purple" repulsionForce={1.2} />
      <div className="absolute inset-0 bg-slate-950/45 pointer-events-none" />
      <div className="relative z-10 py-12 flex-1 flex items-center justify-center">
        <ForgotPasswordPage 
          onNavigateToLogin={() => navigate("/login")}
        />
      </div>
      <footer className="border-t border-white/5 bg-slate-950/80 py-4 relative z-10 font-mono text-[10px] text-slate-500 text-center">
        // © 2026 STELLAR AI COMPASS KEY RESTORATION
      </footer>
    </div>
  );
}

// LANDING PAGE COMPONENT
function LandingPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [dashboardTab, setDashboardTab] = useState<"user" | "admin" >("user");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // WebGL 3D Customizer states
  const [particleCount, setParticleCount] = useState(280);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.2);
  const [colorTheme, setColorTheme] = useState<"cyan-purple" | "neon-pink" | "cosmic-blue">("cyan-purple");
  const [repulsionForce, setRepulsionForce] = useState(1.4);

  // Core model sandbox state
  const [activeModel, setActiveModel] = useState("aether");
  const [modelStatus, setModelStatus] = useState<"online" | "syncing" | "idle">("online");

  // Chat system states
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "stellar-ai",
      content: "◆ [STELLAR_OPERATIONAL_INTELLIGENCE_ONLINE]\nWelcome, Partner. I am the Stellar business automation agent. We help enterprise companies and startups scale, eliminate manual inefficiencies, and unlock dormant revenue streams.\n\nAsk me how we can optimize your business operations, or click one of the diagnostic shortcuts below to begin.",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Workflow builder state
  const [workflowStep, setWorkflowStep] = useState(0); // 0 idle, 1 ingesting, 2 vector-matching, 3 reasoning, 4 finished
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([]);
  const [workflowOutput, setWorkflowOutput] = useState("");

  const handleScrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Intersection observer to track current sections for high-fidelity header highlighting
  useEffect(() => {
    const sections = ["hero", "problem", "solutions", "results", "audience", "portals", "interactive-core"];
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "-20% 0px -60% 0px",
    });

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isChatLoading]);

  // Handle live chat submissions to Express Server API proxying Gemini
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText ? customText.trim() : chatInput.trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      sender: "user",
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setChatInput("");
    setIsChatLoading(true);

    try {
      const historyPayload = {
        messages: [{ content: textToSend }]
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(historyPayload),
      });

      if (!response.ok) {
        throw new Error("Stellar communication relays timed out.");
      }

      const data = await response.json();
      const assistantMsg: Message = {
        id: Math.random().toString(36).substring(7),
        sender: "stellar-ai",
        content: data.text || "◆ [COR_ERR] Critical fail-safe triggered. No response content.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          sender: "system",
          content: `◆ [LINK_OFFLINE] Error communicating with Stellar AI: ${error.message}. Please configure GEMINI_API_KEY inside the Secrets panel.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Run the premium interactive logical pipeline simulation
  const triggerWorkflowSimulation = async () => {
    if (workflowStep > 0) return; // Prevent double trigger
    
    setWorkflowLogs([]);
    setWorkflowOutput("");
    
    // Step 1: Ingesting Data
    setWorkflowStep(1);
    addWorkflowLog("> Initializing Ingestion Relays...");
    await sleep(900);
    addWorkflowLog("> LOADING FILE Stream: [analytics_raw_q2_2026.csv]");
    addWorkflowLog("> PARSING table headers into token chunks...");
    await sleep(700);

    // Step 2: Vector Embedding & DB Matching
    setWorkflowStep(2);
    addWorkflowLog("> Indexing database vectors in memory...");
    addWorkflowLog("> QUERYING high-dimensional vector spaces...");
    addWorkflowLog("> Found 3 relevant semantic clusters matching 'Q2 operational metrics'");
    await sleep(950);

    // Step 3: High-speed Reasoning
    setWorkflowStep(3);
    addWorkflowLog("> SPINNING UP Gemini 3.5-Flash processing loops...");
    addWorkflowLog("> SYNTHESIS prompt layout formatted under system configuration");
    addWorkflowLog("> Performing deep-inference categorical analysis...");
    await sleep(1100);

    // Step 4: Output structured result
    setWorkflowStep(4);
    addWorkflowLog("◆ [COMPILATION_COMPLETE] Formulating visual insights...");
    setWorkflowOutput(
      JSON.stringify(
        {
          operationalHealth: "98.7%",
          anomaliesDetected: 0,
          recommendation: "System operating at maximum vector fidelity. Re-allocate 400Gbs bandwidth to Helios-Net pipelines to bypass transit latency peaks.",
          timestamp: "2026-06-22T11:32:00Z"
        },
        null,
        2
      )
    );
  };

  const addWorkflowLog = (text: string) => {
    setWorkflowLogs(prev => [...prev, text]);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="relative min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <ThreeParticlesBackground
        count={particleCount}
        speedMultiplier={speedMultiplier}
        colorTheme={colorTheme}
        repulsionForce={repulsionForce}
      />

      <CustomCursor />

      <div className="cyber-grid pointer-events-none absolute inset-0 -z-10 mix-blend-color-dodge opacity-20" />

      <Header onScrollToSection={handleScrollToSection} activeSection={activeSection} />

      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8 pb-20 relative z-10">
        
        {/* HERO SECTION */}
        <section id="hero" className="py-20 lg:py-28 relative flex flex-col items-center">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 blur-3xl pointer-events-none" />

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5 text-xs font-mono font-medium text-purple-300 tracking-wider mb-8"
          >
            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            STELLAR OPERATIONAL SYSTEMS PORTFOLIO NOW ONLINE
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-center font-display text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-b from-white via-slate-100 to-purple-400 bg-clip-text text-transparent max-w-4xl leading-tight"
          >
            Stop Losing Revenue <br className="hidden sm:inline" />
            to <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent font-extrabold">Manual Work</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-8 text-center text-lg text-slate-300 max-w-2xl leading-relaxed sm:text-xl font-light"
          >
            We help businesses automate operations, reduce costs, increase sales, and scale faster with intelligent AI systems.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => handleScrollToSection("strategy-call")}
              className="px-8 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:scale-[1.03] transition-all duration-300 shadow-[0_4px_25px_rgba(0,255,255,0.25)] hover:shadow-[0_4px_35px_rgba(0,255,255,0.4)] relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                Book a Free Strategy Call <ArrowRight className="h-5 w-5" />
              </span>
            </button>

            <button
              onClick={() => {
                if (user) {
                  navigate(user.role === "admin" ? "/admin" : "/dashboard");
                } else {
                  navigate("/login");
                }
              }}
              className="px-8 py-4 rounded-xl font-medium text-cyan-300 border border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-400/60 hover:bg-cyan-500/10 hover:scale-[1.03] transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-pulse"
            >
              <Bot className="h-4 w-4 text-cyan-400" />
              {user ? "Launch Console" : "Client Portal Log In"}
            </button>
            
            <button
              onClick={() => handleScrollToSection("problem")}
              className="px-8 py-4 rounded-xl font-medium text-slate-200 border border-white/10 hover:border-cyan-400/30 hover:bg-white/5 transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Zap className="h-4 w-4 text-cyan-400" />
              Learn More
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 w-full max-w-4xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent blur-3xl rounded-full pointer-events-none" />
            
            <motion.div
              style={{ transformStyle: "preserve-3d" }}
              whileHover={{ rotateY: 6, rotateX: -6, scale: 1.015, translateZ: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/60 p-1.5 shadow-[0_0_50px_rgba(0,255,255,0.15)] select-none cursor-pointer"
            >
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950">
                <img 
                  src="/src/assets/images/stellar_ai_entity_1782153787344.jpg" 
                  alt="Stellar AI Quantum Neural Node" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-103 group-hover:opacity-95 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-300 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-cyan-400/20 backdrop-blur-md flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  COGNITIVE_GRID // INTERACTIVE_3D_CORE
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[10px] text-purple-300 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-purple-500/20 backdrop-blur-md">
                  STABILITY: 99.98% // ORBITAL_ANGLE: +28.4°
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 w-full max-w-5xl rounded-2xl glass-card overflow-hidden border border-white/10 p-1 relative shadow-[0_0_50px_rgba(157,78,221,0.05)] scroll-mt-24"
          >
            <div className="bg-slate-950/80 px-4 py-3 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full bg-red-500/75" />
                <span className="h-3.5 w-3.5 rounded-full bg-yellow-500/75" />
                <span className="h-3.5 w-3.5 rounded-full bg-green-500/75" />
                <span className="ml-3 font-mono text-[11px] text-slate-400 tracking-widest uppercase">STELLAR_CORE_MONITOR_DASHBOARD</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping mr-1" />
                  REALTIMER_FEED
                </span>
              </div>
            </div>

            <div className="bg-slate-950/50 p-6 md:p-8 min-h-[300px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 sm:min-h-[400px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-cyan-500/10 blur-[80px]" />
              
              <div className="relative z-10 w-full md:w-1/2 flex flex-col justify-center space-y-6">
                <h3 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Intelligent Quantum Processing
                </h3>
                <p className="text-slate-300 font-light leading-relaxed">
                  Stellar AI maps parallel logical nodes dynamically across cognitive clusters. Watch our active deep-space sub-systems self-optimize to match throughput query standards.
                </p>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="border border-white/5 rounded-xl bg-white/2 p-3 font-mono">
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Neural Bandwidth</span>
                    <span className="text-xl font-semibold text-cyan-400">3,492 T/sec</span>
                  </div>
                  <div className="border border-white/5 rounded-xl bg-white/2 p-3 font-mono">
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider">Sync Integrity</span>
                    <span className="text-xl font-semibold text-purple-400">99.98%</span>
                  </div>
                </div>
              </div>

              <motion.div 
                whileHover={{ scale: 1.025, rotateY: -3, rotateX: 3 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-full md:w-1/2 h-64 md:h-80 border border-white/10 rounded-xl bg-slate-950/75 overflow-hidden group shadow-[0_0_40px_rgba(0,255,255,0.05)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <img 
                  src="/src/assets/images/stellar_3d_interface_1782153805844.jpg" 
                  alt="Stellar AI Cognitive Interface Hub" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                />
                
                <div 
                  className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#00ffff] pointer-events-none"
                  style={{ animation: "scan 6s linear infinite" }}
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-4 flex justify-between items-center">
                  <span className="font-mono text-[9px] text-cyan-300">TELEMETRY_SOURCE: ORBIT_CORE_MAIN</span>
                  <span className="font-mono text-[9px] bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 px-2 py-0.5 rounded backdrop-blur-sm">
                    ONLINE // ACTIVE SENSORS
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <ProblemSection />
        <SolutionsSection />
        <ResultsSection />
        <AudienceSection />

        {/* SECTION: COGNITIVE OPERATOR PORTALS */}
        <section id="portals" className="py-24 border-t border-white/5 scroll-mt-24 relative overflow-hidden">
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border border-indigo-500/30 bg-indigo-500/5 text-indigo-300 mb-4 uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 animate-pulse" /> Unified Cognitive Portals
                </span>
                <h2 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  AI-Augmented Control Center
                </h2>
                <p className="mt-4 text-slate-300 font-light text-lg leading-relaxed">
                  Toggle perspective between our specialized workspaces. Monitor active automated agents on the User Dashboard, or tune global LLM parameters and manage infrastructure loads from the Admin Console.
                </p>
              </motion.div>

              <div className="mt-10 inline-flex p-1.5 rounded-2xl bg-slate-950/80 border border-white/5 backdrop-blur-md relative">
                <button
                  onClick={() => setDashboardTab("user")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    dashboardTab === "user"
                      ? "bg-gradient-to-r from-indigo-500/15 to-cyan-500/15 border border-indigo-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.12)]"
                      : "border border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Bot className="h-4 w-4" /> User Workspace
                </button>
                <button
                  onClick={() => setDashboardTab("admin")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    dashboardTab === "admin"
                      ? "bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.12)]"
                      : "border border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Shield className="h-4 w-4" /> Admin Control
                </button>
              </div>
            </div>

            {/* Dashboard Container wrapped in a premium Laptop frame */}
            <div className="relative group">
              
              {/* STUNNING ACTIVE HANDSHAKE FLOATING CALLOUT OVER THE LAPTOP FRAME IF NOT LOGGED IN */}
              {!user && (
                <div className="absolute inset-x-0 -top-4 mx-auto max-w-lg z-30 transform hover:-translate-y-0.5 duration-300">
                  <div className="p-4 rounded-xl border border-cyan-500/25 bg-slate-950/95 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <Lock className="h-5 w-5 text-cyan-400 animate-pulse" />
                      <div className="font-mono text-[11px] leading-tight text-slate-300">
                        <span className="font-bold text-white block">DEMONSTRATIVE PLAYGROUND</span>
                        Authenticate to sync live strategy sessions.
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/login")}
                      className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:scale-102 transition-transform font-mono font-bold text-[10px] text-white cursor-pointer"
                    >
                      SECURE LOG IN
                    </button>
                  </div>
                </div>
              )}

              {user && (
                <div className="absolute inset-x-0 -top-4 mx-auto max-w-sm z-30">
                  <div className="p-3 rounded-xl border border-green-500/30 bg-slate-950/95 backdrop-blur-md shadow-xl flex items-center justify-between">
                    <span className="font-mono text-[10px] text-green-400 font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
                      ACTIVE SESSION DETECTED
                    </span>
                    <button
                      onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")}
                      className="px-3 py-1 rounded-lg border border-green-500/25 hover:bg-green-500/10 font-mono text-[10px] text-green-400 font-bold cursor-pointer transition-all"
                    >
                      LAUNCH FULLSCREEN CONSOLE →
                    </button>
                  </div>
                </div>
              )}

              <LaptopFrame>
                <AnimatePresence mode="wait">
                  {dashboardTab === "user" ? (
                    <motion.div
                      key="user-portal"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.35 }}
                    >
                      <UserDashboard />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="admin-portal"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.35 }}
                    >
                      <AdminDashboard />
                    </motion.div>
                  )}
                </AnimatePresence>
              </LaptopFrame>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CORE SANDBOX */}
        <section id="interactive-core" className="py-20 border-t border-white/5 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Stellar Holographic Core
            </h2>
            <p className="mt-4 text-slate-300 font-light text-lg">
              Interact directly with the WebGL particle generators and chat live with Gemini 3.5 Core.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="glass-card rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center gap-3 mb-6">
                  <Sliders className="h-5 w-5 text-cyan-400 animate-pulse" />
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">WebGL Particle Controller</h3>
                </div>

                <p className="text-xs text-slate-300 font-light mb-6 leading-relaxed">
                  Modify the full-screen React Three Fiber particles backdrop in real-time. Rotate geometry matrices and shift the visual color vector nodes safely.
                </p>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono text-slate-300">
                      <span>Particle Mesh Density [count]:</span>
                      <span className="text-cyan-400">{particleCount} units</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="600"
                      step="25"
                      value={particleCount}
                      onChange={(e) => setParticleCount(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono text-slate-300">
                      <span>Orbit Kinetic Velocity [speed]:</span>
                      <span className="text-purple-400">{speedMultiplier.toFixed(1)}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.1"
                      value={speedMultiplier}
                      onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-mono text-slate-300">
                      <span>Mouse Deflection Force:</span>
                      <span className="text-pink-400">{repulsionForce.toFixed(1)} N</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.1"
                      value={repulsionForce}
                      onChange={(e) => setRepulsionForce(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-mono text-slate-300 mb-2">Magnetic Color Array [Matrix]:</span>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setColorTheme("cyan-purple")}
                        className={`py-2 px-3 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                          colorTheme === "cyan-purple"
                            ? "bg-gradient-to-r from-cyan-500/10 to-purple-600/10 border-cyan-400 text-cyan-200"
                            : "border-white/5 bg-slate-950/20 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        Cyan & Purple
                      </button>
                      <button
                        onClick={() => setColorTheme("neon-pink")}
                        className={`py-2 px-3 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                          colorTheme === "neon-pink"
                            ? "bg-gradient-to-r from-pink-500/10 to-purple-600/10 border-pink-500 text-pink-200"
                            : "border-white/5 bg-slate-950/20 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        Neon & Violet
                      </button>
                      <button
                        onClick={() => setColorTheme("cosmic-blue")}
                        className={`py-2 px-3 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                          colorTheme === "cosmic-blue"
                            ? "bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border-blue-400 text-blue-200"
                            : "border-white/5 bg-slate-950/20 text-slate-400 hover:border-white/10"
                        }`}
                      >
                        Cosmic Blue
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 p-6 shadow-xl relative backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-purple-400 animate-spin" style={{ animationDuration: "10s" }} />
                    <span className="font-display font-bold text-white text-base">Select Cognitive Engine Module</span>
                  </div>
                  <span className="text-[10px] bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 font-mono py-0.5 px-2 rounded">
                    ACTIVE NODES
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div 
                    onClick={() => {
                      setActiveModel("aether");
                      setModelStatus("online");
                    }} 
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      activeModel === "aether" 
                        ? "bg-purple-600/10 border-purple-400 shadow-[0_0_15px_rgba(157,78,221,0.15)]" 
                        : "border-white/5 bg-slate-950/30 hover:border-white/10"
                    }`}
                  >
                    <span className="block font-mono text-[10px] text-purple-400">MODULE_01</span>
                    <span className="block font-display text-sm font-bold text-white mt-1">AETHER OMNI 6.1</span>
                    <span className="block text-[11px] text-slate-400 mt-2 font-light">Advanced multithread logic parsing.</span>
                  </div>

                  <div 
                    onClick={() => {
                      setActiveModel("helios");
                      setModelStatus("online");
                    }} 
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      activeModel === "helios" 
                        ? "bg-cyan-600/10 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.15)]" 
                        : "border-white/5 bg-slate-950/30 hover:border-white/10"
                    }`}
                  >
                    <span className="block font-mono text-[10px] text-cyan-400">MODULE_02</span>
                    <span className="block font-display text-sm font-bold text-white mt-1">HELIOS ANALYTICS</span>
                    <span className="block text-[11px] text-slate-400 mt-2 font-light">High throughput data structures.</span>
                  </div>

                  <div 
                    onClick={() => {
                      setActiveModel("chrono");
                      setModelStatus("syncing");
                    }} 
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      activeModel === "chrono" 
                        ? "bg-pink-600/10 border-pink-400 shadow-[0_0_15px_rgba(255,0,127,0.15)]" 
                        : "border-white/5 bg-slate-950/30 hover:border-white/10"
                    }`}
                  >
                    <span className="block font-mono text-[10px] text-pink-400">MODULE_03</span>
                    <span className="block font-display text-sm font-bold text-white mt-1">CHRONO SYNC</span>
                    <span className="block text-[11px] text-slate-400 mt-2 font-light">Dynamic stream timing & rules.</span>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-white/5 font-mono text-xs">
                  <div className="flex justify-between items-center text-slate-400 border-b border-white/5 pb-2 mb-2">
                    <span>Active Telemetry Output</span>
                    <span className="text-cyan-400">{modelStatus === "online" ? "● NORMAL" : "▲ RE-SYNCHRONIZING"}</span>
                  </div>
                  {activeModel === "aether" && (
                    <div className="space-y-1 text-slate-300">
                      <div>[SYSTEM] Loaded Aether-Omni-Weight matrices matching standard core profiles.</div>
                      <div>[SYSTEM] Hot-loading deep attention heads: OK</div>
                      <div>[SYSTEM] Context block index: 2,000,000 tokens limit active.</div>
                    </div>
                  )}
                  {activeModel === "helios" && (
                    <div className="space-y-1 text-slate-300">
                      <div>[SYSTEM] Stream bandwidth initialized over Helios logic vectors.</div>
                      <div>[SYSTEM] Aggregation tick rate: 45ms average sync interval.</div>
                      <div>[SYSTEM] Active index files: 4,103 remote vector repositories connected safely.</div>
                    </div>
                  )}
                  {activeModel === "chrono" && (
                    <div className="space-y-1 text-slate-300 text-pink-300">
                      <div>[SYSTEM_WARNING] Chrono sync rates slightly lag local server ticks.</div>
                      <div>[SYSTEM] Re-establishing clock phase synchronization loops now...</div>
                      <div>[SYSTEM] Connection buffer threshold: 24,000 requests stack capacity.</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="glass-card rounded-2xl border border-white/10 h-[560px] flex flex-col justify-between overflow-hidden shadow-2xl relative bg-slate-950/80 backdrop-blur-md">
                
                <div className="bg-slate-950/90 border-b border-white/5 px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-cyan-400" />
                    <span className="font-mono text-xs font-semibold text-white tracking-wider">STELLAR_CORE_AI_COGNITIVE</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono text-[9px] text-slate-400 font-medium">LIVE REMOTE LINK</span>
                  </div>
                </div>

                <div 
                  ref={chatScrollRef}
                  className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs"
                >
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col max-w-[90%] ${
                        msg.sender === "user" ? "ml-auto items-end" : "items-start"
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 mb-1">
                        {msg.sender === "user" ? "USER_OPERATOR" : "STELLAR_CORE_OMNI"}
                      </span>
                      <div 
                        className={`p-3 rounded-xl whitespace-pre-wrap ${
                          msg.sender === "user" 
                            ? "bg-indigo-600/80 text-white rounded-tr-none border border-indigo-400/20" 
                            : msg.sender === "system"
                            ? "bg-red-500/10 text-red-300 border border-red-500/20 w-full"
                            : "bg-slate-900 border border-white/5 text-slate-200 rounded-tl-none leading-relaxed"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
                      <span className="animate-pulse">Stellar Core AI formulated response...</span>
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 border-t border-white/5 bg-slate-950/50">
                  <span className="block text-[9px] font-mono text-slate-400 mb-1.5">PROJECT COGNITIVE QUERIES:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleSendMessage("◆ ANALYZE PROJECT AETHER SWARM HEALTH & DECISIONS")}
                      disabled={isChatLoading}
                      className="text-[10px] font-mono bg-purple-500/10 border border-purple-500/20 hover:border-cyan-400/40 text-purple-300 px-2 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Aether Swarm Status
                    </button>
                    <button
                      onClick={() => handleSendMessage("◆ SCAN HELIOS TELEMETRY FOR RECENT ANOMALIES")}
                      disabled={isChatLoading}
                      className="text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-400/40 text-cyan-300 px-2 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Helios Diagnostics
                    </button>
                    <button
                      onClick={() => handleSendMessage("◆ AUDIT CYBER GUARD SYSTEM FIREWALL INTEGRITY")}
                      disabled={isChatLoading}
                      className="text-[10px] font-mono bg-pink-500/10 border border-pink-500/20 hover:border-cyan-400/40 text-pink-300 px-2 py-1 rounded transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      Cyber Shield Audit
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/90 border-t border-white/5">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="ENTER TERMINAL INSTRUCTION..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-mono rounded-lg glass-input bg-slate-950 border border-white/5"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading}
                      className="bg-indigo-600 hover:bg-cyan-500 hover:text-slate-950 text-white min-w-[40px] px-3.5 rounded-lg flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: INTERACTIVE WORKFLOW PIPELINE BUILDER */}
        <section id="workflow" className="py-20 border-t border-white/5 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              AI Solution Integration Pipelines
            </h2>
            <p className="mt-4 text-slate-300 font-light text-lg">
              Orchestrate autonomous pipelines, connect custom vector indexes, and run simulated core workloads.
            </p>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 pb-6 border-b border-white/5">
              <div>
                <span className="font-mono text-xs text-cyan-400 tracking-wider font-semibold">SEQUENTIAL CLUSTERING INTERACTION</span>
                <h3 className="font-display text-xl font-bold text-white mt-1">Multi-Node Orchestration</h3>
              </div>

              <button
                onClick={triggerWorkflowSimulation}
                disabled={workflowStep > 0 && workflowStep < 4}
                className="px-6 py-3.5 rounded-xl font-mono text-xs font-semibold bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-cyan-400/40 text-cyan-200 hover:border-cyan-400 duration-300 shadow-md flex items-center gap-2 self-start disabled:opacity-50 cursor-pointer"
              >
                <Play className={`h-4 w-4 ${workflowStep > 0 && workflowStep < 4 ? "animate-spin" : ""}`} />
                {workflowStep === 0 && "INITIATE COGNITIVE PIPELINE"}
                {workflowStep > 0 && workflowStep < 4 && "PROCESSING PIPELINE FLX..."}
                {workflowStep === 4 && "RE-INITIATE PIPELINE"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-white/5 -z-10">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-1000"
                  style={{
                    width: 
                      workflowStep === 0 ? "0%" :
                      workflowStep === 1 ? "15%" :
                      workflowStep === 2 ? "45%" :
                      workflowStep === 3 ? "75%" : "100%"
                  }}
                />
              </div>

              <div className={`p-5 rounded-xl border transition-all ${
                workflowStep === 1 ? "bg-cyan-500/10 border-cyan-400 scale-[1.03] shadow-[0_0_15px_rgba(0,255,255,0.15)]" :
                workflowStep > 1 ? "bg-cyan-950/20 border-cyan-400/40" : "border-white/5 bg-slate-950/30"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${workflowStep >= 1 ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-slate-500"}`}>
                    <Database className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 uppercase font-bold">BLOCK_01</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white mb-1">Raw File Stream</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">Loads files parsed by standard categorical indexes securely.</p>
                {workflowStep === 1 && (
                  <span className="inline-block mt-3 text-[10px] font-mono text-cyan-400 animate-pulse">INGESTING DATASTREAM...</span>
                )}
                {workflowStep > 1 && (
                  <span className="inline-flex mt-3 items-center gap-1 text-[10px] font-mono text-cyan-400"><Check className="h-3.5 w-3.5" /> COMPILED</span>
                )}
              </div>

              <div className={`p-5 rounded-xl border transition-all ${
                workflowStep === 2 ? "bg-cyan-500/10 border-cyan-400 scale-[1.03] shadow-[0_0_15px_rgba(0,255,255,0.15)]" :
                workflowStep > 2 ? "bg-cyan-950/20 border-purple-500/40" : "border-white/5 bg-slate-950/30"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${workflowStep >= 2 ? "bg-cyan-500/20 text-cyan-300" : "bg-white/5 text-slate-500"}`}>
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 uppercase font-bold">BLOCK_02</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white mb-1">Vector Alignment</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">Converts tables into high dimensional token vector weights.</p>
                {workflowStep === 2 && (
                  <span className="inline-block mt-3 text-[10px] font-mono text-cyan-300 animate-pulse">DIMENSIONAL_OFFSET SHIFT...</span>
                )}
                {workflowStep > 2 && (
                  <span className="inline-flex mt-3 items-center gap-1 text-[10px] font-mono text-cyan-400"><Check className="h-3.5 w-3.5" /> INDEXED</span>
                )}
              </div>

              <div className={`p-5 rounded-xl border transition-all ${
                workflowStep === 3 ? "bg-purple-500/10 border-purple-400 scale-[1.03] shadow-[0_0_15px_rgba(157,78,221,0.15)]" :
                workflowStep > 3 ? "bg-purple-950/20 border-purple-400/40" : "border-white/5 bg-slate-950/30"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${workflowStep >= 3 ? "bg-purple-500/20 text-purple-400" : "bg-white/5 text-slate-500"}`}>
                    <Cpu className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 uppercase font-bold">BLOCK_03</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white mb-1">Gemini Inference</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">Analyzes clusters in deep contextual token pipelines.</p>
                {workflowStep === 3 && (
                  <span className="inline-block mt-3 text-[10px] font-mono text-purple-300 animate-pulse">RUNNING FLASH_REASON...</span>
                )}
                {workflowStep > 3 && (
                  <span className="inline-flex mt-3 items-center gap-1 text-[10px] font-mono text-purple-400"><Check className="h-3.5 w-3.5" /> OPTIMIZED</span>
                )}
              </div>

              <div className={`p-5 rounded-xl border transition-all ${
                workflowStep === 4 ? "bg-purple-500/10 border-purple-400 scale-[1.03] shadow-[0_0_15px_rgba(157,78,221,0.15)]" : "border-white/5 bg-slate-950/30"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${workflowStep === 4 ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white" : "bg-white/5 text-slate-500"}`}>
                    <Workflow className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[9px] text-slate-400 uppercase font-bold">BLOCK_04</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white mb-1">Structured Insights</h4>
                <p className="text-xs text-slate-400 font-light leading-relaxed">Formulates final JSON responses back to operators securely.</p>
                {workflowStep === 4 && (
                  <span className="inline-flex mt-3 items-center gap-1 text-[10px] font-mono text-purple-300"><CheckCircle2 className="h-4 w-4 text-cyan-400" /> COMPLETED</span>
                )}
              </div>
            </div>

            {(workflowLogs.length > 0 || workflowOutput) && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6 bg-slate-950 border border-white/5 p-4 rounded-xl font-mono text-xs h-40 overflow-y-auto">
                  <span className="block text-slate-500 mb-2">// PROCESSING ENGINE TRACE_LOGS:</span>
                  {workflowLogs.map((log, i) => (
                    <div key={i} className="text-slate-300 leading-relaxed">{log}</div>
                  ))}
                </div>

                <div className="md:col-span-6 bg-slate-950 border border-white/5 p-4 rounded-xl font-mono text-xs h-40 overflow-y-auto">
                  <span className="block text-slate-500 mb-2">// DECISION JSON OUTPUT:</span>
                  {workflowOutput ? (
                    <pre className="text-cyan-300 leading-relaxed">{workflowOutput}</pre>
                  ) : (
                    <span className="text-slate-600 italic">Waiting for compiler loop telemetry output...</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM CTA FORM */}
        <section id="strategy-call" className="py-20 text-center relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 p-8 md:p-12 shadow-2xl backdrop-blur-md scroll-mt-24">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

          <h2 className="font-display text-4xl font-bold tracking-tight text-white mb-4 sm:text-5xl">
            Book Your Free Strategy Call
          </h2>
          <p className="text-slate-300 font-light text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Let's diagnose your operational leaks together. We'll outline a direct, custom automation plan to recover lost margins and scale your output.
          </p>

          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const formEl = e.currentTarget;
              const name = (formEl.elements[0] as HTMLInputElement).value;
              const company = (formEl.elements[1] as HTMLInputElement).value;
              const email = (formEl.elements[2] as HTMLInputElement).value;
              const bottleneck = (formEl.elements[3] as HTMLSelectElement).value;

              try {
                // Post strategy call to the backend booking API!
                const res = await fetch("/api/bookings", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ fullName: name, company, email, bottleneck })
                });

                if (res.ok) {
                  alert("◆ [LEAD_CAPTURE_SUCCESS] Your free strategy audit call has been logged in our databases! Our technical lead will reach out to schedule within 12 hours.");
                  formEl.reset();
                } else {
                  const errData = await res.json();
                  alert(`◆ Error: ${errData.error || "Submission failure."}`);
                }
              } catch (err) {
                alert("◆ [DATABASE_GATEWAY_TIMEOUT] Failed to secure socket submission. Please retry.");
              }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto bg-slate-950/80 p-6 rounded-2xl border border-white/5 shadow-inner"
          >
            <div className="col-span-1">
              <input
                type="text"
                required
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono border border-white/10 bg-slate-950/50"
              />
            </div>
            <div className="col-span-1">
              <input
                type="text"
                required
                placeholder="Company Name"
                className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono border border-white/10 bg-slate-950/50"
              />
            </div>
            <div className="col-span-2">
              <input
                type="email"
                required
                placeholder="Corporate Email Address"
                className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono border border-white/10 bg-slate-950/50"
              />
            </div>
            <div className="col-span-2">
              <select
                required
                defaultValue=""
                className="w-full px-4 py-3 rounded-xl glass-input text-xs font-mono border border-white/10 bg-slate-950 text-slate-300"
              >
                <option value="" disabled>Select Primary Bottleneck</option>
                <option value="manual">Repetitive manual tasks (Data entry, syncing)</option>
                <option value="support">Slow customer support / High lead latency</option>
                <option value="sales">Missed conversions & lead generation issues</option>
                <option value="data">Poor reporting insights & fragmented systems</option>
                <option value="workflows">Inefficient daily team workflows</option>
              </select>
            </div>
            <div className="col-span-2 mt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-xl font-medium text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:scale-[1.02] duration-300 hover:shadow-[0_4px_25px_rgba(0,255,255,0.35)] shadow-lg cursor-pointer"
              >
                Schedule Free Audit Now
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-8 text-[11px] font-mono text-slate-500">
            <span>AUDIT QUEUE: 4 OPENINGS THIS WEEK</span>
            <span>SHIELDS SECURE</span>
            <span>DIAGNOSTIC SEATS: SYNCED</span>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 bg-slate-950/60 py-8 relative z-10 font-mono text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:items-center sm:justify-between">
          <span className="tracking-widest">// © 2026 STELLAR AI INC. ALL LOGICAL PROTOCOLS REGISTERED COGNITIVELY.</span>
          <span className="block mt-2 sm:mt-0 text-cyan-400 select-all cursor-crosshair">SEC_SYS_STATUS_ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}

// SCROLL TO TOP UTILITY
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// MASTER ROUTING CONTROLLER
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route path="/register" element={<RegisterPageWrapper />} />
          <Route path="/forgot-password" element={<ForgotPasswordPageWrapper />} />
          <Route path="/dashboard" element={
            <ProtectedRoute role="user">
              <UserLiveDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLiveDashboard />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
