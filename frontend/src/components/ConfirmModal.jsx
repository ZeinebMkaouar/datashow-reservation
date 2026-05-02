import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";

/**
 * Reusable modal component for confirmations, alerts, and success messages.
 *
 * Props:
 *  - isOpen (bool)
 *  - onClose ()
 *  - onConfirm () — optional, if provided shows confirm + cancel buttons
 *  - title (string)
 *  - message (string)
 *  - type: "danger" | "warning" | "success" | "info"  (default: "info")
 *  - confirmText (string) — label for confirm button (default: "Confirm")
 *  - cancelText  (string) — label for cancel  button (default: "Cancel")
 *  - loading (bool) — disables confirm button
 */
const typeConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
    confirmBg: "bg-destructive hover:bg-destructive/90",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    confirmBg: "bg-warning hover:bg-warning/90",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    confirmBg: "bg-success hover:bg-success/90",
  },
  info: {
    icon: Info,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    confirmBg: "bg-primary hover:bg-primary/90",
  },
  error: {
    icon: XCircle,
    iconColor: "text-destructive",
    iconBg: "bg-destructive/10",
    confirmBg: "bg-destructive hover:bg-destructive/90",
  },
};

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm",
  message = "",
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) => {
  if (!isOpen) return null;

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl border border-border flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 pb-2">
          <div className={`w-10 h-10 rounded-full ${config.iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-6 pt-4 flex justify-end gap-3">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${config.confirmBg}`}
              >
                {loading ? "Please wait..." : confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
