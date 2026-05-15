"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  Briefcase, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Transactions", icon: Receipt, href: "/transactions" },
  { label: "Projects", icon: Briefcase, href: "/projects" },
  { label: "Clients", icon: Users, href: "/clients" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Telegram Bot", icon: MessageSquare, href: "/telegram-bot" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header - Slimmer */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-xl border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-black tracking-tighter text-lg italic">CashFlow</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Sidebar - Same High-end Look */}
      <aside className="hidden lg:flex flex-col w-72 h-screen bg-card border-r sticky top-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-black tracking-tighter text-2xl">CashFlow</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Fullscreen Menu - Cleaner & Animated */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="lg:hidden fixed inset-0 bg-background/95 backdrop-blur-2xl z-[100] flex flex-col p-6 pt-20"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-3 bg-secondary rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-5 px-6 py-4 rounded-2xl font-black text-lg transition-all",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" 
                        : "text-muted-foreground active:bg-secondary"
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Dock - More Compact & Centered */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] h-14 bg-card/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-full z-50 flex items-center justify-around px-2">
        {menuItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "p-2.5 rounded-full transition-all duration-300",
                isActive ? "bg-primary text-primary-foreground shadow-lg scale-110" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
            </Link>
          );
        })}
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2.5 text-muted-foreground"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </>
  );
}
