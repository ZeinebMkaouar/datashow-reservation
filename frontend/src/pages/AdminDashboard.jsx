import { useAuth } from '../context/AuthContext';
import { DoorOpen, Projector, Users, Settings, BarChart3, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Rooms', value: '—', icon: DoorOpen, color: 'bg-primary-500' },
    { label: 'DataShows', value: '—', icon: Projector, color: 'bg-emerald-500' },
    { label: 'Professors', value: '—', icon: Users, color: 'bg-violet-500' },
    { label: 'Active Today', value: '—', icon: BarChart3, color: 'bg-amber-500' },
  ];

  const managementCards = [
    {
      title: 'Manage Rooms',
      description: 'Add, edit, or remove rooms available for reservation.',
      icon: DoorOpen,
      color: 'from-primary-500 to-primary-600',
    },
    {
      title: 'Manage DataShows',
      description: 'Track and manage DataShow projector equipment inventory.',
      icon: Projector,
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg shadow-gray-800/30">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
              Admin Panel
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </h1>
            <p className="mt-2 text-gray-300 text-sm lg:text-base">
              Welcome, {user?.fullName}. Manage rooms, DataShows, and monitor system activity.
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {managementCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="p-6">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{card.description}</p>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  Coming Soon
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminDashboard;
