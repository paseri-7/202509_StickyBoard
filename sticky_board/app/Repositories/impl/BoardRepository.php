<?php

namespace App\Repositories\impl;

use App\Models\Board;
use App\Repositories\IBoardRepository;

class BoardRepository implements IBoardRepository
{
    public function getAll(): \Illuminate\Support\Collection
    {
        return Board::query()
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'description', 'updated_at']);
    }
}
