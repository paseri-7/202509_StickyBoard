import "./bootstrap";
import React from "react";
import { createRoot } from "react-dom/client";

type PageId = "login" | "boards" | "not-found";

const resolvePage = (path: string): PageId => {
    if (path === "/login") {
        return "login";
    }
    if (path === "/boards") {
        return "boards";
    }
    return "not-found";
};

const App = () => {
    const page = resolvePage(window.location.pathname);

    if (page === "login") {
        return (
            <main className="min-h-screen bg-slate-50 text-slate-900">
                <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h1 className="text-2xl font-semibold">StickyBoard</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            Googleでログイン
                        </p>
                        <button className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
                            Googleでログイン
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (page === "boards") {
        return (
            <main className="min-h-screen bg-slate-50 text-slate-900">
                <div className="mx-auto max-w-5xl px-6 py-12">
                    <h1 className="text-3xl font-semibold">ボード一覧</h1>
                    <p className="mt-3 text-sm text-slate-600">
                        ここにボードの一覧を表示します。
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                            ボードカード（仮）
                        </div>
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                            ボードカード（仮）
                        </div>
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                            ボードカード（仮）
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <h1 className="text-2xl font-semibold">Page not found</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        指定されたページは存在しません。
                    </p>
                </div>
            </div>
        </main>
    );
};

const root = document.getElementById("app");
if (root) {
    createRoot(root).render(<App />);
}
