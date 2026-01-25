<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\StickyNote;
use Illuminate\Database\Seeder;

class StickyNoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!Board::query()->exists() || StickyNote::query()->exists()) {
            return;
        }

        $board = Board::query()->orderBy('id')->first();

        if (!$board) {
            return;
        }

        StickyNote::query()->insert([
            [
                'board_id' => $board->id,
                'content' => 'UIレビューの反映',
                'color' => 'pink',
                'due_at' => now()->addDays(2),
                'x' => 160,
                'y' => 180,
                'width' => 220,
                'height' => 160,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'board_id' => $board->id,
                'content' => 'API設計のたたき台',
                'color' => 'yellow',
                'due_at' => null,
                'x' => 420,
                'y' => 220,
                'width' => 220,
                'height' => 160,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'board_id' => $board->id,
                'content' => 'ユーザー導線の整理',
                'color' => 'green',
                'due_at' => now()->addDays(5),
                'x' => 760,
                'y' => 240,
                'width' => 220,
                'height' => 160,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
