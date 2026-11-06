const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");   // 5_stage.html の <p id="info">

let x = 100;          // 丸の中心の位置
let y = 80;
let vx = 180;         // 横の速さ（1秒に180px）
let vy = 140;         // 縦の速さ（1秒に140px。＋ は下へ）
const r = 24;         // 半径
let last = performance.now();
const img = new Image();            // ① 画像を入れる入れ物を作る
img.src = "5-5_player.png";         // ② 読み込むファイル（5_stage.html から見た場所）

function update(dt) {
  x = x + vx * dt;
  y = y + vy * dt;

  // 左右の壁（丸は x が中心なので、半径 r を足し引きする）
  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
  }
  if (x - r < 0) {
    x = r;
    vx = -vx;
  }
  // 上下の壁
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
  }
  if (y - r < 0) {
    y = r;
    vy = -vy;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ③ 画像を描く（左上の位置 x, y, 幅, 高さ）。x, y は丸の中心なので、半径の分だけ左上にずらす
  ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
}
// now：今回呼ばれた時刻（ミリ秒）。requestAnimationFrame が引数で渡してくれる
function loop(now) {
  const dt = (now - last) / 1000;   // 前回からの時間（秒）
  last = now;                       // 今回の時刻を、次の「前回」として覚えておく

  info.textContent = "dt：" + dt.toFixed(4) + " 秒　／　1秒に約 " + (1 / dt).toFixed(0) + " 回";

  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);