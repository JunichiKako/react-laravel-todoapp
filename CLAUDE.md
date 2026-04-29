# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## このリポジトリの位置づけ

Udemy のフルスタック学習用に作っている「React + Laravel の Todo アプリ」用 Docker 環境。現状リポジトリ名に `react` が入っているが、`src/` には Laravel 13 のスケルトンしか入っていない（`app/Http/Controllers` は空、`app/Models` は `User.php` のみ、`resources/views` は `welcome.blade.php` のみ、フロントは Vite + Tailwind v4 のみで React は未導入）。これからアプリを書き足していく初期状態として扱う。

## 構造の前提（最重要）

- **Laravel プロジェクトはリポジトリ直下ではなく `src/` 配下** — `composer.json` / `artisan` / `package.json` / `vite.config.js` / `phpunit.xml` などはすべて `src/` にある。`composer` や `php artisan`、`npm` を実行するときは `src/` を作業ディレクトリにすること。
- **`.env` が 2 つあって役割が違う**:
  - リポジトリ直下 `./.env` … `docker-compose.yml` が読む。`DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` / `DB_ROOT_PASSWORD` の 4 つだけ。MySQL コンテナの初期化と `app` コンテナへの環境変数渡しに使う。
  - `src/.env` … Laravel アプリ本体の `.env`。`DB_HOST=db` でコンテナ名 `db` を参照している。両者の DB 名/ユーザー/パスワードは一致させる必要がある。
- **コンテナ内のマウントパスは `/data`** — `./src` が `app` / `web` の両コンテナで `/data` にマウントされる。`working_dir: /data`。Nginx の document root は `/data/public`。
- **`app` コンテナは `appuser` (UID/GID 1000) で動く** — `docker-compose.yml` で `user: "1000:1000"` が指定されているので、ホスト側ユーザーの UID が 1000 でない場合に `storage/` `bootstrap/cache/` のパーミッションで詰まる可能性がある。

## よく使うコマンド

すべてリポジトリ直下から実行する想定。

```bash
# 環境構築（初回）
cp .env.example .env                              # 直下の docker-compose 用 .env
docker-compose up -d --build
docker-compose exec app composer install
docker-compose exec app cp .env.example .env      # src/.env （Laravel 本体）
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate

# 起動 / 停止
docker-compose up -d
docker-compose down
docker-compose down -v          # ← MySQL の永続ボリューム db-store も消える。要確認

# コンテナに入る
docker-compose exec app bash    # PHP/Composer/Node が入っている

# Laravel
docker-compose exec app php artisan migrate
docker-compose exec app php artisan migrate:fresh --seed
docker-compose exec app php artisan tinker
docker-compose exec app php artisan make:controller TodoController

# テスト（PHPUnit 12 + Laravel test runner）
docker-compose exec app php artisan test
docker-compose exec app php artisan test --filter=ExampleTest
docker-compose exec app vendor/bin/phpunit tests/Feature/ExampleTest.php

# Lint / フォーマット（Laravel Pint）
docker-compose exec app vendor/bin/pint
docker-compose exec app vendor/bin/pint --test       # 変更せずチェックだけ

# フロント（Vite + Tailwind v4）
docker-compose exec app npm install
docker-compose exec app npm run dev      # Vite dev server
docker-compose exec app npm run build
```

`composer dev` / `composer setup` / `composer test` スクリプトも `src/composer.json` に定義済み。`composer dev` は `php artisan serve` + queue + pail + vite を `concurrently` で同時起動するが、Docker 構成では Nginx 経由で配信するので通常は使わない。

## アクセスポートと既知の食い違い

- アプリ: `http://localhost`（Nginx → app:9000 へ FastCGI）
- MySQL: ホスト `localhost:3306`（README には 3380 と書かれているが、`docker-compose.yml` では `3306:3306`。実装側が正）
- Vite dev: `5173`（`app` コンテナで公開済み）。ただし `src/vite.config.js` には `server.host` の指定がない。Docker 外のブラウザから HMR を通したい場合は README 末尾のスニペットのように `host: '0.0.0.0'` / `strictPort` / `hmr` を足す必要がある。

## 本番想定

`docker-compose.prod.yml` をオーバーレイ:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

本番では Aurora MySQL 等の外部 DB を使う前提で、`db` サービスは置き換える（`docker-compose.prod.yml` は `app` の `DB_HOST` 等を上書きする形）。CloudFront + ACM 利用が README で推奨されている。

## 変更時の注意

- `src/` 内の Laravel 標準ファイル（`bootstrap/`, `config/`, `routes/`, `app/Http/Kernel` 等）はフレームワーク既定のまま。アプリ固有のコントローラ・モデル・マイグレーションを足していく段階。
- `database/database.sqlite` がリポジトリに含まれているが、`src/.env` は `DB_CONNECTION=mysql` を使う設定。SQLite は Laravel skeleton の `composer create-project` 時の名残で、テスト等で必要になったときだけ参照する。
- `infra/{php,nginx,mysql}/` を編集した場合は `docker-compose build` （または `up -d --build`）が必要。`src/` 配下のコード変更はバインドマウントなので再ビルド不要。
