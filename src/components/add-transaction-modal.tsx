"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddTransactionModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [scanLoading, setScanLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const res = await fetch("/api/ocr", {
          method: "POST",
          body: JSON.stringify({ image: base64 }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.amount) setAmount(data.amount);
        if (data.type) setType(data.type);
        if (data.category) setCategory(data.category);
        if (data.vendor) setDescription(data.vendor);
      };
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setScanLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-card border shadow-2xl rounded-[2.5rem] overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">New Transaction</h2>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Quick Scan */}
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleScan}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <button 
                disabled={scanLoading}
                className="w-full py-4 bg-primary/5 border border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-primary/10 transition-colors group"
              >
                {scanLoading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </div>
                )}
                <span className="text-sm font-semibold">{scanLoading ? "AI is analyzing..." : "Scan Invoice with AI"}</span>
                <span className="text-xs text-muted-foreground">Upload image to auto-fill data</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Amount</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 font-bold text-lg" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</label>
                <select 
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary/50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                  <option value="TRANSFER">Transfer</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</label>
              <input 
                type="text"
                placeholder="e.g. Food, Fuel..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description</label>
              <textarea 
                placeholder="What was this for?" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24" 
              />
            </div>

            <button className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
              Save Transaction
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
