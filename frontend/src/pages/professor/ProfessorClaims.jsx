import { useState, useEffect } from "react";
import { MessageSquare, Info, AlertCircle } from "lucide-react";
import api from "../../services/api";
import ConfirmModal from "../../components/ConfirmModal";

const ProfessorClaims = () => {
  const [formData, setFormData] = useState({
    datashowId: "",
    issueType: "",
    description: "",
  });
  const [datashows, setDatashows] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
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
        title: "Success",
        message: "Your claim has been submitted successfully. The administration will review it soon.",
        type: "success",
      });
      setFormData({ datashowId: "", issueType: "", description: "" });
    } catch (error) {
      console.error("Failed to submit claim:", error);
      setConfirmModal({
        isOpen: true,
        title: "Error",
        message: "Failed to submit claim. Please try again later.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in relative">
      <ConfirmModal
        {...confirmModal}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          Help / Claims
        </h1>
        <p className="text-muted-foreground text-sm lg:text-base mt-2">
          Report an issue with a projector or missing accessories.
        </p>
      </div>

      {/* Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm flex items-start gap-3">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <span className="text-muted-foreground">
          <strong className="text-foreground">Support Workflow:</strong> Your claims are sent directly to the maintenance team. If a DataShow is reported as broken, it will be inspected and moved to <strong className="text-foreground">Maintenance</strong> if necessary.
        </span>
      </div>

      {/* Form */}
      <div className="bg-card rounded-xl card-shadow p-6 lg:p-8 border border-border">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DataShow ID */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Select DataShow
            </label>
            <select
              name="datashowId"
              value={formData.datashowId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="">Select a DataShow</option>
              {datashows.map(ds => (
                <option key={ds._id} value={ds.numero}>{ds.numero} — {ds.marque} {ds.modele}</option>
              ))}
            </select>
          </div>

          {/* Issue Type */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Issue Type
            </label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            >
              <option value="">Select issue category</option>
              <option value="not-working">Not working / Won't turn on</option>
              <option value="poor-quality">Poor quality (Blurry/Dim)</option>
              <option value="missing-accessories">Missing cables (HDMI/VGA/Remote)</option>
              <option value="damaged">Physical damage</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Detailed Description
            </label>
            <textarea
              name="description"
              placeholder="What exactly is the problem? Mention room number if relevant."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? "Submitting..." : (
              <>
                <AlertCircle className="w-4 h-4" />
                Submit Claim
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Claims are reviewed within 24-48 hours. For urgent technical support, please visit the IT office.
        </p>
      </div>
    </div>
  );
};

export default ProfessorClaims;
