import { useState } from "react";
import { Projector, Search, Download, Plus, Edit2, Trash2 } from "lucide-react";

const initialInventory = [
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

const statusStyles = {
  available: "bg-success/10 text-success",
  "in use": "bg-primary/10 text-primary",
  repair: "bg-warning/10 text-warning",
  broken: "bg-destructive/10 text-destructive",
};

const AdminInventory = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");

  const brands = [...new Set(inventory.map((item) => item.brand))];

  const filtered = inventory.filter((item) => {
    const matchSearch =
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    const matchBrand = filterBrand === "all" || item.brand === filterBrand;
    return matchSearch && matchStatus && matchBrand;
  });

  const exportCSV = () => {
    const header = "ID,Brand,Model,Status,Last Maintenance\n";
    const rows = filtered
      .map(
        (item) =>
          `${item.id},${item.brand},${item.model},${item.status},${item.lastMaintenance}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "inventory.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Projector className="w-8 h-8 text-primary" />
            DataShow Inventory
          </h1>
          <p className="text-muted-foreground mt-2">
            {inventory.length} devices total · {filtered.length} shown
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-3xl border border-muted/60 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted/70 transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="inline-flex items-center gap-2 rounded-3xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" /> Add DataShow
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-muted/60 bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, brand, or model..."
              className="w-full rounded-3xl border border-muted/50 bg-background px-11 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-3xl border border-muted/50 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="in use">In Use</option>
            <option value="repair">Repair</option>
            <option value="broken">Broken</option>
          </select>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="rounded-3xl border border-muted/50 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-muted/60 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last Maintenance</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/50">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-semibold text-foreground">
                  {item.id}
                </td>
                <td className="px-4 py-4 text-foreground">{item.brand}</td>
                <td className="px-4 py-4 text-muted-foreground">
                  {item.model}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-muted-foreground text-xs">
                  {item.lastMaintenance}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-muted hover:bg-muted/80 text-muted-foreground transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-muted hover:bg-muted/80 text-destructive transition-colors"
                    >
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
