<?php

namespace App\Services;

use App\Repositories\IBoardAreaRepository;

class BoardAreaService
{
    public function __construct(
        private IBoardAreaRepository $boardAreaRepository,
    ) {}

    public function createForUser(int $userId, array $data)
    {
        return $this->boardAreaRepository->createForUser($userId, $data);
    }

    public function updateForUser(int $userId, int $id, array $data)
    {
        return $this->boardAreaRepository->updateForUser($userId, $id, $data);
    }

    public function deleteForUser(int $userId, int $id): void
    {
        $this->boardAreaRepository->deleteForUser($userId, $id);
    }
}
