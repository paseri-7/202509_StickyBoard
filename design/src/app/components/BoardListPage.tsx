import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export interface Board {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  updatedAt: Date;
}

interface BoardListPageProps {
  boards: Board[];
  onBoardClick: (boardId: string) => void;
  onCreateBoard: () => void;
  onDeleteBoard: (boardId: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export function BoardListPage({
  boards,
  onBoardClick,
  onCreateBoard,
  onDeleteBoard,
  onLoadMore,
  hasMore,
}: BoardListPageProps) {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, onLoadMore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9FB] via-[#F9F6FF] to-[#F6FAFF]">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            マイボード
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={onCreateBoard}
              className="bg-gradient-to-r from-[#FF85B8] to-[#E8D6FF] hover:from-[#FF6BA3] hover:to-[#D6C1FF] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all px-6 py-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              新規ボード作成
            </Button>
          </motion.div>
        </div>

        {boards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-[#FFD6E8] to-[#E8D6FF] rounded-full flex items-center justify-center mb-6">
              <Plus className="h-16 w-16 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">まだボードがありません</h3>
            <p className="text-foreground/60 mb-6">
              新しいボードを作成して、作業を始めましょう！
            </p>
            <Button
              onClick={onCreateBoard}
              className="bg-gradient-to-r from-[#FF85B8] to-[#E8D6FF] hover:from-[#FF6BA3] hover:to-[#D6C1FF] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all px-8 py-6"
            >
              <Plus className="h-5 w-5 mr-2" />
              最初のボードを作成
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boards.map((board, index) => (
                <motion.div
                  key={board.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => setHoveredId(board.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card
                    className="relative cursor-pointer hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden border-2 border-transparent hover:border-primary/30 bg-white group"
                    onClick={() => onBoardClick(board.id)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-[#FFD6E8]/30 via-[#E8D6FF]/30 to-[#D6E9FF]/30 flex items-center justify-center relative overflow-hidden">
                      {board.thumbnail ? (
                        <img
                          src={board.thumbnail}
                          alt={board.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-6xl opacity-10">📌</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 truncate">
                        {board.title}
                      </h3>
                      <p className="text-sm text-foreground/60 line-clamp-2 mb-3">
                        {board.description || "説明なし"}
                      </p>
                      <p className="text-xs text-foreground/40">
                        更新日: {board.updatedAt.toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredId === board.id ? 1 : 0 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBoard(board.id);
                      }}
                      className="absolute top-3 right-3 bg-white hover:bg-destructive text-destructive hover:text-white rounded-full p-2 shadow-lg transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                  </Card>
                </motion.div>
              ))}
            </div>

            {hasMore && (
              <div ref={observerTarget} className="py-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
