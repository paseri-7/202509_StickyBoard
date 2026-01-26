import React from "react";
import { useBoardList } from "./board_list.hooks";
import ConfirmDialog from "../../ui/ConfirmDialog";
import BoardThumbnail from "./board_thumbnail";
import AppHeader from "../../ui/AppHeader";
import { useHeaderData } from "../../../hooks/useHeaderData";

const formatUpdatedAt = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    const pad = (num: number) => String(num).padStart(2, "0");
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(
        date.getDate(),
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const BoardList: React.FC = () => {
    const { boards, loading, deleteBoard } = useBoardList();
    const headerData = useHeaderData();
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [targetBoardId, setTargetBoardId] = React.useState<number | null>(
        null,
    );

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
            <AppHeader {...headerData} />
            <div className="mx-auto w-full px-30 py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">マイボード</h1>
                    </div>
                    <button
                        className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-400 to-violet-300 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:from-pink-500 hover:to-violet-400"
                        onClick={() => {
                            window.location.href = "/boards/create";
                        }}
                    >
                        新規ボード作成
                    </button>
                </div>
                {boards.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#D6E9FF] to-[#E8D6FF]">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-16 w-16 text-white"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                {/* ボード枠 */}
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="14"
                                    rx="3"
                                />
                                {/* 付箋 */}
                                <path d="M8 8h6a2 2 0 0 1 2 2v5H10a2 2 0 0 1-2-2V8z" />
                                {/* 付箋の折り返し */}
                                <path d="M16 15l-3 0" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">
                            ボードはありません
                        </h3>
                        <p className="text-slate-500">
                            新しいボードを作成するとここに表示されます
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                        {boards.map((board) => (
                            <article
                                key={board.id}
                                className="group relative overflow-hidden rounded-3xl border-2 border-transparent bg-white transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-2xl"
                                onClick={() => {
                                    window.location.href = `/boards/${board.id}`;
                                }}
                            >
                                <button
                                    className="absolute right-4 bottom-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rose-500 border-2 border-rose-500 shadow opacity-0 transition group-hover:opacity-100 hover:text-white/90 hover:bg-rose-500"
                                    aria-label={`${board.title} を削除`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        setTargetBoardId(board.id);
                                        setConfirmOpen(true);
                                    }}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path d="M3 6h18"></path>
                                        <path d="M8 6V4h8v2"></path>
                                        <path d="M19 6l-1 14H6L5 6"></path>
                                        <path d="M10 11v6"></path>
                                        <path d="M14 11v6"></path>
                                    </svg>
                                </button>
                                <div className="aspect-[16/9]">
                                    <BoardThumbnail board={board} />
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-slate-900 truncate">
                                        {board.title}
                                    </h2>
                                    <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                                        {board.description || "説明なし"}
                                    </p>
                                    <p className="mt-4 text-xs text-slate-400">
                                        更新日:{" "}
                                        {formatUpdatedAt(board.updatedAt)}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                {loading && (
                    <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <span className="inline-flex h-6 w-6 animate-spin rounded-full border-2 border-violet-300 border-t-transparent"></span>
                        読み込み中...
                    </div>
                )}
            </div>
            <ConfirmDialog
                open={confirmOpen}
                title="ボードを削除しますか？"
                description="この操作は元に戻せません。"
                confirmText="削除"
                cancelText="キャンセル"
                variant="destructive"
                onConfirm={async () => {
                    if (targetBoardId) {
                        await deleteBoard(targetBoardId);
                    }
                    setTargetBoardId(null);
                    setConfirmOpen(false);
                }}
                onClose={() => {
                    setTargetBoardId(null);
                    setConfirmOpen(false);
                }}
            />
        </main>
    );
};

export default BoardList;
