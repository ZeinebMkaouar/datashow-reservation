import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ClipboardList,
  MessageSquare,
  LogOut,
  Menu,
  X,
  User,
  Projector,
  DoorOpen,
  Wrench,
  Calendar as CalendarIcon,
  Bell,
} from "lucide-react";

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const professorLinks = [
    { to: "/professor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/professor/schedule", label: "My Schedule", icon: Calendar },
    { to: "/professor/book", label: "Book a DataShow", icon: BookOpen },
    {
      to: "/professor/reservations",
      label: "My Reservations",
      icon: ClipboardList,
    },
    { to: "/professor/claims", label: "Help / Claims", icon: MessageSquare },
  ];

  const adminLinks = [
    { to: "/admin/overview", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/inventory", label: "Inventory", icon: Projector },
    { to: "/admin/rooms", label: "Room Management", icon: DoorOpen },
    { to: "/admin/maintenance", label: "Maintenance Logs", icon: Wrench },
    { to: "/admin/claims", label: "Claims", icon: MessageSquare },
    { to: "/admin/weeks", label: "Week Management", icon: CalendarIcon },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : professorLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 sidebar-gradient text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <Projector className="w-6 h-6 text-white" />
          <h1 className="text-xl font-bold tracking-tight">DataShow</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="px-3 py-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 sticky top-0 z-30 backdrop-blur-sm bg-white/95">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-5 h-5 border border-gray-300 rounded flex items-center justify-center">
              <span className="text-[10px] font-bold">[]</span>
            </div>
            <span className="text-sm font-medium">Professor Portal</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white">
                3
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
              {user?.fullName?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
