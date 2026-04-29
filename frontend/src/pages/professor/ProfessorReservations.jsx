import { useState } from "react";
import { ClipboardList, Search, Download, X } from "lucide-react";

const ProfessorReservations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [roomFilter, setRoomFilter] = useState("All Rooms");

  const reservations = [
    {
      id: 1,
      date: "Monday, 2026-04-14",
      slot: "Slot S2",
      room: "Room A-201",
      datashow: "DS-004",
      status: "confirmed",
    },
    {
      id: 2,
      date: "Tuesday, 2026-04-15",
      slot: "Slot S4",
      room: "Room B-103",
      datashow: "DS-007",
      status: "confirmed",
    },
    {
      id: 3,
      date: "Thursday, 2026-04-17",
      slot: "Slot S1",
      room: "Room A-201",
      datashow: "DS-004",
      status: "confirmed",
    },
    {
      id: 4,
      date: "Thursday, 2026-04-17",
      slot: "Slot S3",
      room: "Room C-302",
      datashow: "DS-012",
      status: "confirmed",
    },
    {
      id: 5,
      date: "Thursday, 2026-04-10",
      slot: "Slot S2",
      room: "Room B-103",
      datashow: "DS-002",
      status: "completed",
    },
    {
      id: 6,
      date: "Tuesday, 2026-04-08",
      slot: "Slot S5",
      room: "Room A-201",
      datashow: "DS-006",
      status: "completed",
    },
  ];

  const filtered = reservations.filter((res) => {
    const matchesSearch =
      res.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.datashow.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || res.status === statusFilter;
    const matchesRoom =
      roomFilter === "All Rooms" || res.room.includes(roomFilter);
    return matchesSearch && matchesStatus && matchesRoom;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-8 h-8 text-primary" />
            My Reservations
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
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
              placeholder="Search by room, DataShow, day..."
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
            <option>All Status</option>
            <option>confirmed</option>
            <option>completed</option>
          </select>

          {/* Room Filter */}
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          >
            <option>All Rooms</option>
            <option>A-201</option>
            <option>B-103</option>
            <option>C-302</option>
          </select>
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-3">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-card rounded-xl card-shadow p-4 lg:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{res.date}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {res.slot} · {res.room}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">
                    DataShow: {res.datashow}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                      res.status === "confirmed"
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
              </div>
              {res.status === "confirmed" && (
                <button className="px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap">
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
