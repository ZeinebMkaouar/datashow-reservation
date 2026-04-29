import { useState } from "react";
import { Calendar } from "lucide-react";

const initialWeeks = [
  { id: 1, label: "Week of 2026-04-13", open: true },
  { id: 2, label: "Week of 2026-04-20", open: true },
  { id: 3, label: "Week of 2026-04-27", open: false },
  { id: 4, label: "Week of 2026-05-04", open: false },
  { id: 5, label: "Week of 2026-05-11", open: false },
];

const AdminWeeks = () => {
  const [weeks, setWeeks] = useState(initialWeeks);
  const [autoOpen, setAutoOpen] = useState(false);

  const toggleWeek = (id) => {
    setWeeks((prev) =>
      prev.map((week) =>
        week.id === id ? { ...week, open: !week.open } : week,
      ),
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calendar className="w-8 h-8 text-purple-500" />
          Week Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Control which weeks are open for booking.
        </p>
      </div>

      <div className="bg-card rounded-3xl p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border border-muted/60 shadow-sm">
        <div>
          <p className="font-medium text-foreground">Auto-Open Weeks</p>
          <p className="text-sm text-muted-foreground">
            Automatically open the next week every Sunday at midnight.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={autoOpen}
            onChange={() => setAutoOpen((prev) => !prev)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 rounded-full bg-muted/50 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/40"></div>
          <div className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"></div>
        </label>
      </div>

      <div className="bg-card rounded-lg card-shadow divide-y border border-muted/60">
        {weeks.map((week) => (
          <div
            key={week.id}
            className="p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${week.open ? "bg-success" : "bg-muted-foreground/40"}`}
              />
              <span className="font-medium text-foreground">{week.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {week.open ? "Open" : "Closed"}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={week.open}
                  onChange={() => toggleWeek(week.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 rounded-full bg-muted/50 peer-checked:bg-primary peer-focus:ring-2 peer-focus:ring-primary/40"></div>
                <div className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWeeks;
