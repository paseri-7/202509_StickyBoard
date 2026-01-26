<?php

namespace App\Repositories;

use App\Models\BoardArea;

interface IBoardAreaRepository
{
    public function createForUser(int $userId, array $data): BoardArea;

    public function updateForUser(int $userId, int $id, array $data): BoardArea;

    public function deleteForUser(int $userId, int $id): void;
}
