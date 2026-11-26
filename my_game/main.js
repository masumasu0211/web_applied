// 全体の流れ：ゲームの状態を見て、動かす・描く

let gameState = "title";   // ゲーム全体の状態："title"・"play"・"pause"（このあと "gameover" も足す）
let score = 0;             // 点数

// ゲームを最初の値に戻す（後から足す値も、ここに足す）
function resetGame() {
  resetPlayer();
  resetEnemies();
  score = 0;
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

// タイトルとゲームオーバーでは、クリックでも始められる
canvas.addEventListener("pointerdown", () => {
  if (gameState === "title" || gameState === "gameover") {
    startGame();
  }
});

function update(dt) {
  if (gameState !== "play") {
    return;                 // プレイ中でなければ、動かさない
  }
  const prevBottom = player.y + player.h;
  updatePlayer(dt);
  spawnEnemies(dt);
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

// 点数と HP（HUD）
function drawHud() {
  ctx.fillStyle = "#e8eeff";
  ctx.fillText("SCORE " + score, 500, 20);
  ctx.strokeStyle = "#e8eeff";
  ctx.strokeRect(500, 30, 120, 12);                       // HP バーの枠
  ctx.fillStyle = "#7ef5e1";
  ctx.fillRect(500, 30, 120 * player.hp / MAX_HP, 12);   // HP の分だけ塗る
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawStage();
  if (gameState === "title") {
    drawMessage("my game", "Enterかクリックで始める");
    drawAim();
    return;                 // タイトルでは、敵とプレイヤーは描かない
  }

  drawEnemies();
  drawPlayer();
  drawHud();

  if (gameState === "pause") {
    drawMessage("PAUSE", "P でつづける");
  }
  if (gameState === "gameover") {
    drawMessage("GAME OVER", "Enterかクリックでもう一度");
  }
  drawAim();
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