import React from "react";
import ConfirmDialog from "../../ui/ConfirmDialog";

type Toast = {
    type: "success" | "error";
    message: string;
};

const BoardForm: React.FC = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [toast, setToast] = React.useState<Toast | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

    const csrfToken =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? "";

    const showToast = (next: Toast) => {
        setToast(next);
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!title.trim()) {
            showToast({ type: "error", message: "タイトルは必須です。" });
            return;
        }

        setIsConfirmOpen(true);
    };

    const handleConfirmCreate = async () => {
        setIsConfirmOpen(false);

        setIsSubmitting(true);
        try {
            const response = await fetch("/boards", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify({
                    title,
                    description: description.trim() || null,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create board.");
            }

            showToast({ type: "success", message: "作成しました。" });
            setTimeout(() => {
                window.location.href = "/boards";
            }, 500);
        } catch (error) {
            console.error(error);
            showToast({ type: "error", message: "作成に失敗しました。" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
            <div className="mx-auto max-w-2xl px-6 py-10">
                <button
                    className="rounded-2xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    onClick={() => (window.location.href = "/boards")}
                >
                    ← 戻る
                </button>
                <div className="mt-6 rounded-3xl border-2 border-pink-100 bg-white p-8 shadow-xl">
                    <h1 className="text-2xl font-semibold">新規ボード作成</h1>
                    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                タイトル *
                            </label>
                            <input
                                className="mt-2 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-pink-300 focus:outline-none"
                                value={title}
                                onChange={(event) =>
                                    setTitle(event.target.value)
                                }
                                placeholder="例：プロジェクト管理ボード"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                説明
                            </label>
                            <textarea
                                className="mt-2 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-pink-300 focus:outline-none"
                                rows={6}
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                placeholder="このボードの説明を入力してください..."
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                className="flex-1 rounded-2xl border-2 border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                                onClick={() =>
                                    (window.location.href = "/boards")
                                }
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-violet-300 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 hover:from-pink-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? "作成中..." : "作成"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {toast ? (
                <div className="fixed bottom-6 right-6">
                    <div
                        className={`rounded-2xl px-5 py-4 text-sm text-white shadow-lg ${
                            toast.type === "success"
                                ? "bg-emerald-500"
                                : "bg-rose-500"
                        }`}
                    >
                        {toast.message}
                    </div>
                </div>
            ) : null}
            <ConfirmDialog
                open={isConfirmOpen}
                title="ボードを作成しますか？"
                description="入力内容で新規ボードを作成します。"
                confirmText="作成"
                cancelText="キャンセル"
                onConfirm={handleConfirmCreate}
                onClose={() => setIsConfirmOpen(false)}
            />
        </div>
    );
};

export default BoardForm;
