<?php

namespace App\Services;

use App\Repositories\IStickyNoteRepository;

class StickyNoteService
{
    public function __construct(
        private IStickyNoteRepository $stickyNoteRepository,
    ) {}

    public function createForUser(int $userId, array $data)
    {
        return $this->stickyNoteRepository->createForUser($userId, $data);
    }

    public function updateForUser(int $userId, int $id, array $data)
    {
        return $this->stickyNoteRepository->updateForUser($userId, $id, $data);
    }

    public function deleteForUser(int $userId, int $id): void
    {
        $this->stickyNoteRepository->deleteForUser($userId, $id);
    }
}
