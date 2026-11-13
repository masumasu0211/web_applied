const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;   // 重力の加速度：速さが1秒ごとに 2000px/秒 ずつ増える（下向き）
const JUMP_SPEED = 700;   // ジャンプの速さ（上向き）：1秒に700px
const MOVE_SPEED = 240;   // 左右の速さ：1秒に240px（５-６と同じ）

// キャラ：位置（左上）・大きさ・縦の速さ vy（下が＋）
const player = { x: 80, y: 20, w: 32, h: 32, vy: 0, isGrounded: false };
const floor = { x: 0, y: 320, w: 640, h: 40 };   // 床：canvas の下の帯
const plat = { x: 300, y: 230, w: 160, h: 16 };   // 浮いた足場

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  // 地面にいる、かつ（&&）スペースを押したときだけ跳ぶ
  if (e.code === "Space" && player.isGrounded) {
    player.vy = -JUMP_SPEED;   // 上向きはマイナス
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 2つの四角 a と b が重なっていれば true、重なっていなければ false を返す（AABB）
function aabb(a, b) {
  return a.x < b.x + b.w &&   // a の左の辺が、b の右の辺より左
         a.x + a.w > b.x &&   // a の右の辺が、b の左の辺より右
         a.y < b.y + b.h &&   // a の上の辺が、b の下の辺より上
         a.y + a.h > b.y;     // a の下の辺が、b の上の辺より下
}

// 床とぶつかったら、位置を戻して、速さを決める
function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;    // 床の上にいる
  } else {
    player.isGrounded = false;   // 空中にいる
  }
}

// 足場：上から落ちてきて重なったときだけ乗る
function collideWithPlatform(prevBottom) {
  if (aabb(player, plat) && prevBottom <= plat.y && player.vy >= 0) {
    player.y = plat.y - player.h;   // 位置を足場の上に戻す
    player.vy = 0;
    player.isGrounded = true;
  }
}

function update(dt) {
    const prevBottom = player.y + player.h;   // 動かす前（前の回）の、キャラの下の辺
    if (keys["ArrowRight"]) {
        player.x = player.x + MOVE_SPEED * dt;
    }
    if (keys["ArrowLeft"]) {
        player.x = player.x - MOVE_SPEED * dt;
    }
    player.vy = player.vy + GRAVITY * dt;    // ① 加速度が、速さを変える
    player.y = player.y + player.vy * dt;    // ② 速さが、位置を変える（５-４と同じ）
    collideWithFloor(); 
      collideWithPlatform(prevBottom);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);
  ctx.fillStyle = "#2e446e";
  ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
  ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   isGrounded = " + player.isGrounded + "   重なり = " + aabb(player, plat), 10, 20);
}

let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);