import { MessageSquare, Reply, CheckCircle } from "lucide-react";

const AdminClaims = () => {
  const claims = [
    {
      id: 45,
      title: "Lamp flickering",
      professor: "Dr. Benali",
      device: "DS-005",
      date: "2026-04-10",
      status: "open",
    },
    {
      id: 44,
      title: "No power output",
      professor: "Dr. Amrani",
      device: "DS-008",
      date: "2026-04-08",
      status: "open",
    },
    {
      id: 43,
      title: "Missing remote",
      professor: "Dr. Belkacem",
      device: "DS-003",
      date: "2026-04-03",
      status: "resolved",
    },
  ];

  const openClaims = claims.filter((c) => c.status === "open");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-purple-500" />
          Claims Inbox
        </h1>
        <p className="text-gray-600 text-sm lg:text-base mt-2">
          {openClaims.length} open claims
        </p>
      </div>

      {/* Claims List */}
      <div className="space-y-3">
        {claims.map((claim) => (
          <div
            key={claim.id}
            className={`rounded-xl border shadow-sm p-4 lg:p-6 ${
              claim.status === "open"
                ? "bg-white border-gray-100"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">
                  Claim #{claim.id} — {claim.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {claim.professor} · {claim.device} · {claim.date}
                </p>
                {claim.status === "resolved" && (
                  <p className="text-xs text-green-600 font-medium mt-2">
                    ✓ Resolved
                  </p>
                )}
              </div>
              {claim.status === "open" && (
                <div className="flex gap-2 whitespace-nowrap">
                  <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors font-medium text-sm">
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Resolve
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminClaims;
