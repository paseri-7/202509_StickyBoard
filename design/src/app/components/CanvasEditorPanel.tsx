import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import type { StickyNote } from "./StickyNote";
import type { Area } from "./Area";

interface CanvasEditorPanelProps {
  mode: "sticky" | "area";
  selectedItem: StickyNote | Area | null;
  onModeChange: (mode: "sticky" | "area") => void;
  onCreateSticky: (data: Partial<StickyNote>) => void;
  onUpdateSticky: (id: string, data: Partial<StickyNote>) => void;
  onDeleteSticky: (id: string) => void;
  onCreateArea: (data: Partial<Area>) => void;
  onUpdateArea: (id: string, data: Partial<Area>) => void;
  onDeleteArea: (id: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const STICKY_COLORS = [
  { name: "ピンク", value: "#FFD6E8" },
  { name: "黄色", value: "#FFF4CC" },
  { name: "緑", value: "#D4F4DD" },
  { name: "青", value: "#D6E9FF" },
  { name: "紫", value: "#E8D6FF" },
  { name: "ピーチ", value: "#FFDAD6" },
];

export function CanvasEditorPanel({
  mode,
  selectedItem,
  onModeChange,
  onCreateSticky,
  onUpdateSticky,
  onDeleteSticky,
  onCreateArea,
  onUpdateArea,
  onDeleteArea,
  isOpen,
  onOpenChange,
}: CanvasEditorPanelProps) {
  const [stickyContent, setStickyContent] = useState("");
  const [stickyColor, setStickyColor] = useState(STICKY_COLORS[0].value);
  const [stickyDeadline, setStickyDeadline] = useState("");

  const [areaTitle, setAreaTitle] = useState("");

  // When an item is selected, populate the form
  useEffect(() => {
    if (selectedItem && "content" in selectedItem) {
      setStickyContent(selectedItem.content);
      setStickyColor(selectedItem.backgroundColor);
      setStickyDeadline(
        selectedItem.deadline
          ? new Date(selectedItem.deadline).toISOString().slice(0, 16)
          : ""
      );
    } else if (selectedItem && "title" in selectedItem) {
      setAreaTitle(selectedItem.title);
    } else {
      // Reset form when no item is selected
      setStickyContent("");
      setStickyColor(STICKY_COLORS[0].value);
      setStickyDeadline("");
      setAreaTitle("");
    }
  }, [selectedItem]);

  const handleCreateSticky = () => {
    onCreateSticky({
      content: stickyContent,
      backgroundColor: stickyColor,
      deadline: stickyDeadline ? new Date(stickyDeadline) : undefined,
      x: 100,
      y: 100,
    });
    setStickyContent("");
    setStickyDeadline("");
  };

  const handleUpdateSticky = () => {
    if (selectedItem && "content" in selectedItem) {
      onUpdateSticky(selectedItem.id, {
        content: stickyContent,
        backgroundColor: stickyColor,
        deadline: stickyDeadline ? new Date(stickyDeadline) : undefined,
      });
    }
  };

  const handleCreateArea = () => {
    onCreateArea({
      title: areaTitle,
      x: 100,
      y: 100,
      width: 400,
      height: 300,
    });
    setAreaTitle("");
  };

  const handleUpdateArea = () => {
    if (selectedItem && "title" in selectedItem && "width" in selectedItem) {
      onUpdateArea(selectedItem.id, {
        title: areaTitle,
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-primary/20 shadow-2xl z-40">
      <Accordion
        type="single"
        collapsible
        value={isOpen ? "editor" : ""}
        onValueChange={(value) => onOpenChange(value === "editor")}
      >
        <AccordionItem value="editor" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
            <span className="text-lg font-bold">編集パネル</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <Tabs value={mode} onValueChange={(v) => onModeChange(v as "sticky" | "area")}>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-muted rounded-2xl p-1">
                <TabsTrigger
                  value="sticky"
                  className="rounded-xl data-[state=active]:bg-[#FFD6E8] data-[state=active]:text-foreground"
                >
                  📌 付箋
                </TabsTrigger>
                <TabsTrigger
                  value="area"
                  className="rounded-xl data-[state=active]:bg-[#D6E9FF] data-[state=active]:text-foreground"
                >
                  🔲 エリア
                </TabsTrigger>
              </TabsList>

              <TabsContent value="sticky" className="mt-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div>
                    <Label htmlFor="sticky-content">内容</Label>
                    <Textarea
                      id="sticky-content"
                      value={stickyContent}
                      onChange={(e) => setStickyContent(e.target.value)}
                      placeholder="付箋の内容を入力..."
                      rows={4}
                      className="mt-2 rounded-2xl border-2 border-border focus:border-primary bg-input-background resize-none"
                    />
                  </div>

                  <div>
                    <Label>背景色</Label>
                    <div className="mt-2 flex gap-3">
                      {STICKY_COLORS.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setStickyColor(color.value)}
                          className={`w-12 h-12 rounded-2xl transition-all hover:scale-110 ${
                            stickyColor === color.value
                              ? "ring-4 ring-primary ring-offset-2"
                              : "ring-2 ring-border"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sticky-deadline">期限（任意）</Label>
                    <Input
                      id="sticky-deadline"
                      type="datetime-local"
                      value={stickyDeadline}
                      onChange={(e) => setStickyDeadline(e.target.value)}
                      className="mt-2 rounded-2xl border-2 border-border focus:border-primary bg-input-background"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    {selectedItem && "content" in selectedItem ? (
                      <>
                        <Button
                          onClick={handleUpdateSticky}
                          className="flex-1 bg-gradient-to-r from-[#FF85B8] to-[#E8D6FF] hover:from-[#FF6BA3] hover:to-[#D6C1FF] text-white rounded-2xl py-6"
                        >
                          更新
                        </Button>
                        <Button
                          onClick={() => onDeleteSticky(selectedItem.id)}
                          variant="destructive"
                          className="rounded-2xl px-6 py-6"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleCreateSticky}
                        className="flex-1 bg-gradient-to-r from-[#FF85B8] to-[#E8D6FF] hover:from-[#FF6BA3] hover:to-[#D6C1FF] text-white rounded-2xl py-6"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        付箋を作成
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="area" className="mt-6">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div>
                    <Label htmlFor="area-title">タイトル</Label>
                    <Input
                      id="area-title"
                      value={areaTitle}
                      onChange={(e) => setAreaTitle(e.target.value)}
                      placeholder="エリアのタイトルを入力..."
                      className="mt-2 rounded-2xl border-2 border-border focus:border-primary bg-input-background py-6"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    {selectedItem && "width" in selectedItem ? (
                      <>
                        <Button
                          onClick={handleUpdateArea}
                          className="flex-1 bg-gradient-to-r from-[#6BA3FF] to-[#D6E9FF] hover:from-[#5090FF] hover:to-[#C1DBFF] text-white rounded-2xl py-6"
                        >
                          更新
                        </Button>
                        <Button
                          onClick={() => onDeleteArea(selectedItem.id)}
                          variant="destructive"
                          className="rounded-2xl px-6 py-6"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleCreateArea}
                        className="flex-1 bg-gradient-to-r from-[#6BA3FF] to-[#D6E9FF] hover:from-[#5090FF] hover:to-[#C1DBFF] text-white rounded-2xl py-6"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        エリアを作成
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}