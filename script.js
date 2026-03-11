const board = document.getElementById("board")
const keyboard = document.getElementById("keyboard")

let currentRow = 0
let currentCol = 0
let guesses = []

const answer = getTodayWord()

function createBoard(){

for(let r=0;r<6;r++){

const row=document.createElement("div")
row.className="row"

for(let c=0;c<5;c++){

const tile=document.createElement("div")
tile.className="tile"

row.appendChild(tile)

}

board.appendChild(row)

}

}

createBoard()

function createKeyboard(){

const rows=[
"qwertyuiop",
"asdfghjkl",
"enterzxcvbnm⌫"
]

rows.forEach(r=>{

const div=document.createElement("div")
div.className="keyrow"

for(let k of r){

const btn=document.createElement("button")

btn.className="key"

if(k==="enter"||k==="⌫")btn.classList.add("big")

btn.textContent=k.toUpperCase()

btn.onclick=()=>handleKey(k)

div.appendChild(btn)

}

keyboard.appendChild(div)

})

}

createKeyboard()

function handleKey(key){

if(key==="⌫"){

if(currentCol>0){

currentCol--

updateTile("")

}

return

}

if(key==="enter"){

submitGuess()

return

}

if(currentCol<5){

updateTile(key)

currentCol++

}

}

function updateTile(letter){

const row=board.children[currentRow]

const tile=row.children[currentCol]

tile.textContent=letter

}

function submitGuess(){

const row=board.children[currentRow]

let guess=""

for(let t of row.children){

guess+=t.textContent.toLowerCase()

}

if(!words.includes(guess)){

alert("Word not in list")

return

}

checkWord(guess,row)

guesses.push(guess)

if(guess===answer){

saveStats(true)

setTimeout(()=>shareScore(),500)

return

}

currentRow++
currentCol=0

if(currentRow===6){

saveStats(false)

alert("Answer: "+answer)

}

}

function checkWord(guess,row){

for(let i=0;i<5;i++){

const tile=row.children[i]

tile.classList.add("flip")

setTimeout(()=>{

if(guess[i]===answer[i]){

tile.classList.add("green")

}

else if(answer.includes(guess[i])){

tile.classList.add("yellow")

}

else{

tile.classList.add("gray")

}

},300)

}

}

function getTodayWord(){

const start=new Date("2022-01-01")

const today=new Date()

const diff=Math.floor((today-start)/(1000*60*60*24))

return answers[diff%answers.length]

}

function saveStats(win){

let stats=JSON.parse(localStorage.getItem("stats"))||{wins:0,played:0}

stats.played++

if(win)stats.wins++

localStorage.setItem("stats",JSON.stringify(stats))

}

function shareScore(){

let result="Wordle Clone\n"

guesses.forEach(g=>{

for(let i=0;i<5;i++){

if(g[i]===answer[i])result+="🟩"
else if(answer.includes(g[i]))result+="🟨"
else result+="⬛"

}

result+="\n"

})

navigator.clipboard.writeText(result)

alert("Score copied!")

}
