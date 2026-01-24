import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Badge } from "@/app/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

interface HeaderProps {
  userName: string;
  userImage?: string;
  unreadCount: number;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onLogout: () => void;
}

export function Header({
  userName,
  userImage,
  unreadCount,
  onProfileClick,
  onNotificationsClick,
  onLogout,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF85B8] via-[#E8D6FF] to-[#D6E9FF] bg-clip-text text-transparent">
            StickyBoard
          </h1>
          <span className="text-base text-foreground/70">
            {userName}さん ようこそ！
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
              <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                <AvatarImage src={userImage} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-[#FFD6E8] to-[#D6E9FF]">
                  <User className="h-5 w-5 text-foreground/70" />
                </AvatarFallback>
              </Avatar>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-1 rounded-full text-xs font-bold shadow-lg"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border-border shadow-lg rounded-2xl p-2"
          >
            <DropdownMenuItem
              onClick={onProfileClick}
              className="cursor-pointer rounded-xl hover:bg-[#FFD6E8]/30 px-4 py-3 transition-colors"
            >
              <User className="mr-3 h-5 w-5 text-primary" />
              <span>プロフィール編集</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onNotificationsClick}
              className="cursor-pointer rounded-xl hover:bg-[#D6E9FF]/30 px-4 py-3 transition-colors"
            >
              <Bell className="mr-3 h-5 w-5 text-[#6BA3FF]" />
              <span className="flex items-center justify-between flex-1">
                通知一覧
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer rounded-xl hover:bg-destructive/10 px-4 py-3 text-destructive transition-colors"
            >
              <span>ログアウト</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
