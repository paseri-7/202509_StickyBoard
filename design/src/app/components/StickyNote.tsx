import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";

export interface StickyNote {
  id: string;
  content: string;
  backgroundColor: string;
  deadline?: Date;
  x: number;
  y: number;
}

interface StickyNoteComponentProps {
  note: StickyNote;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  isSelected: boolean;
}

export function StickyNoteComponent({
  note,
  onSelect,
  onPositionChange,
  isSelected,
}: StickyNoteComponentProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: note.x, y: note.y });
  const dragStartRef = useRef({ x: 0, y: 0, noteX: 0, noteY: 0 });
  const hasMovedRef = useRef(false);

  // Update position when note prop changes (from external updates)
  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: note.x, y: note.y });
    }
  }, [note.x, note.y, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      noteX: position.x,
      noteY: position.y,
    };
    setIsDragging(true);
    e.stopPropagation();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      
      // Check if mouse has moved more than 5 pixels (threshold for drag)
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
      
      // If the mouse hasn't moved much, treat it as a click
      if (!hasMovedRef.current) {
        onSelect(note.id);
      } else {
        // Save final position only if dragged
        onPositionChange(note.id, Math.round(position.x), Math.round(position.y));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, note.id, onPositionChange, onSelect, position.x, position.y]);

  const isOverdue =
    note.deadline && new Date(note.deadline) < new Date();

  return (
    <motion.div
      initial={{ scale: 0, rotate: -5 }}
      animate={{ scale: 1, rotate: 0 }}
      whileHover={{ scale: isDragging ? 1 : 1.05, rotate: isDragging ? 0 : 2 }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        backgroundColor: note.backgroundColor,
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: isDragging ? 30 : isSelected ? 20 : 10,
        userSelect: "none",
      }}
      className={`w-56 rounded-3xl shadow-lg p-5 transition-shadow ${
        isSelected ? "ring-4 ring-primary ring-offset-2" : ""
      } ${isOverdue ? "ring-4 ring-destructive ring-offset-2" : ""} ${
        isDragging ? "shadow-2xl" : ""
      }`}
    >
      {isOverdue && (
        <div className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-2 shadow-lg">
          <AlertCircle className="h-4 w-4" />
        </div>
      )}
      <div className="flex flex-col">
        <div className="break-words whitespace-pre-wrap text-sm">
          {note.content || "付箋の内容を入力..."}
        </div>
        {note.deadline && (
          <div
            className={`text-xs mt-2 pt-2 border-t-2 ${
              isOverdue
                ? "border-destructive text-destructive font-bold"
                : "border-foreground/20 text-foreground/60"
            }`}
          >
            期限: {new Date(note.deadline).toLocaleString("ja-JP", {
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}