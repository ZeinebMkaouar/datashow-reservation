import { useState, useEffect } from "react";
import { ClipboardList, Search, Download, X } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";

const ProfessorReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roomFilter, setRoomFilter] = useState("All Rooms");

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
      fetchReservations();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, statusFilter]);

  const fetchReservations = async () => {
    try {
      const response = await api.get(`/reservations/my?search=${searchTerm}&status=${statusFilter}`);
      setReservations(response.data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Cancel Reservation",
      message: "Are you sure you want to cancel this reservation? This action cannot be undone.",
      type: "danger",
      onConfirm: () => performCancel(id),
    });
  };

  const performCancel = async (id) => {
    setConfirmModal(prev => ({ ...prev, loading: true }));
    try {
      await api.put(`/reservations/${id}/cancel`);
      fetchReservations();
      setConfirmModal({
        isOpen: true,
        title: "Cancelled",
        message: "Your reservation has been cancelled.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to cancel reservation.",
        type: "error",
      });
    }
  };

  const rooms = [...new Set(reservations.map((res) => res.salle))].filter(Boolean);

  const filtered = reservations.filter((res) => {
    const matchesRoom = roomFilter === "All Rooms" || res.salle === roomFilter;
    return matchesRoom;
  }); // Room filter remains frontend for now

  const exportCSV = () => {
    const header = "Date,Slot,Room,DataShow,Type,Status\n";
    const rows = filtered
      .map(
        (res) =>
          `${new Date(res.date).toLocaleDateString()},${res.seance},${res.salle},${res.datashow?.numero || 'Unknown'},${res.type},${res.status}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "my_reservations.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading reservations...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-primary" />
            My Reservations
          </h1>
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export CSV</span>
          </button>
        </div>
        <p className="text-muted-foreground text-sm mt-2">
          {filtered.length} reservations found
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl card-shadow p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by room, DataShow..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          >
            <option value="All Status">All Status</option>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          >
            <option value="All Rooms">All Rooms</option>
            {rooms.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 bg-card rounded-xl border border-border text-muted-foreground">
            No reservations match your criteria.
          </div>
        )}
        {filtered.map((res) => (
          <div
            key={res._id}
            className={`bg-card rounded-xl card-shadow p-4 lg:p-6 border-l-4 ${res.status === 'confirmed' ? 'border-l-primary' : res.status === 'cancelled' ? 'border-l-destructive/50' : 'border-l-success'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{new Date(res.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Slot {res.seance} · Room {res.salle}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">
                    DataShow: {res.datashow?.numero || 'Unknown'}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      res.status === "confirmed"
                        ? "bg-primary/10 text-primary"
                        : res.status === "cancelled"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/20 text-success"
                    }`}
                  >
                    {res.status}
                  </span>
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
                    {res.type}
                  </span>
                </div>
              </div>
              {res.status === "confirmed" && (
                <button 
                  onClick={() => handleCancel(res._id)}
                  className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap border border-transparent hover:border-destructive/20"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessorReservations;
