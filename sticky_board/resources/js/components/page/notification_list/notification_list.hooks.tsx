import { useCallback, useEffect, useState } from "react";
import { NotificationItem } from "../../../types/Notification";

const PAGE_SIZE = 10;

type NotificationResponse = {
    data: NotificationItem[];
    has_more: boolean;
};

export const useNotificationList = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? "";

    const fetchPage = useCallback(
        async (targetPage: number, append: boolean) => {
            const response = await fetch(
                `/notifications/data?page=${targetPage}&per_page=${PAGE_SIZE}`,
            );
            if (!response.ok) {
                throw new Error("Failed to fetch notifications.");
            }
            const data = (await response.json()) as NotificationResponse;
            setNotifications((prev) =>
                append ? [...prev, ...data.data] : data.data,
            );
            setHasMore(data.has_more);
            setPage(targetPage);
        },
        [],
    );

    useEffect(() => {
        let isMounted = true;

        const fetchInitial = async () => {
            try {
                await fetchPage(1, false);
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchInitial();

        return () => {
            isMounted = false;
        };
    }, [fetchPage]);

    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) {
            return;
        }
        setLoadingMore(true);
        try {
            await fetchPage(page + 1, true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    }, [fetchPage, hasMore, loadingMore, page]);

    const markRead = useCallback(
        async (notificationId: number) => {
            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === notificationId
                        ? { ...notification, isRead: true }
                        : notification,
                ),
            );
            const response = await fetch(`/notifications/${notificationId}/read`, {
                method: "PATCH",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to mark notification as read.");
            }
        },
        [csrfToken],
    );

    return {
        notifications,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        markRead,
    };
};
