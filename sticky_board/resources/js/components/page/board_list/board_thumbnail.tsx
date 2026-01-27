import React from "react";
import { Board } from "../../../types/Board";
import { StickyNote } from "../../../types/StickyNote";
import { BoardArea } from "../../../types/BoardArea";

const CANVAS_WIDTH = 1900;
const CANVAS_HEIGHT = 700;

type BoardThumbnailProps = {
    board: Board;
};

const resolveStickyColor = (value: string) => {
    if (value === "pink") return "#FFD6E8";
    if (value === "yellow") return "#FFF4CC";
    if (value === "green") return "#D4F4DD";
    if (value === "blue") return "#D6E9FF";
    return value || "#E0F2FE";
};

const formatDeadline = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString("ja-JP", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const BoardThumbnail: React.FC<BoardThumbnailProps> = ({ board }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [scale, setScale] = React.useState(0.1);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const updateScale = () => {
            const rect = el.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const nextScale = Math.min(
                rect.width / CANVAS_WIDTH,
                rect.height / CANVAS_HEIGHT,
            );
            setScale(nextScale);
            setOffset({
                x: (rect.width - CANVAS_WIDTH * nextScale) / 2,
                y: (rect.height - CANVAS_HEIGHT * nextScale) / 2,
            });
        };

        updateScale();
        const observer = new ResizeObserver(updateScale);
        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }, []);

    const stickyNotes = board.sticky_notes ?? [];
    const areas = board.areas ?? [];

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-pink-100/60 via-violet-100/60 to-sky-100/60"
        >
            <div
                className="absolute left-0 top-0"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                    transformOrigin: "top left",
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                }}
            >
                <div className="relative h-full w-full pointer-events-none">
                    {areas.map((area: BoardArea) => (
                        <div
                            key={`area-${area.id}`}
                            className="absolute rounded-3xl border-4 border-slate-400/30"
                            style={{
                                left: area.x,
                                top: area.y,
                                width: area.width,
                                height: area.height,
                            }}
                        >
                            <div className="absolute -top-8 left-4 rounded-2xl border-2 border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700">
                                {area.title || "エリア名"}
                            </div>
                        </div>
                    ))}
                    {stickyNotes.map((note: StickyNote) => {
                        const isOverdue =
                            note.due_at &&
                            new Date(note.due_at).getTime() < Date.now();

                        return (
                            <div
                                key={`note-${note.id}`}
                                className={`absolute rounded-3xl p-5 text-sm shadow-lg ${
                                    isOverdue
                                        ? "ring-4 ring-rose-400 ring-offset-2"
                                        : ""
                                }`}
                                style={{
                                    left: note.x,
                                    top: note.y,
                                    // width: Math.max(180, note.width || 220),
                                    // height: Math.max(120, note.height || 160),
                                    width: "fit-content",
                                    minWidth: 220,
                                    maxWidth: 320,
                                    height: "auto",
                                    minHeight: 60,
                                    backgroundColor: resolveStickyColor(
                                        note.color,
                                    ),
                                }}
                            >
                                <div className="line-clamp-3 break-words whitespace-pre-wrap text-sm">
                                    {note.content || "付箋の内容を入力..."}
                                </div>
                                {note.due_at ? (
                                    <div
                                        className={`mt-2 border-t-2 pt-2 text-xs ${
                                            isOverdue
                                                ? "border-rose-400 text-rose-500 font-semibold"
                                                : "border-slate-700/20 text-slate-600"
                                        }`}
                                    >
                                        期限: {formatDeadline(note.due_at)}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BoardThumbnail;
