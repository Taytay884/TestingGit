'use strict';
/*
    Minesweeper game by Itay Ben Shmuel.
*/

var gLevel = {
    level: 1, // 1 - easy, 2 - medium, 3 - hard.
    boardSize: 8,
    mineCount: 10
};

var gMINE_SIGN = '💣';
var gFOUND_SIGN = '';
var gFLAG_SIGN = '🚩';

var gCountsMap = {
    EMPTY_CELL_COUNT: gLevel.boardSize ** 2 - gLevel.mineCount,
    FOUND_EMPTY_CELL_COUNT: 0, // The found empty cells.
    MARKED_MINES_COUNT: 0,
    MARKED_CELLS_COUNT: 0
}

var gBoard;

// Game Timer
var gGameTimer = 0;
var gGameTimerInterval;

var gIsVictory = false;
var gIsGameOn = false;
var gIsGameOver = false; // click = startGame - don't let the player click untill game starts again.
var gElUsrMsg = document.querySelector('#usr-msg');

initGame();

function initGame() {
    var elEasyBtn = document.querySelector('#easy-btn');
    setDifficult(elEasyBtn, 1);
    // resetGame(); // SetDifficult runs the game.
    // newGame();
}

function newGame() {
    setMinesRandomly(gBoard);
    setMinesNegsCount(gBoard);
    console.log('New game.')
    renderBoard(gBoard);
    resizeTds();
}

function startGame() {
    gIsGameOn = true;
    gIsGameOver = false;
    gGameTimerInterval = setInterval(startTimer, 1000);
    console.log('Game has started.')
}

function resetGame() {
    gBoard = buildBoard();

    gIsGameOn = false;
    gIsVictory = false;
    gIsGameOver = false;

    gCountsMap.EMPTY_CELL_COUNT = gLevel.boardSize ** 2 - gLevel.mineCount;
    gCountsMap.FOUND_EMPTY_CELL_COUNT = 0;
    gCountsMap.MARKED_MINES_COUNT = 0;
    gCountsMap.MARKED_CELLS_COUNT = 0;

    gElUsrMsg.innerHTML = '';

    stopTimer();
    var elTimer = document.querySelector('#game-timer');
    elTimer.innerHTML = '0';
    gGameTimer = 0;

    var elNewGameBtn = document.querySelector('#new-game-btn');
    elNewGameBtn.style.display = '';

    updateMarkedCount();
    updateCellsCount();
    console.log('Game have been reset.')
}

function startTimer() {
    var elTimer = document.querySelector('#game-timer');
    elTimer.innerHTML = ++gGameTimer;
}

function stopTimer() {
    clearInterval(gGameTimerInterval);
}

function updateCellsCount() {
    var elCellsCount = document.querySelector('#cells-count');
    elCellsCount.innerHTML = gCountsMap.FOUND_EMPTY_CELL_COUNT;
}

function updateMarkedCount() {
    var elMarkedCount = document.querySelector('#marked-count');
    elMarkedCount.innerHTML = gCountsMap.MARKED_CELLS_COUNT;
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.boardSize; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.boardSize; j++) {
            board[i][j] = {
                mine: false,
                mineNegsCount: 0,
                found: false,
                marked: false
            };
        }
    }
    return board;
}
// Unit Testing:
// console.table(gBoard);

function setMinesRandomly(board) {
    for (var i = 0; i < gLevel.mineCount; i++) {
        var randRow = getRandomInt(0, board.length);
        var randCol = getRandomInt(0, board.length);
        // check if already filled with mine.
        var isMine = board[randRow][randCol].mine;
        // repeat on this loop.
        if (isMine) {
            i--;
            continue;
        }
        board[randRow][randCol].mine = true;
    }
}

function renderBoard(board) {
    console.log('Board Rendered.')
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {
            var cell = board[i][j];
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" oncontextmenu="cellMarked(this, ' + i + ', ' + j + ');return false;" onclick="cellClicked(this, ' + i + ', ' + j + ')">' + '' + '</td>';
        }
        strHtml += '</tr>';
    }
    var elMat = document.querySelector('.board');
    elMat.innerHTML = strHtml;
}

function cellClicked(elCell, cellI, cellJ) {
    if (!gIsGameOn && !gIsGameOver) startGame(); // Game not started yet.
    else if (gIsGameOver) return; // Game has been paused.
    // if pressed on a cell that have been clicked before. || Game is not running.
    var cell = gBoard[cellI][cellJ];
    if (cell.found) return;
    // if cell is marked, unmark it.
    if (cell.marked) cellMarked(elCell, cellI, cellJ);
    // if cell has mine - Lose.
    if (cell.mine) {
        gIsVictory = false;
        gameOver();
    }
    // if cell is empty.
    else {
        // if the one you're clicked has mine negs, show a number/
        markCellAsFound(elCell, cellI, cellJ);
        if (cell.mineNegsCount > 0) {
            elCell.innerHTML = cell.mineNegsCount;
        } else {
            expandShown(gBoard, elCell, cellI, cellJ);
        }
    }
    checkGameOver();
    updateCellsCount();
}

