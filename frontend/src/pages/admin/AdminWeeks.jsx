import { useState, useEffect } from "react";
import { Calendar, Plus, X, Trash2, Info, Settings } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import { useTranslation } from "react-i18next";

const AdminWeeks = () => {
  const { t, i18n } = useTranslation();
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeekDate, setNewWeekDate] = useState("");
  const [modalError, setModalError] = useState("");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: "", message: "", type: "info", onConfirm: null,
  });

  useEffect(() => { fetchWeeks(); }, []);

  const fetchWeeks = async () => {
    try { const response = await api.get('/weeks'); setWeeks(response.data); }
    catch (error) { console.error("Failed to fetch weeks:", error); }
    finally { setLoading(false); }
  };

  const toggleWeek = async (id) => {
    try { await api.put(`/weeks/${id}/toggle`); fetchWeeks(); }
    catch (error) {
      console.error("Failed to toggle week:", error);
      setConfirmModal({ isOpen: true, title: t('common.error'), message: t('adminWeeks.toggleFail'), type: "error" });
    }
  };

  const handleDeleteWeek = (id) => {
    setConfirmModal({ isOpen: true, title: t('adminWeeks.deleteTitle'), message: t('adminWeeks.deleteMsg'), type: "danger", onConfirm: () => performDeleteWeek(id) });
  };

  const performDeleteWeek = async (id) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await api.delete(`/weeks/${id}`);
      fetchWeeks();
      setConfirmModal({ isOpen: true, title: t('adminWeeks.deleted'), message: t('adminWeeks.deletedMsg'), type: "success" });
    } catch (error) {
      console.error("Failed to delete week:", error);
      setConfirmModal({ isOpen: true, title: t('common.error'), message: t('adminWeeks.deleteFail'), type: "error" });
    }
  };

  const handleAddWeek = async () => {
    setModalError("");
    if (!newWeekDate) { setModalError(t('adminWeeks.selectDate')); return; }
    try {
      await api.post('/weeks', { weekStart: newWeekDate, isOpen: false });
      setIsModalOpen(false); setNewWeekDate(""); fetchWeeks();
      setConfirmModal({ isOpen: true, title: t('common.success'), message: t('adminWeeks.addSuccess'), type: "success" });
    } catch (error) {
      console.error("Failed to add week:", error);
      setModalError(t('adminWeeks.addFail'));
    }
  };

  const today = new Date(); today.setHours(0,0,0,0);
  const todayTime = today.getTime();
  const isCurrentWeek = (weekStart) => {
    const start = new Date(weekStart).getTime();
    const end = start + 7 * 24 * 60 * 60 * 1000;
    return todayTime >= start && todayTime < end;
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">{t('adminWeeks.loading')}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            {t('adminWeeks.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('adminWeeks.subtitle')}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> {t('adminWeeks.addBtn')}
        </button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">{t('adminWeeks.info')}</span>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t('adminWeeks.colStart')}</th>
              <th className="px-4 py-3">{t('adminWeeks.colEnd')}</th>
              <th className="px-4 py-3">{t('adminWeeks.colStatus')}</th>
              <th className="px-4 py-3 text-center">{t('adminWeeks.colToggle')}</th>
              <th className="px-4 py-3 text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {weeks.length === 0 && (
              <tr><td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">{t('adminWeeks.noWeeks')}</td></tr>
            )}
            {weeks.map((week) => {
              const start = new Date(week.weekStart);
              const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
              const isCurrent = isCurrentWeek(week.weekStart);
              return (
                <tr key={week._id} className={`hover:bg-muted/30 transition-colors ${isCurrent ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                  <td className="px-4 py-4 font-semibold text-foreground">
                    {start.toLocaleDateString(i18n.language, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                    {isCurrent && <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t('adminWeeks.current')}</span>}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {end.toLocaleDateString(i18n.language, { weekday: 'short', day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${week.isOpen ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      <span className={`w-2 h-2 rounded-full ${week.isOpen ? 'bg-success' : 'bg-muted-foreground/40'}`} />
                      {week.isOpen ? t('adminWeeks.opened') : t('adminWeeks.closedStatus')}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={week.isOpen} onChange={() => toggleWeek(week._id)} className="sr-only peer" />
                      <div className="w-11 h-6 rounded-full bg-muted/50 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/40"></div>
                      <div className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => handleDeleteWeek(week._id)} className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-muted hover:bg-destructive/10 text-destructive transition-colors" title={t('common.delete')}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{t('adminWeeks.addTitle')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {modalError && (<div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{modalError}</div>)}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('adminWeeks.fieldDate')}</label>
                <input type="date" value={newWeekDate} onChange={(e) => setNewWeekDate(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                <p className="text-xs text-muted-foreground mt-2">{t('adminWeeks.fieldHelp')}</p>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('common.cancel')}</button>
              <button onClick={handleAddWeek} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">{t('common.add')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWeeks;
