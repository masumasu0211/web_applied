const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;   // 重力の加速度：速さが1秒ごとに 2000px/秒 ずつ増える（下向き）

// キャラ：位置（左上）・大きさ・縦の速さ vy（下が＋）
const player = { x: 80, y: 20, w: 32, h: 32, vy: 0 };

function update(dt) {
  player.vy = player.vy + GRAVITY * dt;    // ① 加速度が、速さを変える
  player.y = player.y + player.vy * dt;    // ② 速さが、位置を変える（５-４と同じ）
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#7ef5e1";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // 今の状態を画面に出す（数字の変わり方を目で確かめる）
  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0), 10, 20);
}

let last = performance.now();

function loop(now) {
  const dt = (now - last) / 1000;
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);