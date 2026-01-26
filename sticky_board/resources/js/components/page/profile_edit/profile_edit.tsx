import React from "react";
import ConfirmDialog from "../../ui/ConfirmDialog";
import AppHeader from "../../ui/AppHeader";
import { useHeaderData } from "../../../hooks/useHeaderData";
import { useProfileEdit } from "./profile_edit.hooks";

type Toast = {
    type: "success" | "error";
    message: string;
};

const ProfileEdit: React.FC = () => {
    const headerData = useHeaderData();
    const { profile, loading, updateProfile } = useProfileEdit();
    const [name, setName] = React.useState("");
    const [avatarPreview, setAvatarPreview] = React.useState("");
    const [avatarFile, setAvatarFile] = React.useState<File | null>(null);
    const [isAvatarDirty, setIsAvatarDirty] = React.useState(false);
    const [toast, setToast] = React.useState<Toast | null>(null);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    React.useEffect(() => {
        if (!profile) return;
        setName(profile.name);
        if (!isAvatarDirty) {
            setAvatarPreview(profile.avatar ?? "");
        }
    }, [profile]);

    const showToast = (next: Toast) => {
        setToast(next);
        setTimeout(() => setToast(null), 4000);
    };

    const handleAvatarChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0] ?? null;
        setAvatarFile(file);
        setIsAvatarDirty(Boolean(file));
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                setAvatarPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) {
            showToast({ type: "error", message: "表示名は必須です。" });
            return;
        }
        setConfirmOpen(true);
    };

    const handleConfirmUpdate = async () => {
        setConfirmOpen(false);
        setIsSubmitting(true);
        try {
            const payload = new FormData();
            payload.append("name", name.trim());
            if (avatarFile) {
                payload.append("avatar", avatarFile);
            }
            const updated = await updateProfile(payload);
            showToast({ type: "success", message: "更新しました。" });
            if (avatarFile && avatarPreview) {
                window.sessionStorage.setItem(
                    "profile_avatar_preview",
                    avatarPreview,
                );
                headerData.applyProfileUpdate({
                    name: updated.name,
                    avatar: avatarPreview,
                });
            } else {
                window.sessionStorage.removeItem("profile_avatar_preview");
                headerData.applyProfileUpdate({
                    name: updated.name,
                    avatar: updated.avatar ?? "",
                });
            }
            if (!avatarFile) {
                setAvatarPreview(updated.avatar ?? "");
                setIsAvatarDirty(false);
            }
        } catch (error) {
            console.error(error);
            showToast({ type: "error", message: "更新に失敗しました。" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
                <AppHeader {...headerData} />
                <div className="mx-auto max-w-2xl px-6 py-10 text-sm text-slate-500">
                    読み込み中...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
            <AppHeader {...headerData} />
            <div className="mx-auto max-w-2xl px-6 py-10">
                <button
                    className="rounded-2xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    onClick={() => {
                        window.location.href = "/boards";
                    }}
                >
                    ← 戻る
                </button>
                <div className="mt-6 rounded-3xl border-2 border-pink-100 bg-white p-8 shadow-xl">
                    <h1 className="text-2xl font-semibold">プロフィール編集</h1>
                    <form
                        className="mt-6 space-y-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-pink-100 bg-pink-50">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="プロフィール画像"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-10 w-10"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle
                                                cx="12"
                                                cy="8"
                                                r="3"
                                            ></circle>
                                            <path d="M4 20c1.6-3.2 5-5 8-5s6.4 1.8 8 5"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border-2 border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                                画像を選択
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                表示名 *
                            </label>
                            <input
                                className="mt-2 w-full rounded-2xl border-2 border-slate-200 px-4 py-3 text-sm focus:border-pink-300 focus:outline-none"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                placeholder="表示名を入力"
                                required
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                この名前がヘッダーに表示されます
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                className="flex-1 rounded-2xl border-2 border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                                onClick={() => {
                                    window.location.href = "/boards";
                                }}
                            >
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-violet-300 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60 hover:from-pink-500 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? "更新中..." : "更新"}
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
                open={confirmOpen}
                title="プロフィールを更新しますか？"
                description="入力内容でプロフィールを更新します。"
                confirmText="更新"
                cancelText="キャンセル"
                onConfirm={handleConfirmUpdate}
                onClose={() => setConfirmOpen(false)}
            />
        </div>
    );
};

export default ProfileEdit;
