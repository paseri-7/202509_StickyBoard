import React from "react";
import { useBoardDetail } from "./board_detail.hooks";
import StickyNoteItem from "./sticky_note";
import AreaItem from "./area";

type BoardDetailProps = {
    boardId: number;
};

const STICKY_COLORS = [
    { name: "ピンク", value: "#FFD6E8" },
    { name: "黄色", value: "#FFF4CC" },
    { name: "緑", value: "#D4F4DD" },
    { name: "青", value: "#D6E9FF" },
    { name: "紫", value: "#E8D6FF" },
    { name: "ピーチ", value: "#FFDAD6" },
];

const BoardDetail: React.FC<BoardDetailProps> = ({ boardId }) => {
    const {
        board,
        stickyNotes,
        areas,
        loading,
        createSticky,
        updateSticky,
        deleteSticky,
        createArea,
        updateArea,
        deleteArea,
    } = useBoardDetail(boardId);
    const [editorMode, setEditorMode] = React.useState<"sticky" | "area">(
        "sticky",
    );
    const [isPanelOpen, setIsPanelOpen] = React.useState(false);
    const [zoom, setZoom] = React.useState(1);
    const [selectedStickyId, setSelectedStickyId] = React.useState<
        number | null
    >(null);
    const [selectedAreaId, setSelectedAreaId] = React.useState<number | null>(
        null,
    );
    const [stickyContent, setStickyContent] = React.useState("");
    const [stickyColor, setStickyColor] = React.useState(
        STICKY_COLORS[0].value,
    );
    const [stickyDeadline, setStickyDeadline] = React.useState("");
    const [areaTitle, setAreaTitle] = React.useState("");

    const selectedSticky = stickyNotes.find(
        (note) => note.id === selectedStickyId,
    );
    const selectedArea = areas.find((area) => area.id === selectedAreaId);

    React.useEffect(() => {
        if (selectedSticky) {
            setStickyContent(selectedSticky.content);
            setStickyColor(selectedSticky.color || STICKY_COLORS[0].value);
            setStickyDeadline(
                selectedSticky.due_at
                    ? new Date(selectedSticky.due_at).toISOString().slice(0, 16)
                    : "",
            );
            return;
        }
        setStickyContent("");
        setStickyColor(STICKY_COLORS[0].value);
        setStickyDeadline("");
    }, [selectedSticky]);

    React.useEffect(() => {
        if (selectedArea) {
            setAreaTitle(selectedArea.title);
            return;
        }
        setAreaTitle("");
    }, [selectedArea]);

    const handleSelectSticky = (id: number) => {
        setSelectedStickyId(id);
        setSelectedAreaId(null);
        setEditorMode("sticky");
        setIsPanelOpen(true);
    };

    const handleSelectArea = (id: number) => {
        setSelectedAreaId(id);
        setSelectedStickyId(null);
        setEditorMode("area");
        setIsPanelOpen(true);
    };

    const handleCanvasClick = () => {
        setSelectedStickyId(null);
        setSelectedAreaId(null);
    };

    const handleCreateSticky = async () => {
        const offset = stickyNotes.length * 20;
        const payload = {
            content: stickyContent || "新しい付箋",
            color: stickyColor,
            due_at: stickyDeadline
                ? new Date(stickyDeadline).toISOString()
                : null,
            x: 120 + offset,
            y: 140 + offset,
            width: 220,
            height: 160,
        };
        await createSticky(payload);
        setStickyContent("");
        setStickyDeadline("");
        setSelectedStickyId(null);
    };

    const handleUpdateSticky = async () => {
        if (!selectedStickyId) {
            return;
        }
        const payload = {
            content: stickyContent,
            color: stickyColor,
            due_at: stickyDeadline
                ? new Date(stickyDeadline).toISOString()
                : null,
        };
        await updateSticky(selectedStickyId, payload);
    };

    const handleCreateArea = async () => {
        const offset = areas.length * 24;
        const payload = {
            title: areaTitle || "新しいエリア",
            x: 100 + offset,
            y: 120 + offset,
            width: 360,
            height: 220,
        };
        await createArea(payload);
        setAreaTitle("");
        setSelectedAreaId(null);
    };

    const handleUpdateArea = async () => {
        if (!selectedAreaId) {
            return;
        }
        await updateArea(selectedAreaId, { title: areaTitle });
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 2));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 0.25));
    };

    const handleResetZoom = () => {
        setZoom(1);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
                <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-slate-500">
                    読み込み中...
                </div>
            </main>
        );
    }

    if (!board) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900">
                <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-slate-500">
                    ボードが見つかりません。
                </div>
            </main>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-violet-50 to-sky-50 text-slate-900 pb-52">
            {/* <div className="mx-auto w-full px-30 py-10"></div> */}
            <div className="bg-white border-b border-slate-200 shadow-sm">
                <div className="mx-auto w-full px-30 py-4">
                    <div className="flex items-center gap-4 mb-3">
                        <button
                            className="rounded-2xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                            onClick={() => {
                                window.location.href = "/boards";
                            }}
                        >
                            ← 戻る
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {board.title}
                            </h2>
                            {board.description ? (
                                <p className="text-sm text-slate-500 mt-1">
                                    {board.description}
                                </p>
                            ) : null}
                        </div>
                        <button
                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            onClick={() => {
                                window.location.href = `/boards/${board.id}/edit`;
                            }}
                        >
                            ボード編集
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="relative overflow-auto"
                style={{ height: "calc(100vh - 220px)" }}
                onClick={handleCanvasClick}
            >
                <div className="absolute right-6 top-6 z-20 flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                    <button
                        className="h-10 w-10 rounded-xl text-sm hover:bg-slate-100"
                        onClick={handleZoomIn}
                        title="ズームイン"
                    >
                        ＋
                    </button>
                    <button
                        className="h-10 w-10 rounded-xl text-xs font-semibold hover:bg-slate-100"
                        onClick={handleResetZoom}
                        title="リセット"
                    >
                        {Math.round(zoom * 100)}%
                    </button>
                    <button
                        className="h-10 w-10 rounded-xl text-sm hover:bg-slate-100"
                        onClick={handleZoomOut}
                        title="ズームアウト"
                    >
                        －
                    </button>
                </div>
                <div
                    className="relative mx-auto mt-6 mb-10 origin-top-left transition-transform"
                    style={{
                        width: "3000px",
                        height: "2000px",
                        transform: `scale(${zoom})`,
                        backgroundImage:
                            "linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
                        backgroundSize: "30px 30px",
                    }}
                >
                    {areas.map((area) => (
                        <AreaItem
                            key={area.id}
                            area={area}
                            isSelected={selectedAreaId === area.id}
                            onSelect={handleSelectArea}
                            onUpdate={updateArea}
                        />
                    ))}
                    {stickyNotes.map((note) => (
                        <StickyNoteItem
                            key={note.id}
                            note={note}
                            isSelected={selectedStickyId === note.id}
                            onSelect={handleSelectSticky}
                            onPositionChange={(id, x, y) =>
                                updateSticky(id, { x, y })
                            }
                        />
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t-2 border-pink-200 bg-white shadow-2xl">
                <div
                    className="flex items-center justify-between px-30 py-4 cursor-pointer hover:bg-pink-50/40"
                    onClick={() => setIsPanelOpen((prev) => !prev)}
                >
                    <span className="text-lg font-semibold">編集パネル</span>
                    <span className="text-sm text-slate-500">
                        {isPanelOpen ? "閉じる" : "開く"}
                    </span>
                </div>
                {isPanelOpen ? (
                    <div className="px-6 pb-6">
                        <div className="mx-auto max-w-3xl">
                            <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-semibold">
                                <button
                                    className={`rounded-xl py-2 ${
                                        editorMode === "sticky"
                                            ? "bg-pink-200 text-slate-900"
                                            : "text-slate-500"
                                    }`}
                                    onClick={() => setEditorMode("sticky")}
                                >
                                    📌 付箋
                                </button>
                                <button
                                    className={`rounded-xl py-2 ${
                                        editorMode === "area"
                                            ? "bg-sky-200 text-slate-900"
                                            : "text-slate-500"
                                    }`}
                                    onClick={() => setEditorMode("area")}
                                >
                                    🔲 エリア
                                </button>
                            </div>

                            {editorMode === "sticky" ? (
                                <div className="mt-6 space-y-6">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700">
                                            内容
                                        </label>
                                        <textarea
                                            className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:border-pink-300 focus:outline-none"
                                            rows={4}
                                            value={stickyContent}
                                            onChange={(event) =>
                                                setStickyContent(
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="付箋の内容を入力..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700">
                                            背景色
                                        </label>
                                        <div className="mt-2 flex flex-wrap gap-3">
                                            {STICKY_COLORS.map((color) => (
                                                <button
                                                    key={color.value}
                                                    className={`h-12 w-12 rounded-2xl transition-all hover:scale-105 ${
                                                        stickyColor ===
                                                        color.value
                                                            ? "ring-4 ring-pink-300 ring-offset-2"
                                                            : "ring-2 ring-slate-200"
                                                    }`}
                                                    style={{
                                                        backgroundColor:
                                                            color.value,
                                                    }}
                                                    title={color.name}
                                                    onClick={() =>
                                                        setStickyColor(
                                                            color.value,
                                                        )
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700">
                                            期限（任意）
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:border-pink-300 focus:outline-none"
                                            value={stickyDeadline}
                                            onChange={(event) =>
                                                setStickyDeadline(
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        {selectedSticky ? (
                                            <>
                                                <button
                                                    className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-violet-300 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60"
                                                    onClick={handleUpdateSticky}
                                                >
                                                    更新
                                                </button>
                                                <button
                                                    className="rounded-2xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50"
                                                    onClick={async () => {
                                                        if (!selectedStickyId) {
                                                            return;
                                                        }
                                                        await deleteSticky(
                                                            selectedStickyId,
                                                        );
                                                    }}
                                                >
                                                    削除
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="flex-1 rounded-2xl bg-gradient-to-r from-pink-400 to-violet-300 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-200/60"
                                                onClick={handleCreateSticky}
                                            >
                                                付箋を作成
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-6">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700">
                                            タイトル
                                        </label>
                                        <input
                                            className="mt-2 w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm focus:border-sky-300 focus:outline-none"
                                            value={areaTitle}
                                            onChange={(event) =>
                                                setAreaTitle(event.target.value)
                                            }
                                            placeholder="エリアのタイトルを入力..."
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        {selectedArea ? (
                                            <>
                                                <button
                                                    className="flex-1 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-200 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/60"
                                                    onClick={handleUpdateArea}
                                                >
                                                    更新
                                                </button>
                                                <button
                                                    className="rounded-2xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50"
                                                    onClick={async () => {
                                                        if (!selectedAreaId) {
                                                            return;
                                                        }
                                                        await deleteArea(
                                                            selectedAreaId,
                                                        );
                                                    }}
                                                >
                                                    削除
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="flex-1 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-200 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-200/60"
                                                onClick={handleCreateArea}
                                            >
                                                エリアを作成
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default BoardDetail;
