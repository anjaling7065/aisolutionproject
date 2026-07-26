import { useState } from "react";
import { Mail, ArrowLeft, Send, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export default function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative bg-slate-950/40 backdrop-blur-md"
      >
        <div>
          <button
            onClick={onNavigateToLogin}
            className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" /> BACK TO SECURE ENTRY
          </button>

          {!isSubmitted ? (
            <>
              <h2 className="text-3xl font-display font-extrabold text-white tracking-tight">
                Reset Secret Passkey
              </h2>
              <p className="mt-2 text-xs font-mono text-slate-400">
                ENTER SECURE EMAIL TO DESERIALIZE ACCESS KEY
              </p>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Corporate Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm border border-white/10 bg-slate-950/60 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl text-xs font-mono font-medium text-white bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:scale-[1.02] duration-300 hover:shadow-[0_4px_20px_rgba(6,182,212,0.25)] shadow-lg cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>DISPATCHING SECURITY BEACON...</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      SEND SECURE RESET LINK <Send className="h-4 w-4" />
                    </span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-full text-green-400">
                  <CheckCircle className="h-10 w-10" />
                </div>
              </div>
              <h3 className="text-xl font-display font-bold text-white">Reset Request Received</h3>
              <p className="text-xs text-slate-300 font-light leading-relaxed max-w-sm mx-auto">
                If <span className="font-mono text-cyan-300">{email}</span> matches a secure database node in our system, a passkey decryption packet has been dispatched with further operational steps.
              </p>
              <button
                onClick={onNavigateToLogin}
                className="mt-6 px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 text-xs font-mono text-white transition-all cursor-pointer"
              >
                Return to Login Node
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
