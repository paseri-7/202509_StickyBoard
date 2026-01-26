export type NotificationItem = {
    id: number;
    message: string;
    boardId: number;
    stickyNoteId?: number | null;
    isRead: boolean;
    createdAt: string;
};
