<?php

namespace App\Repositories\impl;

use App\Models\StickyNote;
use App\Repositories\IStickyNoteRepository;

class StickyNoteRepository implements IStickyNoteRepository
{
    public function create(array $data): StickyNote
    {
        return StickyNote::create($data);
    }

    public function update(int $id, array $data): StickyNote
    {
        $note = StickyNote::findOrFail($id);
        $note->fill($data);
        $note->save();

        return $note;
    }

    public function delete(int $id): void
    {
        StickyNote::whereKey($id)->delete();
    }
}
