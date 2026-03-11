const rows = 6, cols = 5;
let currentRow = 0, currentCol = 0;
const board = document.getElementById("board");
const keyboardDiv = document.getElementById("keyboard");
const popup = document.getElementById("popup");

// Daily Word - UTC-based
function getTodayWord() {
  const start = new Date(Date.UTC(2022,0,1));
  const now = new Date();
  const diff = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) - start.getTime()) / (1000*60*60*24));
  return answers[diff % answers.length].toLowerCase();
}
const answer = getTodayWord();

// Stats in localStorage
let stats = JSON.parse(localStorage.getItem("stats")) || {gamesPlayed:0, wins:0, streak:0, lastPlayed:""};

// Build Board
function initBoard(){
  board.innerHTML="";
  for(let r=0;r<rows;r++){
    const row=document.createElement("div"); row.className="row";
    for(let c=0;c<cols;c++){ const tile=document.createElement("div"); tile.className="tile"; row.appendChild(tile);}
    board.appendChild(row);
  }
}
initBoard();

// Keyboard
const keys="QWERTYUIOPASDFGHJKLZXCVBNM".split("");
function initKeyboard(){
  keyboardDiv.innerHTML="";
  keys.forEach(k=>{
    const key=document.createElement("button"); key.textContent=k; key.className="key";
    key.addEventListener("click",()=>handleKey(k));
    keyboardDiv.appendChild(key);
  });
  ["ENTER","BACK"].forEach(k=>{
    const key=document.createElement("button"); key.textContent=k==="BACK"?"⌫":"ENTER"; key.className="key "+k.toLowerCase();
    key.addEventListener("click",()=>handleKey(k));
    keyboardDiv.appendChild(key);
  });
}
initKeyboard();

// Key Handler
function handleKey(key){
  const row = board.children[currentRow];
  const tiles = row.children;
  if(key==="ENTER"){ submitGuess(); return;}
  if(key==="BACK"){ if(currentCol>0){currentCol--; tiles[currentCol].textContent="";} return;}
  if(currentCol<cols && key.length===1){ tiles[currentCol].textContent=key; currentCol++;}
}

// Submit Guess
function submitGuess(){
  const row = board.children[currentRow];
  let guess=""; for(let tile of row.children) guess+=tile.textContent.toLowerCase();
  if(guess.length<cols){ alert("Not enough letters"); return;}
  if(!words.includes(guess)){ alert("Word not in list"); return;}
  revealGuess(guess,row);
}

// Reveal Tiles
function revealGuess(guess,row){
  const guessArr=guess.split(""); const ansArr=answer.split(""); const colors=Array(cols).fill("grey");
  // green first
  for(let i=0;i<cols;i++){ if(guessArr[i]===ansArr[i]){colors[i]="green"; ansArr[i]=null; guessArr[i]=null;}}
  // yellow second
  for(let i=0;i<cols;i++){ if(guessArr[i] && ansArr.includes(guessArr[i])){ colors[i]="yellow"; ansArr[ansArr.indexOf(guessArr[i])]=null;}}
  row.childNodes.forEach((tile,i)=>{
    setTimeout(()=>{
      tile.classList.add("flip"); tile.classList.add(colors[i]);
      setTimeout(()=>tile.classList.remove("flip"),300);
    }, i*300);
  });
  updateKeyboard(guess,colors);
  currentRow++; currentCol=0;
  setTimeout(()=>{
    if(guess===answer){ alert("🎉 You solved today's Wordle!"); updateStats(true);}
    else if(currentRow===rows){ alert(`😢 Game over! Today's word: ${answer.toUpperCase()}`); updateStats(false);}
  }, cols*300);
}

// Update keyboard colors
function updateKeyboard(guess,colors){
  guess.split("").forEach((l,i)=>{
    const key=Array.from(keyboardDiv.children).find(k=>k.textContent.toLowerCase()===l);
    if(!key) return;
    if(colors[i]==="green"){key.classList.remove("yellow","grey"); key.classList.add("green");}
    else if(colors[i]==="yellow" && !key.classList.contains("green")){key.classList.remove("grey"); key.classList.add("yellow");}
    else if(!key.classList.contains("green") && !key.classList.contains("yellow")){ key.classList.add("grey");}
  });
}

// Stats update
function updateStats(win){
  const todayStr=new Date().toDateString();
  if(stats.lastPlayed!==todayStr){
    stats.gamesPlayed++; stats.lastPlayed=todayStr;
    if(win){ stats.wins++; stats.streak++;} else{stats.streak=0;}
    localStorage.setItem("stats",JSON.stringify(stats));
  }
}

// Keyboard support
document.addEventListener("keydown",e=>{
  if(e.key==="Enter") handleKey("ENTER");
  else if(e.key==="Backspace") handleKey("BACK");
  else if(/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

// Share results
function shareResult(){
  let text=`Wordle Clone ${new Date().toLocaleDateString()}\n`;
  for(let r=0;r<currentRow;r++){
    const row=board.children[r];
    Array.from(row.children).forEach(tile=>{
      if(tile.classList.contains("green")) text+="🟩";
      else if(tile.classList.contains("yellow")) text+="🟨";
      else text+="⬛";
    });
    text+="\n";
  }
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard!");
}

// Auto reload at UTC midnight
const now=new Date();
const nextUTCmidnight=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+1));
setTimeout(()=>{ location.reload(); }, nextUTCmidnight-now);
