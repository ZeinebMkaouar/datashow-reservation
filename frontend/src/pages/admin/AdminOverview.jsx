import {
  CheckCircle,
  AlertTriangle,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

const stats = [
  {
    label: "Total DataShows",
    value: "24",
    icon: Package,
    color: "text-primary",
    trend: "+2 this month",
  },
  {
    label: "Available",
    value: "18",
    icon: CheckCircle,
    color: "text-success",
    trend: "75% of fleet",
  },
  {
    label: "In Repair",
    value: "4",
    icon: AlertTriangle,
    color: "text-warning",
    trend: "-1 vs last week",
  },
  {
    label: "Active Bookings",
    value: "12",
    icon: Users,
    color: "text-secondary",
    trend: "+4 today",
  },
];

const bookingsByDay = [
  { day: "Mon", bookings: 8 },
  { day: "Tue", bookings: 12 },
  { day: "Wed", bookings: 6 },
  { day: "Thu", bookings: 15 },
  { day: "Fri", bookings: 10 },
  { day: "Sat", bookings: 3 },
];

const statusDistribution = [
  { name: "Available", value: 18, color: "var(--color-success)" },
  { name: "In Use", value: 4, color: "var(--color-primary)" },
  { name: "Repair", value: 1, color: "var(--color-warning)" },
  { name: "Broken", value: 1, color: "var(--color-destructive)" },
];

const weeklyTrend = [
  { week: "W10", reservations: 22, claims: 1 },
  { week: "W11", reservations: 28, claims: 2 },
  { week: "W12", reservations: 35, claims: 1 },
  { week: "W13", reservations: 30, claims: 3 },
  { week: "W14", reservations: 40, claims: 2 },
  { week: "W15", reservations: 38, claims: 1 },
];

const recentActivity = [
  {
    action: "DS-004 booked by Dr. Benali",
    time: "10 min ago",
    type: "booking",
  },
  { action: "DS-012 marked for repair", time: "1 hour ago", type: "repair" },
  { action: "Week 2026-04-20 opened", time: "3 hours ago", type: "system" },
  { action: "Claim #45 resolved", time: "Yesterday", type: "claim" },
  {
    action: "DS-002 returned by Dr. Amrani",
    time: "Yesterday",
    type: "booking",
  },
];

const AdminOverview = () => (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Admin Overview</h1>
      <p className="text-muted-foreground">System status and analytics.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card rounded-3xl p-5 shadow-sm border border-muted/60"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {s.label}
              </p>
              <p className="mt-3 text-3xl font-semibold text-foreground">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {s.trend}
              </p>
            </div>
            <s.icon className={`w-10 h-10 ${s.color} opacity-90`} />
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="bg-card rounded-3xl p-6 shadow-sm border border-muted/60">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            Bookings by Day
          </h2>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Live
          </span>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingsByDay}>
              <XAxis
                dataKey="day"
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                }}
              />
              <Bar
                dataKey="bookings"
                fill="var(--color-primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-card rounded-3xl p-6 shadow-sm border border-muted/60">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">
            Fleet Status
          </h2>
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Updated
          </span>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="h-52 w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {statusDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {statusDistribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex h-3 w-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

    <section className="bg-card rounded-3xl p-6 shadow-sm border border-muted/60">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Weekly Trends
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Reservations and claims over the last 6 weeks.
          </p>
        </div>
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="week"
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="reservations"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="claims"
              stroke="var(--color-destructive)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>

    <section className="bg-card rounded-3xl shadow-sm border border-muted/60">
      <div className="p-5 border-b border-muted/60">
        <h2 className="text-lg font-semibold text-foreground">
          Recent Activity
        </h2>
      </div>
      <div className="divide-y">
        {recentActivity.map((item, index) => (
          <div
            key={index}
            className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-2 h-2 rounded-full ${
                  item.type === "booking"
                    ? "bg-primary"
                    : item.type === "repair"
                      ? "bg-warning"
                      : item.type === "claim"
                        ? "bg-destructive"
                        : "bg-success"
                }`}
              />
              <span className="text-sm text-foreground">{item.action}</span>
            </div>
            <span className="text-xs text-muted-foreground">{item.time}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default AdminOverview;
