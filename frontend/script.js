let board = ["","","","","","","","",""];
let currentPlayer = "X";
let gameOver = false;
let mode = ""; // pvp or ai

const statusText = document.getElementById("status");
const cells = document.querySelectorAll(".cell");

function playSound(id) {
  document.getElementById(id).play();
}

function setMode(selectedMode) {
  mode = selectedMode;
  reset();
  gameOver = false;
  currentPlayer = "X";
  statusText.innerText =
    mode === "pvp" ? "Player X Turn" : "Your Turn (X)";
}

function move(i) {
  if (board[i] || gameOver || mode === "") return;

  board[i] = currentPlayer;
  cells[i].innerText = currentPlayer;
  playSound("clickSound");

  if (checkWinner(currentPlayer)) {
    statusText.innerText = `🎉 ${currentPlayer} Wins!`;
    playSound("winSound");
    gameOver = true;
    return;
  }

  if (!board.includes("")) {
    statusText.innerText = "🤝 Draw!";
    playSound("drawSound");
    gameOver = true;
    return;
  }

  // PvP MODE
  if (mode === "pvp") {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer} Turn`;
    return;
  }

  // AI MODE
  if (mode === "ai") {
    statusText.innerText = "AI Thinking...";
    fetch("http://127.0.0.1:5000/ai-move", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ board: board })
    })
    .then(res => res.json())
    .then(data => {
      const aiMove = data.move;
      board[aiMove] = "O";
      cells[aiMove].innerText = "O";
      playSound("clickSound");

      if (checkWinner("O")) {
        statusText.innerText = "😢 AI Wins!";
        playSound("loseSound");
        gameOver = true;
      } else {
        statusText.innerText = "Your Turn (X)";
      }
    });
  }
}

function checkWinner(player) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(w => w.every(i => board[i] === player));
}

function reset() {
  board = ["","","","","","","","",""];
  cells.forEach(c => c.innerText = "");
  gameOver = false;
}
