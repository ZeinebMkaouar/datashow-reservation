import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  TrendingUp,
  Clock,
  Check,
  AlertCircle,
  MonitorPlay,
  Calendar,
  Zap,
  HelpCircle,
  ArrowRight
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
import api from "../../services/api";
import { Link } from "react-router-dom";

const ProfessorDashboard = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/reservations/my');
      setReservations(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeRes = reservations.filter(r => r.status === 'confirmed');
  const completedRes = reservations.filter(r => r.status === 'completed');
  
  // Sort by date upcoming
  const upcomingReservations = [...activeRes]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const stats = [
    {
      label: "Active Reservations",
      value: activeRes.length.toString(),
      change: "Current bookings",
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Total Bookings",
      value: reservations.length.toString(),
      change: "All time",
      icon: Clock,
      color: "text-secondary",
    },
    {
      label: "Completed",
      value: completedRes.length.toString(),
      change: "Finished sessions",
      icon: Check,
      color: "text-success",
    },
    {
      label: "Pending Claims",
      value: "0", 
      change: "Avg 2d response",
      icon: AlertCircle,
      color: "text-warning",
    },
  ];

  // Calculate usage by slot
  const slotCount = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0, S6: 0 };
  reservations.forEach(r => {
    if (slotCount[r.seance] !== undefined) {
      slotCount[r.seance]++;
    }
  });
  const usageBySlot = Object.keys(slotCount).map(slot => ({ slot, count: slotCount[slot] }));

  // Mock monthly usage since we might not have enough historical data yet
  const monthlyUsage = [
    { month: "Jan", bookings: 8 },
    { month: "Feb", bookings: 12 },
    { month: "Mar", bookings: 15 },
    { month: "Apr", bookings: reservations.length },
  ];

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, {user?.fullName?.split(" ")[0] || "Professor"}
        </h1>
        <p className="mt-1 text-muted-foreground text-sm lg:text-base">
          Here's your reservation overview.
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          Quick Start Guide: How to use the system
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <h3 className="font-semibold text-foreground">Set Schedule</h3>
            <p className="text-sm text-muted-foreground">Go to <strong>My Schedule</strong> and fill in the rooms where you have classes. You only do this once.</p>
            <Link to="/professor/schedule" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mt-2">Go to Schedule <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">2</div>
            <h3 className="font-semibold text-foreground">Fast Booking</h3>
            <p className="text-sm text-muted-foreground">Go to <strong>Book DataShow</strong>. Choose a date. We'll automatically find your class and assign a projector!</p>
            <Link to="/professor/book" className="text-sm font-medium text-secondary hover:underline flex items-center gap-1 mt-2">Book a Device <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-warning text-white flex items-center justify-center font-bold">3</div>
            <h3 className="font-semibold text-foreground">Report Issues</h3>
            <p className="text-sm text-muted-foreground">Missing a cable? Device broken? Go to <strong>Help/Claims</strong> to notify the administration immediately.</p>
            <Link to="/professor/claims" className="text-sm font-medium text-warning hover:underline flex items-center gap-1 mt-2">Report Issue <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
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
          {upcomingReservations.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">No upcoming reservations.</div>
          )}
          {upcomingReservations.map((res) => (
            <div
              key={res._id}
              className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <MonitorPlay className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {new Date(res.date).toLocaleDateString('en-GB', { weekday: 'long' })} — Slot {res.seance}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Room {res.salle} · DataShow: {res.datashow?.numero || 'Unknown'}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {new Date(res.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
