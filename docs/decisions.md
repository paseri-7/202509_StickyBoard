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
