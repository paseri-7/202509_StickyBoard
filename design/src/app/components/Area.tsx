import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

export interface Area {
  id: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AreaComponentProps {
  area: Area;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Area>) => void;
  isSelected: boolean;
}

export function AreaComponent({
  area,
  onSelect,
  onUpdate,
  isSelected,
}: AreaComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0, areaX: 0, areaY: 0, width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;
        onUpdate(area.id, {
          x: startPosRef.current.areaX + dx,
          y: startPosRef.current.areaY + dy,
        });
      } else if (isResizing && resizeHandle) {
        const dx = e.clientX - startPosRef.current.x;
        const dy = e.clientY - startPosRef.current.y;

        let updates: Partial<Area> = {};

        if (resizeHandle.includes("e")) {
          updates.width = Math.max(100, startPosRef.current.width + dx);
        }
        if (resizeHandle.includes("s")) {
          updates.height = Math.max(100, startPosRef.current.height + dy);
        }
        if (resizeHandle.includes("w")) {
          const newWidth = Math.max(100, startPosRef.current.width - dx);
          updates.width = newWidth;
          updates.x = startPosRef.current.areaX + (startPosRef.current.width - newWidth);
        }
        if (resizeHandle.includes("n")) {
          const newHeight = Math.max(100, startPosRef.current.height - dy);
          updates.height = newHeight;
          updates.y = startPosRef.current.areaY + (startPosRef.current.height - newHeight);
        }

        onUpdate(area.id, updates);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, resizeHandle, area.id, onUpdate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("area-border")) {
      e.stopPropagation();
      onSelect(area.id);
      setIsDragging(true);
      startPosRef.current = {
        x: e.clientX,
        y: e.clientY,
        areaX: area.x,
        areaY: area.y,
        width: area.width,
        height: area.height,
      };
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    onSelect(area.id);
    setIsResizing(true);
    setResizeHandle(handle);
    startPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      areaX: area.x,
      areaY: area.y,
      width: area.width,
      height: area.height,
    };
  };

  return (
    <motion.div
      ref={areaRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: "absolute",
        left: area.x,
        top: area.y,
        width: area.width,
        height: area.height,
        zIndex: 1,
      }}
      className="pointer-events-none"
    >
      {/* Border */}
      <div
        className={`area-border absolute inset-0 border-4 rounded-3xl pointer-events-auto cursor-move transition-all ${
          isSelected
            ? "border-primary shadow-lg"
            : "border-foreground/30 hover:border-primary/50"
        }`}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(area.id);
        }}
      />

      {/* Title */}
      <div
        className={`absolute -top-8 left-4 px-4 py-2 rounded-2xl font-medium pointer-events-none ${
          isSelected
            ? "bg-primary text-white"
            : "bg-white border-2 border-foreground/30 text-foreground"
        }`}
      >
        {area.title || "エリア名"}
      </div>

      {/* Resize handles - only visible when selected */}
      {isSelected && (
        <>
          {/* Corners */}
          <div
            className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nw-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, "nw")}
          />
          <div
            className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-ne-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, "ne")}
          />
          <div
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-sw-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, "sw")}
          />
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-se-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeMouseDown(e, "se")}
          />
        </>
      )}
    </motion.div>
  );
}
