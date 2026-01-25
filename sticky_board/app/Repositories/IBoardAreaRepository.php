<?php

namespace App\Repositories;

use App\Models\BoardArea;

interface IBoardAreaRepository
{
    public function create(array $data): BoardArea;

    public function update(int $id, array $data): BoardArea;

    public function delete(int $id): void;
}
