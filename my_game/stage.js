// ステージ：画面（canvas）と床

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const floor = { x: 0, y: 320, w: 640, h: 40 };

// 床を描く（★ main.js の draw から呼ばれる）
function drawStage() {
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);
}