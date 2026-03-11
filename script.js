// ============================
// Wordle Clone Script.js
// ============================

// Board setup
const rows = 6; // max tries
const cols = 5; // word length
let currentRow = 0;
let currentCol = 0;

const board = document.getElementById("board");
const keyboardDiv = document.getElementById("keyboard");

// Optional: daily play lock
const lastPlayed = localStorage.getItem("lastPlayed");
const todayStr = new Date().toDateString();

if (lastPlayed === todayStr) {
  alert("You already played today's Wordle!");
} else {
  localStorage.setItem("lastPlayed", todayStr);
}

// ============================
// Daily Puzzle Word Logic
// ============================
function getTodayWord() {
  const start = new Date("2022-01-01");
  const today = new Date();

  const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));

  return answers[diff % answers.length];
}

const answer = getTodayWord().toLowerCase();
console.log("Today's word:", answer); // for debugging

// ============================
// Initialize Board
// ============================
function initBoard() {
  board.innerHTML = "";
  for (let r = 0; r < rows; r++) {
    const row = document.createElement("div");
    row.className = "row";
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

initBoard();

// ============================
// Keyboard Input
// ============================
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
function initKeyboard() {
  keyboardDiv.innerHTML = "";
  keys.forEach(k => {
    const key = document.createElement("button");
    key.textContent = k;
    key.className = "key";
    key.addEventListener("click", () => handleKey(k));
    keyboardDiv.appendChild(key);
  });

  // Add Enter & Backspace
  const enter = document.createElement("button");
  enter.textContent = "ENTER";
  enter.className = "key enter";
  enter.addEventListener("click", () => handleKey("ENTER"));
  keyboardDiv.appendChild(enter);

  const back = document.createElement("button");
  back.textContent = "⌫";
  back.className = "key back";
  back.addEventListener("click", () => handleKey("BACK"));
  keyboardDiv.appendChild(back);
}

initKeyboard();

// ============================
// Handle Key Press
// ============================
function handleKey(key) {
  const row = board.children[currentRow];
  const tiles = row.children;

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (key === "BACK") {
    if (currentCol > 0) {
      currentCol--;
      tiles[currentCol].textContent = "";
    }
    return;
  }

  if (currentCol < cols && key.length === 1) {
    tiles[currentCol].textContent = key;
    currentCol++;
  }
}

// ============================
// Submit Guess
// ============================
function submitGuess() {
  const row = board.children[currentRow];
  let guess = "";
  for (let tile of row.children) {
    guess += tile.textContent.toLowerCase();
  }

  if (guess.length < cols) {
    alert("Not enough letters");
    return;
  }

  if (!words.includes(guess)) {
    alert("Word not in list");
    return;
  }

  // Check letters and color tiles
  checkWord(guess, row);

  if (guess === answer) {
    alert("🎉 Congratulations! You solved today's Wordle!");
    return;
  }

  currentRow++;
  currentCol = 0;

  if (currentRow === rows) {
    alert(`😢 Game over! Today's word was: ${answer.toUpperCase()}`);
  }
}

// ============================
// Check Word & Color Tiles
// ============================
function checkWord(guess, row) {
  const answerArray = answer.split("");
  const guessArray = guess.split("");

  // First pass: green letters
  const colorTiles = Array(cols).fill("grey");
  for (let i = 0; i < cols; i++) {
    if (guessArray[i] === answerArray[i]) {
      colorTiles[i] = "green";
      answerArray[i] = null; // remove matched
      guessArray[i] = null;
    }
  }

  // Second pass: yellow letters
  for (let i = 0; i < cols; i++) {
    if (guessArray[i] && answerArray.includes(guessArray[i])) {
      colorTiles[i] = "yellow";
      const index = answerArray.indexOf(guessArray[i]);
      answerArray[index] = null;
    }
  }

  // Apply colors to tiles
  for (let i = 0; i < cols; i++) {
    row.children[i].classList.add(colorTiles[i]);
  }

  // Optional: update keyboard colors
  updateKeyboard(guess, colorTiles);
}

// ============================
// Update Keyboard Colors
// ============================
function updateKeyboard(guess, colors) {
  guess.split("").forEach((letter, i) => {
    const key = Array.from(keyboardDiv.children).find(
      k => k.textContent.toLowerCase() === letter
    );
    if (!key) return;

    // priority: green > yellow > grey
    if (colors[i] === "green") {
      key.classList.remove("yellow", "grey");
      key.classList.add("green");
    } else if (colors[i] === "yellow" && !key.classList.contains("green")) {
      key.classList.remove("grey");
      key.classList.add("yellow");
    } else if (!key.classList.contains("green") && !key.classList.contains("yellow")) {
      key.classList.add("grey");
    }
  });
}

// ============================
// Optional: Keyboard Input from Physical Keys
// ============================
document.addEventListener("keydown", e => {
  if (e.key === "Enter") handleKey("ENTER");
  else if (e.key === "Backspace") handleKey("BACK");
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});
