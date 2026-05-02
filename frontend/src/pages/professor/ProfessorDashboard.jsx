import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usageBySlot, setUsageBySlot] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res, sessRes] = await Promise.all([
        api.get('/reservations/my'),
        api.get('/sessions')
      ]);

      setReservations(res.data);

      // Calculate usage by slot dynamically
      const slotCount = {};
      sessRes.data.forEach(s => slotCount[s.name] = 0);

      res.data.forEach(r => {
        if (slotCount[r.seance] !== undefined) {
          slotCount[r.seance]++;
        }
      });

      setUsageBySlot(Object.keys(slotCount).map(slot => ({ slot, count: slotCount[slot] })));
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
      label: t('profDashboard.statResTitle'),
      value: reservations.length.toString(),
      icon: TrendingUp,
      color: "text-primary",
      description: t('profDashboard.statResDesc'),
    },
    {
      label: t('profDashboard.statUpcomingTitle'),
      value: activeRes.length.toString(),
      icon: Clock,
      color: "text-secondary",
      description: t('profDashboard.statUpcomingDesc'),
    },
    {
      label: t('profDashboard.statDoneTitle'),
      value: completedRes.length.toString(),
      icon: Check,
      color: "text-success",
      description: t('profDashboard.statDoneDesc'),
    },
    {
      label: t('profDashboard.statClaimsTitle'),
      value: "0",
      icon: AlertCircle,
      color: "text-warning",
      description: t('profDashboard.statClaimsDesc'),
    },
  ];

  const monthlyUsage = [
    { month: "Jan", bookings: 8 },
    { month: "Fév", bookings: 12 },
    { month: "Mar", bookings: 15 },
    { month: "Avr", bookings: reservations.length },
  ];

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">{t('profDashboard.loading')}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('profDashboard.greeting', { name: user?.fullName?.split(" ")[0] || "" })}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('profDashboard.subtitle')}
        </p>
      </div>

      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
          <HelpCircle className="w-5 h-5 text-primary" />
          {t('profDashboard.quickStart')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <h3 className="font-semibold text-foreground">{t('profDashboard.setupScheduleTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('profDashboard.setupScheduleDesc')}</p>
            <Link to="/professor/schedule" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mt-2">{t('profDashboard.setupScheduleLink')} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold">2</div>
            <h3 className="font-semibold text-foreground">{t('profDashboard.fastBookTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('profDashboard.fastBookDesc')}</p>
            <Link to="/professor/book" className="text-sm font-medium text-secondary hover:underline flex items-center gap-1 mt-2">{t('profDashboard.fastBookLink')} <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-warning text-white flex items-center justify-center font-bold">3</div>
            <h3 className="font-semibold text-foreground">{t('profDashboard.reportProblemTitle')}</h3>
            <p className="text-sm text-muted-foreground">{t('profDashboard.reportProblemDesc')}</p>
            <Link to="/professor/claims" className="text-sm font-medium text-warning hover:underline flex items-center gap-1 mt-2">{t('profDashboard.reportProblemLink')} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>

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
                    {stat.description}
                  </p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color} opacity-80`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl card-shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">{t('profDashboard.usageBySlot')}</h2>
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

        <div className="bg-card rounded-xl card-shadow p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">{t('profDashboard.monthlyRes')}</h2>
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

      <div className="bg-card rounded-xl card-shadow">
        <div className="p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {t('profDashboard.upcomingResTitle')}
          </h2>
        </div>
        <div className="divide-y divide-border">
          {upcomingReservations.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">{t('profDashboard.noUpcoming')}</div>
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
                    {new Date(res.date).toLocaleDateString(i18n.language, { weekday: 'long' })} — {t('common.slot')} {res.seance}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('common.room')} {res.salle} · DataShow: {res.datashow?.numero || t('profDashboard.unknown')}
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
