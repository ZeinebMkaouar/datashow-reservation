import { useState, useEffect } from "react";
import { Projector, Search, Download, Plus, Trash2, X, Info } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import { useTranslation } from "react-i18next";

const statusStyles = {
  disponible: "bg-success/10 text-success",
  en_panne: "bg-destructive/10 text-destructive",
};

const AdminInventory = () => {
  const { t } = useTranslation();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDatashow, setNewDatashow] = useState({ numero: "", marque: "", modele: "", dateAchat: "" });
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: "", message: "", type: "info", onConfirm: null,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchInventory(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, filterStatus]);

  const fetchInventory = async () => {
    try {
      const statusParam = filterStatus === 'all' ? '' : `&etat=${filterStatus}`;
      const response = await api.get(`/datashows?search=${search}${statusParam}`);
      setInventory(response.data);
    } catch (error) { console.error("Failed to fetch datashows:", error); } finally { setLoading(false); }
  };

  const handleAddDataShow = async () => {
    setModalError("");
    if (!newDatashow.numero || !newDatashow.marque || !newDatashow.modele || !newDatashow.dateAchat) {
      setModalError(t('adminInventory.fillAll')); return;
    }
    setSubmitting(true);
    try {
      await api.post('/datashows', { ...newDatashow, etat: 'disponible' });
      setIsModalOpen(false);
      setNewDatashow({ numero: "", marque: "", modele: "", dateAchat: "" });
      fetchInventory();
      setConfirmModal({ isOpen: true, title: t('common.success'), message: t('adminInventory.addSuccess'), type: "success" });
    } catch (error) {
      console.error("Failed to add datashow:", error);
      setModalError(t('adminInventory.addFail'));
    } finally { setSubmitting(false); }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, title: t('adminInventory.deleteTitle'), message: t('adminInventory.deleteMsg'), type: "danger", onConfirm: () => performDelete(id) });
  };

  const performDelete = async (id) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await api.delete(`/datashows/${id}`);
      fetchInventory();
      setConfirmModal({ isOpen: true, title: t('adminInventory.deleted'), message: t('adminInventory.deletedMsg'), type: "success" });
    } catch (error) {
      console.error("Failed to delete datashow:", error);
      setConfirmModal({ isOpen: true, title: t('common.error'), message: t('adminInventory.deleteFail'), type: "error" });
    }
  };

  const brands = [...new Set(inventory.map((item) => item.marque))];
  const disponibleCount = inventory.filter(i => i.etat === 'disponible').length;
  const enPanneCount = inventory.filter(i => i.etat === 'en_panne').length;

  const filtered = inventory.filter(item => {
    const matchBrand = filterBrand === "all" || item.marque === filterBrand;
    return matchBrand;
  });

  const exportCSV = () => {
    const header = "ID,Brand,Model,Status,Purchase Date\n";
    const rows = filtered.map((item) => `${item.numero},${item.marque},${item.modele},${item.etat},${new Date(item.dateAchat).toLocaleDateString()}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "inventory.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">{t('adminInventory.loading')}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Projector className="w-8 h-8 text-primary" />
            {t('adminInventory.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('adminInventory.totalInfo', { total: inventory.length, available: disponibleCount, broken: enPanneCount })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-3xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/70 transition-colors">
            <Download className="w-4 h-4" /> {t('common.export')}
          </button>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> {t('adminInventory.addBtn')}
          </button>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">{t('adminInventory.lifecycle')}</span>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('adminInventory.searchPlaceholder')} className="w-full rounded-3xl border border-border bg-background px-11 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="all">{t('adminInventory.allStates')}</option>
            <option value="disponible">{t('adminDashboard.available')}</option>
            <option value="en_panne">{t('adminDashboard.inRepair')}</option>
          </select>
          <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} className="rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="all">{t('adminInventory.allBrands')}</option>
            {brands.map((brand) => (<option key={brand} value={brand}>{brand}</option>))}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t('adminInventory.colId')}</th>
              <th className="px-4 py-3">{t('adminInventory.colBrand')}</th>
              <th className="px-4 py-3">{t('adminInventory.colModel')}</th>
              <th className="px-4 py-3">{t('adminInventory.colState')}</th>
              <th className="px-4 py-3">{t('adminInventory.colPurchase')}</th>
              <th className="px-4 py-3 text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">{t('adminInventory.noFound')}</td></tr>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{t('adminInventory.addTitle')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {modalError && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{modalError}</div>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('adminInventory.fieldNumber')}</label>
                <input type="text" placeholder="ex: DS-001" value={newDatashow.numero} onChange={(e) => setNewDatashow({...newDatashow, numero: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('adminInventory.fieldBrand')}</label>
                <input type="text" placeholder="ex: Epson" value={newDatashow.marque} onChange={(e) => setNewDatashow({...newDatashow, marque: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('adminInventory.fieldModel')}</label>
                <input type="text" placeholder="ex: EB-X51" value={newDatashow.modele} onChange={(e) => setNewDatashow({...newDatashow, modele: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('adminInventory.fieldDate')}</label>
                <input type="date" value={newDatashow.dateAchat} onChange={(e) => setNewDatashow({...newDatashow, dateAchat: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('common.cancel')}</button>
              <button onClick={handleAddDataShow} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? t('adminInventory.adding') : t('adminInventory.addBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
