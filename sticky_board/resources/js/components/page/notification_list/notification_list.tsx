import React from "react";
import AppHeader from "../../ui/AppHeader";
import { useHeaderData } from "../../../hooks/useHeaderData";
import { useNotificationList } from "./notification_list.hooks";
import { NotificationItem } from "../../../types/Notification";

const NotificationList: React.FC = () => {
    const headerData = useHeaderData();
    const { notifications, loading, loadingMore, hasMore, loadMore, markRead } =
        useNotificationList();
    const observerTarget = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        if (!hasMore) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    loadMore();
                }
            },
            { threshold: 0.1 },
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [hasMore, loadMore]);

    const handleNotificationClick = async (notification: NotificationItem) => {
        try {
            if (!notification.isRead) {
                await markRead(notification.id);
            }
        } catch (error) {
            console.error(error);
        }

        const target = notification.stickyNoteId
            ? `/boards/${notification.boardId}?sticky_note_id=${notification.stickyNoteId}`
            : `/boards/${notification.boardId}`;
        window.location.href = target;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#FFF9FB] via-[#F9F6FF] to-[#F6FAFF] text-slate-900">
            <AppHeader {...headerData} />
            <div className="mx-auto w-full px-30 py-10">
                <button
                    className="rounded-2xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    onClick={() => {
                        window.location.href = "/boards";
                    }}
                >
                    ← 戻る
                </button>
                <h1 className="mt-6 text-3xl font-semibold">通知一覧</h1>

                {loading ? (
                    <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <span className="inline-flex h-6 w-6 animate-spin rounded-full border-2 border-violet-300 border-t-transparent"></span>
                        読み込み中...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#D6E9FF] to-[#E8D6FF]">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-16 w-16 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                            通知はありません
                        </h3>
                        <p className="text-slate-500">
                            新しい通知が届くとここに表示されます
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 space-y-3">
                        {notifications.map((notification, index) => (
                            <button
                                key={notification.id}
                                type="button"
                                onClick={() =>
                                    handleNotificationClick(notification)
                                }
                                className={`flex w-full items-start gap-4 rounded-3xl border-2 p-5 text-left transition hover:shadow-lg animate-slide-in ${
                                    notification.isRead
                                        ? "bg-gray-100 border-gray-200 hover:bg-gray-50"
                                        : "bg-white border-pink-200 hover:border-pink-300 shadow-md"
                                }`}
                                style={{
                                    animationDelay: `${Math.min(
                                        index * 60,
                                        300,
                                    )}ms`,
                                }}
                            >
                                <div
                                    className={`rounded-full p-3 ${
                                        notification.isRead
                                            ? "bg-gray-300"
                                            : "bg-gradient-to-br from-[#FF85B8] to-[#E8D6FF]"
                                    }`}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className={`h-5 w-5 ${
                                            notification.isRead
                                                ? "text-gray-600"
                                                : "text-white"
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                        <path d="M13.73 21a2 2 0 01-3.46 0"></path>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p
                                        className={`mb-2 ${
                                            notification.isRead
                                                ? "text-slate-500"
                                                : "text-slate-900 font-medium"
                                        }`}
                                    >
                                        {notification.message}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(
                                            notification.createdAt,
                                        ).toLocaleString("ja-JP", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                {!notification.isRead ? (
                                    <span className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-pink-400"></span>
                                ) : null}
                            </button>
                        ))}
                    </div>
                )}

                {hasMore ? (
                    <div ref={observerTarget} className="py-8 text-center">
                        {loadingMore ? (
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-pink-300 border-t-transparent"></div>
                        ) : (
                            <span className="text-xs text-slate-400">
                                さらに読み込み中...
                            </span>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default NotificationList;
