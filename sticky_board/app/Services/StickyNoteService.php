<?php

namespace App\Services;

use App\Repositories\IStickyNoteRepository;

class StickyNoteService
{
    public function __construct(
        private IStickyNoteRepository $stickyNoteRepository,
    ) {}

    public function create(array $data)
    {
        return $this->stickyNoteRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->stickyNoteRepository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->stickyNoteRepository->delete($id);
    }
}
