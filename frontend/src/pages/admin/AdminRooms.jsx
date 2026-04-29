import { useState } from "react";
import { DoorOpen, Search } from "lucide-react";

const initialRooms = [
  { id: "A-101", building: "A", equipped: true },
  { id: "A-201", building: "A", equipped: false },
  { id: "A-302", building: "A", equipped: false },
  { id: "B-103", building: "B", equipped: false },
  { id: "B-205", building: "B", equipped: true },
  { id: "C-101", building: "C", equipped: false },
  { id: "C-302", building: "C", equipped: true },
];

const AdminRooms = () => {
  const [search, setSearch] = useState("");
  const [rooms, setRooms] = useState(initialRooms);

  const filtered = rooms.filter((room) =>
    room.id.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleEquipped = (id) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === id ? { ...room, equipped: !room.equipped } : room,
      ),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <DoorOpen className="w-8 h-8 text-primary" />
          Room Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage rooms and their built-in equipment status.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-3xl border border-muted/50 bg-card px-11 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="bg-card rounded-3xl border border-muted/60 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Room ID</th>
              <th className="px-4 py-3">Building</th>
              <th className="px-4 py-3">Built-in Equipment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/50">
            {filtered.map((room) => (
              <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-foreground">
                  {room.id}
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  Building {room.building}
                </td>
                <td className="px-4 py-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={room.equipped}
                      onChange={() => toggleEquipped(room.id)}
                      className="h-4 w-4 rounded border-muted/50 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">
                      {room.equipped
                        ? "TV/Projector installed"
                        : "No equipment"}
                    </span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRooms;
