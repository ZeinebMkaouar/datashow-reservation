import { useState, useEffect } from "react";
import { ClipboardList, Search, Filter, Calendar, Projector, CheckCircle2, XCircle } from "lucide-react";
import api from "../../services/api";
import { useTranslation } from "react-i18next";

const AdminReservations = () => {
  const { t, i18n } = useTranslation();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => { fetchReservations(); }, [search, filterStatus]);

  const fetchReservations = async () => {
    try {
      const statusParam = filterStatus === 'all' ? '' : `&status=${filterStatus}`;
      const r = await api.get(`/reservations/all?search=${search}${statusParam}`);
      setReservations(r.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed": return "bg-success/10 text-success border-success/20";
      case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20";
      case "completed": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "confirmed": return t('common.confirmed');
      case "cancelled": return t('common.cancelled');
      case "completed": return t('common.completed');
      default: return status;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-primary" />{t('adminReservations.title')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('adminReservations.subtitle')}</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder={t('adminReservations.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-3xl border border-border bg-background px-10 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full appearance-none rounded-3xl border border-border bg-background px-10 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                <option value="all">{t('common.allStatus')}</option>
                <option value="confirmed">{t('common.confirmed')}</option>
                <option value="cancelled">{t('common.cancelled')}</option>
                <option value="completed">{t('common.completed')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-6 py-4">{t('common.date')} & {t('common.slot')}</th>
              <th className="px-6 py-4">{t('adminReservations.professor')}</th>
              <th className="px-6 py-4">{t('common.room')}</th>
              <th className="px-6 py-4">DataShow</th>
              <th className="px-6 py-4">{t('common.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">{t('adminReservations.loading')}</td></tr>
            ) : reservations.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-10 text-center text-muted-foreground">{t('adminReservations.noFound')}</td></tr>
            ) : (
              reservations.map((res) => (
                <tr key={res._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(res.date).toLocaleDateString(i18n.language)}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium ml-5">{res.seance}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {res.professeur?.fullName?.charAt(0) || "P"}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{res.professeur?.fullName}</span>
                        <span className="text-xs text-muted-foreground">{res.professeur?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{res.salle}</td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Projector className="w-4 h-4 text-primary" />{res.datashow?.numero}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${getStatusStyle(res.status)}`}>
                      {res.status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                      {res.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                      {getStatusLabel(res.status)}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservations;
