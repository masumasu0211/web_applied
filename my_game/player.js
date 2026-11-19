// プレイヤー：決まった数・今の値・キー・動き・描き方

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;
const MAX_JUMPS = 2;          // 地面を離れてから跳べる回数（2段ジャンプ）
const FALL_GRAVITY_RATE = 2;  // 落ちるときは、重力を何倍にするか

const player = { x: 80, y: 20, w: 32, h: 32, vx: 0, vy: 0, isGrounded: false, jumpsLeft: MAX_JUMPS, state: "idle", frameIndex: 0, frameTimer: 0 };

// コマを並べた画像（1コマ 32×32）
const playerImg = new Image();
playerImg.src = "7-3_bird.png";
const FRAME_SIZE = 32;    // 1コマの大きさ
const FRAME_TIME = 0.12;  // 1コマを見せる時間（秒）

// 状態ごとの色
const STATE_COLORS = { idle: "#7ef5e1", run: "#6dd3ff", jump: "#ffd166", fall: "#ff9999" };

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space" && player.jumpsLeft > 0) {
    player.vy = -JUMP_SPEED;
    player.jumpsLeft = player.jumpsLeft - 1;
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 床とぶつかったら、位置を戻して、速さを決める
function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = MAX_JUMPS;
  } else {
    player.isGrounded = false;
  }
}

function decideState() {
  if (!player.isGrounded) {   // 空中にいて
    if (player.vy < 0) {      // 速さが上向き（vy がマイナス）なら
      return "jump";
    }
    return "fall";
  }
  if (player.vx !== 0) {      // 横の速さが 0 でなければ
    return "run";
  }
  return "idle";
}

// プレイヤーを動かす（★ main.js の update から呼ばれる）
function updatePlayer(dt) {
  // 横の速さをキーで決める → 速さが位置を変える（５-４と同じ形）
  player.vx = 0;
  if (keys["ArrowRight"]) {
    player.vx = MOVE_SPEED;
  }
  if (keys["ArrowLeft"]) {
    player.vx = -MOVE_SPEED;
  }
  player.x = player.x + player.vx * dt;

  const g = player.vy > 0 ? GRAVITY * FALL_GRAVITY_RATE : GRAVITY;
  player.vy = player.vy + g * dt;
  player.y = player.y + player.vy * dt;
  collideWithFloor();
  player.state = decideState();   // 動かし終わったら、今の状態を決める
  // コマ送り（タイマーの形）：時間をためて、決めた時間を超えたら次のコマへ進め、タイマーを戻す
  player.frameTimer = player.frameTimer + dt;
  if (player.frameTimer >= FRAME_TIME) {
    player.frameIndex = (player.frameIndex + 1) % 4;   // 0 → 1 → 2 → 3 → 0 …
    player.frameTimer = 0;
  }  
}

// プレイヤーを描く（★ main.js の draw から呼ばれる）
function drawPlayer() {
  // 画像から1コマを切り出して描く（今は「走る」の段だけ）
  const sx = player.frameIndex * FRAME_SIZE;   // 切り出す左上の x：何コマ目か
  const sy = 1 * FRAME_SIZE;                   // 切り出す左上の y：2段目（走る）
  ctx.drawImage(playerImg, sx, sy, FRAME_SIZE, FRAME_SIZE, player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft + "   state = " + player.state + "   frameIndex = " + player.frameIndex, 10, 20);
}