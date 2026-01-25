<?php

namespace App\Services;

use App\Repositories\IBoardRepository;

class BoardService
{
    public function __construct(
        private IBoardRepository $boardRepository,
    ) {}

    public function fetchBoards()
    {
        return $this->boardRepository->getAll();
    }

    public function getBoardById(int $id)
    {
        return $this->boardRepository->findById($id);
    }

    public function getBoardDetail(int $id)
    {
        return $this->boardRepository->findWithItems($id);
    }

    public function createBoard(array $data)
    {
        return $this->boardRepository->create($data);
    }
}
