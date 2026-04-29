import { useState } from "react";
import { Calendar } from "lucide-react";

const AdminWeeks = () => {
  const [autoOpen, setAutoOpen] = useState(true);
  const [weeks, setWeeks] = useState([
    { week: "Week of 2026-04-13", isOpen: true },
    { week: "Week of 2026-04-20", isOpen: true },
    { week: "Week of 2026-04-27", isOpen: false },
    { week: "Week of 2026-05-04", isOpen: false },
    { week: "Week of 2026-05-11", isOpen: false },
  ]);

  const toggleWeek = (index) => {
    const newWeeks = [...weeks];
    newWeeks[index].isOpen = !newWeeks[index].isOpen;
    setWeeks(newWeeks);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-8 h-8 text-purple-500" />
          Week Management
        </h1>
        <p className="text-gray-600 text-sm lg:text-base mt-2">
          Control which weeks are open for booking.
        </p>
      </div>

      {/* Auto-Open Setting */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Auto-Open Weeks</p>
            <p className="text-sm text-gray-600 mt-1">
              Automatically open the next week every Sunday at midnight.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoOpen}
              onChange={() => setAutoOpen(!autoOpen)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {/* Weeks List */}
      <div className="space-y-3">
        {weeks.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{item.week}</p>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {item.isOpen ? "Open" : "Closed"}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.isOpen}
                    onChange={() => toggleWeek(index)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWeeks;
