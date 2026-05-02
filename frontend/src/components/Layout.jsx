import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
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
  PanelLeft,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const Layout = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const professorLinks = [
    { to: "/professor/dashboard", key: "nav.dashboard", icon: LayoutDashboard },
    { to: "/professor/schedule", key: "nav.schedule", icon: Calendar },
    { to: "/professor/book", key: "nav.book", icon: BookOpen },
    {
      to: "/professor/reservations",
      key: "nav.reservations",
      icon: ClipboardList,
    },
    { to: "/professor/claims", key: "nav.claims", icon: MessageSquare },
  ];

  const adminLinks = [
    { to: "/admin/overview", key: "nav.dashboard", icon: LayoutDashboard },
    { to: "/admin/inventory", key: "nav.inventory", icon: Projector },
    { to: "/admin/rooms", key: "nav.rooms", icon: DoorOpen },
    { to: "/admin/maintenance", key: "nav.maintenance", icon: Wrench },
    { to: "/admin/claims", key: "nav.claims", icon: MessageSquare },
    { to: "/admin/weeks", key: "nav.weeks", icon: CalendarIcon },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : professorLinks;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:inset-auto lg:translate-x-0 flex flex-col h-full ${isCollapsed ? "lg:w-20" : "lg:w-72"
          } transition-all duration-300 sidebar-gradient text-white border-r border-white/10 ${sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full"
          } overflow-hidden`}
      >
        {/* Logo */}
        <div className={`p-6 flex items-center border-b border-white/10 ${isCollapsed ? "lg:justify-center" : ""}`}>
          <Projector className="w-6 h-6 text-white shrink-0" />
          <h1 className={`font-bold tracking-tight transition-all duration-300 ${isCollapsed ? "lg:opacity-0 lg:w-0 lg:ml-0" : "opacity-100 ml-3 text-xl"} overflow-hidden whitespace-nowrap`}>
            DataShow
          </h1>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            const title = t(link.key);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                  } ${isCollapsed ? "lg:justify-center" : ""}`}
                title={isCollapsed ? title : ""}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span className={`transition-all duration-300 ${isCollapsed ? "lg:opacity-0 lg:w-0 lg:ml-0" : "opacity-100 ml-3"} overflow-hidden whitespace-nowrap`}>
                  {title}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="mt-auto p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full rounded-lg px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300 cursor-pointer ${isCollapsed ? "lg:justify-center" : ""}`}
            title={isCollapsed ? t("nav.logout") : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-all duration-300 ${isCollapsed ? "lg:opacity-0 lg:w-0 lg:ml-0" : "opacity-100 ml-3"} overflow-hidden whitespace-nowrap`}>
              {t("nav.logout")}
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 shrink-0 z-30 backdrop-blur-sm bg-white/95">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Sidebar Toggle & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <PanelLeft className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} />
            </button>

            <div className="flex items-center gap-2 text-gray-500">
              <span className="text-sm font-medium text-gray-500">
                {user?.role === 'ADMIN' ? t("nav.adminPortal") : t("nav.profPortal")}
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher />
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
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
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
