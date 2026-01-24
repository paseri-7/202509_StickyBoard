import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

interface BoardFormPageProps {
  mode: "create" | "edit";
  initialTitle?: string;
  initialDescription?: string;
  onBack: () => void;
  onSubmit: (title: string, description: string) => void;
}

export function BoardFormPage({
  mode,
  initialTitle = "",
  initialDescription = "",
  onBack,
  onSubmit,
}: BoardFormPageProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    onSubmit(title, description);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9FB] via-[#F9F6FF] to-[#F6FAFF]">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="rounded-2xl hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            戻る
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-primary/10">
            <h2 className="text-2xl font-bold mb-6">
              {mode === "create" ? "新規ボード作成" : "ボード編集"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">タイトル *</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={initialTitle}
                  required
                  placeholder="例：プロジェクト管理ボード"
                  className="mt-2 rounded-2xl border-2 border-border focus:border-primary bg-input-background px-4 py-6"
                />
              </div>

              <div>
                <Label htmlFor="description">説明</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={initialDescription}
                  placeholder="このボードの説明を入力してください..."
                  rows={6}
                  className="mt-2 rounded-2xl border-2 border-border focus:border-primary bg-input-background px-4 py-3 resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={onBack}
                  variant="outline"
                  className="flex-1 rounded-2xl border-2 py-6 hover:bg-muted"
                >
                  キャンセル
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF85B8] to-[#E8D6FF] hover:from-[#FF6BA3] hover:to-[#D6C1FF] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all py-6"
                >
                  {mode === "create" ? "作成" : "更新"}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
