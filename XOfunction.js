var cells = document.getElementsByTagName("td");
var newGameBtn = document.querySelector("#newGame");
var msg = document.querySelector("#msg");
var vsPlayerBtn = document.querySelector("#vsPlayer");
var player = "X";
var N = 3;
var rowCell = new Array(N);
var colCell = new Array(N);
var diagCell = [new cell(), new cell()];

function cell() {
    this.size = 0;
    this.sign = null;
    this.active = true;
    this.reset = function() {
        this.size = 0;
        this.sign = null;
        this.active = true;
    }
}

startGame();

function startGame() {
    vsPlayerBtn.classList.add("mode"); // Defult mode
    vsPlayer();
}

function vsPlayer() {
    initRowAndCol();
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", gamePlan);
    }
    newGameBtn.addEventListener("click", resetGame);
    msgUpdate("New Game", player);
}

function gamePlan() {
    var row = this.parentNode.rowIndex;
    var col = this.cellIndex;
    console.log("player: " + player);
    console.log("column: " + col);
    console.log("row: " + row);
    console.log("-------------------")
    if (this.textContent === "") {
        this.textContent = player;
        var sign = player;
        updateCell(colCell, col, sign);
        updateCell(rowCell, row, sign);
        if (row === col)
            updateCell(diagCell, 0, sign);
        if (row + col == N - 1)
            updateCell(diagCell, 1, sign);
        msgUpdate("Status", player);
        switchPlayer();
    }
}

function initRowAndCol() {
    for (var i = 0; i < N; i++) {
        colCell[i] = new cell();
        rowCell[i] = new cell();
    }
}

function switchPlayer() {
    if (player === "X")
        player = "O";
    else
        player = "X";
}

function updateCell(type, index, sign) {
    var temp = type[index];
    console.log("cell sign: " + temp.sign);
    console.log("recive sign: " + sign);
    if (temp.sign === null) {
        temp.sign = sign;
        temp.size++;
    } else if (temp.sign === sign) {
        temp.size++;
    } else {
        temp.active = false;
    }
    if (temp.size === N) {
        msgUpdate("Win", sign);
        endGame();
    }
}

function resetGame() {
    player = "X";
    msgUpdate("New Game", player);
    diagCell[0].reset();
    diagCell[1].reset();
    for (var i = 0; i < N; i++) {
        colCell[i].reset();
        rowCell[i].reset();
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", gamePlan);
    }
}

function msgUpdate(type, sign) {
    if (type === "New Game")
        msg.innerHTML = "New Game- X Turn";
    if (type === "Status") {
        setTimeout(() => {
            msg.innerHTML = player + " Turn";
        }, 60);
    }
    if (type === "Win") {
        setTimeout(() => {
            msg.innerHTML = "The winner is: " + sign;
        }, 100);
    }
}

function endGame() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener("click", gamePlan);
    }
}