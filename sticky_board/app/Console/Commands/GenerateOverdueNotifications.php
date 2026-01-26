<?php

namespace App\Console\Commands;

use App\Models\BoardNotification;
use App\Models\StickyNote;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateOverdueNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:generate-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create notifications for overdue sticky notes.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $now = now();

        StickyNote::query()
            ->whereNotNull('due_at')
            ->where('due_at', '<=', $now)
            ->whereNull('notified_at')
            ->with(['board:id,user_id,title'])
            ->orderBy('id')
            ->chunkById(100, function ($notes) use ($now) {
                $notifications = [];
                $noteIds = [];

                foreach ($notes as $note) {
                    if (!$note->board) {
                        continue;
                    }

                    $message = $this->buildMessage(
                        $note->board->title,
                        $note->content,
                    );

                    $notifications[] = [
                        'user_id' => $note->board->user_id,
                        'board_id' => $note->board_id,
                        'sticky_note_id' => $note->id,
                        'message' => $message,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    $noteIds[] = $note->id;
                }

                if ($notifications) {
                    BoardNotification::insert($notifications);
                }

                if ($noteIds) {
                    StickyNote::query()
                        ->whereIn('id', $noteIds)
                        ->update(['notified_at' => $now]);
                }
            });

        return Command::SUCCESS;
    }

    private function buildMessage(string $boardTitle, string $content): string
    {
        $board = Str::squish(Str::replace("\n", ' ', $boardTitle));
        $clean = Str::squish(Str::replace("\n", ' ', $content));
        $boardLabel = $board !== ''
            ? Str::limit($board, 30, '…')
            : '（無題）';
        if ($clean === '') {
            return "ボード「{$boardLabel}」：付箋の期限を超過しました。";
        }

        $title = Str::limit($clean, 30, '…');
        return "ボード「{$boardLabel}」：付箋「{$title}」の期限を超過しました。";
    }
}
