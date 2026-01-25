# StickyBoard Docker 開発環境

## 起動手順

```bash
cd /202509_StickyBoard/docker
docker compose up -d --build
```

- Web: http://localhost (Apache)
- Vite: http://localhost:5173
- Storybook: http://localhost:6006

## 接続情報（Docker Compose 既定値）

- PostgreSQL
  - Host: `localhost`
  - Port: `5432`
  - Database: `sticky_board`
  - User: `sticky_board`
  - Password: `sticky_board`
- Redis
  - Host: `localhost`
  - Port: `6379`

## 疎通確認コマンド

### PostgreSQL

```bash
docker compose exec db psql -U sticky_board -d sticky_board
```

### Redis

```bash
docker compose exec redis redis-cli ping
```

## Xdebug

- Xdebug3 / port 9003 を有効化済み
- `xdebug.client_host=host.docker.internal` を設定済み（Linux では `extra_hosts` で host-gateway を割り当てています）
