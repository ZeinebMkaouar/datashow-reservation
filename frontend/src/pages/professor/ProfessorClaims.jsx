import { useState, useEffect } from "react";
import { MessageSquare, Info, AlertCircle } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";
import { useTranslation } from "react-i18next";

const ProfessorClaims = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    datashowId: "",
    issueType: "",
    description: "",
  });
  const [datashows, setDatashows] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false, title: "", message: "", type: "info", onConfirm: null,
  });

  useEffect(() => {
    fetchDatashows();
  }, []);

  const fetchDatashows = async () => {
    try {
      const response = await api.get('/datashows');
      setDatashows(response.data);
    } catch (error) {
      console.error("Failed to fetch datashows:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.datashowId || !formData.issueType || !formData.description) {
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/claims', formData);
      setConfirmModal({
        isOpen: true,
        title: t('profClaims.successTitle'),
        message: t('profClaims.successMsg'),
        type: "success",
      });
      setFormData({ datashowId: "", issueType: "", description: "" });
    } catch (error) {
      console.error("Failed to submit claim:", error);
      setConfirmModal({
        isOpen: true,
        title: t('profClaims.errorTitle'),
        message: t('profClaims.errorMsg'),
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">{t('profClaims.loading')}</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in relative">
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />

      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          {t('profClaims.title')}
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base mt-2">
          {t('profClaims.subtitle')}
        </p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">
          {t('profClaims.supportFlow')}
        </span>
      </div>

      <div className="bg-card rounded-xl card-shadow p-6 lg:p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t('profClaims.selectDatashow')}
            </label>
            <select
              name="datashowId"
              value={formData.datashowId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="">{t('profClaims.selectDatashowOpt')}</option>
              {datashows.map(ds => (
                <option key={ds._id} value={ds.numero}>{ds.numero} — {ds.marque} {ds.modele}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t('profClaims.issueType')}
            </label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="">{t('profClaims.selectCategory')}</option>
              <option value="not-working">{t('profClaims.notWorking')}</option>
              <option value="poor-quality">{t('profClaims.poorQuality')}</option>
              <option value="missing-accessories">{t('profClaims.missingAccessories')}</option>
              <option value="damaged">{t('profClaims.damaged')}</option>
              <option value="other">{t('profClaims.otherIssue')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              {t('profClaims.description')}
            </label>
            <textarea
              name="description"
              placeholder={t('profClaims.descPlaceholder')}
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? t('profClaims.submitting') : (
              <>
                <AlertCircle className="w-4 h-4" />
                {t('profClaims.submitBtn')}
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          {t('profClaims.footer')}
        </p>
      </div>
    </div>
  );
};

export default ProfessorClaims;
