const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");   // 5_stage.html の <p id="info">

let x = 100;          // 丸の中心の位置
let y = 80;
let vx = 180;         // 横の速さ（1秒に180px）
let vy = 140;         // 縦の速さ（1秒に140px。＋ は下へ）
let r = 14;         // 半径
let last = performance.now();
let hitCount = 0;//壁に当たった回数をカウント

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") {
    vx = vx * 1.2;   // 速さを1.2倍（向きはそのまま）
    vy = vy * 1.2;
  }
  // ここに、ほかのキーを足す
  if (e.code === "ArrowUp") {
    vx = vx * 1.2;
    vy = vy * 1.2;
  }else if (e.code === "ArrowDown") {
    vx = vx * 0.8;
    vy = vy * 0.8;
  }else if (e.code === "ArrowRight") {
    // 右キー：半径を大きくする（最大30）
    r = Math.min(r + 3, 30);
  } else if (e.code === "ArrowLeft") {
    // 左キー：半径を小さくする（最小5）
    r = Math.max(r - 3, 5);
  }
});

function update(dt) {
  x = x + vx * dt;
  y = y + vy * dt;

  // 左右の壁（丸は x が中心なので、半径 r を足し引きする）
  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
     hitCount++; // 追加
  }
  if (x - r < 0) {
    x = r;
    vx = -vx;
     hitCount++; // 追加
  }
  // 上下の壁
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
    hitCount++; // 追加
  }
  if (y - r < 0) {
    y = r;
    vy = -vy;
    hitCount++; // 追加
  }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    // 壁に当たった回数を表示
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    ctx.fillText("壁に当たった回数：" + hitCount, 10, 25);
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