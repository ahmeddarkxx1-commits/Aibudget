"use client";

import { motion } from "framer-motion";
import {
  User,
  Wallet,
  MessageSquare,
  Bell,
  Shield,
  Moon,
  Sun,
  Globe,
  Loader2,
  Check,
  Save,
  DollarSign,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("General");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [telegramId, setTelegramId] = useState("");
  const [currency, setCurrency] = useState("EGP");
  const [salary, setSalary] = useState("0");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/settings/telegram")
      .then(r => r.json())
      .then(data => {
        setTelegramId(data.telegramId || "");
        setCurrency(data.currency || "EGP");
        setSalary(data.salary?.toString() || "0");
        setName(data.name || "");
        setEmail(data.email || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/settings/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramId, currency, name, salary: parseFloat(salary) }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 pb-20 md:pb-10">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account and app preferences.</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation - Mobile Friendly Scroll */}
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 no-scrollbar">
          {[
            { id: "General", icon: User },
            { id: "Financial", icon: Wallet },
            { id: "Telegram", icon: MessageSquare },
            { id: "Notifications", icon: Bell },
            { id: "Security", icon: Shield },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold transition-all",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-card border text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.id}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === "General" && (
            <section className="p-6 md:p-8 rounded-3xl bg-card border shadow-sm space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><User className="w-6 h-6 text-primary" /> General Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Display Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-secondary/30 border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Preferred Currency</label>
                  <select className="w-full px-4 py-3 bg-secondary/30 border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold" value={currency} onChange={e => setCurrency(e.target.value)}>
                    <option value="EGP">EGP (E£)</option>
                    <option value="USD">USD ($)</option>
                    <option value="SAR">SAR (﷼)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Financial" && (
            <section className="p-6 md:p-8 rounded-3xl bg-card border shadow-sm space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><DollarSign className="w-6 h-6 text-emerald-500" /> Financial Settings</h3>
              <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Basic Monthly Salary ({currency})</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-4 bg-background border rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-2xl font-bold text-emerald-600"
                    value={salary} 
                    onChange={e => setSalary(e.target.value)} 
                  />
                  <p className="text-xs text-muted-foreground">هذا هو المبلغ الذي سيتم اعتباره دخلاً أساسياً لك كل شهر.</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "Telegram" && (
            <section className="p-6 md:p-8 rounded-3xl bg-card border shadow-sm space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><MessageSquare className="w-6 h-6 text-blue-500" /> Bot Controls</h3>
              <div className="space-y-4">
                <div className="p-5 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                  <label className="text-sm font-bold mb-2 block">Telegram Account ID</label>
                  <input type="text" className="w-full px-4 py-3 bg-background border rounded-xl font-mono text-lg" value={telegramId} onChange={e => setTelegramId(e.target.value)} placeholder="Enter ID from /start" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-secondary/20 rounded-2xl space-y-2">
                    <p className="font-bold text-sm">Bot Name</p>
                    <p className="text-xs text-muted-foreground">CashFlow Assistant v1.0</p>
                  </div>
                  <div className="p-4 bg-secondary/20 rounded-2xl space-y-2">
                    <p className="font-bold text-sm">AI Engine</p>
                    <p className="text-xs text-emerald-500 font-bold">Google Gemini (Active)</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {(activeTab === "Notifications" || activeTab === "Security") && (
            <section className="p-12 text-center rounded-3xl bg-card border border-dashed space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                {activeTab === "Notifications" ? <Bell className="w-8 h-8 text-muted-foreground" /> : <Shield className="w-8 h-8 text-muted-foreground" />}
              </div>
              <h3 className="text-xl font-bold">Coming Soon</h3>
              <p className="text-muted-foreground max-w-xs mx-auto">We're working on making {activeTab} more powerful. Stay tuned!</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
