import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationCenter() {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-pink-400" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/20 border-green-500/30';
      case 'error':
        return 'bg-red-500/20 border-red-500/30';
      case 'warning':
        return 'bg-yellow-500/20 border-yellow-500/30';
      case 'info':
      default:
        return 'bg-pink-500/20 border-pink-500/30';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md space-y-2 pointer-events-none">
      <AnimatePresence mode="sync">
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 400, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ duration: 0.3 }}
            className={`${getBgColor(notification.type)} backdrop-blur-2xl p-4 rounded-lg border flex items-start gap-3 pointer-events-auto`}
          >
            <div className="pt-0.5">{getIcon(notification.type)}</div>
            <p className="text-white/90 text-sm flex-1">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
