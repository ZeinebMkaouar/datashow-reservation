import { BarChart3, PieChart, TrendingUp } from "lucide-react";

const AdminOverview = () => {
  const stats = [
    {
      label: "Total DataShows",
      value: "24",
      change: "+2 this month",
      color: "bg-blue-500",
    },
    {
      label: "Available",
      value: "18",
      change: "75% of fleet",
      color: "bg-emerald-500",
    },
    {
      label: "In Repair",
      value: "4",
      change: "-1 vs last week",
      color: "bg-orange-500",
    },
    {
      label: "Active Bookings",
      value: "12",
      change: "+4 today",
      color: "bg-purple-500",
    },
  ];

  const recentActivity = [
    { action: "DS-004 booked by Dr. Benali", time: "10 min ago" },
    { action: "DS-012 marked for repair", time: "1 hour ago" },
    { action: "Week 2026-04-20 opened", time: "3 hours ago" },
    { action: "Claim #45 resolved", time: "Yesterday" },
    { action: "DS-002 returned by Dr. Amrani", time: "Yesterday" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Admin Overview
        </h1>
        <p className="text-gray-600 text-sm lg:text-base mt-2">
          System status and analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
          >
            <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stat.value}
            </p>
            <p className="text-xs text-gray-400 mt-2">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings by Day */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            Bookings by Day
          </h2>
          <div className="flex items-end gap-3 h-40">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
              <div key={day} className="flex-1 text-center">
                <div className="flex items-end justify-center h-32">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg"
                    style={{ height: `${(idx + 1) * 15}%` }}
                  />
                </div>
                <p className="text-xs font-medium text-gray-600 mt-2">{day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Status */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
            <PieChart className="w-5 h-5 text-purple-500" />
            Fleet Status
          </h2>
          <div className="space-y-4">
            {[
              { label: "Available", value: "18", color: "bg-emerald-500" },
              { label: "In Use", value: "4", color: "bg-blue-500" },
              { label: "Repair", value: "1", color: "bg-orange-500" },
              { label: "Broken", value: "1", color: "bg-red-500" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 ${item.color} rounded-full`} />
                  <span className="text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Weekly Trends
        </h2>
        <div className="flex items-end gap-3 h-48">
          {["W10", "W11", "W12", "W13", "W14", "W15"].map((week, idx) => (
            <div key={week} className="flex-1 text-center">
              <div className="flex items-end justify-center h-40">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg"
                  style={{ height: `${15 + idx * 8}%` }}
                />
              </div>
              <p className="text-xs font-medium text-gray-600 mt-2">{week}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <p className="text-sm text-gray-700">{item.action}</p>
              <p className="text-xs text-gray-400 whitespace-nowrap ml-4">
                {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
