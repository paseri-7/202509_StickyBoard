import React from "react";

type ConfirmDialogProps = {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void;
    onClose: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    description,
    confirmText = "実行",
    cancelText = "キャンセル",
    variant = "default",
    onConfirm,
    onClose,
}) => {
    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-slate-900/50"
                onClick={onClose}
            />
            <div className="relative w-full max-w-2xl rounded-[32px] border-2 border-pink-100 bg-white px-10 py-8 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
                <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
                <p className="mt-3 text-base text-slate-500">{description}</p>
                <div className="mt-8 flex justify-end gap-4">
                    <button
                        className="rounded-full bg-slate-100 px-8 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                        onClick={onClose}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`rounded-full px-8 py-3 text-sm font-semibold text-white shadow-md transition ${
                            variant === "destructive"
                                ? "bg-rose-500 hover:bg-rose-600"
                                : "bg-pink-500 hover:bg-pink-600"
                        }`}
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
