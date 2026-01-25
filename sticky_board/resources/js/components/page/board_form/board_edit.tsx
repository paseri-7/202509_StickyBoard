import React from "react";
import BoardForm from "./board_form";
import { useBoardEdit } from "./board_edit.hooks";

type BoardEditProps = {
    boardId: number;
};

const BoardEdit: React.FC<BoardEditProps> = ({ boardId }) => {
    const { board, loading } = useBoardEdit(boardId);
    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? "";

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
                <div className="mx-auto max-w-2xl px-6 py-10 text-sm text-slate-500">
                    読み込み中...
                </div>
            </div>
        );
    }

    if (!board) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
                <div className="mx-auto max-w-2xl px-6 py-10 text-sm text-slate-500">
                    ボードが見つかりません。
                </div>
            </div>
        );
    }

    return (
        <BoardForm
            mode="edit"
            initialTitle={board.title}
            initialDescription={board.description || ""}
            onCancel={() => {
                window.location.href = `/boards/${board.id}`;
            }}
            onSuccessRedirect={() => {
                window.location.href = `/boards/${board.id}`;
            }}
            onSubmit={async (payload) => {
                const response = await fetch(`/boards/${board.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error("Failed to update board.");
                }
            }}
        />
    );
};

export default BoardEdit;
