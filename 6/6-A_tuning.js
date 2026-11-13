const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

// 調整する数（ここだけを変えて試す）
const CONFIG = {
  GRAVITY: 2000,
  JUMP_SPEED: 700,
  MOVE_SPEED: 360,
  AIR_MOVE_SPEED: 360,
  MAX_JUMPS: 2,
  FALL_GRAVITY_RATE: 2,
};
/*const CONFIG = {
  GRAVITY: 196,          // 9.8 m/秒² × 20
  JUMP_SPEED: 60,        // 3 m/秒 × 20
  MOVE_SPEED: 100,       // 5 m/秒 × 20
  MAX_JUMPS: 1,          // 現実では空中で跳べない
  FALL_GRAVITY_RATE: 1,  // 現実では落ちるときも重力は同じ
};*/

const TARGET_HEIGHT = 64;   // 目印の線の高さ（床から64px＝キャラ2つ分）。ぶつからない

const player = { x: 80, y: 20, w: 32, h: 32, vy: 0, isGrounded: false, jumpsLeft: CONFIG.MAX_JUMPS };
const floor = { x: 0, y: 320, w: 640, h: 40 };

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  // 跳べる回数が残っていれば跳ぶ（空中でも）
  if (e.code === "Space" && player.jumpsLeft > 0) {
    player.vy = -CONFIG.JUMP_SPEED;
    player.jumpsLeft = player.jumpsLeft - 1;
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = CONFIG.MAX_JUMPS;   // 着地したら、跳べる回数を元に戻す
  } else {
    player.isGrounded = false;
  }
}

function update(dt) {
    // 地面にいるときは MOVE_SPEED、空中にいるときは AIR_MOVE_SPEED
  const speed = player.isGrounded ? CONFIG.MOVE_SPEED : CONFIG.AIR_MOVE_SPEED;

  if (keys["ArrowRight"]) {
    player.x = player.x + speed * dt;
  }
  if (keys["ArrowLeft"]) {
    player.x = player.x - speed * dt;
  }
  // 落ちているとき（vy が＋）だけ、重力を強くする
  const g = player.vy > 0 ? CONFIG.GRAVITY * CONFIG.FALL_GRAVITY_RATE : CONFIG.GRAVITY;
  player.vy = player.vy + g * dt;
  player.y = player.y + player.vy * dt;
  collideWithFloor();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);

  // 目印の線（跳んだ高さをくらべる）
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(0, floor.y - TARGET_HEIGHT, canvas.width, 2);

  ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft, 10, 20);
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