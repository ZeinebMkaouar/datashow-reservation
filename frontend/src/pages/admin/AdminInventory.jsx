import { useState } from "react";
import { Projector, Search, Download, Plus, Edit2, Trash2 } from "lucide-react";

const AdminInventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [brandFilter, setBrandFilter] = useState("All Brands");

  const datashows = [
    {
      id: "DS-001",
      brand: "Epson",
      model: "EB-X51",
      status: "available",
      lastMaintenance: "2026-03-20",
    },
    {
      id: "DS-002",
      brand: "BenQ",
      model: "MH733",
      status: "available",
      lastMaintenance: "2026-03-15",
    },
    {
      id: "DS-003",
      brand: "Epson",
      model: "EB-X51",
      status: "in use",
      lastMaintenance: "2026-04-03",
    },
    {
      id: "DS-004",
      brand: "Epson",
      model: "EB-W52",
      status: "in use",
      lastMaintenance: "2026-02-10",
    },
    {
      id: "DS-005",
      brand: "ViewSonic",
      model: "PA503W",
      status: "repair",
      lastMaintenance: "2026-04-10",
    },
    {
      id: "DS-006",
      brand: "BenQ",
      model: "MH733",
      status: "available",
      lastMaintenance: "2026-01-22",
    },
    {
      id: "DS-007",
      brand: "Epson",
      model: "EB-X51",
      status: "in use",
      lastMaintenance: "2026-03-05",
    },
    {
      id: "DS-008",
      brand: "ViewSonic",
      model: "PA503W",
      status: "broken",
      lastMaintenance: "2026-04-08",
    },
  ];

  const filtered = datashows.filter((ds) => {
    const matchesSearch =
      ds.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ds.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || ds.status === statusFilter;
    const matchesBrand =
      brandFilter === "All Brands" || ds.brand === brandFilter;
    return matchesSearch && matchesStatus && matchesBrand;
  });

  const getStatusColor = (status) => {
    const colors = {
      available: "bg-green-100 text-green-700",
      "in use": "bg-blue-100 text-blue-700",
      repair: "bg-orange-100 text-orange-700",
      broken: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Projector className="w-8 h-8 text-purple-500" />
            DataShow Inventory
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            {filtered.length} devices total · {filtered.length} shown
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add DataShow</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, brand, or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option>All Status</option>
            <option>available</option>
            <option>in use</option>
            <option>repair</option>
            <option>broken</option>
          </select>

          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option>All Brands</option>
            <option>Epson</option>
            <option>BenQ</option>
            <option>ViewSonic</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Brand
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Model
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Last Maintenance
              </th>
              <th className="px-4 lg:px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((ds) => (
              <tr key={ds.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 lg:px-6 py-4 text-sm font-semibold text-gray-900">
                  {ds.id}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">
                  {ds.brand}
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-700">
                  {ds.model}
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ds.status)}`}
                  >
                    {ds.status}
                  </span>
                </td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">
                  {ds.lastMaintenance}
                </td>
                <td className="px-4 lg:px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;
