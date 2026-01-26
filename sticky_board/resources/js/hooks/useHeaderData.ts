import { useEffect, useState } from "react";

type HeaderData = {
    userName: string;
    userImageUrl?: string;
    unreadCount: number;
    onProfileClick: () => void;
    onNotificationsClick: () => void;
    onLogout: () => void;
    applyProfileUpdate: (payload: { name: string; avatar?: string }) => void;
};

export const useHeaderData = (): HeaderData => {
    const [userName, setUserName] = useState("ユーザー");
    const [userImageUrl, setUserImageUrl] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? "";
    const pollingInterval = 30000;

    useEffect(() => {
        let isMounted = true;
        let timerId: number | null = null;

        const cachedAvatar = window.sessionStorage.getItem(
            "profile_avatar_preview",
        );
        if (cachedAvatar) {
            setUserImageUrl(cachedAvatar);
        }

        const fetchMe = async () => {
            try {
                const response = await fetch("/me");
                if (response.status === 401) {
                    window.location.href = "/login";
                    return;
                }
                if (!response.ok) {
                    return;
                }
                const data = (await response.json()) as {
                    name?: string;
                    avatar?: string | null;
                    unread_count?: number;
                };
                if (isMounted) {
                    if (data.name) {
                        setUserName(data.name);
                    }
                    if (data.avatar) {
                        if (cachedAvatar && cachedAvatar !== data.avatar) {
                            window.sessionStorage.removeItem(
                                "profile_avatar_preview",
                            );
                        }
                        setUserImageUrl(data.avatar);
                    }
                    setUnreadCount(data.unread_count ?? 0);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchMe();
        timerId = window.setInterval(fetchMe, pollingInterval);

        return () => {
            isMounted = false;
            if (timerId) {
                window.clearInterval(timerId);
            }
        };
    }, [pollingInterval]);

    return {
        userName,
        userImageUrl,
        unreadCount,
        onProfileClick: () => {
            window.location.href = "/profile";
        },
        onNotificationsClick: () => {
            window.location.href = "/notifications";
        },
        onLogout: async () => {
            await fetch("/logout", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
            });
            window.sessionStorage.removeItem("profile_avatar_preview");
            window.location.href = "/login";
        },
        applyProfileUpdate: (payload) => {
            setUserName(payload.name);
            if (payload.avatar !== undefined) {
                setUserImageUrl(payload.avatar);
            }
        },
    };
};
