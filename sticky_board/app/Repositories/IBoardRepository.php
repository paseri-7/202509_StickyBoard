<?php

namespace App\Repositories;

interface IBoardRepository
{
    public function getAll(int $userId): \Illuminate\Support\Collection;

    public function findById(int $userId, int $id): \App\Models\Board;

    public function findWithItems(int $userId, int $id): \App\Models\Board;

    public function create(array $data): \App\Models\Board;

    public function update(int $userId, int $id, array $data): \App\Models\Board;

    public function delete(int $userId, int $id): void;
}
