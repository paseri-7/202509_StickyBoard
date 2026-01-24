import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Header } from "./components/Header";
import { LoginPage } from "./components/LoginPage";
import {
  BoardListPage,
  Board,
} from "./components/BoardListPage";
import { BoardFormPage } from "./components/BoardFormPage";
import { BoardDetailPage } from "./components/BoardDetailPage";
import {
  NotificationListPage,
  Notification,
} from "./components/NotificationListPage";
import { ProfileEditPage } from "./components/ProfileEditPage";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { SnackNotification } from "./components/SnackNotification";
import type { StickyNote } from "./components/StickyNote";
import type { Area } from "./components/Area";

type Page =
  | "login"
  | "board-list"
  | "board-create"
  | "board-edit"
  | "board-detail"
  | "notifications"
  | "profile-edit";

interface ConfirmState {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("ゲスト");
  const [userImage, setUserImage] = useState<string>();

  // Boards state
  const [boards, setBoards] = useState<Board[]>([]);
  const [currentBoardId, setCurrentBoardId] = useState<
    string | null
  >(null);
  const [boardsPage, setBoardsPage] = useState(1);
  const [hasMoreBoards, setHasMoreBoards] = useState(true);

  // Notifications state
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsPage, setNotificationsPage] = useState(1);
  const [hasMoreNotifications, setHasMoreNotifications] =
    useState(true);
  const [snackNotification, setSnackNotification] = useState<
    string | null
  >(null);

  // Canvas state (sticky notes and areas)
  const [stickyNotes, setStickyNotes] = useState<
    Record<string, StickyNote[]>
  >({});
  const [areas, setAreas] = useState<Record<string, Area[]>>(
    {},
  );

  // Confirm dialog state
  const [confirmState, setConfirmState] =
    useState<ConfirmState>({
      open: false,
      title: "",
      description: "",
      onConfirm: () => {},
    });

  // Initialize mock data
  useEffect(() => {
    // Mock boards
    const mockBoards: Board[] = [
      {
        id: "1",
        title: "プロジェクト管理",
        description: "開発タスクとスケジュール管理",
        updatedAt: new Date(2026, 0, 15),
      },
      {
        id: "2",
        title: "アイデアボード",
        description: "新規企画のブレインストーミング",
        updatedAt: new Date(2026, 0, 18),
      },
      {
        id: "3",
        title: "学習計画",
        description: "今月の学習目標と進捗",
        updatedAt: new Date(2026, 0, 19),
      },
    ];
    setBoards(mockBoards);

    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: "1",
        message: "付箋「レビュー依頼」の期限が近づいています",
        boardId: "1",
        stickyNoteId: "sticky1",
        isRead: false,
        createdAt: new Date(2026, 0, 19, 10, 30),
      },
      {
        id: "2",
        message: "ボード「プロジェクト管理」が更新されました",
        boardId: "1",
        isRead: false,
        createdAt: new Date(2026, 0, 19, 9, 15),
      },
      {
        id: "3",
        message: "付箋「データベース設計」が完了しました",
        boardId: "1",
        stickyNoteId: "sticky2",
        isRead: true,
        createdAt: new Date(2026, 0, 18, 16, 45),
      },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(
      mockNotifications.filter((n) => !n.isRead).length,
    );

    // Mock sticky notes for board 1
    setStickyNotes({
      "1": [
        {
          id: "sticky1",
          content:
            "レビュー依頼\n\nコードレビューをお願いします",
          backgroundColor: "#FFD6E8",
          deadline: new Date(2026, 0, 20, 17, 0),
          x: 150,
          y: 150,
        },
        {
          id: "sticky2",
          content: "データベース設計\n\n完了しました！",
          backgroundColor: "#D4F4DD",
          x: 450,
          y: 150,
        },
        {
          id: "sticky3",
          content: "UIデザイン確認",
          backgroundColor: "#D6E9FF",
          deadline: new Date(2026, 0, 21, 12, 0),
          x: 750,
          y: 150,
        },
      ],
    });

    // Mock areas for board 1
    setAreas({
      "1": [
        {
          id: "area1",
          title: "進行中",
          x: 100,
          y: 100,
          width: 600,
          height: 400,
        },
        {
          id: "area2",
          title: "完了",
          x: 750,
          y: 100,
          width: 400,
          height: 400,
        },
      ],
    });
  }, []);

  // Polling for new notifications (simulated)
  useEffect(() => {
    if (!isLoggedIn) return;

    const interval = setInterval(() => {
      // Simulate new notification randomly
      if (Math.random() > 0.95) {
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          message: "新しい通知が届きました",
          boardId: "1",
          isRead: false,
          createdAt: new Date(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        setSnackNotification(newNotification.message);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Handlers
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserName("山田太郎");
    setCurrentPage("board-list");
    toast.success("ログインしました");
  };

  const handleLogout = () => {
    setConfirmState({
      open: true,
      title: "ログアウト",
      description: "本当にログアウトしますか？",
      onConfirm: () => {
        setIsLoggedIn(false);
        setCurrentPage("login");
        setConfirmState((prev) => ({ ...prev, open: false }));
        toast.success("ログアウトしました");
      },
    });
  };

  const handleCreateBoard = () => {
    setCurrentPage("board-create");
  };

  const handleBoardFormSubmit = (
    title: string,
    description: string,
  ) => {
    setConfirmState({
      open: true,
      title:
        currentPage === "board-create"
          ? "ボード作成"
          : "ボード更新",
      description:
        currentPage === "board-create"
          ? "新しいボードを作成しますか？"
          : "ボードを更新しますか？",
      onConfirm: () => {
        if (currentPage === "board-create") {
          const newBoard: Board = {
            id: `board-${Date.now()}`,
            title,
            description,
            updatedAt: new Date(),
          };
          setBoards((prev) => [newBoard, ...prev]);
          toast.success("ボードを作成しました");
          setCurrentPage("board-list");
        } else if (
          currentPage === "board-edit" &&
          currentBoardId
        ) {
          setBoards((prev) =>
            prev.map((b) =>
              b.id === currentBoardId
                ? {
                    ...b,
                    title,
                    description,
                    updatedAt: new Date(),
                  }
                : b,
            ),
          );
          toast.success("ボードを更新しました");
          setCurrentPage("board-detail");
        }
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleDeleteBoard = (boardId: string) => {
    setConfirmState({
      open: true,
      title: "ボード削除",
      description:
        "このボードを削除しますか？この操作は取り消せません。",
      variant: "destructive",
      onConfirm: () => {
        setBoards((prev) =>
          prev.filter((b) => b.id !== boardId),
        );
        delete stickyNotes[boardId];
        delete areas[boardId];
        toast.success("ボードを削除しました");
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleBoardClick = (boardId: string) => {
    setCurrentBoardId(boardId);
    setCurrentPage("board-detail");
  };

  const handleEditBoard = () => {
    setCurrentPage("board-edit");
  };

  // Sticky note handlers
  const handleCreateSticky = (data: Partial<StickyNote>) => {
    if (!currentBoardId) return;

    setConfirmState({
      open: true,
      title: "付箋作成",
      description: "新しい付箋を作成しますか？",
      onConfirm: () => {
        const newSticky: StickyNote = {
          id: `sticky-${Date.now()}`,
          content: data.content || "",
          backgroundColor: data.backgroundColor || "#FFD6E8",
          deadline: data.deadline,
          x: data.x || 100,
          y: data.y || 100,
        };
        setStickyNotes((prev) => ({
          ...prev,
          [currentBoardId]: [
            ...(prev[currentBoardId] || []),
            newSticky,
          ],
        }));
        toast.success("付箋を作成しました");
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleUpdateSticky = (
    id: string,
    data: Partial<StickyNote>,
  ) => {
    if (!currentBoardId) return;

    // For position changes, update immediately without confirmation
    if (data.x !== undefined || data.y !== undefined) {
      setStickyNotes((prev) => ({
        ...prev,
        [currentBoardId]: prev[currentBoardId].map((s) =>
          s.id === id ? { ...s, ...data } : s,
        ),
      }));
      return;
    }

    setConfirmState({
      open: true,
      title: "付箋更新",
      description: "付箋を更新しますか？",
      onConfirm: () => {
        setStickyNotes((prev) => ({
          ...prev,
          [currentBoardId]: prev[currentBoardId].map((s) =>
            s.id === id ? { ...s, ...data } : s,
          ),
        }));
        toast.success("付箋を更新しました");
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleDeleteSticky = (id: string) => {
    if (!currentBoardId) return;

    setConfirmState({
      open: true,
      title: "付箋削除",
      description: "この付箋を削除しますか？",
      variant: "destructive",
      onConfirm: () => {
        setStickyNotes((prev) => ({
          ...prev,
          [currentBoardId]: prev[currentBoardId].filter(
            (s) => s.id !== id,
          ),
        }));
        toast.success("付箋を削除しました");
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  // Area handlers
  const handleCreateArea = (data: Partial<Area>) => {
    if (!currentBoardId) return;

    setConfirmState({
      open: true,
      title: "エリア作成",
      description: "新しいエリアを作成しますか？",
      onConfirm: () => {
        const newArea: Area = {
          id: `area-${Date.now()}`,
          title: data.title || "",
          x: data.x || 100,
          y: data.y || 100,
          width: data.width || 400,
          height: data.height || 300,
        };
        setAreas((prev) => ({
          ...prev,
          [currentBoardId]: [
            ...(prev[currentBoardId] || []),
            newArea,
          ],
        }));
        toast.success("エリアを作成しました");
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleUpdateArea = (
    id: string,
    data: Partial<Area>,
  ) => {
    if (!currentBoardId) return;

    // For position/size changes, update immediately without confirmation
    if (
      data.x !== undefined ||
      data.y !== undefined ||
      data.width !== undefined ||
      data.height !== undefined
    ) {
      setAreas((prev) => ({
        ...prev,
        [currentBoardId]: prev[currentBoardId].map((a) =>
          a.id === id ? { ...a, ...data } : a,
        ),
      }));
      return;
    }

    setConfirmState({
      open: true,
      title: "エリア更新",
      description: "エリアを更新しますか？",
      onConfirm: () => {
        setAreas((prev) => ({
          ...prev,
          [currentBoardId]: prev[currentBoardId].map((a) =>
            a.id === id ? { ...a, ...data } : a,
          ),
        }));
        toast.success("エリアを更新しました");
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleDeleteArea = (id: string) => {
    if (!currentBoardId) return;

    setConfirmState({
      open: true,
      title: "エリア削除",
      description: "このエリアを削除しますか？",
      variant: "destructive",
      onConfirm: () => {
        setAreas((prev) => ({
          ...prev,
          [currentBoardId]: prev[currentBoardId].filter(
            (a) => a.id !== id,
          ),
        }));
        toast.success("エリアを削除しました");
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleNotificationClick = (
    notification: Notification,
  ) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n,
      ),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Navigate to board
    setCurrentBoardId(notification.boardId);
    setCurrentPage("board-detail");
  };

  const handleProfileSave = (name: string) => {
    setConfirmState({
      open: true,
      title: "プロフィール更新",
      description: "プロフィールを更新しますか？",
      onConfirm: () => {
        setUserName(name);
        toast.success("プロフィールを更新しました");
        setCurrentPage("board-list");
        setConfirmState((prev) => ({ ...prev, open: false }));
      },
    });
  };

  const handleLoadMoreBoards = () => {
    // Simulate loading more boards
    setTimeout(() => {
      if (boardsPage >= 3) {
        setHasMoreBoards(false);
      } else {
        setBoardsPage((prev) => prev + 1);
      }
    }, 1000);
  };

  const handleLoadMoreNotifications = () => {
    // Simulate loading more notifications
    setTimeout(() => {
      if (notificationsPage >= 3) {
        setHasMoreNotifications(false);
      } else {
        setNotificationsPage((prev) => prev + 1);
      }
    }, 1000);
  };

  const currentBoard = currentBoardId
    ? boards.find((b) => b.id === currentBoardId)
    : null;

  return (
    <>
      {isLoggedIn && currentPage !== "login" && (
        <Header
          userName={userName}
          userImage={userImage}
          unreadCount={unreadCount}
          onProfileClick={() => setCurrentPage("profile-edit")}
          onNotificationsClick={() =>
            setCurrentPage("notifications")
          }
          onLogout={handleLogout}
        />
      )}

      {currentPage === "login" && (
        <LoginPage onLogin={handleLogin} />
      )}

      {currentPage === "board-list" && (
        <BoardListPage
          boards={boards}
          onBoardClick={handleBoardClick}
          onCreateBoard={handleCreateBoard}
          onDeleteBoard={handleDeleteBoard}
          onLoadMore={handleLoadMoreBoards}
          hasMore={hasMoreBoards}
        />
      )}

      {currentPage === "board-create" && (
        <BoardFormPage
          mode="create"
          onBack={() => setCurrentPage("board-list")}
          onSubmit={handleBoardFormSubmit}
        />
      )}

      {currentPage === "board-edit" && currentBoard && (
        <BoardFormPage
          mode="edit"
          initialTitle={currentBoard.title}
          initialDescription={currentBoard.description}
          onBack={() => setCurrentPage("board-detail")}
          onSubmit={handleBoardFormSubmit}
        />
      )}

      {currentPage === "board-detail" && currentBoard && (
        <BoardDetailPage
          boardId={currentBoard.id}
          boardTitle={currentBoard.title}
          boardDescription={currentBoard.description}
          stickyNotes={stickyNotes[currentBoard.id] || []}
          areas={areas[currentBoard.id] || []}
          onBack={() => setCurrentPage("board-list")}
          onEditBoard={handleEditBoard}
          onCreateSticky={handleCreateSticky}
          onUpdateSticky={handleUpdateSticky}
          onDeleteSticky={handleDeleteSticky}
          onCreateArea={handleCreateArea}
          onUpdateArea={handleUpdateArea}
          onDeleteArea={handleDeleteArea}
        />
      )}

      {currentPage === "notifications" && (
        <NotificationListPage
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onBack={() => setCurrentPage("board-list")}
          onLoadMore={handleLoadMoreNotifications}
          hasMore={hasMoreNotifications}
        />
      )}

      {currentPage === "profile-edit" && (
        <ProfileEditPage
          userName={userName}
          userImage={userImage}
          onBack={() => setCurrentPage("board-list")}
          onSave={handleProfileSave}
        />
      )}

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={(open) =>
          setConfirmState((prev) => ({ ...prev, open }))
        }
        title={confirmState.title}
        description={confirmState.description}
        onConfirm={confirmState.onConfirm}
        variant={confirmState.variant}
      />

      <Toaster position="top-center" richColors closeButton />

      {snackNotification && (
        <SnackNotification
          message={snackNotification}
          onClose={() => setSnackNotification(null)}
        />
      )}
    </>
  );
}