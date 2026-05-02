import { useState, useEffect } from "react";
import { Wrench, Search, Download, Plus, CheckCircle, X, Info, AlertTriangle } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";

const AdminMaintenance = () => {
  const [logs, setLogs] = useState([]);
  const [datashows, setDatashows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRepair, setNewRepair] = useState({
    datashowId: "",
    description: "",
    action: "",
    technician: ""
  });
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
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    fetchDatashows();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get(`/repairs?search=${search}`);
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch repairs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatashows = async () => {
    try {
      const response = await api.get('/datashows');
      setDatashows(response.data);
    } catch (error) {
      console.error("Failed to fetch datashows:", error);
    }
  };

  const handleAddRepair = async () => {
    setModalError("");
    if (!newRepair.datashowId || !newRepair.description || !newRepair.action || !newRepair.technician) {
      setModalError("Please fill all fields.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/repairs', {
        datashow: newRepair.datashowId,
        date: new Date().toISOString().split('T')[0],
        description: newRepair.description,
        action: newRepair.action,
        technician: newRepair.technician
      });
      setIsModalOpen(false);
      setNewRepair({ datashowId: "", description: "", action: "", technician: "" });
      fetchLogs();
      fetchDatashows(); // Refresh to see updated status
      setConfirmModal({
        isOpen: true,
        title: "Success",
        message: "Repair log added. DataShow status updated to 'en_panne'.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add repair:", error);
      setModalError("Failed to add repair.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkDone = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Complete Repair",
      message: "Mark this repair as completed? The DataShow will be set back to 'disponible'.",
      type: "warning",
      onConfirm: () => performMarkDone(id),
    });
  };

  const performMarkDone = async (id) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await api.put(`/repairs/${id}/done`);
      fetchLogs();
      fetchDatashows();
      setConfirmModal({
        isOpen: true,
        title: "Success",
        message: "Repair marked as completed.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to mark repair as done:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to update status.",
        type: "error",
      });
    }
  };

  const inProgressCount = logs.filter(l => l.status === 'en_cours').length;
  const doneCount = logs.filter(l => l.status === 'terminee').length;

  const filtered = logs.filter((log) => {
    const dsNum = log.datashow?.numero || "";
    const matchSearch =
      dsNum.toLowerCase().includes(search.toLowerCase()) ||
      log.description.toLowerCase().includes(search.toLowerCase()) ||
      log.technician.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || log.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const header = "Device,Date,Issue,Action,Technician,Status\n";
    const rows = filtered
      .map(
        (log) =>
          `${log.datashow?.numero || 'Unknown'},${new Date(log.date).toLocaleDateString()},"${log.description}","${log.action}",${log.technician},${log.status}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "maintenance_logs.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading maintenance logs...</div>;
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
            <Wrench className="w-8 h-8 text-primary" />
            Maintenance Logs
          </h1>
          <p className="text-muted-foreground mt-2">
            {logs.length} total repairs · {inProgressCount} in progress · {doneCount} completed
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="inline-flex items-center gap-2 rounded-3xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/70">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Add Repair
          </button>
        </div>
      </div>

      {/* How en_panne works */}
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <span className="text-muted-foreground">
          <strong className="text-foreground">Automatic status sync:</strong> When you <strong className="text-foreground">Add a Repair</strong>, the DataShow is automatically set to <strong className="text-destructive">en_panne</strong> (broken) — it will no longer appear in professors' booking options. When you click <strong className="text-foreground">Mark Done</strong>, it switches back to <strong className="text-success">disponible</strong>.
        </span>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by device, issue, or technician..." className="w-full rounded-3xl border border-border bg-background px-11 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="all">All Status</option>
            <option value="en_cours">In Progress</option>
            <option value="terminee">Completed</option>
          </select>
        </div>
      </div>

      {/* Repair Cards */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((log) => (
            <div
              key={log._id}
              className={`bg-card rounded-xl border border-border p-5 shadow-sm flex flex-col sm:flex-row gap-4 ${log.status === 'en_cours' ? 'border-l-4 border-l-warning' : 'border-l-4 border-l-success'}`}
            >
              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{log.datashow?.numero || 'Unknown'}</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${log.status === 'en_cours' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                      {log.status === 'en_cours' ? 'IN PROGRESS' : 'DONE'}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <p className="text-sm text-foreground mt-3"><span className="font-medium text-muted-foreground">Issue:</span> {log.description}</p>
                <p className="text-sm text-foreground mt-2"><span className="font-medium text-muted-foreground">Action:</span> {log.action}</p>
                <p className="text-xs text-muted-foreground mt-3">Technician: {log.technician}</p>
              </div>
              {log.status === 'en_cours' && (
                <div className="flex items-center">
                  <button 
                    onClick={() => handleMarkDone(log._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium text-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Mark Done
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">No logs match your search.</div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Add Repair Log</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="bg-warning/5 border border-warning/20 p-3 rounded-lg text-xs text-warning flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Creating a repair will automatically set the DataShow to "en_panne".
              </div>
              {modalError && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{modalError}</div>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">DataShow</label>
                <select value={newRepair.datashowId} onChange={(e) => setNewRepair({...newRepair, datashowId: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option value="">Select DataShow</option>
                  {datashows.map(ds => (
                    <option key={ds._id} value={ds._id}>
                      {ds.numero} — {ds.marque} {ds.modele} ({ds.etat})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Issue Description</label>
                <textarea placeholder="What's wrong?" value={newRepair.description} onChange={(e) => setNewRepair({...newRepair, description: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Action Taken</label>
                <textarea placeholder="What was done / will be done?" value={newRepair.action} onChange={(e) => setNewRepair({...newRepair, action: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" rows={2} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Technician</label>
                <input type="text" placeholder="e.g. A. Mansouri" value={newRepair.technician} onChange={(e) => setNewRepair({...newRepair, technician: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleAddRepair} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? "Adding..." : "Add Repair"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMaintenance;
