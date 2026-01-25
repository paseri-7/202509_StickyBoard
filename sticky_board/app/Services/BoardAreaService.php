<?php

namespace App\Services;

use App\Repositories\IBoardAreaRepository;

class BoardAreaService
{
    public function __construct(
        private IBoardAreaRepository $boardAreaRepository,
    ) {}

    public function create(array $data)
    {
        return $this->boardAreaRepository->create($data);
    }

    public function update(int $id, array $data)
    {
        return $this->boardAreaRepository->update($id, $data);
    }

    public function delete(int $id): void
    {
        $this->boardAreaRepository->delete($id);
    }
}
