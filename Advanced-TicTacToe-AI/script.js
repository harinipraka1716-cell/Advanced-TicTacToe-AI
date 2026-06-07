const cells =
document.querySelectorAll(".cell");

const statusText =
document.getElementById("status");

const restartBtn =
document.getElementById("restartBtn");

const difficulty =
document.getElementById("difficulty");

const themeBtn =
document.getElementById("themeBtn");

let board =
["","","","","","","","",""];

let gameOver = false;

const player = "X";
const ai = "O";

let playerScore =
localStorage.getItem("playerScore") || 0;

let aiScore =
localStorage.getItem("aiScore") || 0;

let drawScore =
localStorage.getItem("drawScore") || 0;

document.getElementById(
"playerScore"
).textContent = playerScore;

document.getElementById(
"aiScore"
).textContent = aiScore;

document.getElementById(
"drawScore"
).textContent = drawScore;

const wins = [

[0,1,2],
[3,4,5],
[6,7,8],

[0,3,6],
[1,4,7],
[2,5,8],

[0,4,8],
[2,4,6]

];

cells.forEach(cell => {

cell.addEventListener(
"click",
handleClick
);

});

function handleClick(){

let index =
this.dataset.index;

if(
board[index] !== "" ||
gameOver
)
return;

board[index] = player;

renderBoard();

if(checkWinner(player)){
endGame("You Win!");
updateScore("player");
return;
}

if(isDraw()){
endGame("Draw!");
updateScore("draw");
return;
}

setTimeout(aiMove,400);
}

function renderBoard(){

cells.forEach((cell,i)=>{

cell.textContent =
board[i];

});
}

function aiMove(){

let move;

let mode =
difficulty.value;

if(mode==="easy"){

move = randomMove();

}

else if(mode==="medium"){

if(Math.random()<0.7)
move = bestMove();
else
move = randomMove();
}

else{

move = bestMove();
}

board[move] = ai;

renderBoard();

if(checkWinner(ai)){

endGame("AI Wins!");

updateScore("ai");

return;
}

if(isDraw()){

endGame("Draw!");

updateScore("draw");
}
}

function randomMove(){

let available = [];

for(let i=0;i<9;i++){

if(board[i]==="")
available.push(i);

}

return available[
Math.floor(
Math.random()*available.length
)
];
}

function bestMove(){

let bestScore =
-Infinity;

let move;

for(let i=0;i<9;i++){

if(board[i]===""){

board[i]=ai;

let score =
minimax(
board,
0,
false,
-Infinity,
Infinity
);

board[i]="";

if(score > bestScore){

bestScore=score;
move=i;

}
}
}

return move;
}

function minimax(
board,
depth,
isMax,
alpha,
beta
){

if(checkWinner(ai))
return 10-depth;

if(checkWinner(player))
return depth-10;

if(isDraw())
return 0;

if(isMax){

let best =
-Infinity;

for(let i=0;i<9;i++){

if(board[i]===""){

board[i]=ai;

best=Math.max(
best,
minimax(
board,
depth+1,
false,
alpha,
beta
)
);

board[i]="";

alpha=Math.max(
alpha,
best
);

if(beta<=alpha)
break;

}
}

return best;
}

else{

let best=
Infinity;

for(let i=0;i<9;i++){

if(board[i]===""){

board[i]=player;

best=Math.min(
best,
minimax(
board,
depth+1,
true,
alpha,
beta
)
);

board[i]="";

beta=Math.min(
beta,
best
);

if(beta<=alpha)
break;
}
}

return best;
}
}

function checkWinner(current){

for(let combo of wins){

if(

board[combo[0]]
=== current &&

board[combo[1]]
=== current &&

board[combo[2]]
=== current

){

combo.forEach(index=>{

cells[index]
.classList
.add("winner");

});

return true;
}
}

return false;
}

function isDraw(){

return board.every(
cell => cell !== ""
);
}

function endGame(msg){

statusText.textContent =
msg;

gameOver = true;
}

function updateScore(type){

if(type==="player")
playerScore++;

if(type==="ai")
aiScore++;

if(type==="draw")
drawScore++;

document.getElementById(
"playerScore"
).textContent =
playerScore;

document.getElementById(
"aiScore"
).textContent =
aiScore;

document.getElementById(
"drawScore"
).textContent =
drawScore;

localStorage.setItem(
"playerScore",
playerScore
);

localStorage.setItem(
"aiScore",
aiScore
);

localStorage.setItem(
"drawScore",
drawScore
);
}

restartBtn.addEventListener(
"click",
()=>{

board=
["","","","","","","","",""];

gameOver=false;

statusText.textContent=
"Your Turn";

cells.forEach(cell=>{

cell.textContent="";

cell.classList.remove(
"winner"
);

});
}
);

themeBtn.addEventListener(
"click",
()=>{

document.body
.classList
.toggle("dark");

}
);