# StickyBoard - Codex 作業ルール（AGENTS.md）

<!--
■短く・強制力があるものを当ファイルに記載
・編集対象制約（実装先/参照専用/禁止パス）
・参照元の優先順位（requirementsが正、迷ったらdecisionsに記録）
・技術スタック固定
・“必ず守る”作業ルール（1タスク小さく、要件外追加禁止、等）
・規約ドキュメントの場所（リンク）

コーディング規約、アーキテクチャ、ディレクトリ構成ルール等はdocs配下へ
-->

## 重要：編集対象の制約

- 変更（追加/更新/削除）は `202509_StickyBoard/**` のみ許可する。
- `202503_twitter/**` は参照専用（変更禁止）。
- `design/**` は参照専用（変更禁止）。

## 参照元（唯一の正）

- 要件は `docs/requirements.md` を唯一の正（Source of Truth）とする。
- 仕様に明記されていない点で判断が必要な場合は、仮置きで進めてよいが、必ず `docs/decisions.md` に「仮置き内容・理由」を記録する。

## UI参照

- Figma Make の生成ソースは `design/` 配下にある。UIレイアウト/コンポーネントの意図の参照元として利用する。
- ただし生成ソースの丸ごとコピーは避け、アプリ構成に合わせて整理して実装する。

## ディレクトリ構成の参照（重要）

- ディレクトリ構成・命名・配置の方針は `202503_twitter/**` を手本にする。
  - Docker関連は主に `202503_twitter/docker/**` を参照する。
  - アプリ（Laravel/React）の配置は主に `202503_twitter/board_app/**` を参照する。
- 参照は「構成・命名・配置の考え方」を優先し、コードの大量コピーは行わない。
- ただし実装（追加/更新/削除）は必ず `202509_StickyBoard/**` 配下のみで行う。

# AI / Laravel Boost 運用

- 202509_StickyBoard/AGENTS.md（本ファイル）を唯一の正とする。
- 202509_StickyBoard/sticky_board/AGENTS.md は Laravel Boost が生成した補助ガイドライン（手編集しない）。本ファイルと衝突した場合は本ファイルを優先する。
- codex は MCP 経由で laravel-boost を利用する（.codex/config.toml）。

- 不明点は推測しない。確認できる事項（Laravelの設定、ルート、DB、依存、バージョン、既存実装）は Laravel Boost MCP を使って確認してから判断する。
- 重要な判断（構成変更・依存追加・設計方針）をする場合は、確認に使ったツール名（例：`mcp__laravel-boost__...`）を回答内に記載する。
- MCPで確認できない場合のみ、その理由（なぜ確認できないか）を明記した上で仮置きする。

## 技術スタック（固定）

- Docker / Laravel / React / TypeScript / PostgreSQL / Apache / Redis
- CSS は Tailwind CSS を使用する（大きなカスタムCSSは作らず、必要最小限に留める）

## 導入・利用が確定しているもの

- Laravel Boost（導入は基盤構築後）
- Laravel Pint（PHP整形）
- Laravel Horizon（Queue監視 / Redis前提）
- Laravel Telescope（開発環境のみ）
- Xdebug（Docker環境で有効化し、VS Code からステップ実行できること）
- ESLint MCP（フロント品質）
- Playwright MCP（E2E / UI確認）

## 進め方

- 1タスク = 1目的で小さく実装する（差分を巨大化させない）
- 要件にない機能は追加しない
- 変更後は必ず「変更内容の要約 / 起動・確認手順 / 変更ファイル一覧」を回答に含める
