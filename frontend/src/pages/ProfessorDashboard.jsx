import { useAuth } from '../context/AuthContext';
import { CalendarDays, BookOpen, Clock, TrendingUp } from 'lucide-react';

const ProfessorDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Upcoming Bookings', value: '—', icon: CalendarDays, color: 'bg-primary-500' },
    { label: 'This Week', value: '—', icon: Clock, color: 'bg-emerald-500' },
    { label: 'Total Reservations', value: '—', icon: TrendingUp, color: 'bg-violet-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 lg:p-8 text-white shadow-lg shadow-primary-600/20">
        <h1 className="text-2xl lg:text-3xl font-bold">
          Welcome back, {user?.fullName} 👋
        </h1>
        <p className="mt-2 text-primary-100 text-sm lg:text-base">
          Manage your DataShow reservations and view your schedule.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Calendar placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            Booking Calendar
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">View and manage your DataShow reservations</p>
        </div>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
            <CalendarDays className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Calendar Coming Soon</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">
            The interactive booking calendar will be available here to reserve DataShow equipment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
