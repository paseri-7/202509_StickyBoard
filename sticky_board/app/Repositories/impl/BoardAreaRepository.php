<?php

namespace App\Repositories\impl;

use App\Models\BoardArea;
use App\Repositories\IBoardAreaRepository;

class BoardAreaRepository implements IBoardAreaRepository
{
    public function create(array $data): BoardArea
    {
        return BoardArea::create($data);
    }

    public function update(int $id, array $data): BoardArea
    {
        $area = BoardArea::findOrFail($id);
        $area->fill($data);
        $area->save();

        return $area;
    }

    public function delete(int $id): void
    {
        BoardArea::whereKey($id)->delete();
    }
}
