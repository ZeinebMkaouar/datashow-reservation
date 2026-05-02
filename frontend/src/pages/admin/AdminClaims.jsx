import { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, X, Info, AlertTriangle, Clock } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import { useTranslation } from "react-i18next";

const AdminClaims = () => {
  const { t, i18n } = useTranslation();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolvingClaim, setResolvingClaim] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [modalError, setModalError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", type: "info", onConfirm: null });

  useEffect(() => { fetchClaims(); }, [filter]);

  const fetchClaims = async () => {
    try { const r = await api.get(`/claims/all?status=${filter}`); setClaims(r.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const openResolveModal = (claim) => { setResolvingClaim(claim); setAdminResponse(""); setModalError(""); setIsModalOpen(true); };

  const handleResolve = async () => {
    setModalError("");
    if (!adminResponse.trim()) { setModalError(t('adminClaims.resolveFail')); return; }
    setSubmitting(true);
    try {
      await api.put(`/claims/${resolvingClaim._id}/resolve`, { adminResponse });
      setIsModalOpen(false); setResolvingClaim(null); fetchClaims();
      setConfirmModal({ isOpen: true, title: t('common.success'), message: t('adminClaims.resolvedMsg'), type: "success" });
    } catch (e) { setModalError(t('adminClaims.resolveFail')); } finally { setSubmitting(false); }
  };

  const openClaims = claims.filter((c) => c.status === "open");
  const resolvedClaims = claims.filter((c) => c.status === "resolved");
  const filtered = filter === "all" ? claims : filter === "open" ? openClaims : resolvedClaims;

  if (loading) return <div className="text-center py-10 text-muted-foreground">{t('adminClaims.loading')}</div>;

  return (
    <div className="space-y-6 animate-fade-in relative">
      <ConfirmModal {...confirmModal} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} />
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2"><MessageSquare className="w-8 h-8 text-primary" />{t('adminClaims.title')}</h1>
        <p className="text-muted-foreground text-sm lg:text-base mt-2">{t('adminClaims.subtitle')}</p>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">{t('adminClaims.subtitle')}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>{t('adminMaintenance.allStates')}</button>
        <button onClick={() => setFilter("open")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'open' ? 'bg-warning text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t('common.pending')}</span>
        </button>
        <button onClick={() => setFilter("resolved")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'resolved' ? 'bg-success text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5" /> {t('adminClaims.resolved')}</span>
        </button>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-center py-10 bg-card rounded-xl border border-border text-muted-foreground">{t('adminClaims.noFound')}</div>}
        {filtered.map((claim) => (
          <div key={claim._id} className={`rounded-xl border shadow-sm p-4 lg:p-6 ${claim.status === "open" ? "bg-card border-l-4 border-l-warning border-border" : "bg-muted/30 border-border"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${claim.status === 'open' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                    {claim.status === 'open' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                    {claim.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(claim.createdAt).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <p className="font-semibold text-foreground mt-2">{claim.issueType} — DataShow {claim.datashowId}</p>
                <p className="text-sm text-muted-foreground mt-1">{t('adminClaims.colProfessor')} : <strong className="text-foreground">{claim.professeur?.fullName || t('profDashboard.unknown')}</strong></p>
                <p className="text-sm text-foreground mt-3 bg-muted/50 p-3 rounded-lg">"{claim.description}"</p>
                {claim.status === "resolved" && (
                  <div className="mt-3 bg-success/5 border border-success/20 p-3 rounded-lg">
                    <p className="text-xs text-success font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> {t('adminClaims.resolved')} {claim.resolvedAt && new Date(claim.resolvedAt).toLocaleDateString(i18n.language)}</p>
                    {claim.adminResponse && <p className="text-sm text-foreground mt-1">{claim.adminResponse}</p>}
                  </div>
                )}
              </div>
              {claim.status === "open" && (
                <button onClick={() => openResolveModal(claim)} className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-colors font-medium text-sm shrink-0">
                  <CheckCircle className="w-4 h-4" />{t('adminClaims.resolve')}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && resolvingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{t('adminClaims.resolveTitle')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-muted/50 p-3 rounded-lg text-sm">
                <p className="text-muted-foreground"><strong className="text-foreground">{resolvingClaim.issueType}</strong> — DataShow {resolvingClaim.datashowId}</p>
                <p className="text-muted-foreground mt-1">{t('adminClaims.colProfessor')}: {resolvingClaim.professeur?.fullName}</p>
              </div>
              {modalError && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{modalError}</div>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Response</label>
                <textarea placeholder="..." value={adminResponse} onChange={(e) => setAdminResponse(e.target.value)} className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none" rows={4} />
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('common.cancel')}</button>
              <button onClick={handleResolve} disabled={submitting} className="px-4 py-2 text-sm font-medium bg-success text-white rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50">
                {submitting ? t('common.pleaseWait') : t('adminClaims.resolve')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClaims;
