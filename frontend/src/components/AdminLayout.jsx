import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
} from "lucide-react";

const navItems = [
  { title: "Overview", url: "/admin/overview", icon: LayoutDashboard },
  { title: "Inventory", url: "/admin/inventory", icon: Package },
  { title: "Room Management", url: "/admin/rooms", icon: DoorOpen },
  { title: "Maintenance Logs", url: "/admin/maintenance", icon: Wrench },
  { title: "Claims", url: "/admin/claims", icon: MessageSquare },
  { title: "Week Management", url: "/admin/weeks", icon: Settings },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col ${collapsed ? "w-20" : "w-72"} transition-all duration-300 bg-sidebar-background text-sidebar-foreground border-r border-muted/50`}
      >
        <div className={`p-4 ${collapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-2">
            <MonitorPlay className="w-6 h-6" />
            {!collapsed && <span className="font-bold text-lg">DataShow</span>}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 mb-1 text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-auto p-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-20" : "ml-72"}`}>
        <header className="h-14 flex items-center justify-between border-b border-muted/50 bg-card px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <PanelLeft className={`w-5 h-5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
            </button>
            <span className="text-sm font-medium text-muted-foreground">Admin Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted/70 text-muted-foreground hover:bg-muted transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white font-semibold">
                3
              </span>
            </button>
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium text-foreground">
                {user?.fullName}
              </span>
              <span className="text-xs text-muted-foreground">
                Administrator
              </span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
