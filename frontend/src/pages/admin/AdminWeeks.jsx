import { useState, useEffect } from "react";
import { Calendar, Plus, X, Trash2, Info } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";

const AdminWeeks = () => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeekDate, setNewWeekDate] = useState("");
  const [modalError, setModalError] = useState("");

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  useEffect(() => {
    fetchWeeks();
  }, []);

  const fetchWeeks = async () => {
    try {
      const response = await api.get('/weeks');
      setWeeks(response.data);
    } catch (error) {
      console.error("Failed to fetch weeks:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = async (id) => {
    try {
      await api.put(`/weeks/${id}/toggle`);
      fetchWeeks();
    } catch (error) {
      console.error("Failed to toggle week:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to toggle week.",
        type: "error",
      });
    }
  };

  const handleDeleteWeek = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Week",
      message: "Are you sure you want to delete this week? This action cannot be undone.",
      type: "danger",
      onConfirm: () => performDeleteWeek(id),
    });
  };

  const performDeleteWeek = async (id) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await api.delete(`/weeks/${id}`);
      fetchWeeks();
      setConfirmModal({
        isOpen: true,
        title: "Deleted",
        message: "Week has been deleted.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to delete week:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to delete week.",
        type: "error",
      });
    }
  };

  const handleAddWeek = async () => {
    setModalError("");
    if (!newWeekDate) {
      setModalError("Please select a date.");
      return;
    }

    try {
      await api.post('/weeks', { weekStart: newWeekDate, isOpen: false });
      setIsModalOpen(false);
      setNewWeekDate("");
      fetchWeeks();
      setConfirmModal({
        isOpen: true,
        title: "Success",
        message: "Week added successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to add week:", error);
      setModalError("Failed to add week. It might already exist.");
    }
  };

  // Determine which week is "current"
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayTime = today.getTime();

  const isCurrentWeek = (weekStart) => {
    const start = new Date(weekStart).getTime();
    const end = start + 7 * 24 * 60 * 60 * 1000;
    return todayTime >= start && todayTime < end;
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading weeks...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-8 h-8 text-primary" />
            Week Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Control which weeks are open for booking. Professors can only reserve during open weeks.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Week
        </button>
      </div>

      {/* Explanation */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">
          <strong className="text-foreground">How it works:</strong> Add a week by selecting a Monday date, then toggle it to <strong className="text-foreground">Open</strong> when you want professors to start booking equipment for that week. Close it to block new reservations.
        </span>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Week Start</th>
              <th className="px-4 py-3">Week End</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Toggle</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {weeks.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                  No weeks configured yet. Click "Add Week" to create one.
                </td>
              </tr>
            )}
            {weeks.map((week) => {
              const start = new Date(week.weekStart);
              const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
              const isCurrent = isCurrentWeek(week.weekStart);
              return (
                <tr 
                  key={week._id} 
                  className={`hover:bg-muted/30 transition-colors ${isCurrent ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                >
                  <td className="px-4 py-4 font-semibold text-foreground">
                    {start.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                    {isCurrent && <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">CURRENT</span>}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {end.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${week.isOpen ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      <span className={`w-2 h-2 rounded-full ${week.isOpen ? 'bg-success' : 'bg-muted-foreground/40'}`} />
                      {week.isOpen ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={week.isOpen}
                        onChange={() => toggleWeek(week._id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 rounded-full bg-muted/50 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/40"></div>
                      <div className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleDeleteWeek(week._id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-muted hover:bg-destructive/10 text-destructive transition-colors"
                      title="Delete week"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Add New Week</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              {modalError && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                  {modalError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Week Start Date (Monday)
                </label>
                <input
                  type="date"
                  value={newWeekDate}
                  onChange={(e) => setNewWeekDate(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Select the Monday of the week you want to add. Once created, toggle it to "Open" to allow bookings.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWeek}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Week
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWeeks;
