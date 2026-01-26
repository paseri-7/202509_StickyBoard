<?php

namespace App\Services;

use App\Repositories\IBoardRepository;

class BoardService
{
    public function __construct(
        private IBoardRepository $boardRepository,
    ) {}

    public function fetchBoards(int $userId)
    {
        return $this->boardRepository->getAll($userId);
    }

    public function getBoardById(int $userId, int $id)
    {
        return $this->boardRepository->findById($userId, $id);
    }

    public function getBoardDetail(int $userId, int $id)
    {
        return $this->boardRepository->findWithItems($userId, $id);
    }

    public function createBoard(array $data)
    {
        return $this->boardRepository->create($data);
    }

    public function updateBoard(int $userId, int $id, array $data)
    {
        return $this->boardRepository->update($userId, $id, $data);
    }

    public function deleteBoard(int $userId, int $id): void
    {
        $this->boardRepository->delete($userId, $id);
    }
}
