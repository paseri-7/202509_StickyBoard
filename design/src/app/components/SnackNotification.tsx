import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface SnackNotificationProps {
  message: string;
  duration?: number;
  onClose: () => void;
}

export function SnackNotification({
  message,
  duration = 4000,
  onClose,
}: SnackNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-gradient-to-r from-[#FF85B8] to-[#E8D6FF] text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 min-w-[300px] max-w-[400px]">
            <span className="flex-1">{message}</span>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
