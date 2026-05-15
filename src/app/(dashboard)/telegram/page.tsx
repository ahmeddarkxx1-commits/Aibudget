"use client";

import { motion } from "framer-motion";
import { Send, Bot, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

export default function TelegramPage() {
  const [copied, setCopied] = useState(false);
  const botUsername = "YourBotUsername"; // Replace with real username if known
  const webhookUrl = "https://your-domain.com/api/telegram/webhook";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Telegram Integration</h1>
        <p className="text-muted-foreground">Connect your bot to track finances via chat.</p>
      </div>

      <div className="grid gap-8">
        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
        >
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Bot Status</h2>
              <div className="flex items-center gap-2 text-green-500 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Webhook Active
              </div>
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-secondary/50 rounded-2xl border flex items-center justify-between">
              <code className="text-sm">{webhookUrl}</code>
              <button 
                onClick={() => copyToClipboard(webhookUrl)}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-secondary/30 rounded-[2rem] p-8 border">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Send className="w-5 h-5" />
              How to use
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">1</span>
                <span>Open your bot on Telegram and type <strong>/start</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">2</span>
                <span>Send a transaction like: <strong>"Paid 50 for lunch"</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">3</span>
                <span>The AI will parse it and add it to your dashboard!</span>
              </li>
            </ul>
          </div>

          <div className="bg-primary text-primary-foreground rounded-[2rem] p-8 shadow-2xl shadow-primary/20 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Open Bot</h3>
              <p className="text-primary-foreground/70 text-sm mb-6">Start managing your money instantly from your phone.</p>
            </div>
            <a 
              href={`https://t.me/${botUsername}`}
              target="_blank"
              className="w-full py-4 bg-white text-primary rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              Go to Telegram
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
