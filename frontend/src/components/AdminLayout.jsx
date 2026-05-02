import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Package,
  DoorOpen,
  Wrench,
  MessageSquare,
  Settings,
  LogOut,
  MonitorPlay,
  Menu,
  Bell,
  PanelLeft,
  ClipboardList,
  Clock,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const navItemsConfig = [
  { key: "nav.dashboard", url: "/admin/overview", icon: LayoutDashboard },
  { key: "nav.inventory", url: "/admin/inventory", icon: Package },
  { key: "nav.reservations", url: "/admin/reservations", icon: ClipboardList },
  { key: "nav.rooms", url: "/admin/rooms", icon: DoorOpen },
  { key: "nav.maintenance", url: "/admin/maintenance", icon: Wrench },
  { key: "nav.claims", url: "/admin/claims", icon: MessageSquare },
  { key: "nav.weeks", url: "/admin/weeks", icon: Settings },
  { key: "nav.sessions", url: "/admin/sessions", icon: Clock },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 lg:static lg:inset-auto lg:translate-x-0 flex flex-col h-full ${
          collapsed ? "lg:w-20" : "lg:w-72"
        } transition-all duration-300 sidebar-gradient text-white border-r border-white/10 ${
          mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full"
        } overflow-hidden`}
      >
        <div className={`p-6 flex items-center border-b border-white/10 ${collapsed ? "lg:justify-center" : ""}`}>
          <MonitorPlay className="w-6 h-6 text-white shrink-0" />
          <span className={`font-bold transition-all duration-300 ${collapsed ? "lg:opacity-0 lg:w-0 lg:ml-0" : "opacity-100 ml-3 text-xl"} overflow-hidden whitespace-nowrap tracking-tight`}>
            DataShow
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 overflow-x-hidden">
          {navItemsConfig.map((item) => {
            const Icon = item.icon;
            const title = t(item.key);
            return (
              <NavLink
                key={item.url}
                to={item.url}
                end
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  } ${collapsed ? "lg:justify-center" : ""}`
                }
                title={collapsed ? title : ""}
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span className={`transition-all duration-300 ${collapsed ? "lg:opacity-0 lg:w-0 lg:ml-0" : "opacity-100 ml-3"} overflow-hidden whitespace-nowrap`}>
                  {title}
                </span>
              </NavLink>
            );
          })}
        </div>

        <div className="mt-auto p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300 cursor-pointer ${collapsed ? "lg:justify-center" : ""}`}
            title={collapsed ? t("nav.logout") : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className={`transition-all duration-300 ${collapsed ? "lg:opacity-0 lg:w-0 lg:ml-0" : "opacity-100 ml-3"} overflow-hidden whitespace-nowrap`}>
              {t("nav.logout")}
            </span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shrink-0 z-30 backdrop-blur-sm bg-white/95">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <PanelLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
            </button>
            <span className="text-sm font-medium text-gray-500">{t("nav.adminPortal")}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border border-white">
                3
              </span>
            </button>
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium text-gray-900">
                {user?.fullName}
              </span>
              <span className="text-xs text-gray-500">
                {t('auth.adminRole')}
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {user?.fullName?.charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
