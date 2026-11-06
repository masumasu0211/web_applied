const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "5-5_player.png";

let x = 100;          // 位置（状態）。画像の左上
let y = 160;
const size = 48;      // 画像の大きさ
const speed = 240;    // 速さ：1秒に240px

const keys = {};      // 押されているキーを覚える入れ物（４-６と同じ）

// 押したら true、離したら false を覚えておく（ここでは動かさない）
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 押されているキーを見て、状態を変える
function update(dt) {
  if (keys["ArrowRight"]) {
    x = x + speed * dt;
  }
  if (keys["ArrowLeft"]) {
    x = x - speed * dt;
  }
  if (keys["ArrowDown"]) {
    y = y + speed * dt;
  }
  if (keys["ArrowUp"]) {
    y = y - speed * dt;
  }

  // 画面の端で止める（５-４の「位置を戻す」と同じ。跳ね返らないので向きは変えない）
  if (x < 0) {
    x = 0;
  }
  if (x > canvas.width - size) {
    x = canvas.width - size;
  }
  if (y < 0) {
    y = 0;
  }
  if (y > canvas.height - size) {
    y = canvas.height - size;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, size, size);
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