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
        $board = Board::whereKey($boardId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $area = BoardArea::create($data);
        $board->touch();

        return $area;
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
        $area->board?->touch();

        return $area;
    }

    public function deleteForUser(int $userId, int $id): void
    {
        $area = BoardArea::query()
            ->whereKey($id)
            ->whereHas('board', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->firstOrFail();

        $board = $area->board;
        $area->delete();
        $board?->touch();
    }
}
