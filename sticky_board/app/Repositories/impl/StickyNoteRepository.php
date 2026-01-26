<?php

namespace App\Repositories\impl;

use App\Models\Board;
use App\Models\StickyNote;
use App\Repositories\IStickyNoteRepository;
use Illuminate\Support\Carbon;

class StickyNoteRepository implements IStickyNoteRepository
{
    public function createForUser(int $userId, array $data): StickyNote
    {
        $boardId = $data['board_id'] ?? null;
        $board = Board::whereKey($boardId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $note = StickyNote::create($data);
        $board->touch();

        return $note;
    }

    public function updateForUser(int $userId, int $id, array $data): StickyNote
    {
        $note = StickyNote::query()
            ->whereKey($id)
            ->whereHas('board', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->firstOrFail();

        if (array_key_exists('due_at', $data)) {
            $dueAt = $data['due_at'] ? Carbon::parse($data['due_at']) : null;
            if ($dueAt === null || $dueAt->greaterThanOrEqualTo(now())) {
                $note->notified_at = null;
            }
        }

        $note->fill($data);
        $note->save();
        $note->board?->touch();

        return $note;
    }

    public function deleteForUser(int $userId, int $id): void
    {
        $note = StickyNote::query()
            ->whereKey($id)
            ->whereHas('board', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->firstOrFail();

        $board = $note->board;
        $note->delete();
        $board?->touch();
    }
}
