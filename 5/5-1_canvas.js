const canvas = document.getElementById("stage");   // 紙（canvas）を取り出す
const ctx = canvas.getContext("2d");                // 描く道具（コンテキスト）を取り出す

ctx.fillStyle = "#7aa2ff";        // 塗る色
ctx.fillRect(40, 40, 40, 40);     // 四角を塗る（x, y, 幅, 高さ）
ctx.fillStyle = "#ef476f";          // 色を変える
ctx.fillRect(160, 120, 80, 40);     // 2つ目の四角
ctx.fillStyle = "#ffd166";
ctx.beginPath();                          // これから形を描き始める
ctx.arc(400, 200, 30, 0, Math.PI * 2);    // 丸（中心の x, 中心の y, 半径, 始まりの角度, 終わりの角度）
ctx.fill();                               // 中を塗る