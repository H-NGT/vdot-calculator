# VDOT Calculator 🏃‍♂️

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Public-green.svg)](https://github.com/H-NGT/vdot-calculator)

ダニエルズ式（VDOT）を使って、マラソンの予測タイムを計算する Web アプリケーションです。

## ✨ 機能

- 📊 **VDOT 値算出** - ペースと距離から走力指標を計算
- 🎯 **レース予測** - フルマラソン / ハーフ / 10K / 5K の予測タイム
- 🎛️ **簡単入力** - ドロップダウンでペース選択（分: 1-10, 秒: 0-59）
- 📏 **プリセット距離** - 5K / 10K / ハーフのワンクリック入力

## 🚀 使い方

### ローカルで実行

```bash
# リポジトリをクローン
git clone https://github.com/H-NGT/vdot-calculator.git
cd vdot-calculator

# ブラウザで開く
open index.html

# または開発サーバーを起動
python3 -m http.server 3000
```

### オンラインデモ

🌐 **[https://vdot-calculator.vercel.app/](https://vdot-calculator.vercel.app/)**

## 📐 計算ロジック

[Jack Daniels' Running Formula](https://en.wikipedia.org/wiki/Jack_Daniels_(coach))（ダニエルズ・ギルバートの式）に基づいて計算しています。

```
VO2 = -4.60 + 0.182258 × (d/t) + 0.000104 × (d/t)²
%VO2max = 0.8 + 0.1894393 × e^(-0.012778×t) + 0.2989558 × e^(-0.1932605×t)
VDOT = VO2 / %VO2max
```

詳細は [アルゴリズム仕様書](docs/04_algorithm_spec.md) を参照してください。

## 📁 プロジェクト構成

```
vdot-calculator/
├── index.html          # メイン HTML
├── style.css           # スタイルシート
├── script.js           # VDOT 計算ロジック
├── docs/               # ドキュメント
│   ├── 01_requirements.md      # 要件定義書
│   ├── 02_functional_spec.md   # 機能仕様書
│   ├── 03_technical_spec.md    # 技術仕様書
│   ├── 04_algorithm_spec.md    # アルゴリズム仕様書
│   ├── 05_ui_spec.md           # UI/UX仕様書
│   └── 06_test_spec.md         # テスト仕様書
├── .gitignore
└── README.md
```

## 🛠️ 技術スタック

| 技術 | 用途 |
|-----|------|
| HTML5 | マークアップ |
| CSS3 (Custom Properties) | スタイリング |
| Vanilla JavaScript (ES6+) | ロジック |
| Google Fonts (Inter) | タイポグラフィ |

※フレームワーク不使用、完全クライアントサイドで動作

## ✅ 対応済み機能

- [x] PWA 対応（オフライン動作、ホーム画面追加）
- [x] Vercel デプロイ

## 🤝 コントリビューション

1. Fork する
2. Feature ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照
