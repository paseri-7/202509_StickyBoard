# 仮置き判断ログ（decisions.md）

- 日付:
- 決定事項:
- 理由:
- 影響範囲:
- 代替案:

- 日付: 2026-01-25
- 決定事項: Docker Compose の DB/Redis 接続情報はローカル開発向けに固定デフォルト（DB 名/ユーザー/パスワードは sticky_board、PostgreSQL 5432・Redis 6379）を採用。
- 理由: 要件に具体的な値指定がなく、docker compose up の即時起動性と疎通確認手順の明確化を優先したため。
- 影響範囲: `docker/docker-compose.yml` と `docker/README.md` の接続情報。
- 代替案: `.env` を必須化して値を注入する運用に変更。

- 日付: 2026-01-25
- 決定事項: ボード一覧の初期実装では `boards` テーブルに `title`/`description`/timestamps のみを持たせ、ユーザー関連は未追加。
- 理由: 認証（Google OAuth）未導入のため、要件に明記された一覧表示に必要な最小構成で進めるため。
- 影響範囲: `boards` テーブル、`Board` モデル、シードデータ。
- 代替案: 先に `user_id` を追加し、仮ユーザーに紐付ける。

- 日付: 2026-01-26
- 決定事項: 付箋/エリアの座標とサイズは `integer`（px想定）で保持し、初期はボード1枚目にサンプル配置のみ投入。
- 理由: 参照元に実装が無いため、最小構成でボード詳細の表示検証を優先した。
- 影響範囲: `sticky_notes`/`board_areas` テーブル、`StickyNote`/`BoardArea` モデル、シードデータ。
- 代替案: `decimal` で保持し拡大縮小に対応、全ボードに初期データ投入。
