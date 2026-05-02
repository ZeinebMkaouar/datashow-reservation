import { useState, useEffect } from "react";
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
import api from "../../services/api";
import { useTranslation } from "react-i18next";

const AdminOverview = () => {
  const [data, setData] = useState({
    datashows: [],
    reservations: [],
    repairs: [],
    claims: [],
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dsRes, resRes, repRes, claimsRes] = await Promise.all([
        api.get('/datashows'),
        api.get('/reservations/all'),
        api.get('/repairs'),
        api.get('/claims/all')
      ]);
      setData({
        datashows: dsRes.data,
        reservations: resRes.data,
        repairs: repRes.data,
        claims: claimsRes.data
      });
    } catch (error) {
      console.error("Failed to load admin overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  const { datashows, reservations, repairs, claims } = data;

  const availableDs = datashows.filter(d => d.etat === 'disponible').length;
  const inRepairDs = datashows.filter(d => d.etat === 'en_panne').length;

  const statusDistribution = [
    { name: t('adminDashboard.available'), value: availableDs, color: "var(--color-success)" },
    { name: t('adminDashboard.inRepair'), value: inRepairDs, color: "var(--color-destructive)" },
  ];

  const activeBookings = reservations.filter(r => r.status === 'confirmed').length;

  const stats = [
    {
      label: t('adminDashboard.totalDs'),
      value: datashows.length.toString(),
      icon: Package,
      color: "text-primary",
      trend: t('adminDashboard.totalFleet'),
    },
    {
      label: t('adminDashboard.available'),
      value: availableDs.toString(),
      icon: CheckCircle,
      color: "text-success",
      trend: t('adminDashboard.fleetPercent', { percent: datashows.length > 0 ? Math.round((availableDs / datashows.length) * 100) : 0 }),
    },
    {
      label: t('adminDashboard.inRepair'),
      value: inRepairDs.toString(),
      icon: AlertTriangle,
      color: "text-warning",
      trend: t('adminDashboard.outOfService'),
    },
    {
      label: t('adminDashboard.activeBookings'),
      value: activeBookings.toString(),
      icon: Users,
      color: "text-secondary",
      trend: t('adminDashboard.systemWide'),
    },
  ];

  // Calculate bookings by day based on reservations
  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const bookingsCount = { 'Lun': 0, 'Mar': 0, 'Mer': 0, 'Jeu': 0, 'Ven': 0, 'Sam': 0, 'Dim': 0 };
  reservations.forEach(r => {
    const day = daysOfWeek[new Date(r.date).getDay()];
    if (bookingsCount[day] !== undefined) {
      bookingsCount[day]++;
    }
  });
  const bookingsByDay = Object.keys(bookingsCount).filter(k => k !== 'Dim').map(day => {
    const keyIndex = daysOfWeek.indexOf(day);
    return { day: t(`adminDashboard.days.${dayKeys[keyIndex]}`), bookings: bookingsCount[day] }
  });

  // Recent Activity
  const recentActivities = [
    ...reservations.map(r => ({
      action: t('adminDashboard.bookingAction', { ds: r.datashow?.numero || t('datashow') }),
      time: new Date(r.createdAt || r.date).getTime(),
      displayTime: new Date(r.createdAt || r.date).toLocaleDateString(),
      type: "booking",
    })),
    ...repairs.map(r => ({
      action: t('adminDashboard.repairAction', { ds: r.datashow?.numero || t('datashow') }),
      time: new Date(r.createdAt || r.date).getTime(),
      displayTime: new Date(r.createdAt || r.date).toLocaleDateString(),
      type: "repair",
    })),
    ...claims.map(c => ({
      action: t('adminDashboard.claimAction', { dsId: c.datashowId }),
      time: new Date(c.createdAt).getTime(),
      displayTime: new Date(c.createdAt).toLocaleDateString(),
      type: "claim",
    }))
  ].sort((a, b) => b.time - a.time).slice(0, 5);

  // Dynamic Weekly Trend (Last 4 weeks)
  const getWeeklyTrend = () => {
    const trend = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (i * 7 + 7));
      const end = new Date(now);
      end.setDate(now.getDate() - (i * 7));

      const resCount = reservations.filter(r => {
        const d = new Date(r.date);
        return d >= start && d < end;
      }).length;

      const claimCount = claims.filter(c => {
        const d = new Date(c.createdAt);
        return d >= start && d < end;
      }).length;

      trend.push({
        week: i === 0 ? t('adminDashboard.currentWeek') : `${t('adminDashboard.weekPrefix')}${i}`,
        reservations: resCount,
        claims: claimCount
      });
    }
    return trend;
  };

  const weeklyTrend = getWeeklyTrend();

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">{t('adminDashboard.loading')}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('adminDashboard.title')}</h1>
        <p className="text-muted-foreground">{t('adminDashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-card rounded-3xl p-5 shadow-sm border border-border"
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
        <section className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              {t('adminDashboard.resByDay')}
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t('adminDashboard.live')}
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
                  name={t('nav.reservations')}
                  dataKey="bookings"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-card rounded-3xl p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              {t('adminDashboard.fleetState')}
            </h2>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {t('adminDashboard.updated')}
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

      <section className="bg-card rounded-3xl p-6 shadow-sm border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {t('adminDashboard.weeklyTrends')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('adminDashboard.trendsDesc')}
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
                name={t('nav.reservations')}
                dataKey="reservations"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                name={t('nav.claims')}
                dataKey="claims"
                stroke="var(--color-destructive)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-card rounded-3xl shadow-sm border border-border">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {t('adminDashboard.recentActivity')}
          </h2>
        </div>
        <div className="divide-y divide-border">
          {recentActivities.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">{t('adminDashboard.noRecent')}</div>
          )}
          {recentActivities.map((item, index) => (
            <div
              key={index}
              className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${item.type === "booking"
                      ? "bg-primary"
                      : item.type === "claim"
                        ? "bg-destructive"
                        : "bg-warning"
                    }`}
                />
                <span className="text-sm text-foreground">{item.action}</span>
              </div>
              <span className="text-xs text-muted-foreground">{item.displayTime}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
