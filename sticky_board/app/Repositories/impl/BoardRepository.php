<?php

namespace App\Repositories\impl;

use App\Models\Board;
use App\Repositories\IBoardRepository;

class BoardRepository implements IBoardRepository
{
    public function getAll(int $userId): \Illuminate\Support\Collection
    {
        return Board::query()
            ->with([
                'stickyNotes:id,board_id,content,color,due_at,x,y,width,height',
                'areas:id,board_id,title,x,y,width,height',
            ])
            ->where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->get(['id', 'title', 'description', 'updated_at']);
    }

    public function findById(int $userId, int $id): Board
    {
        return Board::query()
            ->where('user_id', $userId)
            ->select(['id', 'title', 'description', 'updated_at'])
            ->findOrFail($id);
    }

    public function findWithItems(int $userId, int $id): Board
    {
        return Board::query()
            ->with([
                'stickyNotes:id,board_id,content,color,due_at,x,y,width,height',
                'areas:id,board_id,title,x,y,width,height',
            ])
            ->where('user_id', $userId)
            ->select(['id', 'title', 'description', 'updated_at'])
            ->findOrFail($id);
    }

    public function create(array $data): Board
    {
        return Board::create($data);
    }

    public function update(int $userId, int $id, array $data): Board
    {
        $board = Board::where('user_id', $userId)->findOrFail($id);
        $board->fill($data);
        $board->save();

        return $board;
    }

    public function delete(int $userId, int $id): void
    {
        Board::where('user_id', $userId)->whereKey($id)->delete();
    }
}
