import { useEffect, useRef, useState } from "react";
import { NotificationItem } from "../types/Notification";

const STORAGE_KEY = "latest_notification_id";
const POLL_INTERVAL_MS = 5000;

export const useNotificationPolling = () => {
    const [snack, setSnack] = useState<NotificationItem | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchLatest = async (silentInit: boolean) => {
            try {
                const response = await fetch(
                    "/notifications/data?page=1&per_page=1",
                );
                if (!response.ok) {
                    return;
                }
                const payload = (await response.json()) as {
                    data: NotificationItem[];
                };
                const latest = payload.data?.[0];
                if (!latest) {
                    return;
                }

                const stored = window.sessionStorage.getItem(STORAGE_KEY);
                if (!stored) {
                    window.sessionStorage.setItem(
                        STORAGE_KEY,
                        String(latest.id),
                    );
                    return;
                }

                if (Number(stored) !== latest.id) {
                    window.sessionStorage.setItem(
                        STORAGE_KEY,
                        String(latest.id),
                    );
                    if (!silentInit && !latest.isRead && isMounted) {
                        setSnack(latest);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchLatest(true);
        timerRef.current = window.setInterval(() => {
            fetchLatest(false);
        }, POLL_INTERVAL_MS);

        return () => {
            isMounted = false;
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
            }
        };
    }, []);

    return {
        snack,
        closeSnack: () => setSnack(null),
    };
};
