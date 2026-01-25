import { useEffect, useState } from "react";
import { Board } from "../../../types/Board";
import { StickyNote } from "../../../types/StickyNote";
import { BoardArea } from "../../../types/BoardArea";

type BoardDetailState = {
    board: Board | null;
    stickyNotes: StickyNote[];
    areas: BoardArea[];
    loading: boolean;
};

type CreateStickyPayload = {
    content: string;
    color: string;
    due_at: string | null;
    x: number;
    y: number;
    width: number;
    height: number;
};

type UpdateStickyPayload = Partial<CreateStickyPayload>;

type CreateAreaPayload = {
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
};

type UpdateAreaPayload = Partial<CreateAreaPayload>;

export const useBoardDetail = (boardId: number) => {
    const [state, setState] = useState<BoardDetailState>({
        board: null,
        stickyNotes: [],
        areas: [],
        loading: true,
    });

    useEffect(() => {
        let isMounted = true;

        const fetchBoard = async () => {
            try {
                const response = await fetch(`/boards/data/${boardId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch board.");
                }
                const data = (await response.json()) as Board & {
                    sticky_notes?: StickyNote[];
                    areas?: BoardArea[];
                };
                if (isMounted) {
                    setState({
                        board: data,
                        stickyNotes: data.sticky_notes ?? [],
                        areas: data.areas ?? [],
                        loading: false,
                    });
                }
            } catch (error) {
                console.error(error);
                if (isMounted) {
                    setState({
                        board: null,
                        stickyNotes: [],
                        areas: [],
                        loading: false,
                    });
                }
            }
        };

        fetchBoard();

        return () => {
            isMounted = false;
        };
    }, [boardId]);

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? "";

    const createSticky = async (payload: CreateStickyPayload) => {
        const response = await fetch(`/boards/${boardId}/sticky-notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error("Failed to create sticky note.");
        }
        const data = (await response.json()) as StickyNote;
        setState((prev) => ({
            ...prev,
            stickyNotes: [...prev.stickyNotes, data],
        }));
    };

    const updateSticky = async (id: number, payload: UpdateStickyPayload) => {
        setState((prev) => ({
            ...prev,
            stickyNotes: prev.stickyNotes.map((note) =>
                note.id === id ? { ...note, ...payload } : note
            ),
        }));
        const response = await fetch(`/sticky-notes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error("Failed to update sticky note.");
        }
        const data = (await response.json()) as StickyNote;
        setState((prev) => ({
            ...prev,
            stickyNotes: prev.stickyNotes.map((note) =>
                note.id === id ? data : note
            ),
        }));
    };

    const deleteSticky = async (id: number) => {
        const response = await fetch(`/sticky-notes/${id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to delete sticky note.");
        }
        setState((prev) => ({
            ...prev,
            stickyNotes: prev.stickyNotes.filter((note) => note.id !== id),
        }));
    };

    const createArea = async (payload: CreateAreaPayload) => {
        const response = await fetch(`/boards/${boardId}/areas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error("Failed to create area.");
        }
        const data = (await response.json()) as BoardArea;
        setState((prev) => ({
            ...prev,
            areas: [...prev.areas, data],
        }));
    };

    const updateArea = async (id: number, payload: UpdateAreaPayload) => {
        setState((prev) => ({
            ...prev,
            areas: prev.areas.map((area) =>
                area.id === id ? { ...area, ...payload } : area
            ),
        }));
        const response = await fetch(`/areas/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            throw new Error("Failed to update area.");
        }
        const data = (await response.json()) as BoardArea;
        setState((prev) => ({
            ...prev,
            areas: prev.areas.map((area) => (area.id === id ? data : area)),
        }));
    };

    const deleteArea = async (id: number) => {
        const response = await fetch(`/areas/${id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to delete area.");
        }
        setState((prev) => ({
            ...prev,
            areas: prev.areas.filter((area) => area.id !== id),
        }));
    };

    return {
        ...state,
        createSticky,
        updateSticky,
        deleteSticky,
        createArea,
        updateArea,
        deleteArea,
    };
};
