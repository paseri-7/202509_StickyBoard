import { useEffect, useState } from "react";
import { Board } from "../../../types/Board";

export const useBoardList = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);

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

    return { boards, loading };
};
