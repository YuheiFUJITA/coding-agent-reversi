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

### 必要な環境

- **Node.js**: 18.0.0 以上
- **pnpm**: 8.0.0 以上 (推奨)

### GitHub Codespaces での開発 (推奨)

このリポジトリはGitHub Codespacesで即座に開発環境をセットアップできます：

1. GitHubでこのリポジトリを開く
2. 緑の「Code」ボタンをクリック
3. 「Codespaces」タブを選択
4. 「Create codespace on main」をクリック

Codespacesでは以下が自動で設定されます：
- Node.js 20.x
- pnpm
- 必要なVS Code拡張機能
- 依存関係の自動インストール

### ローカル開発環境

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動 (http://localhost:5173)
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