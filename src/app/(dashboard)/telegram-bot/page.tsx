"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Bot, 
  Zap, 
  ShieldCheck, 
  Bell, 
  Loader2,
  RefreshCw,
  Power,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TelegramBotPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [botStatus] = useState("Online");
  const [botName, setBotName] = useState("CashFlow AI");
  const [savedNote, setSavedNote] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/bot-settings");
        const data = await res.json();
        if (data.bot_name) setBotName(data.bot_name);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/bot-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botName }),
      });
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 3000);
    } catch (e) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 pb-24 lg:pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight italic">Bot Control Center</h1>
          <p className="text-muted-foreground mt-1">Configure your AI Financial Assistant.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase">{botStatus}</span>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {savedNote ? <CheckCircle2 className="w-4 h-4" /> : "Save Configuration"}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {savedNote && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-emerald-500 text-white p-4 rounded-2xl font-bold text-center shadow-lg">
            ✨ Your AI assistant has been renamed to "{botName}"!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-[3rem] bg-card border shadow-sm space-y-8">
            <h3 className="text-xl font-black flex items-center gap-3">
              <Bot className="w-6 h-6 text-primary" /> General Identity
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Bot Display Name</label>
                <input 
                  type="text" 
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  className="w-full px-8 py-5 bg-secondary/30 border rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 font-bold text-xl" 
                />
              </div>
              <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-black text-sm text-primary">AI Smart Responses</p>
                    <p className="text-xs text-muted-foreground">Uses Gemini to understand your voice messages.</p>
                  </div>
                </div>
                <div className="w-14 h-8 bg-primary rounded-full p-1 cursor-pointer">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-[2.5rem] bg-card border shadow-sm space-y-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-black">Security Mode</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Require verification for high-value transactions reported via bot.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-card border shadow-sm space-y-4">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center">
                <Bell className="w-6 h-6" />
              </div>
              <h4 className="font-black">Push Notifications</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">Send daily summaries and low balance alerts to your Telegram.</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-card border shadow-sm text-center space-y-6">
            <div className="w-20 h-20 bg-secondary rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <div>
              <p className="font-black text-xl">Telegram Integration</p>
              <p className="text-sm text-muted-foreground mt-1">Connect your bot to start tracking expenses.</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-2xl text-xs font-mono break-all text-muted-foreground">
              @CashFlowAssist_Bot
            </div>
            <button className="w-full py-4 bg-foreground text-background rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
              <RefreshCw className="w-4 h-4" /> Restart Bot Service
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-rose-500 text-white shadow-xl shadow-rose-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <Power className="w-6 h-6" />
              <p className="font-black text-lg">Emergency Stop</p>
            </div>
            <p className="text-xs opacity-80">Instantly disable all bot interactions in case of security threat.</p>
            <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold transition-all">Deactivate Bot</button>
          </div>
        </div>
      </div>
    </div>
  );
}
