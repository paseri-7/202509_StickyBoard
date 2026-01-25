<?php

namespace App\Repositories;

interface IBoardRepository
{
    public function getAll(): \Illuminate\Support\Collection;

    public function findById(int $id): \App\Models\Board;

    public function findWithItems(int $id): \App\Models\Board;

    public function create(array $data): \App\Models\Board;

    public function update(int $id, array $data): \App\Models\Board;
}
