<?php

namespace App\Repositories\impl;

use App\Models\Board;
use App\Models\BoardArea;
use App\Repositories\IBoardAreaRepository;

class BoardAreaRepository implements IBoardAreaRepository
{
    public function createForUser(int $userId, array $data): BoardArea
    {
        $boardId = $data['board_id'] ?? null;
        Board::whereKey($boardId)->where('user_id', $userId)->firstOrFail();

        return BoardArea::create($data);
    }

    public function updateForUser(int $userId, int $id, array $data): BoardArea
    {
        $area = BoardArea::query()
            ->whereKey($id)
            ->whereHas('board', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->firstOrFail();
        $area->fill($data);
        $area->save();

        return $area;
    }

    public function deleteForUser(int $userId, int $id): void
    {
        BoardArea::query()
            ->whereKey($id)
            ->whereHas('board', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->delete();
    }
}
