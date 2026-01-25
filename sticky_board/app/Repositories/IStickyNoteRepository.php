<?php

namespace App\Repositories;

use App\Models\StickyNote;

interface IStickyNoteRepository
{
    public function create(array $data): StickyNote;

    public function update(int $id, array $data): StickyNote;

    public function delete(int $id): void;
}
