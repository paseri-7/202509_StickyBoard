import { useEffect, useState } from "react";
import { Board } from "../../../types/Board";

export const useBoardEdit = (boardId: number) => {
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchBoard = async () => {
            try {
                const response = await fetch(`/boards/data/${boardId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch board.");
                }
                const data = (await response.json()) as Board;
                if (isMounted) {
                    setBoard(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchBoard();

        return () => {
            isMounted = false;
        };
    }, [boardId]);

    return { board, loading };
};
