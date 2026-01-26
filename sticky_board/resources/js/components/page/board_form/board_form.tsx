import React from "react";
import ConfirmDialog from "../../ui/ConfirmDialog";
import AppHeader from "../../ui/AppHeader";
import { useHeaderData } from "../../../hooks/useHeaderData";

type Toast = {
    type: "success" | "error";
    message: string;
};

type BoardFormProps = {
    mode: "create" | "edit";
    initialTitle?: string;
    initialDescription?: string;
    onSubmit: (payload: {
        title: string;
        description: string | null;
    }) => Promise<void>;
    onCancel: () => void;
    onSuccessRedirect?: () => void;
};

const BoardForm: React.FC<BoardFormProps> = ({
    mode,
    initialTitle = "",
    initialDescription = "",
    onSubmit,
    onCancel,
    onSuccessRedirect,
}) => {
    const headerData = useHeaderData();
    const [title, setTitle] = React.useState(initialTitle);
    const [description, setDescription] = React.useState(initialDescription);
    const [toast, setToast] = React.useState<Toast | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const [pendingPayload, setPendingPayload] = React.useState<{
        title: string;
        description: string | null;
    } | null>(null);

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

        setPendingPayload({
            title: title.trim(),
            description: description.trim() || null,
        });
        setIsConfirmOpen(true);
    };

    const handleConfirmCreate = async () => {
        setIsConfirmOpen(false);
        if (!pendingPayload) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(pendingPayload);

            showToast({
                type: "success",
                message: mode === "create" ? "作成しました。" : "更新しました。",
            });
            setTimeout(() => {
                if (onSuccessRedirect) {
                    onSuccessRedirect();
                    return;
                }
                window.location.href = mode === "create" ? "/boards" : "/boards";
            }, 500);
        } catch (error) {
            console.error(error);
            showToast({
                type: "error",
                message:
                    mode === "create"
                        ? "作成に失敗しました。"
                        : "更新に失敗しました。",
            });
        } finally {
            setIsSubmitting(false);
            setPendingPayload(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
            <AppHeader {...headerData} />
            <div className="mx-auto max-w-2xl px-6 py-10">
                <button
                    className="rounded-2xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    onClick={onCancel}
                >
                    ← 戻る
                </button>
                <div className="mt-6 rounded-3xl border-2 border-pink-100 bg-white p-8 shadow-xl">
                    <h1 className="text-2xl font-semibold">
                        {mode === "create" ? "新規ボード作成" : "ボード編集"}
                    </h1>
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
                                onClick={onCancel}
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-violet-300 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 hover:from-pink-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting
                                    ? mode === "create"
                                        ? "作成中..."
                                        : "更新中..."
                                    : mode === "create"
                                    ? "作成"
                                    : "更新"}
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
                title={
                    mode === "create"
                        ? "ボードを作成しますか？"
                        : "ボードを更新しますか？"
                }
                description={
                    mode === "create"
                        ? "入力内容で新規ボードを作成します。"
                        : "入力内容でボードを更新します。"
                }
                confirmText={mode === "create" ? "作成" : "更新"}
                cancelText="キャンセル"
                onConfirm={handleConfirmCreate}
                onClose={() => setIsConfirmOpen(false)}
            />
        </div>
    );
};

export default BoardForm;
