import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Calendar, 
  Bot, 
  Mail, 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  Coins, 
  TrendingUp, 
  Sparkles, 
  ChevronRight, 
  X, 
  Check, 
  Lock, 
  ShieldAlert, 
  Moon, 
  Eye, 
  Video, 
  UserCheck, 
  RefreshCw,
  Terminal,
  Activity,
  Trash2,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import UserDashboard from "./UserDashboard"; // Keep original agent workspace inside Dashboard Home

export default function UserLiveDashboard() {
  const { user, logout, updateProfile, token } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "bookings" | "ai" | "messages" | "profile" | "settings">("dashboard");
  
  // Bookings State
  const [bookings, setBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [viewingBooking, setViewingBooking] = useState<any | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  
  // New Booking Form State
  const [newBookingCompany, setNewBookingCompany] = useState("");
  const [newBookingEmail, setNewBookingEmail] = useState("");
  const [newBookingFullName, setNewBookingFullName] = useState("");
  const [newBookingBottleneck, setNewBookingBottleneck] = useState("");
  const [newBookingSuccessMsg, setNewBookingSuccessMsg] = useState("");
  const [newBookingErrorMsg, setNewBookingErrorMsg] = useState("");

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [loadingChats, setLoadingChats] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Profile Update State
  const [profileName, setProfileName] = useState(user?.fullName || "");
  const [profileCompany, setProfileCompany] = useState(user?.company || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || "");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Settings State
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsPasswordConfirm, setSettingsPasswordConfirm] = useState("");
  const [settingsDarkMode, setSettingsDarkMode] = useState(true);
  const [settingsNotifications, setSettingsNotifications] = useState(true);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Notifications State
  const [notifications, setNotifications] = useState<any[]>([
    { id: "1", title: "Access Tunneled", message: "Stellar.OS quantum ledger synchronized successfully with your corporate node.", read: false, time: "Just now" },
    { id: "2", title: "Free Strategy Audit", message: "Welcome! Click the scheduling panel or 'Book Call' to configure an audit.", read: false, time: "10 mins ago" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Support Messages State
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  const [supportInput, setSupportInput] = useState("");
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [sendingSupport, setSendingSupport] = useState(false);

  // Load Bookings & Chats
  useEffect(() => {
    if (token) {
      fetchBookings();
      fetchChats();
      fetchSupportMessages();
    }
  }, [token, activeTab]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await fetch("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (e) {
      console.error("Error fetching bookings:", e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await fetch("/api/chats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
    } catch (e) {
      console.error("Error fetching chats:", e);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchSupportMessages = async () => {
    setLoadingSupport(true);
    try {
      const res = await fetch("/api/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSupportMessages(data);
      }
    } catch (e) {
      console.error("Error fetching support messages:", e);
    } finally {
      setLoadingSupport(false);
    }
  };

  const handleSendSupportMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInput.trim() || sendingSupport) return;

    setSendingSupport(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: supportInput })
      });
      if (res.ok) {
        setSupportInput("");
        fetchSupportMessages();
      }
    } catch (e) {
      console.error("Error sending support message:", e);
    } finally {
      setSendingSupport(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewBookingSuccessMsg("");
    setNewBookingErrorMsg("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: newBookingFullName || user?.fullName,
          company: newBookingCompany || user?.company || "Unspecified",
          email: newBookingEmail || user?.email,
          bottleneck: newBookingBottleneck
        })
      });

      const data = await res.json();

      if (res.ok) {
        setNewBookingSuccessMsg("Your Stellar AI strategy call booking was added successfully!");
        setNewBookingCompany("");
        setNewBookingBottleneck("");
        fetchBookings();
        setTimeout(() => {
          setIsNewBookingModalOpen(false);
          setNewBookingSuccessMsg("");
        }, 1500);
      } else {
        setNewBookingErrorMsg(data.error || "Failed to add strategy call.");
      }
    } catch (err) {
      setNewBookingErrorMsg("Server connection failure.");
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this strategy call booking?")) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Rejected" })
      });

      if (res.ok) {
        fetchBookings();
        setViewingBooking(null);
      }
    } catch (e) {
      console.error("Cancel booking error:", e);
    }
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const queryText = chatInput;
    setChatInput("");
    setIsSendingChat(true);

    // Optimistically add user message
    const tempUserMsg = { id: "temp_user_" + Date.now(), sender: "user", content: queryText, createdAt: new Date().toISOString() };
    setChatMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content: queryText })
      });

      if (res.ok) {
        const data = await res.json();
        // Overwrite message list with live returned logs
        fetchChats();
      } else {
        const tempAiMsg = { id: "temp_ai_" + Date.now(), sender: "ai", content: "◆ [CRITICAL_TRANS_FAIL] AI failed to respond. Please check your network.", createdAt: new Date().toISOString() };
        setChatMessages(prev => [...prev, tempAiMsg]);
      }
    } catch (e) {
      console.error("Chat error:", e);
    } finally {
      setIsSendingChat(false);
    }
  };

  const handleClearChats = async () => {
    if (!confirm("Are you sure you want to delete your conversation history with Stellar AI?")) return;

    try {
      const res = await fetch("/api/chats", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setChatMessages([]);
      }
    } catch (e) {
      console.error("Clear chats error:", e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");

    const success = await updateProfile({
      fullName: profileName,
      company: profileCompany,
      email: profileEmail,
      avatar: profileAvatar
    });

    if (success) {
      setProfileSuccess("Stellar database node updated with your profile variables!");
    } else {
      setProfileError("Failed to update profile values.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess("");
    setSettingsError("");

    if (settingsPassword !== settingsPasswordConfirm) {
      setSettingsError("Passwords do not match");
      return;
    }

    const success = await updateProfile({ password: settingsPassword });

    if (success) {
      setSettingsSuccess("Secret security passkey updated successfully!");
      setSettingsPassword("");
      setSettingsPasswordConfirm("");
    } else {
      setSettingsError("Failed to recompile passkey.");
    }
  };

  // Compute stats for Dashboard Home
  const activeBooking = bookings.find(b => b.status === "Pending" || b.status === "Meeting Scheduled");
  const completedBookingsCount = bookings.filter(b => b.status === "Completed").length;

  return (
    <div id="live-dashboard-layout" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex md:w-64 bg-slate-950 border-r border-white/5 flex-col justify-between shrink-0 font-mono text-xs select-none">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-widest text-sm">STELLAR AI</span>
              <span className="block text-[8px] text-slate-500 tracking-wider">CLIENT_INTERFACE // V6.2</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "dashboard" 
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" /> Dashboard Home
              </span>
              {activeTab === "dashboard" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "bookings" 
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4" /> My Bookings
                {bookings.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-[9px] text-cyan-300">
                    {bookings.length}
                  </span>
                )}
              </span>
              {activeTab === "bookings" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("ai")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "ai" 
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Bot className="h-4 w-4" /> AI Assistant
              </span>
              {activeTab === "ai" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "messages" 
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Mail className="h-4 w-4" /> Messages
              </span>
              {activeTab === "messages" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "profile" 
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <User className="h-4 w-4" /> Profile Details
              </span>
              {activeTab === "profile" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "settings" 
                  ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Settings className="h-4 w-4" /> Settings Panel
              </span>
              {activeTab === "settings" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with user avatar profile */}
        <div className="p-4 border-t border-white/5 bg-slate-950/80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"} 
                alt="Avatar"
                className="h-8 w-8 rounded-full border border-white/10"
              />
              <div className="leading-tight">
                <span className="block font-bold text-white max-w-[120px] truncate">{user?.fullName}</span>
                <span className="block text-[9px] text-slate-500 truncate">{user?.company || "Corporate Client"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Close Node Session
          </button>
        </div>
      </aside>

      {/* PRIMARY WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col bg-slate-950/40 relative overflow-hidden">
        
        {/* MOBILE TOP BAR & NAVIGATION STRIP (<md) */}
        <div className="md:hidden bg-slate-950 border-b border-white/10 shrink-0 select-none">
          <div className="p-3 px-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 text-white">
                <Bot className="h-4 w-4" />
              </div>
              <span className="font-bold text-white tracking-widest text-xs font-mono">STELLAR AI</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"} 
                alt="Avatar"
                className="h-6 w-6 rounded-full border border-white/10"
              />
              <button
                onClick={logout}
                title="Close Session"
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {/* Horizontally scrolling tab pills */}
          <div className="flex overflow-x-auto gap-1.5 p-2 px-3 no-scrollbar font-mono text-xs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Home
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" /> Bookings
              {bookings.length > 0 && (
                <span className="px-1 py-0.2 rounded bg-cyan-400/20 text-[9px] text-cyan-300">{bookings.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "ai"
                  ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="h-3.5 w-3.5" /> AI Copilot
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "messages"
                  ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> Messages
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <User className="h-3.5 w-3.5" /> Profile
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Settings className="h-3.5 w-3.5" /> Settings
            </button>
          </div>
        </div>

        {/* UPPER NAVBAR ACCESSORIES */}
        <header className="min-h-[4rem] py-2.5 border-b border-white/5 px-4 sm:px-6 flex flex-wrap gap-2 justify-between items-center bg-slate-950 z-30">
          <div>
            <h1 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
              {activeTab === "dashboard" && "Quantum Automation Console"}
              {activeTab === "bookings" && "Corporate Audit & Calls Booking Ledger"}
              {activeTab === "ai" && "Stellar AI Cognitive Copilot"}
              {activeTab === "messages" && "Secure Inbound Mailbox"}
              {activeTab === "profile" && "Client Node Registry Parameters"}
              {activeTab === "settings" && "Stellar.OS Node Settings"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications panel dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-white/5 bg-slate-950 hover:bg-white/5 text-slate-300 hover:text-white transition-all cursor-pointer relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 glass-card rounded-xl border border-white/10 shadow-2xl p-4 bg-slate-950 z-50 text-xs"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-3">
                      <span className="font-mono font-bold text-slate-300">SYSTEM_LOGS //</span>
                      <button onClick={() => setNotifications([])} className="text-[10px] text-cyan-400 hover:underline">Flush logs</button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-slate-500 italic text-center py-4 font-mono">Telemetry stream synchronized and quiet.</p>
                    ) : (
                      <div className="space-y-3">
                        {notifications.map(notif => (
                          <div key={notif.id} className="p-2 rounded bg-white/5 border border-white/5 font-mono">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-cyan-400">{notif.title}</span>
                              <span className="text-[9px] text-slate-500">{notif.time}</span>
                            </div>
                            <p className="text-slate-300 leading-normal">{notif.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">TUNNEL STATUS:</span>
              <span className="text-[10px] font-mono font-bold bg-green-500/10 border border-green-500/30 text-green-400 px-2 py-0.5 rounded animate-pulse">SECURE_LINK</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* TAB 1: DASHBOARD HOME */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-950/40 via-indigo-950/20 to-purple-950/10 relative overflow-hidden shadow-xl backdrop-blur-md">
                <div className="absolute top-0 right-0 p-8 text-cyan-500/10 pointer-events-none">
                  <Bot className="h-32 w-32" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Welcome Back, {user?.fullName || "Explorer"}!
                </h2>
                <p className="text-slate-300 text-sm font-light mt-1 max-w-2xl leading-relaxed">
                  Stellar AI Cognitive Framework is fully online. Your custom operations dashboard is securely synced with your node variables. Below you can monitor real-time automated workflow runs and review booking queues.
                </p>
                <div className="mt-4 flex gap-3 flex-wrap">
                  <button
                    onClick={() => setIsNewBookingModalOpen(true)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:scale-[1.02] duration-300 text-xs font-mono font-medium text-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Schedule Free Strategy Audit
                  </button>
                  <button
                    onClick={() => setActiveTab("ai")}
                    className="px-5 py-2 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-mono font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    Open AI Chat Core
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="glass-card p-5 rounded-2xl border border-white/5 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Bookings</span>
                    <h3 className="text-2xl font-bold font-mono text-cyan-400 mt-2">{bookings.length} Registered</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Audit Strategy Calls</p>
                  </div>
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20 shadow-inner">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/5 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Upcoming Meeting</span>
                    <h3 className="text-sm font-bold font-mono text-purple-400 mt-2.5 truncate max-w-[150px]">
                      {activeBooking ? activeBooking.status : "No meetings pending"}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                      {activeBooking ? "Status: Active" : "No strategy calls requested"}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20 shadow-inner">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/5 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Current Status</span>
                    <h3 className="text-sm font-bold font-mono text-indigo-300 mt-2.5">
                      {activeBooking ? activeBooking.status : "Clear / Active"}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Stellar.OS Pipeline node</p>
                  </div>
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-inner">
                    <Activity className="h-6 w-6 animate-pulse" />
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/5 bg-slate-950/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Assigned Lead</span>
                    <h3 className="text-sm font-bold font-mono text-pink-400 mt-2.5 truncate max-w-[150px]">
                      {activeBooking?.consultant || "Stellar Engineer"}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Stellar Lead Consultant</p>
                  </div>
                  <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400 border border-pink-500/20 shadow-inner">
                    <UserCheck className="h-6 w-6" />
                  </div>
                </div>

              </div>

              {/* Custom Integrated telemetry Agent workspace (the original visually striking user workspace!) */}
              <UserDashboard />

            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              {/* Header block with button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/50 p-5 rounded-xl border border-white/5">
                <div>
                  <h3 className="font-display font-bold text-white text-base">Strategy Calls Booking History</h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Manage, track progress, or schedule new consultation audits with Stellar core team.</p>
                </div>
                <button
                  onClick={() => setIsNewBookingModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:scale-[1.02] duration-300 text-xs font-mono font-medium text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  <Plus className="h-4 w-4" /> Book New Strategy Call
                </button>
              </div>

              {/* Bookings List Card */}
              <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30 overflow-hidden">
                {loadingBookings ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
                    <span className="font-mono text-xs text-slate-400">Reading Ledger Clusters...</span>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="py-16 text-center">
                    <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                    <h4 className="font-display font-bold text-slate-300 text-sm">No Active Bookings</h4>
                    <p className="text-xs text-slate-500 font-light max-w-sm mx-auto mt-1 leading-relaxed">
                      You haven't requested any strategy calls yet. Book a session to outline an automation outline with our technical operators!
                    </p>
                    <button
                      onClick={() => setIsNewBookingModalOpen(true)}
                      className="mt-4 px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-mono text-cyan-400 cursor-pointer"
                    >
                      Book Free Audit Now
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-500 uppercase font-bold text-[10px]">
                          <th className="py-3 px-4">Company</th>
                          <th className="py-3 px-4">Corporate Email</th>
                          <th className="py-3 px-4">Selected Bottleneck</th>
                          <th className="py-3 px-4">Consultant</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-4 px-4 font-bold text-white">{booking.company}</td>
                            <td className="py-4 px-4 text-slate-300">{booking.email}</td>
                            <td className="py-4 px-4 text-slate-400 italic truncate max-w-[200px]">
                              {booking.bottleneck === "manual" ? "Repetitive manual tasks (Data entry)" :
                               booking.bottleneck === "support" ? "Slow support / lead latency" :
                               booking.bottleneck === "sales" ? "Missed conversions & lead gen" :
                               booking.bottleneck === "data" ? "Poor reporting insights" :
                               booking.bottleneck || "General Operations"}
                            </td>
                            <td className="py-4 px-4 text-slate-300">
                              <span className="flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5 text-pink-400" />
                                {booking.consultant || "Unassigned Operator"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${
                                booking.status === "Pending" ? "bg-amber-400/10 border-amber-400/30 text-amber-400" :
                                booking.status === "Contacted" ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400" :
                                booking.status === "Meeting Scheduled" ? "bg-purple-400/10 border-purple-400/30 text-purple-400 animate-pulse" :
                                booking.status === "Completed" ? "bg-green-400/10 border-green-400/30 text-green-400" :
                                "bg-red-400/10 border-red-400/30 text-red-400"
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button
                                onClick={() => setViewingBooking(booking)}
                                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-400 transition-all cursor-pointer"
                              >
                                View
                              </button>
                              {booking.status !== "Rejected" && booking.status !== "Completed" && (
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AI ASSISTANT CHAT */}
          {activeTab === "ai" && (
            <div className="h-[75vh] flex flex-col justify-between bg-slate-950/60 border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
              
              {/* Header title bar */}
              <div className="bg-slate-950 px-4 sm:px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <div>
                    <h4 className="font-display font-bold text-white text-sm">Stellar Cognitive Interface</h4>
                    <span className="block text-[10px] font-mono text-slate-500">POWERED BY GEMINI 3.5 // CONVERSATION HISTORY SYNCED</span>
                  </div>
                </div>

                <button
                  onClick={handleClearChats}
                  className="px-3 py-1.5 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-mono text-[10px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Purge Chats history
                </button>
              </div>

              {/* Chat Messages Logs */}
              <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto space-y-4 font-mono text-xs select-text">
                {loadingChats && chatMessages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <span className="animate-pulse text-slate-500 text-xs">Accessing cognitive vault thread logs...</span>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="max-w-md mx-auto text-center py-12 space-y-4">
                    <Bot className="h-12 w-12 text-slate-600 mx-auto" />
                    <h5 className="font-display font-bold text-slate-300">Synchronized Node Session Open</h5>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      "Greetings, operator. I am Stellar AI. I can assist you with compiling CRM data models, designing webhook systems, organizing calendar mappings, or drafting automated outreaches. Post a directive below."
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {chatMessages.map((msg, i) => (
                      <div 
                        key={msg.id || i}
                        className={`flex gap-3 items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.sender === "ai" && (
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-400 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}

                        <div className={`p-4 rounded-xl max-w-xl leading-relaxed ${
                          msg.sender === "user"
                            ? "bg-indigo-600/20 border border-indigo-500/30 text-indigo-100"
                            : "bg-slate-900/60 border border-white/5 text-slate-200 whitespace-pre-wrap"
                        }`}>
                          <div className="flex justify-between items-center text-[9px] text-slate-500 mb-1">
                            <span className="font-bold">{msg.sender === "user" ? "USER_OPERATOR" : "STELLAR_CORE"}</span>
                            <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                          </div>
                          {msg.content}
                        </div>

                        {msg.sender === "user" && (
                          <img 
                            src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"} 
                            alt="Me"
                            className="h-8 w-8 rounded-full border border-white/10 shrink-0"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Form entry */}
              <div className="p-4 bg-slate-950 border-t border-white/5">
                <form onSubmit={handleSendChat} className="max-w-4xl mx-auto relative flex items-center gap-2">
                  <input
                    type="text"
                    required
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about designing automation systems, testing CRM configurations, or auditing operations..."
                    className="flex-1 pl-4 pr-12 py-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isSendingChat || !chatInput.trim()}
                    className="px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-all cursor-pointer flex items-center justify-center shrink-0"
                  >
                    {isSendingChat ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 4: MESSAGES */}
          {activeTab === "messages" && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl border border-white/10 p-4 sm:p-6 bg-slate-950/30 max-w-4xl flex flex-col h-[75vh] sm:h-[70vh] justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-cyan-400 animate-pulse" />
                      <h4 className="font-display font-bold text-white text-base">Corporate Support Transmissions</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Secure Link Active // End-to-End</span>
                  </div>

                  {/* Messages list */}
                  <div className="space-y-4 font-mono text-xs overflow-y-auto max-h-[48vh] sm:max-h-[45vh] pr-2">
                    {loadingSupport && supportMessages.length === 0 ? (
                      <div className="py-12 text-center text-slate-500">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Scanning secure datalinks...
                      </div>
                    ) : supportMessages.length === 0 ? (
                      <div className="py-12 text-center text-slate-500">
                        <Mail className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                        <p className="font-bold text-slate-400 mb-1">No Direct Messages Yet</p>
                        <p className="text-[10px] text-slate-600 max-w-xs mx-auto">Send an operations or consultation transmission below to connect with our core engineers.</p>
                      </div>
                    ) : (
                      supportMessages.map((msg, idx) => (
                        <div 
                          key={msg.id || idx} 
                          className={`p-4 rounded-xl border relative max-w-2xl ${
                            msg.senderRole === "admin" 
                              ? "bg-purple-950/20 border-purple-500/20 mr-auto" 
                              : "bg-slate-900/40 border-white/5 ml-auto"
                          }`}
                        >
                          <span className="absolute top-4 right-4 text-[9px] text-slate-500">
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Just now"}
                          </span>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${msg.senderRole === "admin" ? "bg-purple-400 animate-ping" : "bg-cyan-400"}`} />
                            <span className={`font-bold ${msg.senderRole === "admin" ? "text-purple-400" : "text-white"}`}>
                              {msg.senderRole === "admin" ? "STELLAR_ADMIN" : "OPERATOR_CLIENT"} ({msg.senderName})
                            </span>
                          </div>
                          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Input transmission form */}
                <form onSubmit={handleSendSupportMessage} className="mt-6 border-t border-white/5 pt-4 flex gap-2">
                  <input
                    type="text"
                    required
                    value={supportInput}
                    onChange={(e) => setSupportInput(e.target.value)}
                    placeholder="Type an operations directive or direct message to core engineering support..."
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-cyan-400 outline-none font-mono"
                  />
                  <button
                    type="submit"
                    disabled={sendingSupport || !supportInput.trim()}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] duration-300 text-xs font-mono font-medium text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0 animate-glow"
                  >
                    {sendingSupport ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Transmit Link
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE DETAILS */}
          {activeTab === "profile" && (
            <div className="space-y-6 max-w-2xl">
              <div className="glass-card rounded-2xl border border-white/10 p-6 bg-slate-950/30">
                <h4 className="font-display font-bold text-white text-base border-b border-white/5 pb-3 mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-400" /> Update Corporate Node Variables
                </h4>

                {profileSuccess && (
                  <div className="p-3 mb-4 rounded-xl border border-green-500/20 bg-green-500/10 text-green-400 font-mono text-xs text-center">
                    ◆ SUCCESS: {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="p-3 mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 font-mono text-xs text-center">
                    ◆ ERROR: {profileError}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-2 font-bold">CLIENT NAME</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-950 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-2 font-bold">COMPANY REGISTERED</label>
                      <input
                        type="text"
                        value={profileCompany}
                        onChange={(e) => setProfileCompany(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-950 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-2 font-bold">SECURE CORPORATE EMAIL</label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-950 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-2 font-bold">AVATAR VECTOR IMAGE URL</label>
                    <input
                      type="text"
                      value={profileAvatar}
                      onChange={(e) => setProfileAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-950 text-white"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:scale-[1.02] duration-300 font-bold cursor-pointer"
                    >
                      COMMIT PROFILE CHANGES
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS PANEL */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              {/* Passkey recompile */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 bg-slate-950/30">
                <h4 className="font-display font-bold text-white text-base border-b border-white/5 pb-3 mb-6 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-pink-400" /> Recompile Secret Security Passkey
                </h4>

                {settingsSuccess && (
                  <div className="p-3 mb-4 rounded-xl border border-green-500/20 bg-green-500/10 text-green-400 font-mono text-xs text-center">
                    ◆ SUCCESS: {settingsSuccess}
                  </div>
                )}
                {settingsError && (
                  <div className="p-3 mb-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 font-mono text-xs text-center">
                    ◆ ERROR: {settingsError}
                  </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-slate-400 mb-2 font-bold">NEW PASSKEY VALUE</label>
                    <input
                      type="password"
                      required
                      value={settingsPassword}
                      onChange={(e) => setSettingsPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-950 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-2 font-bold">CONFIRM NEW PASSKEY</label>
                    <input
                      type="password"
                      required
                      value={settingsPasswordConfirm}
                      onChange={(e) => setSettingsPasswordConfirm(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-950 text-white"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:scale-[1.02] duration-300 cursor-pointer"
                    >
                      UPDATE ACCESS KEY
                    </button>
                  </div>
                </form>
              </div>

              {/* Preferences settings */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 bg-slate-950/30">
                <h4 className="font-display font-bold text-white text-sm border-b border-white/5 pb-3 mb-4">
                  Autonomous Device Preferences
                </h4>
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <span className="font-bold text-white block">Quantum Dark Mode</span>
                      <span className="text-[10px] text-slate-500">Enable deep eye-save space background layers</span>
                    </div>
                    <button
                      onClick={() => setSettingsDarkMode(!settingsDarkMode)}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${settingsDarkMode ? "bg-cyan-500 flex justify-end" : "bg-slate-800 flex justify-start"}`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full block shadow" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <span className="font-bold text-white block">Continuous Real-Time Notifications</span>
                      <span className="text-[10px] text-slate-500">Enable critical status signal alert indicators</span>
                    </div>
                    <button
                      onClick={() => setSettingsNotifications(!settingsNotifications)}
                      className={`w-12 h-6 rounded-full p-1 transition-all ${settingsNotifications ? "bg-cyan-500 flex justify-end" : "bg-slate-800 flex justify-start"}`}
                    >
                      <span className="w-4 h-4 bg-white rounded-full block shadow" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* POPUP: VIEW BOOKING DETAILS MODAL */}
      <AnimatePresence>
        {viewingBooking && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm font-mono text-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full glass-card p-6 rounded-2xl border border-white/10 bg-slate-950 text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="font-bold text-cyan-400">BOOKING // {viewingBooking.id}</span>
                <button onClick={() => setViewingBooking(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-500 block uppercase">CLIENT COMPANY</span>
                  <span className="text-white text-sm font-bold">{viewingBooking.company}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">CLIENT EMAIL</span>
                  <span className="text-slate-300">{viewingBooking.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">ASSIGNED CONSULTANT</span>
                  <span className="text-pink-400 font-bold">{viewingBooking.consultant || "Unassigned Operator"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">DIAGNOSTIC TARGET BOTTLENECK</span>
                  <span className="text-slate-300 leading-normal block p-2.5 rounded bg-white/5 border border-white/5 italic">
                    {viewingBooking.bottleneck === "manual" ? "Repetitive manual tasks (Data entry)" :
                     viewingBooking.bottleneck === "support" ? "Slow support / lead latency" :
                     viewingBooking.bottleneck === "sales" ? "Missed conversions & lead gen" :
                     viewingBooking.bottleneck === "data" ? "Poor reporting insights" :
                     viewingBooking.bottleneck || "General Operations"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase">CURRENT STATUS</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded border text-[11px] font-bold mt-1 ${
                    viewingBooking.status === "Pending" ? "bg-amber-400/10 border-amber-400/30 text-amber-400" :
                    viewingBooking.status === "Contacted" ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400" :
                    viewingBooking.status === "Meeting Scheduled" ? "bg-purple-400/10 border-purple-400/30 text-purple-400" :
                    viewingBooking.status === "Completed" ? "bg-green-400/10 border-green-400/30 text-green-400" :
                    "bg-red-400/10 border-red-400/30 text-red-400"
                  }`}>
                    {viewingBooking.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-2">
                {viewingBooking.status !== "Rejected" && viewingBooking.status !== "Completed" && (
                  <button
                    onClick={() => handleCancelBooking(viewingBooking.id)}
                    className="flex-1 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold cursor-pointer"
                  >
                    Cancel Booking Session
                  </button>
                )}
                <button
                  onClick={() => setViewingBooking(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD NEW BOOKING */}
      <AnimatePresence>
        {isNewBookingModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm font-mono text-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full glass-card p-6 rounded-2xl border border-white/10 bg-slate-950 text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-cyan-400" /> BOOK NEW AUDIT CALL
                </span>
                <button onClick={() => setIsNewBookingModalOpen(false)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
              </div>

              {newBookingSuccessMsg && (
                <div className="p-3 rounded-xl border border-green-500/20 bg-green-500/10 text-green-400 font-bold text-center">
                  ◆ SUCCESS: {newBookingSuccessMsg}
                </div>
              )}
              {newBookingErrorMsg && (
                <div className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 font-bold text-center">
                  ◆ ERROR: {newBookingErrorMsg}
                </div>
              )}

              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase">Corporate Contact Name</label>
                  <input
                    type="text"
                    required
                    value={newBookingFullName}
                    onChange={(e) => setNewBookingFullName(e.target.value)}
                    placeholder={user?.fullName}
                    className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-900 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase">Client Company Name</label>
                  <input
                    type="text"
                    required
                    value={newBookingCompany}
                    onChange={(e) => setNewBookingCompany(e.target.value)}
                    placeholder="Enter corporate enterprise..."
                    className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-900 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase">Target Bottleneck Sector</label>
                  <select
                    required
                    value={newBookingBottleneck}
                    onChange={(e) => setNewBookingBottleneck(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-900 text-slate-300"
                  >
                    <option value="" disabled>Select Primary Bottleneck</option>
                    <option value="manual">Repetitive manual tasks (Data entry, syncing)</option>
                    <option value="support">Slow customer support / High lead latency</option>
                    <option value="sales">Missed conversions & lead generation issues</option>
                    <option value="data">Poor reporting insights & fragmented systems</option>
                    <option value="workflows">Inefficient daily team workflows</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-white/10 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold cursor-pointer"
                  >
                    SCHEDULE AUDIT NOW
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewBookingModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
