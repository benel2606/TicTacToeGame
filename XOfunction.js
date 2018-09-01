var cells = document.getElementsByTagName("td");
var newGameBtn = document.querySelector("#newGame");
var msg = document.querySelector("#msg");
var vsPlayerBtn = document.querySelector("#vsPlayer");
var vsComputerBtn = document.querySelector("#vsComputer");
var player = "X";
var N = 3;
var changeMode = true;
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

    msg.innerHTML = "Please Choose a game mode";

    vsPlayerBtn.addEventListener("click", function() {

        clearBoard();
        vsComputerBtn.classList.remove("mode");
        vsPlayerBtn.classList.add("mode");
        msg.innerHTML = "Player vs. Player mode";

        setTimeout(() => {
            changeMode = true;
            vsPlayer();
            if (changeMode) {
                changeMode = false;
                vsPlayerRestartGame();
                gameOver("vsComputer");
                clearBoard();
                vsPlayer();
            }
        }, 400);
    });

    vsComputerBtn.addEventListener("click", function() {

        clearBoard();
        vsComputerBtn.classList.add("mode");
        vsPlayerBtn.classList.remove("mode");
        msg.innerHTML = "Player vs. Computer mode";
        setTimeout(() => {
            changeMode = true;
            vsComputer();
            updateMove();
            if (changeMode) {
                changeMode = false;
                vsComputerRestartGame();
                gameOver("vsPlayer");
                clearBoard();
                vsComputer();
                updateMove();
            }
        }, 400);
    });
}
// Player vs. Player - O(1) complexity ----------------------------------------------------------------------------------------------------

function vsPlayer() {
    console.log("here");
    initRowAndCol();
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", gamePlan);
    }
    newGameBtn.addEventListener("click", vsPlayerRestartGame);
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
        gameOver("vsPlayer");
    }
}

function vsPlayerRestartGame() {
    clearBoard();
    player = "X";
    msgUpdate("New Game", player);
    diagCell[0].reset();
    diagCell[1].reset();
    for (var i = 0; i < N; i++) {
        colCell[i].reset();
        rowCell[i].reset();
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
    if (type === "Tie") {
        setTimeout(() => {
            msg.innerHTML = "Tie!";
        }, 100);

    }
}

function gameOver(mode) {
    if (mode === "vsPlayer") {
        for (var i = 0; i < cells.length; i++) {
            cells[i].removeEventListener("click", gamePlan);
        }
        //newGameBtn.removeEventListener("click", vsPlayerRestartGame);
    }
    if (mode === "vsComputer") {
        for (var i = 0; i < cells.length; i++) {
            cells[i].removeEventListener("click", initAndStartGame);
        }
        //newGameBtn.removeEventListener("click", vsComputerRestartGame);
    }
}

function clearBoard() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
    }
}

// Player vs. Computer - Minimax algoritem  -----------------------------------------------------------------------------------------------

var board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]
var myMove = false;
var numNodes = 0;

if (myMove) {
    makeMove();
}

function vsComputerRestartGame() {
    clearBoard();
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    myMove = false;
    msgUpdate("New Game", "X");
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", initAndStartGame);
    }
}

function vsComputer() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", initAndStartGame);
    }
    newGameBtn.addEventListener("click", vsComputerRestartGame);
}

function initAndStartGame() {
    var cell = this.id;
    var row = parseInt(cell[1])
    var col = parseInt(cell[2])
    if (!myMove) {
        board[row][col] = false;
        myMove = true;
        updateMove();
        makeMove();
    }
    updateCells();
}

function updateMove() {

    var winner = getWinner(board);
    if (winner === 1) {
        msgUpdate("Win", "O");
        gameOver("vsComputer");
    } else if (winner === 0) {
        msgUpdate("Win", "X");
        gameOver("vsComputer");
    } else if (winner === -1) {
        msgUpdate("Tie", "X");
        gameOver("vsComputer");
    }
}

function getWinner(board) {

    // Check if someone won
    vals = [true, false];
    var allNotNull = true;
    for (var k = 0; k < vals.length; k++) {
        var value = vals[k];

        // Check rows, columns, and diagonals
        var diagonalComplete1 = true;
        var diagonalComplete2 = true;
        for (var i = 0; i < 3; i++) {
            if (board[i][i] != value) {
                diagonalComplete1 = false;
            }
            if (board[2 - i][i] != value) {
                diagonalComplete2 = false;
            }
            var rowComplete = true;
            var colComplete = true;
            for (var j = 0; j < 3; j++) {
                if (board[i][j] != value) {
                    rowComplete = false;
                }
                if (board[j][i] != value) {
                    colComplete = false;
                }
                if (board[i][j] == null) {
                    allNotNull = false;
                }
            }
            if (rowComplete || colComplete) {
                return value ? 1 : 0;
            }
        }
        if (diagonalComplete1 || diagonalComplete2) {
            return value ? 1 : 0;
        }
    }
    if (allNotNull) {
        return -1;
    }
    return null;
}

function updateCells() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            key = "c" + i + j;
            var square = document.getElementById(key)
            square.innerHTML = (board[i][j] == false ? "X" : board[i][j] == true ? "O" : "");
        }
    }
}

function makeMove() {
    board = minimaxMove(board);
    myMove = false;
    updateMove();
}

function minimaxMove(board) {
    numNodes = 0;
    return recurseMinimax(board, true)[1];
}

function recurseMinimax(board, player) {
    msgUpdate("Status", player);
    numNodes++;
    var winner = getWinner(board);
    if (winner != null) {
        switch (winner) {
            case 1:
                // AI wins
                return [1, board]
            case 0:
                // opponent wins
                return [-1, board]
            case -1:
                // Tie
                return [0, board];
        }
    } else {
        // Next states
        var nextVal = null;
        var nextBoard = null;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    board[i][j] = player;
                    var value = recurseMinimax(board, !player)[0];
                    if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                        nextBoard = board.map(function(arr) {
                            return arr.slice();
                        });
                        nextVal = value;
                    }
                    board[i][j] = null;
                }
            }
        }
        return [nextVal, nextBoard];
    }
}