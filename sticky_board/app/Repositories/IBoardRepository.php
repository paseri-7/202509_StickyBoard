<?php

namespace App\Repositories;

interface IBoardRepository
{
    public function getAll(): \Illuminate\Support\Collection;
}
