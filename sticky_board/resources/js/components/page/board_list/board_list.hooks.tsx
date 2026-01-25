import { useEffect, useState } from "react";
import { Board } from "../../../types/Board";

export const useBoardList = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? "";

    useEffect(() => {
        let isMounted = true;

        const fetchBoards = async () => {
            try {
                const response = await fetch("/boards/data");
                if (!response.ok) {
                    throw new Error("Failed to fetch boards.");
                }
                const data = (await response.json()) as Board[];
                if (isMounted) {
                    setBoards(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchBoards();

        return () => {
            isMounted = false;
        };
    }, []);

    const deleteBoard = async (id: number) => {
        setBoards((prev) => prev.filter((board) => board.id !== id));
        const response = await fetch(`/boards/${id}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to delete board.");
        }
    };

    return { boards, loading, deleteBoard };
};
