import { useAuth } from "../../context/AuthContext";
import {
  TrendingUp,
  Clock,
  Check,
  AlertCircle,
  MonitorPlay,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const ProfessorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      label: "Active Reservations",
      value: "3",
      change: "2 this week",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "This Week's Slots",
      value: "12",
      change: "4 available",
      icon: Clock,
      color: "text-secondary",
    },
    {
      label: "Completed",
      value: "28",
      change: "+5 this month",
      icon: Check,
      color: "text-success",
    },
    {
      label: "Pending Claims",
      value: "1",
      change: "Avg 2d response",
      icon: AlertCircle,
      color: "text-warning",
    },
  ];

  const upcomingReservations = [
    {
      day: "Monday",
      slot: "Slot S2",
      room: "Room A-201",
      datashow: "DS-004",
      time: "10:00 - 11:30",
    },
    {
      day: "Tuesday",
      slot: "Slot S4",
      room: "Room B-103",
      datashow: "DS-007",
      time: "14:00 - 15:30",
    },
    {
      day: "Thursday",
      slot: "Slot S1",
      room: "Room A-201",
      datashow: "DS-004",
      time: "08:00 - 09:30",
    },
  ];

  const usageBySlot = [
    { slot: "S1", count: 8 },
    { slot: "S2", count: 12 },
    { slot: "S3", count: 6 },
    { slot: "S4", count: 14 },
    { slot: "S5", count: 9 },
    { slot: "S6", count: 4 },
  ];

  const monthlyUsage = [
    { month: "Jan", bookings: 8 },
    { month: "Feb", bookings: 12 },
    { month: "Mar", bookings: 15 },
    { month: "Apr", bookings: 10 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, {user?.fullName?.split(" ")[0] || "Dr. Benali"}
        </h1>
        <p className="mt-1 text-muted-foreground text-sm lg:text-base">
          Here's your reservation overview for this week.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-card rounded-xl card-shadow p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage by Slot Chart */}
        <div className="bg-card rounded-xl card-shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Usage by Slot
          </h2>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageBySlot} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="slot" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', background: "var(--color-card)", boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Bookings Chart */}
        <div className="bg-card rounded-xl card-shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            Monthly Bookings
          </h2>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyUsage} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', background: "var(--color-card)", boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="bookings" stroke="var(--color-primary)" fill="var(--color-primary-50)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Upcoming Reservations */}
      <div className="bg-card rounded-xl card-shadow">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            Upcoming Reservations
          </h2>
        </div>
        <div className="divide-y divide-border">
          {upcomingReservations.map((res, idx) => (
            <div
              key={idx}
              className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <MonitorPlay className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {res.day} — {res.slot}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {res.room} · {res.datashow}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {res.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
