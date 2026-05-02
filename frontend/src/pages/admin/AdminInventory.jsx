import { useState, useEffect } from "react";
import { Projector, Search, Download, Plus, Trash2, X, Info } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";

const statusStyles = {
  disponible: "bg-success/10 text-success",
  en_panne: "bg-destructive/10 text-destructive",
};

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDatashow, setNewDatashow] = useState({ numero: "", marque: "", modele: "", dateAchat: "" });
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/datashows');
      setInventory(response.data);
    } catch (error) {
      console.error("Failed to fetch datashows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDataShow = async () => {
    setModalError("");
    if (!newDatashow.numero || !newDatashow.marque || !newDatashow.modele || !newDatashow.dateAchat) {
      setModalError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/datashows', { ...newDatashow, etat: 'disponible' });
      setIsModalOpen(false);
      setNewDatashow({ numero: "", marque: "", modele: "", dateAchat: "" });
      fetchInventory();
      setConfirmModal({
        isOpen: true,
        title: "Success",
        message: "DataShow added successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add datashow:", error);
      setModalError("Failed to add DataShow. The number must be unique.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete DataShow",
      message: "Are you sure you want to delete this DataShow? This action cannot be undone.",
      type: "danger",
      onConfirm: () => performDelete(id),
    });
  };

  const performDelete = async (id) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await api.delete(`/datashows/${id}`);
      fetchInventory();
      setConfirmModal({
        isOpen: true,
        title: "Deleted",
        message: "DataShow has been deleted.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete datashow:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to delete DataShow.",
        type: "error",
      });
    }
  };

  const brands = [...new Set(inventory.map((item) => item.marque))];
  const disponibleCount = inventory.filter(i => i.etat === 'disponible').length;
  const enPanneCount = inventory.filter(i => i.etat === 'en_panne').length;

  const filtered = inventory.filter((item) => {
    const matchSearch =
      item.numero.toLowerCase().includes(search.toLowerCase()) ||
      item.marque.toLowerCase().includes(search.toLowerCase()) ||
      item.modele.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || item.etat === filterStatus;
    const matchBrand = filterBrand === "all" || item.marque === filterBrand;
    return matchSearch && matchStatus && matchBrand;
  });

  const exportCSV = () => {
    const header = "ID,Brand,Model,Status,Purchase Date\n";
    const rows = filtered
      .map((item) => `${item.numero},${item.marque},${item.modele},${item.etat},${new Date(item.dateAchat).toLocaleDateString()}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Projector className="w-8 h-8 text-primary" />
            DataShow Inventory
          </h1>
          <p className="text-muted-foreground mt-2">
            {inventory.length} total · <span className="text-success">{disponibleCount} available</span> · <span className="text-destructive">{enPanneCount} broken</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-3xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/70 transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add DataShow
          </button>
        </div>
      </div>

      {/* Status flow explanation */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">
          <strong className="text-foreground">Status lifecycle:</strong> New devices start as <strong className="text-success">disponible</strong>. When you create a <strong className="text-foreground">Repair</strong> in Maintenance, the status automatically switches to <strong className="text-destructive">en_panne</strong>. Once the repair is marked as done, it returns to <strong className="text-success">disponible</strong>. You don't need to change the status manually.
        </span>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID, brand, or model..." className="w-full rounded-3xl border border-border bg-background px-11 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="all">All Status</option>
            <option value="disponible">Disponible</option>
            <option value="en_panne">En Panne</option>
          </select>
          <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="all">All Brands</option>
            {brands.map((brand) => (<option key={brand} value={brand}>{brand}</option>))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Purchase Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">No datashows found.</td></tr>
            )}
            {filtered.map((item) => (
              <tr key={item._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-foreground">{item.numero}</td>
                <td className="px-4 py-4 text-foreground">{item.marque}</td>
                <td className="px-4 py-4 text-muted-foreground">{item.modele}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.etat]}`}>{item.etat}</span>
                </td>
                <td className="px-4 py-4 text-muted-foreground text-xs">{new Date(item.dateAchat).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => handleDelete(item._id)} className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-muted hover:bg-destructive/10 text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Add New DataShow</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {modalError && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{modalError}</div>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">ID / Number</label>
                <input type="text" placeholder="e.g. DS-001" value={newDatashow.numero} onChange={(e) => setNewDatashow({...newDatashow, numero: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Brand</label>
                <input type="text" placeholder="e.g. Epson" value={newDatashow.marque} onChange={(e) => setNewDatashow({...newDatashow, marque: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Model</label>
                <input type="text" placeholder="e.g. EB-X51" value={newDatashow.modele} onChange={(e) => setNewDatashow({...newDatashow, modele: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Purchase Date</label>
                <input type="date" value={newDatashow.dateAchat} onChange={(e) => setNewDatashow({...newDatashow, dateAchat: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleAddDataShow} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? "Adding..." : "Add DataShow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
