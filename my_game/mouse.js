// マウス：canvas の上の位置を覚えておく

const mouse = { x: -100, y: -100 };   // 最初は画面の外

canvas.addEventListener("pointermove", (e) => {
  const rect = canvas.getBoundingClientRect();   // canvas が、ページのどこにあるか
  mouse.x = e.clientX - rect.left;               // canvas の左上からの位置に直す
  mouse.y = e.clientY - rect.top;
});

// 照準を描く（★ main.js の draw から呼ばれる）
function drawAim() {
  ctx.strokeStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(mouse.x - 1, mouse.y - 1, 3, 3);
}