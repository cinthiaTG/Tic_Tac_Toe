const N_SIZE = 3;
const EMPTY = '';
let boxes = [];
let turn = 'X';
let moves = 0;
let startTime = null;
let bestTimes = JSON.parse(localStorage.getItem("bestTimes")) || [];

document.getElementById("theme-switch").addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", this.checked);
});

function init() {
    const board = document.getElementById("tictactoe");
    board.innerHTML = "";
    boxes = [];
    moves = 0;
    turn = 'X';
    startTime = null;
    document.getElementById("turn").textContent = "Jugador " + turn;

    for (let i = 0; i < N_SIZE * N_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.addEventListener("click", makeMove);
        board.appendChild(cell);
        boxes.push(cell);
    }
    displayBestTimes();
}

function makeMove() {
    if (this.textContent !== EMPTY || startTime === null && turn !== 'X') return;

    if (!startTime) startTime = new Date();
    this.textContent = turn;
    this.classList.add(turn.toLowerCase());
    moves++;

    if (checkWin()) {
        recordWin();
    } else if (moves === N_SIZE * N_SIZE) {
        alert("¡Empate!");
        init();
    } else {
        turn = turn === 'X' ? 'O' : 'X';
        document.getElementById("turn").textContent = "Jugador " + turn;
        if (turn === 'O') computerMove();
    }
}

function checkWin() {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return lines.some(line => 
        line.every(i => boxes[i].textContent === turn)
    );
}

function computerMove() {
    let emptyCells = boxes.filter(cell => cell.textContent === EMPTY);
    let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    randomCell.textContent = turn;
    randomCell.classList.add(turn.toLowerCase());
    moves++;
    
    if (checkWin()) {
        alert("La computadora gano xd");
        init();
    } else {
        turn = 'X';
        document.getElementById("turn").textContent = "Turno del jugador " + turn;
    }
}

function recordWin() {
    const timeTaken = Math.floor((new Date() - startTime) / 1000);
    const playerName = prompt("Has ganado, ingresa tu nombre aquí:");
    
    if (playerName) {
        bestTimes.push({ player: playerName, time: timeTaken, date: new Date().toLocaleString() });
        bestTimes.sort((a, b) => a.time - b.time);
        bestTimes = bestTimes.slice(0, 10);
        localStorage.setItem("bestTimes", JSON.stringify(bestTimes));
        displayBestTimes();
    }
    init();
}

function displayBestTimes() {
    const bestTimesList = document.getElementById("best-times");
    bestTimesList.innerHTML = bestTimes.map(record => 
        `<li>${record.player} - ${record.time}s - ${record.date}</li>`
    ).join("");
}

init();
