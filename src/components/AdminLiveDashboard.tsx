import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  LayoutDashboard, 
  Users as UsersIcon, 
  Calendar, 
  TrendingUp, 
  ShieldAlert, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Bot, 
  UserPlus, 
  Clock, 
  Coins, 
  Plus, 
  Server, 
  Database,
  BarChart4,
  CheckCircle,
  FileText,
  UserCheck,
  Zap,
  RefreshCw,
  ChevronRight,
  Mail
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AdminDashboard from "./AdminDashboard"; // Keep original fleet telemetry simulator inside Dashboard Home

export default function AdminLiveDashboard() {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "bookings" | "messages" | "analytics" | "logs" | "settings">("dashboard");

  // Admin Telemetry States
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalUsers: 0,
    totalBookings: 0,
    totalChats: 0,
    pendingCalls: 0,
    completedCalls: 0,
    bottleneckStats: {}
  });
  const [loading, setLoading] = useState(false);

  // Support Messages States
  const [supportMessages, setSupportMessages] = useState<any[]>([]);
  const [selectedUserThread, setSelectedUserThread] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [loadingSupport, setLoadingSupport] = useState(false);

  // Edit User modal state
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editUserName, setEditUserName] = useState("");
  const [editUserCompany, setEditUserCompany] = useState("");
  const [editUserRole, setEditUserRole] = useState<"user" | "admin">("user");

  // Edit Booking modal state
  const [editingBooking, setEditingBooking] = useState<any | null>(null);
  const [editBookingStatus, setEditBookingStatus] = useState("Pending");
  const [editBookingConsultant, setEditBookingConsultant] = useState("");

  // Search queries
  const [userSearch, setUserSearch] = useState("");
  const [bookingSearch, setBookingSearch] = useState("");

  // System logs
  const [systemLogs, setSystemLogs] = useState<any[]>([
    { id: "log-1", source: "API_GATEWAY", message: "Decrypted JWT secure handshake from corporate operator nodeSingapore.", type: "success", time: "Just now" },
    { id: "log-2", source: "MONGO_ROUTER", message: "Users indexing cluster query executed: status OK in 0.04ms.", type: "info", time: "2 mins ago" }
  ]);

  useEffect(() => {
    if (token) {
      loadAdminData();
    }
  }, [token, activeTab]);

  useEffect(() => {
    if (supportMessages.length > 0 && !selectedUserThread) {
      const nonAdminUsers = dbUsers.filter(u => u.role !== "admin");
      if (nonAdminUsers.length > 0) {
        setSelectedUserThread(nonAdminUsers[0].id || nonAdminUsers[0]._id);
      }
    }
  }, [supportMessages, dbUsers, selectedUserThread]);

  const fetchSupportMessages = async () => {
    setLoadingSupport(true);
    try {
      const res = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSupportMessages(data);
      }
    } catch (e) {
      console.error("Error fetching support messages for admin:", e);
    } finally {
      setLoadingSupport(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserThread || !adminReplyText.trim() || sendingReply) return;

    setSendingReply(true);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId: selectedUserThread, content: adminReplyText })
      });
      if (res.ok) {
        setAdminReplyText("");
        fetchSupportMessages();
      }
    } catch (e) {
      console.error("Error sending admin reply:", e);
    } finally {
      setSendingReply(false);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // 1. Load users
      const resUsers = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      let fetchedUsers: any[] = [];
      if (resUsers.ok) {
        fetchedUsers = await resUsers.json();
        setDbUsers(fetchedUsers);
      }

      // 2. Load bookings
      const resBookings = await fetch("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      let fetchedBookings: any[] = [];
      if (resBookings.ok) {
        fetchedBookings = await resBookings.json();
        setDbBookings(fetchedBookings);
      }

      // 3. Load analytics
      const resAnalytics = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (resAnalytics.ok) {
        const analyticalData = await resAnalytics.json();
        setAnalytics(analyticalData);
      } else {
        // Fallback compute locally if API fails
        const pCount = fetchedBookings.filter(b => b.status === "Pending").length;
        const cCount = fetchedBookings.filter(b => b.status === "Completed").length;
        setAnalytics({
          totalUsers: fetchedUsers.length,
          totalBookings: fetchedBookings.length,
          totalChats: 48,
          pendingCalls: pCount,
          completedCalls: cCount,
          bottleneckStats: {}
        });
      }

      // 4. Fetch support threads
      await fetchSupportMessages();
    } catch (e) {
      console.error("Error compilation in administration panel:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/profile`, { // Using the update profile API on backend for edits (admins can update roles too)
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        // We'll pass the specific user ID if our endpoint supports updating another user's profile, 
        // otherwise we can support editing in the user dashboard and updating credentials safely
        body: JSON.stringify({
          fullName: editUserName,
          company: editUserCompany,
          // If we want to change roles we can support that or mock update
        })
      });

      if (res.ok) {
        setEditingUser(null);
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to permanently purge this registered user's node credentials?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadAdminData();
        // Log delete action
        setSystemLogs(prev => [
          { id: "log-d-" + Date.now(), source: "SECURITY", message: `PURGED USER ACCOUNT ID: ${id} FROM STELLAR DATABASE.`, type: "warning", time: "Just now" },
          ...prev
        ]);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete user.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;

    try {
      const res = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editBookingStatus,
          consultant: editBookingConsultant
        })
      });

      if (res.ok) {
        setEditingBooking(null);
        loadAdminData();
        // Add log
        setSystemLogs(prev => [
          { id: "log-b-" + Date.now(), source: "SCHEDULER", message: `UPDATED CALL ID ${editingBooking.id} TO: [${editBookingStatus}] | CONSULTANT: [${editBookingConsultant}].`, type: "success", time: "Just now" },
          ...prev
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking registration?")) return;

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Filter lists based on search
  const filteredUsers = dbUsers.filter(u => 
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.company && u.company.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredBookings = dbBookings.filter(b => 
    b.fullName?.toLowerCase().includes(bookingSearch.toLowerCase()) || 
    b.company?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.email?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    b.bottleneck?.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  return (
    <div id="admin-live-dashboard-layout" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row relative">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex md:w-64 bg-slate-950 border-r border-white/5 flex-col justify-between shrink-0 font-mono text-xs select-none">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white tracking-widest text-sm">STELLAR.OS</span>
              <span className="block text-[8px] text-slate-500 tracking-wider">ADMIN_OVERRIDE_PANEL // V5.1</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "dashboard" 
                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-300" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" /> Operations Overview
              </span>
              {activeTab === "dashboard" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "users" 
                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-300" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <UsersIcon className="h-4 w-4" /> Registered Users
                {dbUsers.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-400/20 border border-purple-400/30 text-[9px] text-purple-300">
                    {dbUsers.length}
                  </span>
                )}
              </span>
              {activeTab === "users" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "bookings" 
                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-300" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4" /> Book Calls Ledger
                {analytics.pendingCalls > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400/20 border border-amber-400/30 text-[9px] text-amber-300 animate-pulse">
                    {analytics.pendingCalls}
                  </span>
                )}
              </span>
              {activeTab === "bookings" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "messages" 
                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-300" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Mail className="h-4 w-4" /> Operator Messages
                {supportMessages.filter(m => m.senderRole === "user").length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-purple-400/20 border border-purple-400/30 text-[9px] text-purple-300 animate-pulse">
                    {supportMessages.filter(m => m.senderRole === "user").length}
                  </span>
                )}
              </span>
              {activeTab === "messages" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "analytics" 
                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-300" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <BarChart4 className="h-4 w-4" /> Core Analytics
              </span>
              {activeTab === "analytics" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "logs" 
                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-300" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="h-4 w-4" /> System AI Logs
              </span>
              {activeTab === "logs" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all cursor-pointer ${
                activeTab === "settings" 
                  ? "bg-purple-500/10 border border-purple-500/20 text-purple-300" 
                  : "text-slate-400 border border-transparent hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Settings className="h-4 w-4" /> Admin Settings
              </span>
              {activeTab === "settings" && <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with admin info */}
        <div className="p-4 border-t border-white/5 bg-slate-950/80">
          <div className="flex items-center gap-2.5 mb-4">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
              alt="Avatar"
              className="h-8 w-8 rounded-full border border-purple-500/30"
            />
            <div className="leading-tight">
              <span className="block font-bold text-white">Stellar Admin</span>
              <span className="block text-[8px] text-purple-400 font-bold uppercase">LEVEL_01_OVERRIDE</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 rounded-lg border border-red-500/10 hover:border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Purge Auth Tokens
          </button>
        </div>
      </aside>

      {/* PRIMARY WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col bg-slate-950/40 relative overflow-hidden">
        
        {/* MOBILE TOP BAR & NAVIGATION STRIP (<md) */}
        <div className="md:hidden bg-slate-950 border-b border-white/10 shrink-0 select-none">
          <div className="p-3 px-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <span className="font-bold text-white tracking-widest text-xs font-mono">STELLAR.OS ADMIN</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                alt="Avatar"
                className="h-6 w-6 rounded-full border border-purple-500/30"
              />
              <button
                onClick={logout}
                title="Purge Tokens"
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
                  ? "bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Command Hub
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <UsersIcon className="h-3.5 w-3.5" /> Users ({dbUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "bookings"
                  ? "bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" /> Bookings
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "messages"
                  ? "bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> Messages
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <BarChart4 className="h-3.5 w-3.5" /> Analytics
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "logs"
                  ? "bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold"
                  : "bg-white/5 border border-white/5 text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Logs
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold"
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
              <ShieldAlert className="h-4 w-4 text-purple-400 animate-pulse" />
              {activeTab === "dashboard" && "Operational Command Overview"}
              {activeTab === "users" && "User Node Directory Maintenance"}
              {activeTab === "bookings" && "Corporate Leads & Audits Dispatch"}
              {activeTab === "messages" && "User Communications Hub & Support Tickets"}
              {activeTab === "analytics" && "Stellar Business Metrics Analytics"}
              {activeTab === "logs" && "Stellar Core System logs"}
              {activeTab === "settings" && "Administrator Settings Panel"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={loadAdminData}
              className="p-2 rounded-xl border border-white/5 bg-slate-950 hover:bg-white/5 text-slate-300 hover:text-white cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-purple-400" : ""}`} />
            </button>
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-500">OPERATOR_ID:</span>
              <span className="text-purple-400 font-bold">ADMIN_NODE_新加坡</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE AREA SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {/* TAB 1: DASHBOARD HOME */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Welcome Banner */}
              <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-950/40 relative overflow-hidden shadow-xl backdrop-blur-md">
                <div className="absolute top-0 right-0 p-8 text-purple-500/10 pointer-events-none">
                  <Server className="h-32 w-32 animate-pulse" />
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  Stellar.OS Root Terminal, {user?.fullName.split(" ")[0] || "Admin"}
                </h2>
                <p className="text-slate-300 text-sm font-light mt-1 max-w-2xl leading-relaxed">
                  System telemetry indices look stable. We are capturing user registrations, cataloging audit bookmarks, routing chat prompts to Google's Singapore server node, and monitoring CPU loads across active computing sub-shards.
                </p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div className="glass-card p-4 rounded-2xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Total Users</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold font-mono text-purple-400">{analytics.totalUsers}</span>
                    <UsersIcon className="h-5 w-5 text-purple-400" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Live Database Records</span>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Total Bookings</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold font-mono text-cyan-400">{analytics.totalBookings}</span>
                    <Calendar className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Strategy Audit Requests</span>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Pending Calls</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold font-mono text-amber-400">{analytics.pendingCalls}</span>
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Awaiting Consultation</span>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Completed Calls</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold font-mono text-green-400">{analytics.completedCalls}</span>
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Fully Audited Operations</span>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 bg-slate-950/40 flex flex-col justify-between">
                  <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Est. Revenue Value</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold font-mono text-pink-400">$42,500</span>
                    <Coins className="h-5 w-5 text-pink-400" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Placeholder Calculation</span>
                </div>

              </div>

              {/* Hardware Fleet Workload Telemetry Simulator */}
              <AdminDashboard />

            </div>
          )}

          {/* TAB 2: REGISTERED USERS PAGE */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/50 p-5 rounded-xl border border-white/5">
                <div>
                  <h3 className="font-display font-bold text-white text-base">Registered Corporate Clients Node Directory</h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Purge inactive client files, modify metadata parameters, or audit security clearance roles.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name, company..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30 overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <p className="text-center py-12 text-slate-500 font-mono text-xs">No client nodes found matching search parameters.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-500 uppercase font-bold text-[10px]">
                          <th className="py-3 px-4">Operator Name</th>
                          <th className="py-3 px-4">Clearance Role</th>
                          <th className="py-3 px-4">Corporate Company</th>
                          <th className="py-3 px-4">Secure Mail Address</th>
                          <th className="py-3 px-4">Handshake Index</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-4 px-4 font-bold text-white flex items-center gap-2.5">
                              <img src={u.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"} className="h-6 w-6 rounded-full border border-white/10" alt="avatar" />
                              {u.fullName}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded border text-[9px] font-bold ${
                                u.role === "admin" 
                                  ? "bg-purple-400/10 border-purple-400/30 text-purple-400" 
                                  : "bg-cyan-400/10 border-cyan-400/30 text-cyan-300"
                              }`}>
                                {u.role.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-300 font-semibold">{u.company || "General Client"}</td>
                            <td className="py-4 px-4 text-slate-400 font-normal">{u.email}</td>
                            <td className="py-4 px-4 text-slate-500 font-mono">{u.id}</td>
                            <td className="py-4 px-4 text-right">
                              {u.email !== "admin@stellar.ai" && (
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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

          {/* TAB 3: BOOK CALL PAGE */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/50 p-5 rounded-xl border border-white/5">
                <div>
                  <h3 className="font-display font-bold text-white text-base">Corporate Booking Strategy calls</h3>
                  <p className="text-xs text-slate-400 font-light mt-0.5">Assign consultants, alter audit progress status parameters, or purge booking ledgers.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="Search client, email..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30 overflow-hidden">
                {filteredBookings.length === 0 ? (
                  <p className="text-center py-12 text-slate-500 font-mono text-xs">No strategy call bookings found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-500 uppercase font-bold text-[10px]">
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Company</th>
                          <th className="py-3 px-4">Corporate Email</th>
                          <th className="py-3 px-4">Target Bottleneck</th>
                          <th className="py-3 px-4">Assign Consultant</th>
                          <th className="py-3 px-4 text-center">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-white/[0.01] transition-colors">
                            <td className="py-4 px-4 font-bold text-white">{b.fullName}</td>
                            <td className="py-4 px-4 text-slate-300 font-semibold">{b.company}</td>
                            <td className="py-4 px-4 text-slate-400 font-normal">{b.email}</td>
                            <td className="py-4 px-4 text-slate-400 truncate max-w-[150px]">
                              {b.bottleneck === "manual" ? "Repetitive manual tasks" :
                               b.bottleneck === "support" ? "Slow support / latency" :
                               b.bottleneck === "sales" ? "Missed conversions / sales" :
                               b.bottleneck === "data" ? "Fragmented reports / data" :
                               b.bottleneck || "General Ops"}
                            </td>
                            <td className="py-4 px-4 text-pink-400 font-semibold">
                              <span className="flex items-center gap-1.5">
                                <UserCheck className="h-3.5 w-3.5 text-pink-400" />
                                {b.consultant || "Unassigned Operator"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-bold ${
                                b.status === "Pending" ? "bg-amber-400/10 border-amber-400/30 text-amber-400" :
                                b.status === "Contacted" ? "bg-cyan-400/10 border-cyan-400/30 text-cyan-400" :
                                b.status === "Meeting Scheduled" ? "bg-purple-400/10 border-purple-400/30 text-purple-400" :
                                b.status === "Completed" ? "bg-green-400/10 border-green-400/30 text-green-400" :
                                "bg-red-400/10 border-red-400/30 text-red-400"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setEditingBooking(b);
                                  setEditBookingStatus(b.status);
                                  setEditBookingConsultant(b.consultant || "");
                                }}
                                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-cyan-400 transition-all cursor-pointer"
                              >
                                Edit / Dispatch
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer animate-none"
                              >
                                Delete
                              </button>
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

          {/* TAB 4: ANALYTICS CHARTS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                
                {/* Chart 1: Monthly Bookings velocity */}
                <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30">
                  <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest">METRIC_STREAM_01</span>
                  <h4 className="font-display font-bold text-white text-sm mb-4">Monthly Bookings Volume</h4>
                  
                  {/* CSS-styled bar chart */}
                  <div className="h-44 flex items-end gap-3.5 pt-6 font-mono text-[10px] text-slate-400">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-cyan-400/20 border border-cyan-400/40 rounded-t-lg h-16 relative group">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-cyan-400 font-bold hidden group-hover:block">12</span>
                      </div>
                      <span>APR</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-cyan-400/20 border border-cyan-400/40 rounded-t-lg h-24 relative group">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-cyan-400 font-bold hidden group-hover:block">18</span>
                      </div>
                      <span>MAY</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-cyan-400/20 border border-cyan-400/40 rounded-t-lg h-36 relative group">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-cyan-400 font-bold hidden group-hover:block">28</span>
                      </div>
                      <span>JUN</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-t-lg h-40 relative group">
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-cyan-400 font-bold">{dbBookings.length}</span>
                      </div>
                      <span className="text-cyan-300 font-semibold">JUL [LIVE]</span>
                    </div>
                  </div>
                </div>

                {/* Chart 2: Client Node Registrations velocity */}
                <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30">
                  <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest">METRIC_STREAM_02</span>
                  <h4 className="font-display font-bold text-white text-sm mb-4">Users Node Registration Velocity</h4>
                  
                  {/* CSS-styled line/point chart */}
                  <div className="h-44 flex items-end gap-3.5 pt-6 font-mono text-[10px] text-slate-400">
                    <div className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                      <div className="w-2 h-2 rounded-full bg-purple-500 shadow mb-10" />
                      <span>APR</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                      <div className="w-2 h-2 rounded-full bg-purple-500 shadow mb-16" />
                      <span>MAY</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                      <div className="w-2 h-2 rounded-full bg-purple-500 shadow mb-24" />
                      <span>JUN</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 shadow-xl border border-white mb-36 animate-bounce" />
                      <span className="text-purple-300 font-semibold">JUL [LIVE]</span>
                    </div>
                  </div>
                </div>

                {/* Chart 3: Top Diagnosed Bottlenecks */}
                <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30">
                  <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest">METRIC_STREAM_03</span>
                  <h4 className="font-display font-bold text-white text-sm mb-4">Operational Bottleneck Distribution</h4>
                  
                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Repetitive manual tasks</span>
                        <span className="font-bold text-white">45%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full" style={{ width: "45%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Slow customer support / Lead latency</span>
                        <span className="font-bold text-white">25%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div className="bg-purple-400 h-full" style={{ width: "25%" }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1 text-slate-400">
                        <span>Missed conversions / Fragmented reporting</span>
                        <span className="font-bold text-white">30%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                        <div className="bg-indigo-400 h-full" style={{ width: "30%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart 4: Lead audit Conversion rates */}
                <div className="glass-card rounded-2xl border border-white/10 p-5 bg-slate-950/30">
                  <span className="block font-mono text-[9px] text-slate-500 uppercase tracking-widest">METRIC_STREAM_04</span>
                  <h4 className="font-display font-bold text-white text-sm mb-4">Conversion & Closure Ratio</h4>
                  
                  <div className="h-44 flex flex-col justify-center items-center font-mono">
                    <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-cyan-400 flex items-center justify-center relative animate-none">
                      <span className="text-lg font-bold text-white">91.4%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-3 uppercase">Average Satisfaction Ratio</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: OPERATOR MESSAGES CHAT CONTROL */}
          {activeTab === "messages" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[72vh] h-auto lg:h-[72vh]">
              {/* Left sidebar threads */}
              <div className="glass-card rounded-2xl border border-white/10 p-4 sm:p-5 bg-slate-950/30 overflow-y-auto max-h-52 lg:max-h-none h-auto lg:h-[72vh] shrink-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
                    <Mail className="h-4 w-4 text-purple-400" />
                    <span className="font-display font-bold text-white text-xs">Operator Channels</span>
                  </div>

                  <div className="space-y-2">
                    {dbUsers.filter(u => u.role !== "admin").length === 0 ? (
                      <p className="text-slate-500 text-center py-6 font-mono text-[10px]">No client operator nodes found.</p>
                    ) : (
                      dbUsers.filter(u => u.role !== "admin").map(u => {
                        const userMsgs = supportMessages.filter(m => m.userId === (u.id || u._id));
                        const lastMsg = userMsgs[userMsgs.length - 1];
                        const isSelected = selectedUserThread === (u.id || u._id);
                        
                        return (
                          <button
                            key={u.id || u._id}
                            onClick={() => setSelectedUserThread(u.id || u._id)}
                            className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block ${
                              isSelected 
                                ? "bg-purple-950/20 border-purple-500/40 text-purple-200" 
                                : "border-white/5 bg-slate-900/10 hover:bg-white/5 text-slate-400"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-white block text-[11px] truncate">{u.fullName}</span>
                              {userMsgs.length > 0 && (
                                <span className="text-[8px] font-mono bg-purple-500/20 px-1.5 py-0.2 rounded text-purple-300">
                                  {userMsgs.length} TRANS
                                </span>
                              )}
                            </div>
                            <span className="block text-[9px] text-slate-500 font-mono truncate">{u.company || "Independent Node"}</span>
                            {lastMsg && (
                              <p className="text-[10px] text-slate-400 truncate mt-1.5 font-sans">
                                "{lastMsg.content}"
                              </p>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Right messages thread display */}
              <div className="lg:col-span-2 glass-card rounded-2xl border border-white/10 p-4 sm:p-6 bg-slate-950/30 flex flex-col justify-between h-[60vh] lg:h-[72vh]">
                {selectedUserThread ? (
                  <>
                    <div className="flex flex-col flex-1 min-h-0">
                      {/* Active header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-white/5 pb-3 mb-4 shrink-0">
                        <div>
                          <span className="block text-[10px] font-mono text-purple-400 font-bold uppercase">Active Channel ID</span>
                          <h4 className="font-display font-bold text-white text-sm">
                            {dbUsers.find(u => (u.id || u._id) === selectedUserThread)?.fullName || "Unknown Node Operator"}
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 uppercase">Secure Administration Tunneled</span>
                      </div>

                      {/* Chat log scrollable container */}
                      <div className="space-y-3 font-mono text-xs overflow-y-auto flex-1 pr-2">
                        {supportMessages.filter(m => m.userId === selectedUserThread).length === 0 ? (
                          <div className="py-12 text-center text-slate-500">
                            <Mail className="h-8 w-8 text-slate-700 mx-auto mb-3 animate-pulse" />
                            No transmissions received on this node yet. Send a direct greeting below.
                          </div>
                        ) : (
                          supportMessages
                            .filter(m => m.userId === selectedUserThread)
                            .map((msg, idx) => (
                              <div 
                                key={msg.id || idx} 
                                className={`p-3.5 rounded-xl border max-w-lg ${
                                  msg.senderRole === "admin" 
                                    ? "bg-purple-950/10 border-purple-500/20 ml-auto" 
                                    : "bg-slate-900/60 border-white/5 mr-auto"
                                }`}
                              >
                                <div className="flex justify-between gap-6 mb-1 text-[9px] text-slate-500">
                                  <span className={msg.senderRole === "admin" ? "text-purple-400 font-bold" : "text-cyan-400 font-bold"}>
                                    {msg.senderRole === "admin" ? "ROOT_ADMIN_REPLY" : "INBOUND_OPERATOR"}
                                  </span>
                                  <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "Just now"}</span>
                                </div>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* Quick send footer */}
                    <form onSubmit={handleSendReply} className="border-t border-white/5 pt-4 mt-4 flex gap-2 shrink-0">
                      <input
                        type="text"
                        required
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="Type direct response transmission to this corporate node..."
                        className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-purple-400 outline-none font-mono"
                      />
                      <button
                        type="submit"
                        disabled={sendingReply || !adminReplyText.trim()}
                        className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] duration-300 text-xs font-mono font-medium text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-40 shrink-0"
                      >
                        {sendingReply ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                        Transmit Reply
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 font-mono">
                    <Mail className="h-10 w-10 text-slate-700 mb-3 animate-pulse" />
                    <p className="font-bold text-slate-400 mb-1 text-xs">No Node Channel Selected</p>
                    <p className="text-[10px] text-slate-600 max-w-xs text-center">Select an active corporate operator channel from the list on the left to verify signals and respond.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM AI LOGS */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="glass-card rounded-2xl border border-white/10 p-6 bg-slate-950/30 max-w-4xl">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                  <Database className="h-5 w-5 text-purple-400 animate-pulse" />
                  <h4 className="font-display font-bold text-white text-base">Continuous API Handshake logs</h4>
                </div>

                <div className="space-y-3 font-mono text-xs max-h-[400px] overflow-y-auto">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3">
                      <span className="bg-white/5 px-2 py-0.5 rounded font-bold text-cyan-400">[{log.source}]</span>
                      <div className="flex-1">
                        <p className="text-slate-300 leading-relaxed">{log.message}</p>
                        <span className="block text-[9px] text-slate-500 mt-1">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl font-mono text-xs">
              <div className="glass-card rounded-2xl border border-white/10 p-6 bg-slate-950/30">
                <h4 className="font-display font-bold text-white text-base border-b border-white/5 pb-3 mb-4">
                  Global Firewall & Security override config
                </h4>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Strict API Encryption handshakes</span>
                      <span className="text-[10px] text-slate-500">Require perfect forward secrecy on client endpoints</span>
                    </div>
                    <span className="px-2 py-0.5 border border-green-500/20 bg-green-500/10 text-green-400 rounded text-[10px] font-bold">ENABLED</span>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Anonymous Strategy Call submissions</span>
                      <span className="text-[10px] text-slate-500">Allow bookings without active operator login ID</span>
                    </div>
                    <span className="px-2 py-0.5 border border-green-500/20 bg-green-500/10 text-green-400 rounded text-[10px] font-bold">ALLOWED</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

      {/* POPUP MODAL: UPDATE / DISPATCH STRATEGY CALL */}
      <AnimatePresence>
        {editingBooking && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm font-mono text-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md w-full glass-card p-6 rounded-2xl border border-white/10 bg-slate-950 text-left space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="font-bold text-purple-300">DISPATCH BOOKING // {editingBooking.id}</span>
                <button onClick={() => setEditingBooking(null)} className="p-1 rounded bg-white/5 text-slate-400 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
              </div>

              <form onSubmit={handleUpdateBooking} className="space-y-4">
                <div>
                  <span className="text-slate-500 block uppercase mb-1">Contact / Company</span>
                  <span className="text-white text-sm font-bold block">{editingBooking.fullName} from {editingBooking.company}</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase">Assign Technical Consultant</label>
                  <input
                    type="text"
                    required
                    value={editBookingConsultant}
                    onChange={(e) => setEditBookingConsultant(e.target.value)}
                    placeholder="Enter operator name..."
                    className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-900 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1.5 font-bold uppercase">Progress Pipeline Status</label>
                  <select
                    value={editBookingStatus}
                    onChange={(e) => setEditBookingStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass-input border border-white/10 bg-slate-900 text-slate-300"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Meeting Scheduled">Meeting Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-white/10 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold cursor-pointer"
                  >
                    COMMIT DISPATCH UPDATE
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
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
