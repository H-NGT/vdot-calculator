# VDOT Calculator - 技術仕様書

## 1. システム構成

### 1.1 アーキテクチャ

```
┌─────────────────────────────────────────┐
│               Browser                   │
├─────────────────────────────────────────┤
│  index.html    style.css    script.js   │
│       │            │            │       │
│       └────────────┼────────────┘       │
│                    │                    │
│             Service Worker              │
│                (sw.js)                  │
│                    │                    │
│              Cache Storage              │
└─────────────────────────────────────────┘
```

### 1.2 ファイル構成

```
vdot-calculator/
├── index.html          # メイン HTML
├── style.css           # スタイルシート
├── script.js           # VDOT 計算ロジック
├── manifest.json       # PWA マニフェスト
├── sw.js               # Service Worker
├── icons/
│   ├── icon-192.png    # アプリアイコン 192x192
│   └── icon-512.png    # アプリアイコン 512x512
├── docs/               # ドキュメント
│   ├── 01_requirements.md
│   ├── 02_functional_spec.md
│   ├── 03_technical_spec.md
│   ├── 04_algorithm_spec.md
│   ├── 05_ui_spec.md
│   └── 06_test_spec.md
├── .gitignore
└── README.md
```

---

## 2. 技術スタック

| レイヤー | 技術 |
|---------|------|
| マークアップ | HTML5 |
| スタイリング | CSS3（カスタムプロパティ）|
| ロジック | Vanilla JavaScript (ES6+) |
| フォント | Google Fonts (Inter) |
| PWA | manifest.json, Service Worker |

---

## 3. ブラウザ API 使用

### 3.1 使用 API

| API | 用途 |
|-----|------|
| Service Worker API | オフラインキャッシュ |
| Cache API | 静的アセットのキャッシュ |
| DOM API | UI 操作 |

### 3.2 ポリフィル
不要（モダンブラウザ対象）

---

## 4. Service Worker 仕様

### 4.1 キャッシュ戦略

```
Strategy: Cache First, Network Fallback

┌─────────┐     ┌─────────┐     ┌─────────┐
│ Request │────▶│  Cache  │────▶│ Network │
└─────────┘     └─────────┘     └─────────┘
                     │
                     ▼
               ┌─────────┐
               │Response │
               └─────────┘
```

### 4.2 キャッシュ対象

```javascript
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];
```

### 4.3 キャッシュバージョン

```javascript
const CACHE_NAME = 'vdot-calculator-v1';
```

更新時はバージョン番号をインクリメント。

---

## 5. セキュリティ

### 5.1 CSP 推奨設定

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               style-src 'self' https://fonts.googleapis.com; 
               font-src https://fonts.gstatic.com">
```

### 5.2 注意事項

- 外部 API 呼び出しなし
- ユーザーデータの収集・送信なし
- Cookie 不使用

---

## 6. パフォーマンス最適化

### 6.1 実施済み

| 項目 | 対策 |
|-----|------|
| フォント | preconnect で先行接続 |
| CSS | クリティカル CSS のインライン化なし（ファイルサイズ小） |
| JS | defer 不使用（body 末尾に配置） |
| 画像 | PNG アイコンのみ |

### 6.2 今後の改善候補

- アイコンの WebP 変換
- CSS の minify
- JS の minify
