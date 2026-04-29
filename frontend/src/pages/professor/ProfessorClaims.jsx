import { useState } from "react";
import { MessageSquare } from "lucide-react";

const ProfessorClaims = () => {
  const [formData, setFormData] = useState({
    datashowId: "",
    issueType: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Claim submitted successfully");
    setFormData({ datashowId: "", issueType: "", description: "" });
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
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

      {/* Form */}
      <div className="bg-card rounded-xl card-shadow p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DataShow ID */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              DataShow ID
            </label>
            <input
              type="text"
              name="datashowId"
              placeholder="e.g. DS-004"
              value={formData.datashowId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
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
              <option value="">Select issue</option>
              <option value="not-working">Not working</option>
              <option value="poor-quality">Poor quality</option>
              <option value="missing-accessories">Missing accessories</option>
              <option value="damaged">Damaged</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Describe the issue in detail..."
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
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-colors"
          >
            Submit Claim
          </button>
        </form>
      </div>

      {/* Info */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          <strong className="text-primary">Average response time:</strong> Claims are typically reviewed
          within 24-48 hours.
        </p>
      </div>
    </div>
  );
};

export default ProfessorClaims;
