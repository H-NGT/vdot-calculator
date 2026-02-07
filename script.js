/**
 * マラソンタイム予測 - ダニエルズ式 (VDOT) 計算
 * Based on Jack Daniels' Running Formula
 */

// 定数
const MARATHON_DISTANCE = 42195; // メートル
const HALF_MARATHON_DISTANCE = 21097.5;
const TEN_K_DISTANCE = 10000;
const FIVE_K_DISTANCE = 5000;

/**
 * VDOT値を計算する
 * @param {number} distanceMeters - 距離（メートル）
 * @param {number} timeMinutes - タイム（分）
 * @returns {number} VDOT値
 */
function calculateVDOT(distanceMeters, timeMinutes) {
    // 速度 (メートル/分)
    const velocity = distanceMeters / timeMinutes;

    // VO2 計算 (Daniels-Gilbert式)
    const vo2 = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);

    // %VO2max 計算
    const percentVO2max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMinutes)
        + 0.2989558 * Math.exp(-0.1932605 * timeMinutes);

    // VDOT = VO2 / %VO2max
    return vo2 / percentVO2max;
}

/**
 * VDOT値から指定距離のレースタイムを予測する
 * Newton-Raphson法で方程式を解く
 * @param {number} vdot - VDOT値
 * @param {number} targetDistance - 目標距離（メートル）
 * @returns {number} 予測タイム（分）
 */
function predictRaceTime(vdot, targetDistance) {
    // 初期推定値（VDOT値に基づく大まかな推定）
    let timeGuess = targetDistance / (vdot * 3);

    // Newton-Raphson法で反復
    for (let i = 0; i < 100; i++) {
        const velocity = targetDistance / timeGuess;

        // VO2 計算
        const vo2 = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);

        // %VO2max 計算
        const percentVO2max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeGuess)
            + 0.2989558 * Math.exp(-0.1932605 * timeGuess);

        // 現在の推定から計算されるVDOT
        const calculatedVDOT = vo2 / percentVO2max;

        // 誤差
        const error = calculatedVDOT - vdot;

        // 収束判定
        if (Math.abs(error) < 0.0001) {
            break;
        }

        // 時間を調整（VDOTが大きすぎる → 時間を増やす）
        timeGuess += error * 0.5;

        // 負の値にならないように
        if (timeGuess < 1) timeGuess = 1;
    }

    return timeGuess;
}

/**
 * 時間（分）を時:分:秒形式にフォーマット
 * @param {number} totalMinutes - 合計分数
 * @returns {string} フォーマットされた時間
 */
function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.round((totalMinutes % 1) * 60);

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * ペース（分/km）を秒/kmで取得
 * @param {number} minutes - 分
 * @param {number} seconds - 秒
 * @returns {number} 秒/km
 */
function paceToSecondsPerKm(minutes, seconds) {
    return minutes * 60 + seconds;
}

/**
 * 予測を計算して表示
 */
function calculatePrediction() {
    const paceMinutes = parseInt(document.getElementById('pace-minutes').value) || 0;
    const paceSeconds = parseInt(document.getElementById('pace-seconds').value) || 0;
    const distanceKm = parseFloat(document.getElementById('distance').value) || 0;

    // バリデーション
    if (paceMinutes === 0 && paceSeconds === 0) {
        showError('ペースを入力してください');
        return;
    }

    if (distanceKm <= 0) {
        showError('走行距離を入力してください');
        return;
    }

    // ペースから合計タイムを計算
    const paceSecondsPerKm = paceToSecondsPerKm(paceMinutes, paceSeconds);
    const totalTimeMinutes = (paceSecondsPerKm * distanceKm) / 60;
    const distanceMeters = distanceKm * 1000;

    // VDOT を計算
    const vdot = calculateVDOT(distanceMeters, totalTimeMinutes);

    // 各距離の予測タイム
    const marathonTime = predictRaceTime(vdot, MARATHON_DISTANCE);
    const halfMarathonTime = predictRaceTime(vdot, HALF_MARATHON_DISTANCE);
    const tenKTime = predictRaceTime(vdot, TEN_K_DISTANCE);
    const fiveKTime = predictRaceTime(vdot, FIVE_K_DISTANCE);

    // 結果を表示
    displayResults({
        vdot: vdot.toFixed(1),
        marathon: formatTime(marathonTime),
        halfMarathon: formatTime(halfMarathonTime),
        tenK: formatTime(tenKTime),
        fiveK: formatTime(fiveKTime),
        marathonPace: formatTime(marathonTime / 42.195)
    });
}

/**
 * エラーメッセージを表示
 * @param {string} message - エラーメッセージ
 */
function showError(message) {
    const resultsSection = document.getElementById('results');
    resultsSection.innerHTML = `<p class="error">${message}</p>`;
    resultsSection.classList.add('visible');
}

/**
 * 結果を表示
 * @param {Object} results - 計算結果
 */
function displayResults(results) {
    const resultsSection = document.getElementById('results');

    resultsSection.innerHTML = `
    <div class="vdot-display">
      <span class="vdot-label">あなたの VDOT</span>
      <span class="vdot-value">${results.vdot}</span>
    </div>
    
    <div class="prediction-card main">
      <div class="race-name">🏃 フルマラソン</div>
      <div class="race-time">${results.marathon}</div>
      <div class="race-pace">ペース: ${results.marathonPace}/km</div>
    </div>
    
    <div class="other-predictions">
      <div class="prediction-card">
        <div class="race-name">ハーフマラソン</div>
        <div class="race-time">${results.halfMarathon}</div>
      </div>
      <div class="prediction-card">
        <div class="race-name">10K</div>
        <div class="race-time">${results.tenK}</div>
      </div>
      <div class="prediction-card">
        <div class="race-name">5K</div>
        <div class="race-time">${results.fiveK}</div>
      </div>
    </div>
  `;

    resultsSection.classList.add('visible');
}

// イベントリスナー
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prediction-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        calculatePrediction();
    });
});
