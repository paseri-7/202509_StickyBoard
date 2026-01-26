<?php

namespace App\Services;

use App\Models\BoardNotification;

class NotificationService
{
    public function fetchNotifications(int $userId, int $page, int $perPage): array
    {
        $baseQuery = BoardNotification::query()
            ->where('user_id', $userId)
            ->orderByDesc('created_at');

        $total = $baseQuery->count();
        $notifications = $baseQuery
            ->forPage($page, $perPage)
            ->get();

        return [
            'data' => $notifications->map(fn (BoardNotification $notification) => [
                'id' => $notification->id,
                'message' => $notification->message,
                'boardId' => $notification->board_id,
                'stickyNoteId' => $notification->sticky_note_id,
                'isRead' => $notification->read_at !== null,
                'createdAt' => $notification->created_at?->toISOString(),
            ])->values(),
            'has_more' => $page * $perPage < $total,
        ];
    }

    public function markRead(int $userId, int $notificationId): array
    {
        $notification = BoardNotification::query()
            ->where('user_id', $userId)
            ->findOrFail($notificationId);

        if ($notification->read_at === null) {
            $notification->read_at = now();
            $notification->save();
        }

        return [
            'id' => $notification->id,
            'message' => $notification->message,
            'boardId' => $notification->board_id,
            'stickyNoteId' => $notification->sticky_note_id,
            'isRead' => $notification->read_at !== null,
            'createdAt' => $notification->created_at?->toISOString(),
        ];
    }
}
