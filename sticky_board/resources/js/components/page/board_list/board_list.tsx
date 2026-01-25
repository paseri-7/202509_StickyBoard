import React from "react";
import { useBoardList } from "./board_list.hooks";

const BoardList: React.FC = () => {
    const { boards, loading } = useBoardList();

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
            <div className="mx-auto w-full px-30 py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">マイボード</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            作成済みボードのダミーデータを表示しています。
                        </p>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-400 to-violet-300 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 transition hover:from-pink-500 hover:to-violet-400">
                        新規ボード作成
                    </button>
                </div>
                <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
                    {boards.map((board) => (
                        <article
                            key={board.id}
                            className="group relative overflow-hidden rounded-3xl border-2 border-transparent bg-white transition hover:-translate-y-1 hover:border-pink-200 hover:shadow-2xl"
                        >
                            <button
                                className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-400 shadow hover:text-rose-500"
                                aria-label={`${board.title} を削除`}
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
                            <div className="aspect-[16/9] bg-gradient-to-br from-pink-100/60 via-violet-100/60 to-sky-100/60 flex items-center justify-center text-5xl text-slate-300">
                                📌
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold text-slate-900 truncate">
                                    {board.title}
                                </h2>
                                <p className="mt-3 text-sm text-slate-600 line-clamp-2">
                                    {board.description || "説明なし"}
                                </p>
                                <p className="mt-4 text-xs text-slate-400">
                                    更新日: {board.updatedAt}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
                {loading && (
                    <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
                        <span className="inline-flex h-6 w-6 animate-spin rounded-full border-2 border-violet-300 border-t-transparent"></span>
                        読み込み中...
                    </div>
                )}
            </div>
        </main>
    );
};

export default BoardList;
