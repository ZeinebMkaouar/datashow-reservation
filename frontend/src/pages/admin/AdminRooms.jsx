import { useState, useEffect } from "react";
import { DoorOpen, Search, Plus, Trash2, X, Info } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import { useTranslation } from "react-i18next";

const AdminRooms = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEquipped, setFilterEquipped] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", building: "" });
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: "", message: "", type: "info", onConfirm: null,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchRooms(); }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchRooms = async () => {
    try {
      const response = await api.get(`/rooms?search=${search}`);
      setRooms(response.data);
    } catch (error) { console.error("Failed to fetch rooms:", error); } finally { setLoading(false); }
  };

  const filtered = rooms.filter(room => {
    if (filterEquipped === "equipped") return room.hasEquipment;
    if (filterEquipped === "standard") return !room.hasEquipment;
    return true;
  });

  const toggleEquipped = async (id, currentStatus) => {
    try {
      await api.put(`/rooms/${id}`, { hasEquipment: !currentStatus });
      fetchRooms();
    } catch (error) {
      console.error("Failed to update room:", error);
      setConfirmModal({ isOpen: true, title: t('common.error'), message: t('adminRooms.updateFail'), type: "error" });
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({ isOpen: true, title: t('adminRooms.deleteTitle'), message: t('adminRooms.deleteMsg'), type: "danger", onConfirm: () => performDelete(id) });
  };

  const performDelete = async (id) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
      setConfirmModal({ isOpen: true, title: t('adminRooms.deleted'), message: t('adminRooms.deletedMsg'), type: "success" });
    } catch (error) {
      console.error("Failed to delete room:", error);
      setConfirmModal({ isOpen: true, title: t('common.error'), message: t('adminRooms.deleteFail'), type: "error" });
    }
  };

  const handleAddRoom = async () => {
    setModalError("");
    if (!newRoom.name || !newRoom.building) { setModalError(t('adminRooms.fillAll')); return; }
    setSubmitting(true);
    try {
      await api.post('/rooms', { ...newRoom, hasEquipment: false });
      setIsModalOpen(false);
      setNewRoom({ name: "", building: "" });
      fetchRooms();
      setConfirmModal({ isOpen: true, title: t('common.success'), message: t('adminRooms.addSuccess'), type: "success" });
    } catch (error) {
      console.error("Failed to add room:", error);
      setModalError(t('adminRooms.addFail'));
    } finally { setSubmitting(false); }
  };

  const equippedCount = rooms.filter(r => r.hasEquipment).length;

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">{t('adminRooms.loading')}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
      
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <DoorOpen className="w-8 h-8 text-primary" />
            {t('adminRooms.title')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('adminRooms.totalInfo', { total: rooms.length, equipped: equippedCount, notEquipped: rooms.length - equippedCount })}
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> {t('adminRooms.addBtn')}
        </button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">{t('adminRooms.info')}</span>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder={t('adminRooms.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-3xl border border-border bg-background px-11 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={filterEquipped} onChange={(e) => setFilterEquipped(e.target.value)} className="rounded-3xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
          <option value="all">{t('adminRooms.allEquipment')}</option>
          <option value="equipped">{t('adminRooms.filterEquipped')}</option>
          <option value="standard">{t('adminRooms.filterStandard')}</option>
        </select>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t('adminRooms.colName')}</th>
              <th className="px-4 py-3">{t('adminRooms.colBuilding')}</th>
              <th className="px-4 py-3">{t('adminRooms.colEquipment')}</th>
              <th className="px-4 py-3 text-right">{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr><td colSpan="4" className="px-4 py-8 text-center text-muted-foreground">{t('adminRooms.noFound')}</td></tr>
            )}
            {filtered.map((room) => (
              <tr key={room._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-foreground">{room.name}</td>
                <td className="px-4 py-4 text-muted-foreground">{t('common.building')} {room.building}</td>
                <td className="px-4 py-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={room.hasEquipment} onChange={() => toggleEquipped(room._id, room.hasEquipment)} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                    <span className={`text-sm ${room.hasEquipment ? 'text-success font-medium' : 'text-muted-foreground'}`}>
                      {room.hasEquipment ? t('adminRooms.hasEquipment') : t('adminRooms.noEquipment')}
                    </span>
                  </label>
                </td>
                <td className="px-4 py-4 text-right">
                  <button onClick={() => handleDelete(room._id)} className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-muted hover:bg-destructive/10 text-destructive transition-colors" title={t('common.delete')}>
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
              <h2 className="text-lg font-semibold text-foreground">{t('adminRooms.addTitle')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {modalError && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{modalError}</div>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('adminRooms.fieldName')}</label>
                <input type="text" placeholder="ex: A-101" value={newRoom.name} onChange={(e) => setNewRoom({...newRoom, name: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">{t('adminRooms.fieldBuilding')}</label>
                <input type="text" placeholder="ex: Bloc A" value={newRoom.building} onChange={(e) => setNewRoom({...newRoom, building: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="equipped-modal" checked={newRoom.hasEquipment} onChange={(e) => setNewRoom({...newRoom, hasEquipment: e.target.checked})} className="h-4 w-4 rounded border-border text-primary focus:ring-primary" />
                <label htmlFor="equipped-modal" className="text-sm font-medium text-foreground cursor-pointer">{t('adminRooms.fieldEquipped')}</label>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('common.cancel')}</button>
              <button onClick={handleAddRoom} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? t('adminRooms.adding') : t('adminRooms.addRoomBtn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
