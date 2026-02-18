const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeBtn = document.getElementById("modeBtn");
const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");

const clickSound = new Audio("click.mp3");
const winSound = new Audio("win.mp3");
const drawSound = new Audio("draw.mp3");

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;
let vsAI = true;
let scores = { X: 0, O: 0 };

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function renderBoard() {
  boardEl.innerHTML = "";
  board.forEach((cell, i) => {
    const btn = document.createElement("button");
    btn.className = "cell";
    btn.textContent = cell || "";
    btn.disabled = !!cell || !gameActive;
    btn.onclick = () => move(i);
    boardEl.appendChild(btn);
  });
}

function move(index) {
  if (!gameActive) return;
  board[index] = currentPlayer;
  clickSound.play();
  if (checkWin(currentPlayer)) {
    endGame(`${currentPlayer} wins!`, currentPlayer);
  } else if (board.every(Boolean)) {
    endGame("Draw!");
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusEl.textContent = `Player ${currentPlayer}'s turn`;
    renderBoard();
    if (vsAI && currentPlayer === "O") {
      setTimeout(aiMove, 300);
    }
  }
}

function endGame(message, winner) {
  gameActive = false;
  statusEl.textContent = message;
  if (winner) {
    scores[winner]++;
    winSound.play();
  } else {
    drawSound.play();
  }
  updateScores();
  renderBoard();
}

function checkWin(player) {
  return wins.some(combo => combo.every(i => board[i] === player));
}

function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
}

function resetGame() {
  board = Array(9).fill(null);
  gameActive = true;
  currentPlayer = "X";
  statusEl.textContent = "Player X's turn";
  renderBoard();
}

function aiMove() {
  let bestScore = -Infinity;
  let moveIndex;
  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        moveIndex = i;
      }
    }
  });
  move(moveIndex);
}

function minimax(boardState, depth, isMax) {
  if (checkWin("O")) return 10 - depth;
  if (checkWin("X")) return depth - 10;
  if (boardState.every(Boolean)) return 0;

  if (isMax) {
    let best = -Infinity;
    boardState.forEach((cell, i) => {
      if (!cell) {
        boardState[i] = "O";
        best = Math.max(best, minimax(boardState, depth + 1, false));
        boardState[i] = null;
      }
    });
    return best;
  } else {
    let best = Infinity;
    boardState.forEach((cell, i) => {
      if (!cell) {
        boardState[i] = "X";
        best = Math.min(best, minimax(boardState, depth + 1, true));
        boardState[i] = null;
      }
    });
    return best;
  }
}

modeBtn.onclick = () => {
  vsAI = !vsAI;
  modeBtn.textContent = vsAI ? "Play vs AI" : "2 Player Mode";
  resetGame();
};

resetBtn.onclick = resetGame;

renderBoard();
