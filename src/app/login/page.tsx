"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Wallet, Github, Chrome, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (searchParams.get("registered")) {
      setSuccess("Account created successfully! Please login.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/20">
          <Wallet className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">CashFlow OS</h1>
        <p className="text-muted-foreground text-lg">Your financial command center.</p>
      </div>

      <div className="bg-card/50 backdrop-blur-xl border rounded-[2rem] p-8 shadow-2xl space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Sign in to manage your cash flow.</p>
        </div>

        {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20">{error}</div>}
        {success && <div className="p-3 bg-emerald-500/10 text-emerald-500 text-sm rounded-xl border border-emerald-500/20">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                required
                type="email"
                placeholder="Email address"
                className="w-full bg-background border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
              <input
                required
                type="password"
                placeholder="Password"
                className="w-full bg-background border rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => signIn("google")}
            className="py-3 bg-background border hover:bg-secondary transition-all rounded-2xl flex items-center justify-center gap-2 font-semibold"
          >
            <Chrome className="w-5 h-5" />
            Google
          </button>
          <button 
            onClick={() => signIn("github")}
            className="py-3 bg-background border hover:bg-secondary transition-all rounded-2xl flex items-center justify-center gap-2 font-semibold"
          >
            <Github className="w-5 h-5" />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"
        />
      </div>

      <Suspense fallback={<Loader2 className="w-10 h-10 animate-spin text-primary" />}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
