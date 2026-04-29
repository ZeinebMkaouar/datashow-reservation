import { useState } from "react";
import { Wrench, Search, Download } from "lucide-react";

const AdminMaintenance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [technicianFilter, setTechnicianFilter] = useState("All Technicians");

  const logs = [
    {
      id: 1,
      device: "DS-005",
      date: "2026-04-10",
      issue: "Lamp flickering intermittently",
      action: "Replaced lamp unit",
      technician: "M. Khelifi",
    },
    {
      id: 2,
      device: "DS-008",
      date: "2026-04-08",
      issue: "No power output",
      action: "Diagnosed: PSU failure, awaiting part",
      technician: "M. Khelifi",
    },
    {
      id: 3,
      device: "DS-003",
      date: "2026-04-03",
      issue: "Remote not responding",
      action: "Replaced batteries and IR sensor",
      technician: "A. Mansouri",
    },
    {
      id: 4,
      device: "DS-012",
      date: "2026-03-28",
      issue: "Blurry projection",
      action: "Cleaned lens and recalibrated focus",
      technician: "A. Mansouri",
    },
    {
      id: 5,
      device: "DS-001",
      date: "2026-03-20",
      issue: "HDMI port loose",
      action: "Re-soldered HDMI connector",
      technician: "M. Khelifi",
    },
  ];

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTechnician =
      technicianFilter === "All Technicians" ||
      log.technician === technicianFilter;
    return matchesSearch && matchesTechnician;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Wrench className="w-8 h-8 text-purple-500" />
            Maintenance Logs
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Repair and maintenance history for all devices.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by device, issue, or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Technician Filter */}
          <select
            value={technicianFilter}
            onChange={(e) => setTechnicianFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option>All Technicians</option>
            <option>M. Khelifi</option>
            <option>A. Mansouri</option>
          </select>
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-3">
        {filtered.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 lg:p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold text-sm">
                  {log.device}
                </div>
                <span className="text-sm text-gray-500">{log.date}</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">
              Issue: {log.issue}
            </p>
            <p className="text-sm text-gray-700 mb-3">→ {log.action}</p>
            <p className="text-xs text-gray-500">
              Technician: {log.technician}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMaintenance;
