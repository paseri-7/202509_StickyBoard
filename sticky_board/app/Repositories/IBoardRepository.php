<?php

namespace App\Repositories;

interface IBoardRepository
{
    public function getAll(): \Illuminate\Support\Collection;

    public function findById(int $id): \App\Models\Board;

    public function findWithItems(int $id): \App\Models\Board;
}
