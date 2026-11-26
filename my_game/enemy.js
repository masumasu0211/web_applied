// 敵：作る・入れる・動かす・描く（足すものの形）

// ① 作る：敵を1体作って返す関数（呼ぶたびに、新しい敵が1体できる）
function createEnemy(x, vx, hp) {
  return { x: x, y: floor.y - 32, w: 32, h: 32, vx: vx, alive: true, hp: hp, maxHp: hp };
}

// ② 入れる：敵をまとめて入れる配列（７-６で入れ直すので let）
let enemies = [];

// 最初の敵を入れ直す（★ main.js の resetGame から呼ばれる）
function resetEnemies() {
  enemies = [];
  enemies.push(createEnemy(200, 80, 1));
  enemies.push(createEnemy(380, -120, 1));
  enemies.push(createEnemy(540, 60, 1));
  enemies.push(createEnemy(100, 70, 2));
}

// ③ 動かす：配列の敵を1体ずつ取り出して、同じ処理をする
function updateEnemies(dt) {
  for (const enemy of enemies) {
    enemy.x = enemy.x + enemy.vx * dt;
    // 端を越えたら、位置を戻して、向きを反対に（５-４の跳ね返り）
    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.vx = -enemy.vx;
    }
    if (enemy.x + enemy.w > canvas.width) {
      enemy.x = canvas.width - enemy.w;
      enemy.vx = -enemy.vx;
    }
  }
}

//踏まれたらhpを減らし０になったら倒す
function stompEnemy(e) {
    e.hp = e.hp - 1;
    if (e.hp <= 0) {
        e.alive = false;
    }
}

// プレイヤーとぶつかったとき：上から落ちてきたときだけ、敵を倒す
function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {
    if (aabb(player, enemy) && prevBottom <= enemy.y && player.vy > 0) {
        stompEnemy(enemy);
        player.vy = -JUMP_SPEED / 2;    // 踏んだら、少し跳ねる
        score = score + 1;              // 点数を足す（★ main.js の score を書き換える）
      }else if (aabb(player, enemy) && player.hitTimer <= 0) {
      player.hp = player.hp - 1;      // 横から当たった：HP を減らす（★ player.js の値を書き換える）
      player.hitTimer = HIT_TIME;     // しばらく当たらない
    }
      
  }
  enemies = enemies.filter((enemy) => enemy.alive);   // 生きている敵だけを残す
}

// ④ 描く：配列の敵を1体ずつ取り出して描く
function drawEnemies() {
    for(const e of enemies){
        if(e.maxHp === 1){
            ctx.fillStyle = "#ff6b6b";
        } else if (e.hp === 2){
            ctx.fillStyle="rgb(0, 255, 0)";
        } else {
            ctx.fillStyle="#ff9d00";
        }
        ctx.fillRect(e.x, e.y, e.w, e.h);
    }
  ctx.fillStyle = "#e8eeff";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}