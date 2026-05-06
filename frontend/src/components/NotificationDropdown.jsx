import { useState, useEffect, useRef } from "react";
import { Bell, Check, Info } from "lucide-react";
import api from "../services/api";
import { useTranslation } from "react-i18next";

const NotificationDropdown = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/notifications/read-all");
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-all cursor-pointer shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-white/10"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white font-bold border border-white dark:border-gray-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-card rounded-2xl shadow-2xl border border-gray-100 dark:border-border overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-100 dark:border-border flex items-center justify-between bg-muted/30">
            <h3 className="font-bold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
               <Bell className="w-4 h-4 text-primary" />
               {t('notifications.title', 'Notifications')}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-primary hover:underline font-medium cursor-pointer"
              >
                {t('notifications.markAll', 'Tout lire')}
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto divide-y divide-gray-50 dark:divide-white/5">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">{t('notifications.empty', 'Aucune notification')}</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors relative group ${!n.isRead ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-bold ${!n.isRead ? 'text-primary' : 'text-foreground'}`}>{n.title}</h4>
                    {!n.isRead && (
                      <button 
                        onClick={() => markAsRead(n._id)}
                        className="opacity-0 group-hover:opacity-100 text-primary hover:text-primary/80 transition-opacity cursor-pointer p-1 rounded-full hover:bg-primary/10"
                        title="Marquer comme lu"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed flex gap-2">
                    <span className="mt-1"><Info className="w-3 h-3 text-primary opacity-50 shrink-0" /></span>
                    {n.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground/60 mt-3 block font-medium">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 dark:border-border text-center bg-muted/10">
              <button className="text-xs text-muted-foreground hover:text-foreground transition-colors font-semibold">
                {t('notifications.viewAll', 'Voir tout')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
