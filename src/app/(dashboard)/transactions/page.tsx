"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical, 
  Trash2, 
  Loader2,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("EGP");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const d = await res.json();
      setData(d);
      setCurrency(d.user?.currency || "EGP");
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete transaction?")) return;
    await fetch(`/api/dashboard?id=${id}`, { method: "DELETE" });
    fetchData();
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6 pb-24 lg:pb-10">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-4xl font-black tracking-tight">Transactions</h1>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search transactions..." className="w-full pl-12 pr-4 py-3 bg-card border rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-card border rounded-2xl font-bold hover:bg-secondary transition-all">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </header>

      {/* Responsive Table Container */}
      <div className="bg-card border rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b bg-secondary/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Type</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data?.transactions?.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-secondary/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      tx.type === "INCOME" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {tx.type === "INCOME" ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">
                    {tx.description || "No description"}
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-tighter">Other</span>
                  </td>
                  <td className={cn("px-6 py-4 font-black", tx.type === "INCOME" ? "text-emerald-500" : "text-rose-500")}>
                    {tx.type === "INCOME" ? "+" : "-"}{tx.amount.toLocaleString()} {currency}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(tx.id)} className="p-2 text-muted-foreground hover:text-rose-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile-Friendly Pagination */}
        <div className="p-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-muted-foreground">Showing {data?.transactions?.length || 0} entries</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded-xl hover:bg-secondary transition-all disabled:opacity-50"><ChevronLeft className="w-5 h-5" /></button>
            <div className="flex gap-1">
              <button className="w-10 h-10 bg-primary text-primary-foreground rounded-xl font-black">1</button>
            </div>
            <button className="p-2 border rounded-xl hover:bg-secondary transition-all disabled:opacity-50"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
