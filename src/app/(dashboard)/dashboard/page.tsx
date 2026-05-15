"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  MoreVertical,
  Search,
  Trash2,
  X,
  Loader2,
  Briefcase,
  Users,
  Target,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTx, setNewTx] = useState({
    amount: "",
    type: "EXPENSE",
    description: "",
    category: "Other"
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    startTime: ""
  });

  const fetchData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const d = await res.json();
      setData(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/dashboard?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      alert("Failed to delete");
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(newTx.amount),
          type: newTx.type,
          description: newTx.description,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setNewTx({ amount: "", type: "EXPENSE", description: "", category: "Other" });
        fetchData();
      }
    } catch (e) {
      alert("Failed to add transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          startTime: newTask.startTime || new Date().toISOString(),
        }),
      });
      if (res.ok) {
        setShowTaskModal(false);
        setNewTask({ title: "", startTime: "" });
        fetchData();
      }
    } catch (e) {
      alert("Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/schedule?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (e) {
      alert("Failed to delete task");
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  const currency = data?.user?.currency || "EGP";
  const stats = data?.stats || { balance: 0, income: 0, expenses: 0, profit: 0, salary: 0 };

  const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6"];
  const pieData = [
    { name: "Income", value: stats.income },
    { name: "Expenses", value: stats.expenses },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Dynamic Welcome Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Overview
          </h1>
          <p className="text-muted-foreground mt-1">Hello, Ahmed! Here's your real-time financial pulse.</p>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-secondary/50 backdrop-blur-md text-foreground rounded-2xl font-bold border hover:bg-secondary transition-all">
            <Calendar className="w-4 h-4 text-primary" />
            May 2024
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
          <button 
            onClick={() => setShowTaskModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-2xl font-bold border hover:bg-secondary/80 transition-all active:scale-95"
          >
            <Calendar className="w-5 h-5 text-primary" />
            Add Task
          </button>
        </div>
      </header>

      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Balance", value: stats.balance, icon: Wallet, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+2.5%" },
          { label: "Monthly Income", value: stats.income, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+12%" },
          { label: "Monthly Expenses", value: stats.expenses, icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10", trend: "-4%" },
          { label: "Base Salary", value: stats.salary, icon: Target, color: "text-amber-500", bg: "bg-amber-500/10", trend: "Fixed" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-card border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all relative overflow-hidden group"
          >
            <div className={cn(stat.bg, "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500")}>
              <stat.icon className={cn(stat.color, "w-7 h-7")} />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-black mt-2">
                  {stat.value.toLocaleString()} <span className="text-sm font-medium text-muted-foreground ml-1">{currency}</span>
                </h3>
              </div>
              <div className={cn("text-[10px] font-black px-2 py-1 rounded-full", stat.trend.includes('-') ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500")}>
                {stat.trend}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics Chart */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-card border shadow-sm space-y-8 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h3 className="text-2xl font-black">Cashflow Analytics</h3>
              <p className="text-sm text-muted-foreground">Monthly performance tracking</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-xs font-bold">Income</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-500/5 rounded-full border border-rose-500/10">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-xs font-bold">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.chartData || []}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12, fontWeight: 'bold'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(v) => `${v/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px'}}
                  itemStyle={{fontWeight: '900'}}
                />
                <Area type="monotone" dataKey="income" stroke="var(--primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={4} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Distribution & Recent Section */}
        <div className="space-y-8">
          {/* Distribution Pie */}
          <div className="p-8 rounded-[2.5rem] bg-card border shadow-sm space-y-6">
            <h3 className="text-xl font-black">Distribution</h3>
            <div className="h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Savings</p>
                <p className="text-xl font-black">{Math.round((stats.balance / (stats.income || 1)) * 100)}%</p>
              </div>
            </div>
          </div>

          {/* Daily Schedule Section */}
          <div className="p-8 rounded-[2.5rem] bg-card border shadow-sm flex flex-col max-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-black">Daily Schedule</h3>
              </div>
              <button onClick={() => setShowTaskModal(true)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar">
              {data?.schedules?.length > 0 ? (
                data.schedules.map((item: any) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-secondary/20 border border-transparent hover:border-primary/20 transition-all group relative">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-bold text-sm leading-tight">{item.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold">
                          <Loader2 className="w-3 h-3" />
                          {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <button onClick={() => handleDeleteTask(item.id)} className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground">No tasks for today.<br/>Tell the bot to add one!</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Section */}
          <div className="p-8 rounded-[2.5rem] bg-card border shadow-sm flex flex-col max-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black">Quick View</h3>
              <button className="p-2 hover:bg-secondary rounded-xl transition-colors"><MoreVertical className="w-5 h-5" /></button>
            </div>
            <div className="space-y-5 overflow-y-auto pr-2 no-scrollbar">
              {data?.transactions?.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      tx.type === "INCOME" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {tx.type === "INCOME" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-black text-sm truncate max-w-[120px]">{tx.description || "Untitled"}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">{new Date(tx.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={cn("font-black", tx.type === "INCOME" ? "text-emerald-500" : "text-rose-500")}>
                        {tx.type === "INCOME" ? "+" : "-"}{tx.amount.toLocaleString()}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(tx.id)} className="p-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal - Premium Look */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-background/40 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative w-full max-w-xl bg-card border border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black">New Transaction</h3>
                    <p className="text-muted-foreground">Keep your cashflow updated.</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-3 bg-secondary rounded-2xl hover:scale-110 transition-transform"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleAddTransaction} className="space-y-8">
                  <div className="grid grid-cols-2 bg-secondary/50 p-2 rounded-[2rem] gap-2">
                    <button type="button" onClick={() => setNewTx({...newTx, type: 'EXPENSE'})} className={cn("py-4 rounded-[1.5rem] font-black transition-all", newTx.type === 'EXPENSE' ? "bg-rose-500 text-white shadow-xl shadow-rose-500/20" : "text-muted-foreground")}>Expense</button>
                    <button type="button" onClick={() => setNewTx({...newTx, type: 'INCOME'})} className={cn("py-4 rounded-[1.5rem] font-black transition-all", newTx.type === 'INCOME' ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20" : "text-muted-foreground")}>Income</button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Amount ({currency})</label>
                    <input type="number" required className="w-full px-8 py-6 bg-secondary/30 border rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 text-4xl font-black placeholder:text-muted-foreground/30" placeholder="0.00" value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Description</label>
                    <input type="text" required className="w-full px-8 py-5 bg-secondary/30 border rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 font-bold" placeholder="What is this for?" value={newTx.description} onChange={e => setNewTx({...newTx, description: e.target.value})} />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl hover:scale-[1.02] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Save Transaction <ChevronRight className="w-6 h-6" /></>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskModal(false)} className="absolute inset-0 bg-background/40 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 40 }} className="relative w-full max-w-xl bg-card border border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black">New Task</h3>
                    <p className="text-muted-foreground">What's on your agenda?</p>
                  </div>
                  <button onClick={() => setShowTaskModal(false)} className="p-3 bg-secondary rounded-2xl hover:scale-110 transition-transform"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleAddTask} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Task Title</label>
                    <input type="text" required className="w-full px-8 py-6 bg-secondary/30 border rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 text-2xl font-black placeholder:text-muted-foreground/30" placeholder="e.g. Meeting with client" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Date & Time (Optional)</label>
                    <input type="datetime-local" className="w-full px-8 py-5 bg-secondary/30 border rounded-3xl outline-none focus:ring-4 focus:ring-primary/10 font-bold" value={newTask.startTime} onChange={e => setNewTask({...newTask, startTime: e.target.value})} />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="w-full py-6 bg-primary text-primary-foreground rounded-[2rem] font-black text-xl hover:scale-[1.02] shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Schedule Task <ChevronRight className="w-6 h-6" /></>}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
