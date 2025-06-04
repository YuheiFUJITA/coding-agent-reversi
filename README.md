# 黒白リバーシ

Vue 3 + TypeScript + Tailwind CSSで作られたリバーシゲームです。

## 特徴

- 📱 **レスポンシブ対応**: スマートフォンとPCの両方で快適にプレイ
- 🎮 **直感的操作**: タップまたはクリックで簡単操作
- 💾 **ゲーム状態保存**: Cookieでゲーム進行を自動保存
- 🎨 **美しいアニメーション**: 石の配置とひっくり返しにアニメーション
- ⚡ **高速レスポンス**: 100ms以内でのUI反応

## 技術スタック

- **Vue 3** (Composition API)
- **TypeScript** 
- **Tailwind CSS**
- **Vite**
- **pnpm**

## セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# プレビュー
pnpm preview
```

## デプロイ

このプロジェクトはCloudflare Pagesでのデプロイを想定して設計されています。

### Cloudflare Pages での設定

- **Build command**: `pnpm pages:build`
- **Build output directory**: `dist`
- **Node.js version**: 18 以上

## ゲーム仕様

- 8×8の盤面でプレイ
- 黒石が先手
- 有効な手がない場合は自動パス
- 両者とも手がなくなったら自動終了
- ゲーム状態はCookieに30日間保存

## ライセンス

ISC