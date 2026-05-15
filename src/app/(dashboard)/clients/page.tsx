"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MoreVertical,
  Trash2,
  Loader2,
  X,
  User
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const d = await res.json();
      setClients(Array.isArray(d) ? d : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchClients(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      setShowModal(false);
      setNewClient({ name: "", email: "", phone: "" });
      fetchClients();
    } catch (e) { alert("Failed to add"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete client?")) return;
    await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
    fetchClients();
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your relationships and contact details.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" /> New Client
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="p-6 rounded-3xl bg-card border shadow-sm group relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold truncate">{client.name}</h3>
                <p className="text-xs text-muted-foreground">Client Since {new Date(client.createdAt).getFullYear()}</p>
              </div>
              <button onClick={() => handleDelete(client.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" /> <span className="truncate">{client.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" /> <span>{client.phone || "No phone"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border p-8 rounded-3xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Add New Client</h3>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" placeholder="Name" className="w-full px-4 py-3 bg-secondary/50 border rounded-xl outline-none" value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} required />
              <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-secondary/50 border rounded-xl outline-none" value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} />
              <input type="text" placeholder="Phone" className="w-full px-4 py-3 bg-secondary/50 border rounded-xl outline-none" value={newClient.phone} onChange={e => setNewClient({...newClient, phone: e.target.value})} />
              <button type="submit" className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold">Save Client</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
