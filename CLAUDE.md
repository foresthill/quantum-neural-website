# Quantum Neural Website - Development Guide

## プロジェクト概要
革新的なIT企業ホームページ。量子物理学的デザインとAI、3D表現を融合した次世代Web体験を提供。

## 主要機能
- **Quantum Flow Universe**: WebGL/Three.jsによる15,000個の量子粒子システム
- **グラスモーフィズム/ニューモーフィズムUI**: 最先端のデザイントレンド
- **PWA対応**: オフライン動作とアプリライクな体験
- **高パフォーマンス**: 60fps最適化、Lighthouse Score 95+

## セットアップ
```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プレビュー
npm run preview
```

## 技術スタック
- **3D/WebGL**: Three.js (v0.160.0)
- **アニメーション**: GSAP (v3.12.4)
- **ビルドツール**: Vite (v5.0.10)
- **デザイン**: CSS3 (グラスモーフィズム/ニューモーフィズム)
- **最適化**: Service Worker, PWA

## ファイル構成
```
quantum-neural-website/
├── index.html          # メインHTML
├── styles.css          # 基本スタイル
├── css/style.css       # 追加スタイル
├── scripts.js          # 基本インタラクション
├── js/
│   ├── main.js         # Quantum Flow Universe
│   ├── animations.js   # GSAP アニメーション
│   └── performance.js  # パフォーマンス最適化
├── public/
│   ├── manifest.json   # PWA設定
│   ├── service-worker.js
│   ├── robots.txt
│   └── sitemap.xml
└── vite.config.js      # Vite設定
```

## 開発のポイント
- モバイルファーストで実装
- アクセシビリティに配慮
- SEO最適化済み
- パフォーマンスを常に意識

## チーム貢献
- **Worker1**: HTML/CSS基盤とレスポンシブデザイン
- **Worker2**: 3Dインタラクションと高度なアニメーション  
- **Worker3**: パフォーマンス最適化とPWA/SEO対応

---
プロジェクト作成: 2025-06-16
最終更新: 2025-06-16