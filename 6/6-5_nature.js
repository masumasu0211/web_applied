const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;

// ここの数を変えて試す
const BOUNCE =  0.45;      // 反発係数：跳ね返ると、速さが何倍になるか（0〜1）
const STOP_SPEED = 250;   // 落ちる速さがこれより小さければ、跳ね返らずに止まる
const FRICTION = 0.88;    // 摩擦：キーを離して地面にいるとき、横の速さを1回ごとに何倍にするか

// 横の速さ vx を足した
const player = { x: 80, y: 20, w: 32, h: 32, vx: 0, vy: 0, isGrounded: false };
const floor = { x: 0, y: 320, w: 640, h: 40 };

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space" && player.isGrounded) {
    player.vy = -JUMP_SPEED;
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;          // 位置を床の上に戻す
    if (player.vy > STOP_SPEED) {
      player.vy = -player.vy * BOUNCE;      // 速さ：向きを反対にして、BOUNCE 倍にする（跳ね返る）
      player.isGrounded = false;
    } else {
      player.vy = 0;                        // 速さ：0（止まる）
      player.isGrounded = true;
    }
  } else {
    player.isGrounded = false;
  }
}

function update(dt) {
  if (keys["ArrowRight"]) {
    player.vx = MOVE_SPEED;
  } else if (keys["ArrowLeft"]) {
    player.vx = -MOVE_SPEED;
  } else if (player.isGrounded) {
    player.vx = player.vx * FRICTION;       // キーを離していて地面にいるときは、少しずつ遅くなる
  }
  player.x = player.x + player.vx * dt;

  player.vy = player.vy + GRAVITY * dt;
  player.y = player.y + player.vy * dt;
  collideWithFloor();

  // 画面の左右の端で止める（５-６と同じ）
  if (player.x < 0) {
    player.x = 0;
    player.vx = 0;
  }
  if (player.x > canvas.width - player.w) {
    player.x = canvas.width - player.w;
    player.vx = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);
  ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vx = " + player.vx.toFixed(0) + "   vy = " + player.vy.toFixed(0) + "   isGrounded = " + player.isGrounded, 10, 20);
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