import React from "react";
import { BoardArea } from "../../../types/BoardArea";

type AreaProps = {
    area: BoardArea;
    isSelected: boolean;
    onSelect: (id: number) => void;
    onUpdate: (id: number, data: Partial<BoardArea>) => void;
};

const AreaItem: React.FC<AreaProps> = ({
    area,
    isSelected,
    onSelect,
    onUpdate,
}) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const [resizeHandle, setResizeHandle] = React.useState<string | null>(null);
    const [rect, setRect] = React.useState({
        x: area.x,
        y: area.y,
        width: area.width,
        height: area.height,
    });
    const startRef = React.useRef({
        x: 0,
        y: 0,
        areaX: 0,
        areaY: 0,
        width: 0,
        height: 0,
    });

    React.useEffect(() => {
        if (!isDragging && !isResizing) {
            setRect({
                x: area.x,
                y: area.y,
                width: area.width,
                height: area.height,
            });
        }
    }, [area.x, area.y, area.width, area.height, isDragging, isResizing]);

    React.useEffect(() => {
        if (!isDragging && !isResizing) return;

        const handleMouseMove = (event: MouseEvent) => {
            const dx = event.clientX - startRef.current.x;
            const dy = event.clientY - startRef.current.y;

            if (isDragging) {
                setRect({
                    x: startRef.current.areaX + dx,
                    y: startRef.current.areaY + dy,
                    width: startRef.current.width,
                    height: startRef.current.height,
                });
                return;
            }

            if (isResizing && resizeHandle) {
                let next = { ...rect };

                if (resizeHandle.includes("e")) {
                    next.width = Math.max(160, startRef.current.width + dx);
                }
                if (resizeHandle.includes("s")) {
                    next.height = Math.max(120, startRef.current.height + dy);
                }
                if (resizeHandle.includes("w")) {
                    const newWidth = Math.max(160, startRef.current.width - dx);
                    next.width = newWidth;
                    next.x =
                        startRef.current.areaX +
                        (startRef.current.width - newWidth);
                }
                if (resizeHandle.includes("n")) {
                    const newHeight = Math.max(120, startRef.current.height - dy);
                    next.height = newHeight;
                    next.y =
                        startRef.current.areaY +
                        (startRef.current.height - newHeight);
                }

                setRect(next);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            setResizeHandle(null);
            onUpdate(area.id, {
                x: Math.round(rect.x),
                y: Math.round(rect.y),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
            });
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [area.id, isDragging, isResizing, onUpdate, rect, resizeHandle]);

    const handleMouseDown = (event: React.MouseEvent) => {
        event.stopPropagation();
        onSelect(area.id);
        setIsDragging(true);
        startRef.current = {
            x: event.clientX,
            y: event.clientY,
            areaX: rect.x,
            areaY: rect.y,
            width: rect.width,
            height: rect.height,
        };
    };

    const handleResizeMouseDown = (
        event: React.MouseEvent,
        handle: string
    ) => {
        event.stopPropagation();
        onSelect(area.id);
        setIsResizing(true);
        setResizeHandle(handle);
        startRef.current = {
            x: event.clientX,
            y: event.clientY,
            areaX: rect.x,
            areaY: rect.y,
            width: rect.width,
            height: rect.height,
        };
    };

    return (
        <div
            className="absolute animate-pop-in"
            style={{
                left: rect.x,
                top: rect.y,
                width: rect.width,
                height: rect.height,
                zIndex: 1,
                animationDelay: `${Math.min(area.id * 30, 240)}ms`,
            }}
        >
            <div
                className={`absolute inset-0 rounded-3xl border-4 pointer-events-auto cursor-move transition ${
                    isSelected
                        ? "border-pink-300 shadow-lg"
                        : "border-slate-400/30 hover:border-pink-200"
                }`}
                onMouseDown={handleMouseDown}
                onClick={(event) => {
                    event.stopPropagation();
                    onSelect(area.id);
                }}
            />
            <div
                className={`absolute -top-8 left-4 rounded-2xl px-4 py-2 text-xs font-semibold ${
                    isSelected
                        ? "bg-pink-300 text-white"
                        : "bg-white border-2 border-slate-300 text-slate-700"
                }`}
            >
                {area.title || "エリア名"}
            </div>
            {isSelected ? (
                <>
                    <div
                        className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-pink-300 cursor-nw-resize"
                        onMouseDown={(event) =>
                            handleResizeMouseDown(event, "nw")
                        }
                    />
                    <div
                        className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-pink-300 cursor-ne-resize"
                        onMouseDown={(event) =>
                            handleResizeMouseDown(event, "ne")
                        }
                    />
                    <div
                        className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-pink-300 cursor-sw-resize"
                        onMouseDown={(event) =>
                            handleResizeMouseDown(event, "sw")
                        }
                    />
                    <div
                        className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-pink-300 cursor-se-resize"
                        onMouseDown={(event) =>
                            handleResizeMouseDown(event, "se")
                        }
                    />
                </>
            ) : null}
        </div>
    );
};

export default AreaItem;
