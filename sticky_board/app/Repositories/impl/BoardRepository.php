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

    public function findById(int $id): Board
    {
        return Board::query()
            ->select(['id', 'title', 'description', 'updated_at'])
            ->findOrFail($id);
    }

    public function findWithItems(int $id): Board
    {
        return Board::query()
            ->with([
                'stickyNotes:id,board_id,content,color,due_at,x,y,width,height',
                'areas:id,board_id,title,x,y,width,height',
            ])
            ->select(['id', 'title', 'description', 'updated_at'])
            ->findOrFail($id);
    }

    public function create(array $data): Board
    {
        return Board::create($data);
    }

    public function update(int $id, array $data): Board
    {
        $board = Board::findOrFail($id);
        $board->fill($data);
        $board->save();

        return $board;
    }
}
