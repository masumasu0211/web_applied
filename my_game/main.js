// 全体の流れ：ゲームの状態を見て、動かす・描く

let gameState = "title";   // ゲーム全体の状態："title"・"play"・"pause"（このあと "gameover" も足す）

// ゲームを最初の値に戻す（後から足す値も、ここに足す）
function resetGame() {
  resetPlayer();
  resetEnemies();
}
 
// 始める：最初の値に戻してから、プレイ中にする
function startGame() {
  resetGame();
  gameState = "play";
}

// ゲーム全体のキーボードイベント処理
document.addEventListener("keydown", (e) => {
  if (e.code === "Enter" && (gameState === "title" || gameState ==="gameover")) {
    startGame();
  }
  if (e.code === "KeyP") {
    if (gameState === "play") {
      gameState = "pause";
    } else if (gameState === "pause") {
      gameState = "play";
    }
  }
});

function update(dt) {
  if (gameState !== "play") {
    return;                 // プレイ中でなければ、動かさない
  }
  const prevBottom = player.y + player.h;
  updatePlayer(dt);
  updateEnemies(dt);
  collideWithEnemies(prevBottom);
  if (player.hp <= 0) {
    gameState = "gameover";
  }
}

// 画面のまん中に文字を書く
function drawMessage(text, sub) {
  ctx.fillStyle = "#e8eeff";
  ctx.textAlign = "center";
  ctx.font = "32px sans-serif";
  ctx.fillText(text, canvas.width / 2, 150);
  ctx.font = "16px sans-serif";
  ctx.fillText(sub, canvas.width / 2, 190);
  ctx.textAlign = "left";   // ほかの文字のために戻す
  ctx.font = "14px monospace";
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStage();
  if (gameState === "title") {
    drawMessage("my game", "Enter で始める");
    return;                 // タイトルでは、敵とプレイヤーは描かない
  }
  drawEnemies();
  drawPlayer();
  if (gameState === "pause") {
    drawMessage("PAUSE", "P でつづける");
  }
  if (gameState === "gameover") {
    drawMessage("GAME OVER", "Enter でもう一度");
  }
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