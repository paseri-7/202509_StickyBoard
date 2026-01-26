<?php

namespace App\Repositories;

use App\Models\StickyNote;

interface IStickyNoteRepository
{
    public function createForUser(int $userId, array $data): StickyNote;

    public function updateForUser(int $userId, int $id, array $data): StickyNote;

    public function deleteForUser(int $userId, int $id): void;
}
