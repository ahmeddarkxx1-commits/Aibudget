"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Loader2,
  X,
  Target,
  BarChart2,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [currency, setCurrency] = useState("EGP");
  const [newProj, setNewProj] = useState({ name: "", budget: "", spent: "0" });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const d = await res.json();
      setProjects(Array.isArray(d) ? d : []);
      
      const dashRes = await fetch("/api/dashboard");
      const dashData = await dashRes.json();
      setCurrency(dashData.user?.currency || "EGP");
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { 
        name: newProj.name, 
        budget: parseFloat(newProj.budget) || 0,
        spent: parseFloat(newProj.spent) || 0
      };

      if (editingProject) {
        await fetch(`/api/projects?id=${editingProject.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      
      setShowModal(false);
      setEditingProject(null);
      setNewProj({ name: "", budget: "", spent: "0" });
      fetchProjects();
    } catch (e) { alert("Failed to save"); }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setNewProj({
      name: project.name,
      budget: project.budget.toString(),
      spent: project.spent?.toString() || "0"
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete project?")) return;
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
    fetchProjects();
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 pb-24 lg:pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight italic">Projects Hub</h1>
          <p className="text-muted-foreground mt-1">Manage, update, and track your ventures.</p>
        </div>
        <button 
          onClick={() => { setEditingProject(null); setNewProj({ name: "", budget: "", spent: "0" }); setShowModal(true); }}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-2xl font-bold hover:scale-[1.02] shadow-xl shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" /> New Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => {
          const percentage = Math.min(Math.round(((project.spent || 0) / (project.budget || 1)) * 100), 100);
          return (
            <div key={project.id} className="p-8 rounded-[2.5rem] bg-card border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group relative overflow-hidden">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-secondary rounded-2xl group-hover:scale-110 transition-transform">
                  <BarChart2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(project)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-2xl font-black mb-1">{project.name}</h3>
              <p className="text-[10px] text-muted-foreground mb-6 font-bold uppercase tracking-widest italic">ID: #{project.id.slice(-4)}</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-black">
                  <span className="text-muted-foreground">Budget Utilization</span>
                  <span className={cn(percentage > 90 ? "text-rose-500" : "text-primary")}>{percentage}%</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    className={cn(
                      "h-full rounded-full transition-all duration-1000",
                      percentage > 90 ? "bg-rose-500" : "bg-primary"
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-dashed">
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase">Target</p>
                  <p className="text-lg font-black">{project.budget?.toLocaleString()} <span className="text-[10px] font-normal">{currency}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase">Spent</p>
                  <p className="text-lg font-black text-rose-500">{project.spent?.toLocaleString() || 0} <span className="text-[10px] font-normal">{currency}</span></p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-card border p-8 md:p-10 rounded-[3rem] shadow-2xl w-full max-w-md space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black">{editingProject ? "Update Project" : "New Project"}</h3>
                <button onClick={() => { setShowModal(false); setEditingProject(null); }} className="p-2 hover:bg-secondary rounded-xl transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Project Name</label>
                  <input type="text" className="w-full px-6 py-4 bg-secondary/30 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-bold" value={newProj.name} onChange={e => setNewProj({...newProj, name: e.target.value})} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Budget ({currency})</label>
                    <input type="number" className="w-full px-6 py-4 bg-secondary/30 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 font-black text-xl" value={newProj.budget} onChange={e => setNewProj({...newProj, budget: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-2">Spent ({currency})</label>
                    <input type="number" className="w-full px-6 py-4 bg-secondary/30 border border-rose-500/20 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 font-black text-xl text-rose-500" value={newProj.spent} onChange={e => setNewProj({...newProj, spent: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-primary text-primary-foreground rounded-[1.5rem] font-black text-lg hover:scale-[1.02] transition-all shadow-xl shadow-primary/20">
                  {editingProject ? "Update Details" : "Save Project"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
