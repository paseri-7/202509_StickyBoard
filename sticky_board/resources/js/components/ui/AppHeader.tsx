import React from "react";
import { useNotificationPolling } from "../../hooks/useNotificationPolling";
import NotificationSnack from "./NotificationSnack";

type AppHeaderProps = {
    userName?: string;
    userImageUrl?: string;
    unreadCount?: number;
    onProfileClick?: () => void;
    onNotificationsClick?: () => void;
    onLogout?: () => void;
};

const AppHeader: React.FC<AppHeaderProps> = ({
    userName = "ユーザー",
    userImageUrl,
    unreadCount = 0,
    onProfileClick,
    onNotificationsClick,
    onLogout,
}) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const { snack, closeSnack } = useNotificationPolling();
    const [hasSnackUnread, setHasSnackUnread] = React.useState(false);

    React.useEffect(() => {
        if (snack) {
            setHasSnackUnread(true);
        }
    }, [snack]);

    React.useEffect(() => {
        if (unreadCount > 0 && hasSnackUnread) {
            setHasSnackUnread(false);
        }
    }, [unreadCount, hasSnackUnread]);

    const derivedUnreadCount =
        unreadCount > 0 ? unreadCount : hasSnackUnread ? 1 : 0;

    React.useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [menuOpen]);

    const handleMenuAction = (action?: () => void) => {
        setMenuOpen(false);
        if (action) {
            action();
        }
    };

    return (
        <>
            <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
                <div className="mx-auto flex w-full items-center justify-between px-30 py-4">
                    <div className="flex items-center gap-3">
                        <a
                            className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-400 via-violet-400 to-sky-400 bg-clip-text"
                            href="/boards"
                        >
                            StickyBoard
                        </a>
                        <span className="text-sm text-slate-600">
                            {userName}さん ようこそ！
                        </span>
                    </div>

                    <div className="relative" ref={menuRef}>
                        <button
                            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-pink-200"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                        >
                            {userImageUrl ? (
                                <img
                                    src={userImageUrl}
                                    alt={userName}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                            ) : (
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-100">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4 text-slate-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle cx="12" cy="8" r="3"></circle>
                                        <path d="M4 20c1.6-3.2 5-5 8-5s6.4 1.8 8 5"></path>
                                    </svg>
                                </span>
                            )}
                            {derivedUnreadCount > 0 ? (
                                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                    !
                                </span>
                            ) : null}
                        </button>

                        {menuOpen ? (
                            <div
                                className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                                role="menu"
                            >
                                <button
                                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-pink-50"
                                    type="button"
                                    onClick={() =>
                                        handleMenuAction(onProfileClick)
                                    }
                                >
                                    プロフィール編集
                                </button>
                                <button
                                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-sky-50"
                                    type="button"
                                    onClick={() =>
                                        handleMenuAction(onNotificationsClick)
                                    }
                                >
                                    <span>通知一覧</span>
                                    {derivedUnreadCount > 0 ? (
                                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">
                                            {derivedUnreadCount}
                                        </span>
                                    ) : null}
                                </button>
                                <button
                                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-rose-500 hover:bg-rose-50"
                                    type="button"
                                    onClick={() => handleMenuAction(onLogout)}
                                >
                                    ログアウト
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </header>
            {snack ? <NotificationSnack onClose={closeSnack} /> : null}
        </>
    );
};

export default AppHeader;
