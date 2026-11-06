const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let x = 40;          // 横の位置（状態）

// 状態を少し変える
function update() {
  x = x + 2;         // 1回に2px右へ
}

// 全部消して、今の状態で描き直す
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);   // canvas 全体を消す
  ctx.fillStyle = "#7aa2ff";
  ctx.fillRect(x, 160, 40, 40);
}

// ゲームループ：update → draw → 次の書き換えのときに、もう一度 loop を呼んでもらう
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);   // 最初の1回を頼む