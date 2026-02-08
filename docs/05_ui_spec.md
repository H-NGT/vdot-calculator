# VDOT Calculator - UI/UX 仕様書

## 1. デザインシステム

### 1.1 カラーパレット

| 変数名 | 値 | 用途 |
|-------|-----|------|
| `--primary` | #ff6b35 | アクセントカラー |
| `--primary-dark` | #e85a2a | ホバー時 |
| `--primary-light` | #ff8c5a | グラデーション末端 |
| `--secondary` | #1a1a2e | 背景メイン |
| `--surface` | #16213e | 背景サブ |
| `--surface-light` | #1f2b4a | カード背景 |
| `--text` | #ffffff | テキスト |
| `--text-muted` | rgba(255,255,255,0.7) | サブテキスト |
| `--accent` | #00d4ff | VDOT 値表示 |
| `--success` | #00c896 | 成功表示 |

### 1.2 タイポグラフィ

| 要素 | フォント | サイズ | ウェイト |
|-----|---------|-------|---------|
| タイトル | Inter | 2rem | 800 |
| サブタイトル | Inter | 0.9rem | 400 |
| ラベル | Inter | 0.875rem | 600 |
| 入力値 | Inter | 1.25rem | 600 |
| VDOT 値 | Inter | 3rem | 800 |
| レースタイム | Inter | 2.5rem | 800 |

### 1.3 スペーシング

| 変数 | 値 |
|-----|-----|
| コンテナ padding | 2.5rem |
| 入力グループ gap | 0.75rem |
| フォーム gap | 1.5rem |

### 1.4 ボーダー半径

| 変数名 | 値 | 用途 |
|-------|-----|------|
| `--radius-sm` | 8px | ボタン |
| `--radius-md` | 12px | 入力、カード |
| `--radius-lg` | 20px | VDOT 表示 |
| `--radius-xl` | 28px | コンテナ |

---

## 2. コンポーネント

### 2.1 入力フィールド

```css
.input {
  width: 100%;
  padding: 1rem 1.25rem;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
}
```

**状態:**
- Default: 透明ボーダー
- Focus: オレンジボーダー + グロー効果

### 2.2 プリセットボタン

**状態:**
| 状態 | 背景 | ボーダー | テキスト |
|-----|------|---------|---------|
| Default | surface-light | transparent | muted |
| Hover | surface-light | primary | white |
| Active | gradient-primary | transparent | white |

### 2.3 送信ボタン

**スタイル:**
- グラデーション背景
- シャドウ + グロー効果
- 矢印アイコン付き

**アニメーション:**
- Hover: Y方向 -2px、シャドウ拡大
- Click: Y方向 0px（押し込み効果）

### 2.4 結果カード

**メインカード（フルマラソン）:**
- グラデーション背景
- 大きいフォントサイズ
- ペース情報付き

**サブカード（ハーフ/10K/5K）:**
- surface-light 背景
- 3カラムグリッド

---

## 3. アニメーション

### 3.1 ページロード

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
- 対象: コンテナ
- 時間: 0.6s
- イージング: ease-out

### 3.2 ロゴバウンス

```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
```
- 対象: 🏃‍♂️ ロゴ
- 時間: 2s
- 繰り返し: infinite

### 3.3 結果表示

- 対象: 結果セクション
- 時間: 0.4s
- 効果: opacity + translateY

---

## 4. レスポンシブデザイン

### 4.1 ブレークポイント

| 幅 | 対応 |
|----|------|
| > 520px | デスクトップ |
| ≤ 520px | モバイル |

### 4.2 モバイル対応

```css
@media (max-width: 520px) {
  .container { padding: 1.75rem; }
  .title { font-size: 1.5rem; }
  .logo { font-size: 2.5rem; }
  .input { font-size: 1.125rem; }
  .other-predictions { grid-template-columns: 1fr; }
}
```

---

## 5. アクセシビリティ

### 5.1 カラーコントラスト

- テキスト/背景: WCAG AA 準拠
- ボタン: 明確な視覚的区別

### 5.2 フォーカス表示

- 全操作可能要素にフォーカス表示
- オレンジのボーダー + グロー

### 5.3 セマンティック HTML

- `<header>`, `<main>`, `<footer>` 使用
- `<form>`, `<label>` の適切な使用
