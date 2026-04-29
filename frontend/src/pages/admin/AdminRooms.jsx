import { useState } from "react";
import { DoorOpen, Search } from "lucide-react";

const AdminRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [rooms, setRooms] = useState([
    { id: "A-101", building: "Building A", hasEquipment: true },
    { id: "A-201", building: "Building A", hasEquipment: false },
    { id: "A-302", building: "Building A", hasEquipment: false },
    { id: "B-103", building: "Building B", hasEquipment: false },
    { id: "B-205", building: "Building B", hasEquipment: true },
    { id: "C-101", building: "Building C", hasEquipment: false },
    { id: "C-302", building: "Building C", hasEquipment: true },
  ]);

  const filtered = rooms.filter(
    (room) =>
      room.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleToggleEquipment = (id) => {
    setRooms(
      rooms.map((room) =>
        room.id === id ? { ...room, hasEquipment: !room.hasEquipment } : room,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <DoorOpen className="w-8 h-8 text-purple-500" />
          Room Management
        </h1>
        <p className="text-gray-600 text-sm lg:text-base mt-2">
          Manage rooms and their built-in equipment status.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 lg:p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Room ID
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Building
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Built-in Equipment
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-gray-900">
                  {room.id}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">
                  {room.building}
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={room.hasEquipment}
                      onChange={() => handleToggleEquipment(room.id)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      {room.hasEquipment
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
