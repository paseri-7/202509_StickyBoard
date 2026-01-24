import { Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

export interface Notification {
  id: string;
  message: string;
  boardId: string;
  stickyNoteId?: string;
  isRead: boolean;
  createdAt: Date;
}

interface NotificationListPageProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onBack: () => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function NotificationListPage({
  notifications,
  onNotificationClick,
  onBack,
  onLoadMore,
  hasMore,
}: NotificationListPageProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, onLoadMore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9FB] via-[#F9F6FF] to-[#F6FAFF]">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="rounded-2xl hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            戻る
          </Button>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold mb-6"
        >
          通知一覧
        </motion.h2>

        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-[#D6E9FF] to-[#E8D6FF] rounded-full flex items-center justify-center mb-6">
              <Bell className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">通知はありません</h3>
            <p className="text-foreground/60">新しい通知が届くとここに表示されます</p>
          </motion.div>
        ) : (
          <>
            <div className="max-w-3xl mx-auto space-y-3">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onNotificationClick(notification)}
                  className={`cursor-pointer rounded-3xl p-5 border-2 transition-all hover:shadow-lg ${
                    notification.isRead
                      ? "bg-gray-100 border-gray-200 hover:bg-gray-50"
                      : "bg-white border-primary/20 hover:border-primary/40 shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-full p-3 ${
                        notification.isRead
                          ? "bg-gray-300"
                          : "bg-gradient-to-br from-[#FF85B8] to-[#E8D6FF]"
                      }`}
                    >
                      <Bell
                        className={`h-5 w-5 ${
                          notification.isRead ? "text-gray-600" : "text-white"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`mb-2 ${
                          notification.isRead
                            ? "text-foreground/60"
                            : "text-foreground font-medium"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <p className="text-xs text-foreground/40">
                        {notification.createdAt.toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div ref={observerTarget} className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
