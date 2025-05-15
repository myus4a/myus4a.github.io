# GitHub Pagesでの公開手順

このアプリケーションをGitHub Pagesで公開するための手順です。

## 1. Viteの設定を変更

GitHub Pagesではリポジトリ名がURLの一部になるため、ベースパスの設定が必要です。

### vite.config.ts を更新

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/myus4a.github.io/', // リポジトリ名をベースパスに設定
})
```

注意: `base`の値は、あなたのGitHubユーザー名とリポジトリ名によって異なります。あなたの場合は `/myus4a.github.io/` が正しいベースパスです。

## 2. package.jsonにデプロイスクリプトを追加

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

## 3. gh-pagesパッケージをインストール

```bash
npm install --save-dev gh-pages
```

## 4. GitHub Pagesのためのビルドとデプロイ

### 手動デプロイの場合

```bash
# 本番用ビルドを作成
npm run build

# GitHub Pagesにデプロイ
npm run deploy
```

### 自動デプロイの場合（GitHub Actions）

1. リポジトリに `.github/workflows` ディレクトリを作成
2. 以下の内容で `deploy.yml` ファイルを作成:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

## 5. GitHubリポジトリの設定

1. GitHubリポジトリにコードをプッシュ
2. リポジトリの「Settings」タブを開く
3. 左側のメニューから「Pages」を選択
4. 「Build and deployment」セクションで：
   - Source: 「Deploy from a branch」を選択
   - Branch: 「gh-pages」ブランチを選択
   - フォルダ: 「/ (root)」を選択
5. 「Save」ボタンをクリック

デプロイが完了すると、「Your site is published at https://myus4a.github.io/myus4a.github.io/」というメッセージが表示されます。

## 注意点

- `myus4a.github.io` という名前のリポジトリは特別で、このリポジトリの場合はベースパスを `'/'` に設定する必要があります。
- 初回デプロイ後にページが表示されるまで数分かかる場合があります。
- 静的アセット（画像など）のパスも相対パスになっていることを確認してください。

## トラブルシューティング

もしページが正しく表示されない場合：

1. ブラウザのデベロッパーツールでコンソールエラーを確認
2. ベースパスが正しく設定されているか確認
3. リポジトリ設定のPagesセクションでデプロイステータスを確認
