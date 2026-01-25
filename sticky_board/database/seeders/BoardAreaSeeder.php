<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\BoardArea;
use Illuminate\Database\Seeder;

class BoardAreaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!Board::query()->exists() || BoardArea::query()->exists()) {
            return;
        }

        $board = Board::query()->orderBy('id')->first();

        if (!$board) {
            return;
        }

        BoardArea::query()->insert([
            [
                'board_id' => $board->id,
                'title' => '優先タスク',
                'x' => 120,
                'y' => 140,
                'width' => 520,
                'height' => 320,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'board_id' => $board->id,
                'title' => '調査中',
                'x' => 700,
                'y' => 180,
                'width' => 420,
                'height' => 260,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
