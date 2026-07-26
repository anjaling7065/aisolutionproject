import { useState, useEffect } from "react";
import { Hexagon, Sparkles, Menu, X, ArrowUpRight, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  onScrollToSection: (sectionId: string) => void;
  activeSection: string;
}

export default function Header({ onScrollToSection, activeSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "The Problem", id: "problem" },
    { label: "Our Solutions", id: "solutions" },
    { label: "Proven Results", id: "results" },
    { label: "Target Audience", id: "audience" },
    { label: "AI Console", id: "portals" },
    { label: "Interactive Core", id: "interactive-core" },
  ];

  const handleDashboardRedirect = () => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <header
      id="stellar-nav-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "border-b border-white/5 bg-cyber-dark/85 backdrop-blur-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div
            id="nav-logo"
            className="flex cursor-pointer items-center gap-3 group"
            onClick={() => onScrollToSection("hero")}
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-500 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              {/* Spinning high-tech hexagonal border */}
              <Hexagon className="absolute h-7 w-7 text-purple-400/80 animate-spin" style={{ animationDuration: "16s", animationTimingFunction: "linear" }} />
              {/* Steady core sparkle/star logo representing Stellar */}
              <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse relative z-10 transition-transform duration-500 group-hover:scale-110" />
              
              {/* Backglow element */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-extrabold tracking-wider leading-none bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                STELLAR<span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">.AI</span>
              </span>
              <span className="text-[8px] font-mono font-bold tracking-[0.22em] text-cyan-400/70 uppercase leading-none mt-1">
                SYSTEMS
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav-links" className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onScrollToSection(item.id)}
                className={`font-sans text-sm font-medium tracking-wide transition-all duration-200 hover:text-cyan-400 relative py-1 cursor-pointer ${
                  activeSection === item.id ? "text-cyan-400" : "text-slate-400"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400 shadow-[0_0_8px_#00ffff]" />
                )}
              </button>
            ))}
          </nav>

          {/* Call to action */}
          <div id="nav-cta-container" className="hidden md:flex items-center gap-4">
            <button
              onClick={handleDashboardRedirect}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-cyan-500/30 bg-cyan-500/5 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] flex items-center gap-1.5"
            >
              <UserCheck className="h-4 w-4" />
              {user ? "CLIENT PORTAL" : "CLIENT PORTAL LOGIN"}
            </button>
            <button
              onClick={() => onScrollToSection("strategy-call")}
              className="group relative flex items-center justify-center gap-1 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-cyan-500/20 hover:scale-[1.02] cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-1">
                Book a Call
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <span className="absolute inset-x-0 -bottom-1 h-3/4 bg-cyan-400/30 blur-md transition-opacity opacity-0 group-hover:opacity-100" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div id="mobile-menu-btn" className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden glass-card border-x-0 border-t border-white/5 bg-cyber-dark/95 backdrop-blur-lg animate-fade-in">
          <div className="space-y-1.5 px-4 pt-3 pb-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onScrollToSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left rounded-xl px-4 py-3 font-sans text-base font-medium tracking-wide transition-colors ${
                  activeSection === item.id
                    ? "bg-purple-600/10 text-cyan-400 border border-cyan-400/20"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <button
                onClick={() => {
                  handleDashboardRedirect();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center py-3 rounded-xl text-xs font-mono font-bold border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 cursor-pointer"
              >
                {user ? "Launch Console" : "Client Portal Login"}
              </button>
              <button
                onClick={() => {
                  onScrollToSection("strategy-call");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white cursor-pointer"
              >
                Book a Call
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
