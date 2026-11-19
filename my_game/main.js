// 全体の流れ：毎回「動かす → 描く」をくり返す

// 役割ごとの「動かす」関数を呼ぶ
function update(dt) {
  updatePlayer(dt);
}

// 役割ごとの「描く」関数を呼ぶ
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStage();
  drawPlayer();
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