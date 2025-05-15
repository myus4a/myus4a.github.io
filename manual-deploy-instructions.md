# 手動デプロイの手順

GitHub Pagesに手動でデプロイするための手順です。

## 1. gh-pagesパッケージのインストール

```bash
# nodenvを使っている場合は、正しいNode.jsバージョンを選択してからインストール
eval "$(nodenv init -)"
nodenv shell 20.9.0  # または他の利用可能なバージョン

# gh-pagesパッケージをインストール
npm install --save-dev gh-pages
```

## 2. ビルドと手動デプロイ

```bash
# 正しいNode.jsバージョンを使用
eval "$(nodenv init -)"
nodenv shell 20.9.0

# ビルドを実行
npm run build

# GitHub Pagesにデプロイ
npm run deploy
```

## 3. デプロイ後の確認

デプロイが完了したら、以下のURLでサイトが公開されているか確認できます：
https://myus4a.github.io/myus4a.github.io/

注意：初回デプロイ後、ページが表示されるまで数分かかる場合があります。
