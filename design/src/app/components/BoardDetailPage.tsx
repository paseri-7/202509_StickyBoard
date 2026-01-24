import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Edit3, ZoomIn, ZoomOut } from "lucide-react";
import { StickyNoteComponent, type StickyNote } from "./StickyNote";
import { AreaComponent, type Area } from "./Area";
import { CanvasEditorPanel } from "./CanvasEditorPanel";

interface BoardDetailPageProps {
  boardId: string;
  boardTitle: string;
  boardDescription: string;
  stickyNotes: StickyNote[];
  areas: Area[];
  onBack: () => void;
  onEditBoard: () => void;
  onCreateSticky: (data: Partial<StickyNote>) => void;
  onUpdateSticky: (id: string, data: Partial<StickyNote>) => void;
  onDeleteSticky: (id: string) => void;
  onCreateArea: (data: Partial<Area>) => void;
  onUpdateArea: (id: string, data: Partial<Area>) => void;
  onDeleteArea: (id: string) => void;
}

export function BoardDetailPage({
  boardId,
  boardTitle,
  boardDescription,
  stickyNotes,
  areas,
  onBack,
  onEditBoard,
  onCreateSticky,
  onUpdateSticky,
  onDeleteSticky,
  onCreateArea,
  onUpdateArea,
  onDeleteArea,
}: BoardDetailPageProps) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<"sticky" | "area" | null>(null);
  const [editorMode, setEditorMode] = useState<"sticky" | "area">("sticky");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleStickySelect = (id: string) => {
    setSelectedItemId(id);
    setSelectedItemType("sticky");
    setEditorMode("sticky");
    setIsEditorOpen(true);
  };

  const handleAreaSelect = (id: string) => {
    setSelectedItemId(id);
    setSelectedItemType("area");
    setEditorMode("area");
    setIsEditorOpen(true);
  };

  const handleCanvasClick = () => {
    setSelectedItemId(null);
    setSelectedItemType(null);
    setIsEditorOpen(false);
  };

  const handleStickyPositionChange = (id: string, x: number, y: number) => {
    onUpdateSticky(id, { x, y });
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

  const selectedItem =
    selectedItemType === "sticky"
      ? stickyNotes.find((n) => n.id === selectedItemId)
      : selectedItemType === "area"
      ? areas.find((a) => a.id === selectedItemId)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9FB] via-[#F9F6FF] to-[#F6FAFF]">
        {/* Header */}
        <div className="bg-white border-b border-border shadow-sm z-30">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center gap-4 mb-3">
              <Button
                onClick={onBack}
                variant="ghost"
                className="rounded-2xl hover:bg-muted"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                戻る
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{boardTitle}</h2>
                {boardDescription && (
                  <p className="text-sm text-foreground/60 mt-1">{boardDescription}</p>
                )}
              </div>
              <Button
                onClick={onEditBoard}
                variant="outline"
                className="rounded-2xl border-2 hover:bg-muted"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                ボード編集
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="relative overflow-auto"
          style={{ height: "calc(100vh - 250px)" }}
          onClick={handleCanvasClick}
        >
          {/* Zoom Controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white rounded-2xl shadow-lg p-2 border border-border">
            <Button
              onClick={handleZoomIn}
              disabled={zoom >= 2}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-xl hover:bg-muted"
              title="ズームイン"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <button
              onClick={handleResetZoom}
              className="h-10 w-10 text-xs font-semibold hover:bg-muted rounded-xl transition-colors"
              title="リセット"
            >
              {Math.round(zoom * 100)}%
            </button>
            <Button
              onClick={handleZoomOut}
              disabled={zoom <= 0.25}
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 rounded-xl hover:bg-muted"
              title="ズームアウト"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
          </div>

          <div
            className="relative origin-top-left transition-transform duration-200"
            style={{
              width: "3000px",
              height: "2000px",
              transform: `scale(${zoom})`,
              backgroundImage: `
                linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
            }}
          >
            {/* Render areas first (background) */}
            {areas.map((area) => (
              <AreaComponent
                key={area.id}
                area={area}
                onSelect={handleAreaSelect}
                onUpdate={onUpdateArea}
                isSelected={selectedItemId === area.id && selectedItemType === "area"}
              />
            ))}

            {/* Render sticky notes (foreground) */}
            {stickyNotes.map((note) => (
              <StickyNoteComponent
                key={note.id}
                note={note}
                onSelect={handleStickySelect}
                onPositionChange={handleStickyPositionChange}
                isSelected={selectedItemId === note.id && selectedItemType === "sticky"}
              />
            ))}
          </div>
        </div>

        {/* Editor Panel */}
        <CanvasEditorPanel
          mode={editorMode}
          selectedItem={selectedItem || null}
          onModeChange={setEditorMode}
          onCreateSticky={onCreateSticky}
          onUpdateSticky={onUpdateSticky}
          onDeleteSticky={onDeleteSticky}
          onCreateArea={onCreateArea}
          onUpdateArea={onUpdateArea}
          onDeleteArea={onDeleteArea}
          isOpen={isEditorOpen}
          onOpenChange={setIsEditorOpen}
        />
    </div>
  );
}