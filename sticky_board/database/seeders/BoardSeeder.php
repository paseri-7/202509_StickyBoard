<?php

namespace Database\Seeders;

use App\Models\Board;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BoardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Board::query()->exists()) {
            return;
        }

        $boards = [
            ['title' => '新規プロジェクト', 'description' => '初期設計とタスク整理', 'updated_at' => '2026-01-25'],
            ['title' => '学習メモ', 'description' => 'React + Laravel の検証メモ', 'updated_at' => '2026-01-24'],
            ['title' => '今週のやること', 'description' => 'レビュー・実装・整理', 'updated_at' => '2026-01-23'],
            ['title' => 'アイデアボード', 'description' => '付箋の配色検討と配置案', 'updated_at' => '2026-01-22'],
            ['title' => '読書メモ', 'description' => '気づき・引用・タスク化', 'updated_at' => '2026-01-21'],
            ['title' => 'UIラフ案', 'description' => 'ボタン配置と余白の検討', 'updated_at' => '2026-01-20'],
            ['title' => '会議メモ', 'description' => '次回の議題とアクション', 'updated_at' => '2026-01-19'],
            ['title' => '改善リスト', 'description' => 'UX課題と対応案の整理', 'updated_at' => '2026-01-18'],
            ['title' => 'バックログ', 'description' => '後回しタスクの棚卸し', 'updated_at' => '2026-01-17'],
            ['title' => 'リリース準備', 'description' => '公開前の最終確認', 'updated_at' => '2026-01-16'],
        ];

        $now = Carbon::now();
        $payload = array_map(static function (array $board) use ($now) {
            $updatedAt = Carbon::parse($board['updated_at']);
            return [
                'title' => $board['title'],
                'description' => $board['description'],
                'created_at' => $updatedAt->copy()->lessThan($now) ? $updatedAt : $now,
                'updated_at' => $updatedAt,
            ];
        }, $boards);

        Board::query()->insert($payload);
    }
}
