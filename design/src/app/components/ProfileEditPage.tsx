import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { ArrowLeft, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { motion } from "motion/react";

interface ProfileEditPageProps {
  userName: string;
  userImage?: string;
  onBack: () => void;
  onSave: (name: string) => void;
}

export function ProfileEditPage({
  userName,
  userImage,
  onBack,
  onSave,
}: ProfileEditPageProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    onSave(name);
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
            <h2 className="text-2xl font-bold mb-6">プロフィール編集</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-8">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userImage} alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-[#FFD6E8] to-[#D6E9FF] text-4xl">
                    <User className="h-16 w-16 text-foreground/70" />
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <Label htmlFor="name">表示名 *</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={userName}
                  required
                  placeholder="表示名を入力"
                  className="mt-2 rounded-2xl border-2 border-border focus:border-primary bg-input-background px-4 py-6"
                />
                <p className="text-sm text-foreground/50 mt-2">
                  この名前がヘッダーに表示されます
                </p>
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
                  保存
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