function markCellAsFound(elCell, cellI, cellJ) {
    // console.log('You found an empty cell!'); // unit test
    gCountsMap.FOUND_EMPTY_CELL_COUNT++;
    gBoard[cellI][cellJ].found = true;
    elCell.innerHTML = gFOUND_SIGN;
    elCell.classList.add('selected');
}

function expandShown(board, elCell, cellI, cellJ) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= board.length || (cellI === i && cellJ === j)) continue;
            // if there's a mine, continue.
            var cell = board[i][j];
            if (cell.mine || cell.found) continue;
            var expandedElCell = getElByCoords(i, j);
            cellClicked(expandedElCell, i, j);
        }
    }
}

function cellMarked(elCell, cellI, cellJ) {
    if (gBoard[cellI][cellJ].found || !gIsGameOn || gIsGameOver) return;
    var isMarked = gBoard[cellI][cellJ].marked;
    // if wasn't mark.
    if (!isMarked) {
        // if is mine.
        if (gBoard[cellI][cellJ].mine) gCountsMap.MARKED_MINES_COUNT++;
        elCell.innerHTML = gFLAG_SIGN;
        gCountsMap.MARKED_CELLS_COUNT++;
        // console.log('Mines Marked:', gMARKED_MINES_COUNT); // TEST THE GAME. 
        // console.log('Marked:', gMARKED_CELLS_COUNT); // TEST THE GAME. 
        // if was marked.
    } else {
        // if is mine.
        if (gBoard[cellI][cellJ].mine) gCountsMap.MARKED_MINES_COUNT--;
        elCell.innerHTML = '';
        gCountsMap.MARKED_CELLS_COUNT--;
        // console.log('Mines Marked:', gMARKED_MINES_COUNT); // TEST THE GAME. 
        // console.log('Marked:', gMARKED_CELLS_COUNT); // TEST THE GAME. 
    }
    checkGameOver();
    elCell.classList.toggle('marked');
    gBoard[cellI][cellJ].marked = !gBoard[cellI][cellJ].marked;
    updateMarkedCount();
    // unit test: console.log(gMARKED_MINES);
}

function showAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var elCell = getElByCoords(i, j);
            if (gBoard[i][j].mine) {
                elCell.innerHTML = gMINE_SIGN;
                elCell.style.backgroundColor = 'red';
            }
        }
    }
}

function gameOver() {
    if (!gIsVictory) {
        gElUsrMsg.innerHTML = 'You lose..  :,[ ';
        showAllMines();
    } else {
        gElUsrMsg.innerHTML = 'You are the WINNERRRRRR!';
    }
    stopTimer();
    gIsGameOn = false;
    gIsGameOver = true;
    var elNewGameBtn = document.querySelector('#new-game-btn');
    elNewGameBtn.style.display = 'block';
    console.log('Game Over.')
}

function checkGameOver() {
    if (gCountsMap.MARKED_MINES_COUNT === gLevel.mineCount && gCountsMap.FOUND_EMPTY_CELL_COUNT === gCountsMap.EMPTY_CELL_COUNT) {
        gIsVictory = true;
        gameOver();
    }
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var negsCount = getMineNegsCount(board, i, j);
            board[i][j].mineNegsCount = negsCount;
        }
    }
}

function getMineNegsCount(board, rowIdx, colIdx) {
    var mineNegsCount = 0;

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board.length || (rowIdx === i && colIdx === j)) continue;
            if (board[i][j].mine) mineNegsCount++;
        }
    }
    return mineNegsCount;
}

function getElByCoords(i, j) {
    var elCellId = 'cell-' + i + '-' + j;
    var elCell = document.querySelector('#' + elCellId);
    return elCell;
}

function setDifficult(elBtn, level) {
    var elBtns = document.querySelectorAll('.difficult-btn');
    for (var i = 0; i < elBtns.length; i++) {
        elBtns[i].classList.remove('selected-btn');
    }
    elBtn.classList.add('selected-btn');
    level = parseInt(level);

    if (level === 1) { gLevel.boardSize = 4; gLevel.mineCount = 2; console.log('Game level: Easy'); }
    else if (level === 2) { gLevel.boardSize = 6; gLevel.mineCount = 5; console.log('Game level: Medium'); }
    else if (level === 3) { gLevel.boardSize = 12; gLevel.mineCount = 25; console.log('Game level: Hard'); }
    gLevel.level = level;

    resetGame();
    newGame();
}

function resizeTds() {
    var elTds = document.querySelectorAll('td');
    for (var i = 0; i < elTds.length; i++) {
        gLevel.level === 3 ? elTds[i].classList.add('hard') : elTds[i].classList.remove('hard');
    }
}