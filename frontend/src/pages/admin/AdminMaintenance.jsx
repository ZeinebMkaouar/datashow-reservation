import { useState } from "react";
import { Wrench, Search, Download } from "lucide-react";

const logs = [
  {
    device: "DS-005",
    date: "2026-04-10",
    issue: "Lamp flickering intermittently",
    action: "Replaced lamp unit",
    tech: "M. Khelifi",
  },
  {
    device: "DS-008",
    date: "2026-04-08",
    issue: "No power output",
    action: "Diagnosed: PSU failure, awaiting part",
    tech: "M. Khelifi",
  },
  {
    device: "DS-003",
    date: "2026-04-03",
    issue: "Remote not responding",
    action: "Replaced batteries and IR sensor",
    tech: "A. Mansouri",
  },
  {
    device: "DS-012",
    date: "2026-03-28",
    issue: "Blurry projection",
    action: "Cleaned lens and recalibrated focus",
    tech: "A. Mansouri",
  },
  {
    device: "DS-001",
    date: "2026-03-20",
    issue: "HDMI port loose",
    action: "Re-soldered HDMI connector",
    tech: "M. Khelifi",
  },
];

const AdminMaintenance = () => {
  const [search, setSearch] = useState("");
  const [filterTech, setFilterTech] = useState("all");
  const techs = [...new Set(logs.map((log) => log.tech))];

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.device.toLowerCase().includes(search.toLowerCase()) ||
      log.issue.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchTech = filterTech === "all" || log.tech === filterTech;
    return matchSearch && matchTech;
  });

  const exportCSV = () => {
    const header = "Device,Date,Issue,Action,Technician\n";
    const rows = filtered
      .map(
        (log) =>
          `${log.device},${log.date},"${log.issue}","${log.action}",${log.tech}`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "maintenance_logs.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Wrench className="w-8 h-8 text-primary" />
            Maintenance Logs
          </h1>
          <p className="text-muted-foreground mt-2">
            Repair and maintenance history for all devices.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 rounded-3xl border border-muted/60 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted/70"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <div className="rounded-3xl border border-muted/60 bg-card p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by device, issue, or action..."
              className="w-full rounded-3xl border border-muted/50 bg-background px-11 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <select
            value={filterTech}
            onChange={(e) => setFilterTech(e.target.value)}
            className="rounded-3xl border border-muted/50 bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Technicians</option>
            {techs.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((log, idx) => (
            <div
              key={idx}
              className="bg-card rounded-3xl border border-muted/60 p-5 shadow-sm flex gap-4"
            >
              <div className="w-1 rounded-full bg-warning" />
              <div className="flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-foreground">
                    {log.device}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {log.date}
                  </span>
                </div>
                <p className="text-sm text-foreground mt-3">{log.issue}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  → {log.action}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  Technician: {log.tech}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-muted/60 bg-card p-10 text-center text-muted-foreground">
            No logs match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMaintenance;
