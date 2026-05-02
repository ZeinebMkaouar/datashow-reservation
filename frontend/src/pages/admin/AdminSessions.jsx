import { useState, useEffect } from "react";
import { Clock, Plus, Trash2, X, Info } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import { useTranslation } from "react-i18next";

const AdminSessions = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSession, setNewSession] = useState({ name: "", startTime: "", endTime: "" });
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null });

  useEffect(() => { fetchSessions(); }, []);

  const fetchSessions = async () => {
    try { const r = await api.get("/sessions"); setSessions(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleAddSession = async () => {
    setModalError("");
    if (!newSession.name || !newSession.startTime || !newSession.endTime) { setModalError(t('adminSessions.fillAll')); return; }
    setSubmitting(true);
    try {
      await api.post("/sessions", newSession);
      setIsModalOpen(false); setNewSession({ name: "", startTime: "", endTime: "" }); fetchSessions();
    } catch (e) { setModalError(t('adminSessions.addFail')); } finally { setSubmitting(false); }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, title: t('adminSessions.deleteTitle'), message: t('adminSessions.deleteMsg'), type: "danger", onConfirm: () => performDelete(id) });
  };

  const performDelete = async (id) => {
    setConfirmModal(p => ({ ...p, loading: true }));
    try {
      await api.delete(`/sessions/${id}`); fetchSessions();
      setConfirmModal({ isOpen: true, title: t('adminSessions.deleted'), message: t('adminSessions.deletedMsg'), type: "success" });
    } catch (e) {
      setConfirmModal({ isOpen: true, title: t('common.error'), message: t('adminSessions.deleteFail'), type: "error" });
    }
  };

  if (loading) return <div className="text-center py-10 text-muted-foreground">{t('adminSessions.loading')}</div>;

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2"><Clock className="w-8 h-8 text-primary" />{t('adminSessions.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('adminSessions.subtitle')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> {t('adminSessions.addBtn')}
        </button>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">{t('adminSessions.info')}</span>
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t('adminSessions.colName')}</th>
              <th className="px-4 py-3">{t('adminSessions.colStart')}</th>
              <th className="px-4 py-3">{t('adminSessions.colEnd')}</th>
              <th className="px-4 py-3 text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sessions.length === 0 && <tr><td colSpan="4" className="px-4 py-8 text-center text-muted-foreground">{t('adminSessions.noFound')}</td></tr>}
            {sessions.map((s) => (
              <tr key={s._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-foreground">{s.name}</td>
                <td className="px-4 py-4 text-muted-foreground">{s.startTime}</td>
                <td className="px-4 py-4 text-muted-foreground">{s.endTime}</td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => handleDelete(s._id)} className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-muted hover:bg-destructive/10 text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
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
              <h2 className="text-lg font-semibold text-foreground">{t('adminSessions.addTitle')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {modalError && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{modalError}</div>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('adminSessions.fieldName')}</label>
                <input type="text" placeholder="S1" value={newSession.name} onChange={(e) => setNewSession({...newSession, name: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('adminSessions.fieldStart')}</label>
                  <input type="time" value={newSession.startTime} onChange={(e) => setNewSession({...newSession, startTime: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t('adminSessions.fieldEnd')}</label>
                  <input type="time" value={newSession.endTime} onChange={(e) => setNewSession({...newSession, endTime: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('common.cancel')}</button>
              <button onClick={handleAddSession} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? t('common.pleaseWait') : t('adminSessions.addBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSessions;
