import React from "react";
import { StickyNote } from "../../../types/StickyNote";

type StickyNoteProps = {
    note: StickyNote;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onPositionChange: (id: number, x: number, y: number) => void;
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

const StickyNoteItem: React.FC<StickyNoteProps> = ({
    note,
    isSelected,
    onSelect,
    onPositionChange,
}) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [position, setPosition] = React.useState({ x: note.x, y: note.y });
    const dragStartRef = React.useRef({
        x: 0,
        y: 0,
        noteX: 0,
        noteY: 0,
    });
    const hasMovedRef = React.useRef(false);

    React.useEffect(() => {
        if (!isDragging) {
            setPosition({ x: note.x, y: note.y });
        }
    }, [note.x, note.y, isDragging]);

    const handleMouseDown = (event: React.MouseEvent) => {
        if (event.button !== 0) return;
        event.stopPropagation();
        hasMovedRef.current = false;
        dragStartRef.current = {
            x: event.clientX,
            y: event.clientY,
            noteX: position.x,
            noteY: position.y,
        };
        setIsDragging(true);
    };

    React.useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (event: MouseEvent) => {
            const dx = event.clientX - dragStartRef.current.x;
            const dy = event.clientY - dragStartRef.current.y;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                hasMovedRef.current = true;
            }

            setPosition({
                x: dragStartRef.current.noteX + dx,
                y: dragStartRef.current.noteY + dy,
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            if (!hasMovedRef.current) {
                onSelect(note.id);
                return;
            }
            onPositionChange(
                note.id,
                Math.round(position.x),
                Math.round(position.y),
            );
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [
        isDragging,
        note.id,
        onPositionChange,
        onSelect,
        position.x,
        position.y,
    ]);

    const isOverdue =
        note.due_at && new Date(note.due_at).getTime() < Date.now();

    return (
        <div
            className={`absolute inline-flex flex-col rounded-3xl p-5 text-sm shadow-lg transition animate-pop-in ${
                isSelected ? "ring-4 ring-pink-300 ring-offset-2" : ""
            } ${
                isOverdue ? "ring-4 ring-rose-400 ring-offset-2" : ""
            } ${isDragging ? "shadow-2xl" : ""} ${
                isDragging ? "" : "hover:scale-[1.03] hover:rotate-2"
            }`}
            style={{
                left: position.x,
                top: position.y,
                width: "fit-content",
                minWidth: 220,
                maxWidth: 320,
                height: "auto",
                minHeight: 60,
                backgroundColor: resolveStickyColor(note.color),
                opacity: isDragging ? 0.85 : 1,
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
                zIndex: isDragging ? 30 : isSelected ? 20 : 10,
                animationDelay: `${Math.min(note.id * 30, 240)}ms`,
            }}
            onMouseDown={handleMouseDown}
            onClick={(event) => event.stopPropagation()}
        >
            {isOverdue ? (
                <div className="absolute -top-2 -right-2 rounded-full bg-rose-500 p-2 text-white shadow-lg">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 7v6"></path>
                        <path d="M12 16h.01"></path>
                    </svg>
                </div>
            ) : null}
            <div className="break-words whitespace-pre-wrap text-sm">
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
};

export default StickyNoteItem;
