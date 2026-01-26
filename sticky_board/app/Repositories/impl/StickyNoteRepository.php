<?php

namespace App\Repositories\impl;

use App\Models\Board;
use App\Models\StickyNote;
use App\Repositories\IStickyNoteRepository;

class StickyNoteRepository implements IStickyNoteRepository
{
    public function createForUser(int $userId, array $data): StickyNote
    {
        $boardId = $data['board_id'] ?? null;
        Board::whereKey($boardId)->where('user_id', $userId)->firstOrFail();

        return StickyNote::create($data);
    }

    public function updateForUser(int $userId, int $id, array $data): StickyNote
    {
        $note = StickyNote::query()
            ->whereKey($id)
            ->whereHas('board', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->firstOrFail();
        $note->fill($data);
        $note->save();

        return $note;
    }

    public function deleteForUser(int $userId, int $id): void
    {
        StickyNote::query()
            ->whereKey($id)
            ->whereHas('board', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->delete();
    }
}
