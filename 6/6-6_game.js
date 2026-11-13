const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;
const MAX_JUMPS = 2;          // 地面を離れてから跳べる回数（2段ジャンプ）
const FALL_GRAVITY_RATE = 2;  // 落ちるときは、重力を何倍にするか

const player = { x: 80, y: 20, w: 32, h: 32, vy: 0, isGrounded: false, jumpsLeft: MAX_JUMPS };
const floor = { x: 0, y: 320, w: 640, h: 40 };

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  // 跳べる回数が残っていれば跳ぶ（空中でも）
  if (e.code === "Space" && player.jumpsLeft > 0) {
    player.vy = -JUMP_SPEED;
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
    player.jumpsLeft = MAX_JUMPS;   // 着地したら、跳べる回数を元に戻す
  } else {
    player.isGrounded = false;
  }
}

function update(dt) {
  if (keys["ArrowRight"]) {
    player.x = player.x + MOVE_SPEED * dt;
  }
  if (keys["ArrowLeft"]) {
    player.x = player.x - MOVE_SPEED * dt;
  }
  // 落ちているとき（vy が＋）だけ、重力を強くする
  const g = player.vy > 0 ? GRAVITY * FALL_GRAVITY_RATE : GRAVITY;
  player.vy = player.vy + g * dt;
  player.y = player.y + player.vy * dt;
  collideWithFloor();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);
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