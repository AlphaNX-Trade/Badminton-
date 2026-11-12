import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, Bell, Calendar, Trophy, AlertCircle, Sparkles } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearAllNotifications } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-[#C7F464]" />;
      case 'tournament':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'waitlist':
        return <Sparkles className="w-4 h-4 text-sky-400" />;
      case 'cancellation':
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-[#9BA3A8]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#111519] border-l border-[#242C33] h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between p-5 border-b border-[#242C33]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#C7F464]" />
            <h3 className="text-base font-semibold text-[#F4F5F3]">Notification Hub</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearAllNotifications}
              className="text-xs text-[#9BA3A8] hover:text-[#C7F464] flex items-center gap-1 transition-colors px-2 py-1"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#9BA3A8] hover:text-[#F4F5F3] hover:bg-[#191F24] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-[#9BA3A8]">
              <Bell className="w-8 h-8 stroke-1 text-[#242C33] mb-2" />
              <p className="text-sm">No notifications right now</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-[#151A20]/50 border-[#242C33]/60 opacity-75'
                    : 'bg-[#151A20] border-[#C7F464]/30 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#191F24] shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#F4F5F3] truncate">{item.title}</p>
                      <span className="text-[11px] text-[#9BA3A8] shrink-0">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-[#9BA3A8] mt-1 leading-relaxed">{item.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[#242C33] bg-[#0E1216] text-center">
          <p className="text-xs text-[#9BA3A8]">
            Simulated live alert system · Connected to court scheduling state
          </p>
        </div>
      </div>
    </div>
  );
};
