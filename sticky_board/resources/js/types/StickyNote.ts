export type StickyNote = {
    id: number;
    board_id: number;
    content: string;
    color: string;
    due_at: string | null;
    x: number;
    y: number;
    width: number;
    height: number;
};
