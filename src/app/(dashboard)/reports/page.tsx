"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieChartIcon,
  ArrowRight,
  Loader2,
  Calendar
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(d => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const handleExportPDF = () => {
    window.print(); // يستخدم متصفح الـ PDF لطباعة الصفحة بشكل منسق
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  const stats = data?.stats || { income: 0, expenses: 0, profit: 0, balance: 0 };
  const currency = data?.user?.currency || "EGP";

  const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b"];
  const pieData = [
    { name: "Income", value: stats.income },
    { name: "Expenses", value: stats.expenses },
  ];

  return (
    <div className="space-y-8 pb-10 print:p-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">In-depth analysis of your cash flow and performance.</p>
        </div>
        <button 
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg"
        >
          <Download className="w-5 h-5" /> Export PDF
        </button>
      </header>

      {/* Report Header for PDF */}
      <div className="hidden print:block text-center mb-10 border-b pb-8">
        <h1 className="text-4xl font-extrabold mb-2">CashFlow OS - Financial Report</h1>
        <p className="text-muted-foreground">Generated on {new Date().toLocaleDateString()} for User: Ahmed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-2">
          <p className="text-sm font-bold text-muted-foreground">Income Performance</p>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-extrabold">{stats.income.toLocaleString()}</h3>
            <span className="text-sm text-emerald-500 font-bold flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-1" /> High
            </span>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{currency}</p>
        </div>
        <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-2">
          <p className="text-sm font-bold text-muted-foreground">Expense Ratio</p>
          <div className="flex items-center gap-2">
            <h3 className="text-3xl font-extrabold">{stats.expenses.toLocaleString()}</h3>
            <span className="text-sm text-rose-500 font-bold flex items-center bg-rose-500/10 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3 mr-1" /> Low
            </span>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{currency}</p>
        </div>
        <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-2">
          <p className="text-sm font-bold text-muted-foreground">Current Net Worth</p>
          <h3 className="text-3xl font-extrabold">{stats.balance.toLocaleString()}</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">{currency}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribution Chart */}
        <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><PieChartIcon className="w-6 h-6 text-primary" /> Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /> <span className="text-sm font-bold">Income</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /> <span className="text-sm font-bold">Expenses</span></div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-amber-500" /> Monthly Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.chartData || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="income" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Transaction Summary for Report */}
      <div className="p-8 rounded-3xl bg-card border shadow-sm">
        <h3 className="text-xl font-bold mb-6">Detailed Summary</h3>
        <div className="space-y-4">
          {data?.transactions?.slice(0, 5).map((tx: any) => (
            <div key={tx.id} className="flex items-center justify-between py-3 border-b border-dashed last:border-0">
              <div>
                <p className="font-bold">{tx.description || "Untitled"}</p>
                <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString()}</p>
              </div>
              <p className={tx.type === "INCOME" ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                {tx.type === "INCOME" ? "+" : "-"}{tx.amount.toLocaleString()} {currency}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
