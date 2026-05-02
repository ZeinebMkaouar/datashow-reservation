import { useState, useEffect } from "react";
import { DoorOpen, Search, Plus, Trash2, X, Info } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";

const AdminRooms = () => {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", building: "" });
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
      fetchRooms();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchRooms = async () => {
    try {
      const response = await api.get(`/rooms?search=${search}`);
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = rooms; // Now filtered by backend

  const toggleEquipped = async (id, currentStatus) => {
    try {
      await api.put(`/rooms/${id}`, { hasEquipment: !currentStatus });
      fetchRooms();
    } catch (error) {
      console.error("Failed to update room:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to update equipment status.",
        type: "error",
      });
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Room",
      message: "Are you sure you want to delete this room? This action cannot be undone.",
      type: "danger",
      onConfirm: () => performDelete(id),
    });
  };

  const performDelete = async (id) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await api.delete(`/rooms/${id}`);
      fetchRooms();
      setConfirmModal({
        isOpen: true,
        title: "Deleted",
        message: "Room has been deleted.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete room:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to delete room.",
        type: "error",
      });
    }
  };

  const handleAddRoom = async () => {
    setModalError("");
    if (!newRoom.name || !newRoom.building) {
      setModalError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/rooms', { ...newRoom, hasEquipment: false });
      setIsModalOpen(false);
      setNewRoom({ name: "", building: "" });
      fetchRooms();
      setConfirmModal({
        isOpen: true,
        title: "Success",
        message: "Room added successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add room:", error);
      setModalError("Failed to add room. It might already exist.");
    } finally {
      setSubmitting(false);
    }
  };

  const equippedCount = rooms.filter(r => r.hasEquipment).length;

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading rooms...</div>;
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
            <DoorOpen className="w-8 h-8 text-primary" />
            Room Management
          </h1>
          <p className="text-muted-foreground mt-2">
            {rooms.length} rooms total · {equippedCount} already equipped
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">
          <strong className="text-foreground">Purpose:</strong> Register all classrooms here. Mark rooms that have a <strong className="text-foreground">built-in projector/TV</strong> — when a professor books a DataShow for an equipped room, they'll get a <strong className="text-foreground">warning</strong> (not a block) that the room already has equipment.
        </span>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-3xl border border-border bg-card px-11 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Room Name</th>
              <th className="px-4 py-3">Building</th>
              <th className="px-4 py-3">Built-in Equipment</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-muted-foreground">
                  No rooms found.
                </td>
              </tr>
            )}
            {filtered.map((room) => (
              <tr key={room._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-foreground">{room.name}</td>
                <td className="px-4 py-4 text-muted-foreground">Building {room.building}</td>
                <td className="px-4 py-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={room.hasEquipment}
                      onChange={() => toggleEquipped(room._id, room.hasEquipment)}
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className={`text-sm ${room.hasEquipment ? 'text-success font-medium' : 'text-muted-foreground'}`}>
                      {room.hasEquipment ? "TV/Projector installed" : "No equipment"}
                    </span>
                  </label>
                </td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => handleDelete(room._id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-muted hover:bg-destructive/10 text-destructive transition-colors"
                    title="Delete room"
                  >
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
              <h2 className="text-lg font-semibold text-foreground">Add New Room</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {modalError && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{modalError}</div>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Room Name</label>
                <input type="text" placeholder="e.g. A-101" value={newRoom.name} onChange={(e) => setNewRoom({...newRoom, name: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Building</label>
                <input type="text" placeholder="e.g. A" value={newRoom.building} onChange={(e) => setNewRoom({...newRoom, building: e.target.value})} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={handleAddRoom} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? "Adding..." : "Add Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRooms;
