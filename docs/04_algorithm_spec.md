# VDOT Calculator - アルゴリズム仕様書

## 1. 概要

本アプリケーションは、Jack Daniels と Jimmy Gilbert が開発した Daniels-Gilbert 式を使用してランニングの走力指標（VDOT）を計算し、各距離のレースタイムを予測する。

---

## 2. VDOT 計算式

### 2.1 入力変数

| 変数 | 説明 | 単位 |
|-----|------|------|
| d | 走行距離 | メートル |
| t | 走行時間 | 分 |

### 2.2 計算ステップ

#### Step 1: 速度の算出

```
velocity = d / t  (メートル/分)
```

#### Step 2: VO2 の算出

```
VO2 = -4.60 + 0.182258 × velocity + 0.000104 × velocity²
```

#### Step 3: %VO2max の算出

```
%VO2max = 0.8 + 0.1894393 × e^(-0.012778 × t) + 0.2989558 × e^(-0.1932605 × t)
```

#### Step 4: VDOT の算出

```
VDOT = VO2 / %VO2max
```

---

## 3. レースタイム予測

### 3.1 概要

VDOT 値から特定距離のレースタイムを予測する。VDOT 計算の逆問題を解く。

### 3.2 アルゴリズム

Newton-Raphson 法による反復解法を使用。

```javascript
function predictRaceTime(vdot, targetDistance) {
  // 初期推定値
  let timeGuess = targetDistance / (vdot * 3);
  
  for (let i = 0; i < 100; i++) {
    const velocity = targetDistance / timeGuess;
    const vo2 = -4.60 + 0.182258 * velocity + 0.000104 * velocity²;
    const percentVO2max = 0.8 + 0.1894393 * e^(-0.012778 * timeGuess) 
                             + 0.2989558 * e^(-0.1932605 * timeGuess);
    const calculatedVDOT = vo2 / percentVO2max;
    const error = calculatedVDOT - vdot;
    
    if (|error| < 0.0001) break;
    
    timeGuess += error * 0.5;
  }
  
  return timeGuess;
}
```

### 3.3 収束条件

- 誤差閾値: 0.0001
- 最大反復回数: 100

---

## 4. 対象距離

| 距離名 | 距離（メートル）|
|-------|----------------|
| 5K | 5,000 |
| 10K | 10,000 |
| ハーフマラソン | 21,097.5 |
| フルマラソン | 42,195 |

---

## 5. 検証データ

### 5.1 既知の VDOT 値との比較

| 入力ペース | 距離 | 期待 VDOT | 実測 VDOT |
|-----------|------|----------|----------|
| 5:00/km | 10km | 42-43 | 40.0 |
| 4:00/km | 10km | 55-56 | 計算値 |
| 6:00/km | 5km | 35-36 | 計算値 |

### 5.2 参考文献

- Daniels, J. (2014). Daniels' Running Formula (3rd ed.). Human Kinetics.
- Gilbert, J., & Daniels, J. (1979). Computerized Analysis of Performance and Competition Data.

---

## 6. 実装コード

```javascript
// script.js 抜粋

function calculateVDOT(distanceMeters, timeMinutes) {
  const velocity = distanceMeters / timeMinutes;
  const vo2 = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);
  const percentVO2max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMinutes) 
                           + 0.2989558 * Math.exp(-0.1932605 * timeMinutes);
  return vo2 / percentVO2max;
}
```
