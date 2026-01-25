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
}
