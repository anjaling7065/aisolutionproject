import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Sparkles, Bot, Key, Mail, User, Briefcase, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface RegisterPageProps {
  onNavigateToLogin: () => void;
  onSuccess: () => void;
}

export default function RegisterPage({ onNavigateToLogin, onSuccess }: RegisterPageProps) {
  const { register, error, clearError } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || isSubmitting) return;

    setIsSubmitting(true);
    clearError();

    const success = await register(fullName, email, password, company);
    setIsSubmitting(false);

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Visual background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative bg-slate-950/40 backdrop-blur-md"
      >
        <div>
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="h-8 w-8 text-cyan-300 animate-pulse" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-display font-extrabold text-white tracking-tight">
            Register Corporate Node
          </h2>
          <p className="mt-2 text-center text-xs font-mono text-slate-400">
            CONNECT TO THE STELLAR COGNITIVE NETWORK
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-mono text-center"
          >
            ◆ ERROR: {error}
          </motion.div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm border border-white/10 bg-slate-950/60 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="CloudTech Solutions"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm border border-white/10 bg-slate-950/60 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Corporate Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm border border-white/10 bg-slate-950/60 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">Secure Passkey</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm border border-white/10 bg-slate-950/60 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mt-2">
            <Bot className="h-3.5 w-3.5 text-indigo-400" />
            <span>Secure SSL socket handshake encryption ready</span>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-xs font-mono font-medium text-white bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:scale-[1.02] duration-300 hover:shadow-[0_4px_20px_rgba(99,102,241,0.25)] shadow-lg cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>COMPILING OPERATOR ACCESS...</span>
              ) : (
                <span className="flex items-center gap-2">
                  PROVISION NEW ACCESS ID <ArrowRight className="h-4 w-4 text-cyan-300" />
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-white/5">
          <p className="text-xs font-mono text-slate-400">
            Already registered?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors cursor-pointer"
            >
              Authenticate & Log In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
