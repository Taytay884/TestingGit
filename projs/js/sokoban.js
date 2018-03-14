'use strict';

var gTargetCoords = [
    { cellRow: 2, cellCol: 1 },
    { cellRow: 3, cellCol: 5 },
    { cellRow: 4, cellCol: 1 },
    { cellRow: 5, cellCol: 4 },
    { cellRow: 6, cellCol: 3 },
    { cellRow: 6, cellCol: 6 },
    { cellRow: 7, cellCol: 4 },
];

var gWallCoords = [
    { cellRow: 1, cellCol: 1 },
    { cellRow: 1, cellCol: 2 },
    { cellRow: 3, cellCol: 1 },
    { cellRow: 3, cellCol: 2 },
    { cellRow: 4, cellCol: 2 },
    { cellRow: 4, cellCol: 3 },
    { cellRow: 5, cellCol: 2 },
    // { cellRow: 1, cellCol: 6 },
    // { cellRow: 2, cellCol: 6 },
    // { cellRow: 3, cellCol: 6 },
    // { cellRow: 4, cellCol: 6 },
    // { cellRow: 5, cellCol: 6 },
];

var gPlayerCoord = { cellRow: 2, cellCol: 2 };

var gBoxCoords = [
    { cellRow: 2, cellCol: 3 },
    { cellRow: 3, cellCol: 4 },
    { cellRow: 4, cellCol: 4 },
    { cellRow: 6, cellCol: 1 },
    { cellRow: 6, cellCol: 3 },
    { cellRow: 6, cellCol: 4 },
    { cellRow: 6, cellCol: 5 }
    
];

var gObstacles = [
    { cellRow: 3, cellCol: 3, type: 'GLUE' },
    { cellRow: 4, cellCol: 5, type: 'WATER' } // TODO <<
];

var gLevel = {
    boardSizeRow: 9,
    boardSizeCol: 8,
}

// BONUSES:
var gBonus = {
    FREE_STEPS_COUNT: 10,
    freeStepsCount: 0,
    isHaveMagnet: false,
    CLEAR_BONUS_TIME: 5, // seconds.
    APPEAR_BONUS_TIME: 10, // seconds.
    randomBonusInterval: null
}

var gObstacle = {
    playerMoveable: true,
}

var gBoard;
var gGameIsOn = false;
var gPLAYER_STEPS_COUNT = 0;
var gPLAYER_SCORE = 100;
var gElUsrMsg = document.querySelector('#usr-msg');

var gGameTimer = 0;
var gGameTimerInterval;

initGame();

function initGame() {
    resetGame();
    startGame();
}

function startGame() {
    console.log('SOKOBAN: Game have been started.')
    gGameIsOn = true;
    gGameTimerInterval = setInterval(updateTimer, 1000);
    setBonusCycle(gBonus.APPEAR_BONUS_TIME);
}

function resetGame() {
    console.log('SOKOBAN: The game have been reset.')
    // new game.
    gPlayerCoord = { cellRow: 2, cellCol: 2 };
    gGameIsOn = false;
    gBoard = createBoard();
    //bonus cycle.
    clearBonusCycle();
    // info.
    gGameTimer = -1;
    updateTimer();
    stopTimer();
    gPLAYER_STEPS_COUNT = 0;
    gBonus.freeStepsCount = 0;
    updateCount('score');
    updateCount('steps');
    gElUsrMsg.innerText = '';
    // player pos.
}

function updateTimer() {
    var elTimer = document.querySelector('#game-timer');
    elTimer.innerHTML = ++gGameTimer;
}

function stopTimer() {
    clearInterval(gGameTimerInterval);
}

function createBoard() {
    var board = [];
    for (var i = 0; i < gLevel.boardSizeRow; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.boardSizeCol; j++) {
            board[i][j] = {
                type: getCellType(i, j), // FLOOR, WALL, TARGET.
                contain: getCellContain(i, j), // PLAYER, BOX, EMPTY.
                bonus: 'none', // EMPTY, CLOCK
                obstacle: getCellObstacle(i, j) // GLUE, WATER
            };
        }
    }
    renderBoard(board);
    return board;
}

function getCellObstacle(cellI, cellJ) {
    for (var i = 0; i < gObstacles.length; i++) {
        if (cellI === gObstacles[i].cellRow && cellJ === gObstacles[i].cellCol) return gObstacles[i].type;
    }
    return 'none';
}

function getCellType(cellI, cellJ) {
    for (var i = 0; i < Math.max(gTargetCoords.length, gWallCoords.length); i++) {
        if (checkIsOutlineCell(cellI, cellJ)) return 'WALL';
        if (i < gTargetCoords.length && cellI === gTargetCoords[i].cellRow && cellJ === gTargetCoords[i].cellCol) return 'TARGET';
        if (i < gWallCoords.length && cellI === gWallCoords[i].cellRow && cellJ === gWallCoords[i].cellCol) return 'WALL';
    }
    return 'FLOOR';
}

function getCellContain(cellI, cellJ) {
    for (var i = 0; i < gBoxCoords.length; i++) {
        if (cellI === gBoxCoords[i].cellRow && cellJ === gBoxCoords[i].cellCol) return 'BOX';
    }
    if (cellI === gPlayerCoord.cellRow && cellJ === gPlayerCoord.cellCol) return 'PLAYER';
    return 'EMPTY';
}

function checkIsOutlineCell(cellI, cellJ) {
    return (cellI === 0 || cellJ === 0 || cellI === gLevel.boardSizeRow - 1 || cellJ === gLevel.boardSizeCol - 1);
}
// console.log('0, 5', checkIsOutlineCell(0, 0)); // unit test

function renderBoard(board) {
    var strHtml = '';
    for (var i = 0; i < board.length; i++) {
        var row = board[i];
        strHtml += '<tr>';
        for (var j = 0; j < row.length; j++) {

            var cell = board[i][j];
            var cellContent = '';
            if (cell.contain === 'BOX') cellContent = '<img src="https://emojipedia-us.s3.amazonaws.com/thumbs/120/lg/57/package_1f4e6.png" />';
            else if (cell.contain === 'PLAYER') cellContent = '<img src="https://websitecdn.executestrategy.net/wp-content/uploads/2017/12/santa-strategy-square-1.png" />';
            else if (cell.bonus === 'CLOCK') cellContent = '<img src="http://extend.schoolwires.com/ClipartGallery/images/clock_medium.png" />';
            else if (cell.bonus === 'MAGNET') cellContent = '<img src="https://cdn0.iconfinder.com/data/icons/education-circular-6/90/275-512.png" />';
            else if (cell.bonus === 'GOLD') cellContent = '<img src="https://cdn2.iconfinder.com/data/icons/outlined-valuable-items/200/monetary_budget-512.png" />';
            var tdId = 'cell-' + i + '-' + j;
            strHtml += '<td id="' + tdId + '" class="' + cell.type.toLowerCase() + ' ' + cell.contain.toLowerCase() + ' ' + cell.obstacle.toLowerCase() +
                '" oncontextmenu="pullBox(this, ' + i + ', ' + j + '); return false;"onclick="cellClicked(this, ' + i + ', ' + j + ')">' + cellContent + '</td>';
        }
        strHtml += '</tr>';
    }
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHtml;
}

function checkKey(e) {
    e = e || window.event;
    var targetCellI = gPlayerCoord.cellRow;
    var targetCellJ = gPlayerCoord.cellCol;
    if (e.keyCode === 38) { // up arrow
        targetCellI--;
        var elCell = getElByCoords(targetCellI, targetCellJ);
        cellClicked(elCell, targetCellI, targetCellJ);
    }
    else if (e.keyCode === 40) { // down arrow
        targetCellI++;
        var elCell = getElByCoords(targetCellI, targetCellJ);
        cellClicked(elCell, targetCellI, targetCellJ);
    }
    else if (e.keyCode === 37) { // left arrow
        targetCellJ--;
        var elCell = getElByCoords(targetCellI, targetCellJ);
        cellClicked(elCell, targetCellI, targetCellJ);
    }
    else if (e.keyCode === 39) { // right arrow
        targetCellJ++;
        var elCell = getElByCoords(targetCellI, targetCellJ);
        cellClicked(elCell, targetCellI, targetCellJ);
    }

}

function getElByCoords(i, j) {
    var elCellId = 'cell-' + i + '-' + j;
    var elCell = document.querySelector('#' + elCellId);
    return elCell;
}

function cellClicked(elCell, cellI, cellJ) {
    if (!gGameIsOn) return;
    var cellToPlayerDistance = Math.abs(gPlayerCoord.cellRow - cellI) + Math.abs(gPlayerCoord.cellCol - cellJ); // Distance 1 is left, right, up, down.
    if (cellToPlayerDistance !== 1) return;
    var cell = gBoard[cellI][cellJ];
    if (cell.type === 'WALL') return;
    if (movePlayer(cellI, cellJ)) // returns true if moved, false if not.
    {
        renderBoard(gBoard);
        checkGameOver();
        return true;
    }
}

function movePlayer(targetCellI, targetCellJ) {
    if (!gObstacle.playerMoveable) return false;
    var playerCell = gBoard[gPlayerCoord.cellRow][gPlayerCoord.cellCol];
    var targetCell = gBoard[targetCellI][targetCellJ];

    // If there's a box infront of the player, and it's empty place, take it forward too.
    if (targetCell.contain === 'BOX') {
        var beyondBoxRow = targetCellI + (targetCellI - gPlayerCoord.cellRow);
        var beyondBoxCol = targetCellJ + (targetCellJ - gPlayerCoord.cellCol);
        var beyondBoxCell = gBoard[beyondBoxRow][beyondBoxCol];
        if (beyondBoxCell.type === 'WALL' || beyondBoxCell.contain === 'BOX') return false; // If not moved >> false.
        var isBoxOnWater = false;
        if(targetCell.obstacle === 'WATER') isBoxOnWater = true;
        beyondBoxCell.contain = 'BOX';
    }
    // Moves the player forward, and clear his previous place.
    playerCell.contain = 'EMPTY';
    targetCell.contain = 'PLAYER';
    gPlayerCoord.cellRow = targetCellI;
    gPlayerCoord.cellCol = targetCellJ; 
    if (isBoxOnWater) checkIfObstacleWater(targetCellI, targetCellJ, beyondBoxRow, beyondBoxCol);
    

    gPLAYER_STEPS_COUNT++;
    updateCount('steps');
    updateCount('score');

    catchBonus(targetCellI, targetCellJ);
    checkIfObstacleGlue(targetCellI, targetCellJ);

    return true; // If moved >> true.
}

function checkIfObstacleWater(cellI, cellJ, beyondWaterI, beyondWaterJ) {
    var cell = gBoard[cellI][cellJ];
    if (cell.obstacle === 'WATER') {
        // debugger;
        var nextI = beyondWaterI - cellI;
        var nextJ = beyondWaterJ - cellJ;
        while(cellClicked(getElByCoords(beyondWaterI, beyondWaterJ), beyondWaterI, beyondWaterJ)) {
            beyondWaterI += nextI;
            beyondWaterJ += nextJ;
        }
        console.log('WATER'); 
        return true;
    }
    return false;
}

function pullBox(elCell, boxCellI, boxCellJ) {
    if (!gBonus.isHaveMagnet || gBoard[boxCellI][boxCellJ].contain !== 'BOX') return;
    var cellToPlayerDistance = Math.abs(gPlayerCoord.cellRow - boxCellI) + Math.abs(gPlayerCoord.cellCol - boxCellJ); // Distance 1 is left, right, up, down.
    if (cellToPlayerDistance !== 1) return;
    var behindPlayerI = gPlayerCoord.cellRow - (boxCellI - gPlayerCoord.cellRow);
    var behindPlayerJ = gPlayerCoord.cellCol - (boxCellJ - gPlayerCoord.cellCol);
    var behindPlayerCell = gBoard[behindPlayerI][behindPlayerJ];
    if (behindPlayerCell.type === 'WALL' || behindPlayerCell.contain === 'BOX') return false; // If not moved >> false.
    if (!checkIfCellNearWall(boxCellI, boxCellJ)) return false;
    behindPlayerCell.contain = 'PLAYER'; // Put the player in the cell behind.

    var playerCell = gBoard[gPlayerCoord.cellRow][gPlayerCoord.cellCol];
    playerCell.contain = 'BOX'; // Put the box in the cell that the player was in.
    gPlayerCoord.cellRow = behindPlayerI;
    gPlayerCoord.cellCol = behindPlayerJ;
    var boxCell = gBoard[boxCellI][boxCellJ];

    boxCell.contain = 'EMPTY'; // Clear the cell that the box was in.

    gElUsrMsg.innerText = 'You pulled a box.';
    setTimeout(function () { gElUsrMsg.innerText = ''; }, 4000);

    gBonus.isHaveMagnet = false;
    renderBoard(gBoard);
}

function checkIfCellNearWall(cellI, cellJ) {
    return (gBoard[cellI + 1][cellJ].type === 'WALL' || // Right
        gBoard[cellI - 1][cellJ].type === 'WALL' || // Left
        gBoard[cellI][cellJ + 1].type === 'WALL' || // Up
        gBoard[cellI][cellJ - 1].type === 'WALL'); // Down
}

function updateCount(countname) {
    switch (countname) {
        case 'steps':
            if (gBonus.freeStepsCount > 0) {
                gPLAYER_STEPS_COUNT--;
                gBonus.freeStepsCount--;
                gElUsrMsg.innerText = 'Free Steps: ' + gBonus.freeStepsCount;
                if (gBonus.freeStepsCount === 0) gElUsrMsg.innerText = '';
            }
            var elStepsCount = document.querySelector('#steps-count');
            elStepsCount.innerText = gPLAYER_STEPS_COUNT;
            gPLAYER_SCORE--;
            break;
        case 'score':
            var elScoreCount = document.querySelector('#score-count');
            elScoreCount.innerText = gPLAYER_SCORE;
            break;
    }
}

function checkGameOver() {
    for (var i = 0; i < gTargetCoords.length; i++) {
        var cellI = gTargetCoords[i].cellRow;
        var cellJ = gTargetCoords[i].cellCol;
        var cell = gBoard[cellI][cellJ];
        if (cell.contain !== 'BOX') return false;
    }
    gameOver();
    return true;
}

function gameOver() {
    gGameIsOn = false;
    gElUsrMsg.innerText = 'SOKO-WON!';
    gElUsrMsg.style.display = 'block';
    stopTimer();
    // setTimeout(initGame, 5000); // If you want to start the game after a while automatically.
}

function checkIfObstacleGlue(cellI, cellJ) {
    var cell = gBoard[cellI][cellJ];
    if (cell.obstacle === 'GLUE') {
        gElUsrMsg.innerText = 'STUCK!';
        gObstacle.playerMoveable = false;
        setTimeout(function () {
            gObstacle.playerMoveable = true;
            gElUsrMsg.innerText = '';
        }, 5000)
        gPLAYER_STEPS_COUNT += 5;
        return true;
    }
    return false;
}

function catchBonus(cellI, cellJ) {
    var bonus = gBoard[cellI][cellJ].bonus;
    if (bonus === 'none') return false;
    switch (bonus) {
        case 'CLOCK':
            gElUsrMsg.innerText = 'You took clock! You have 10 free steps.';
            gBonus.freeStepsCount += gBonus.FREE_STEPS_COUNT;
            gBoard[cellI][cellJ].bonus = 'none';
            break;
        case 'MAGNET':
            gElUsrMsg.innerText = 'You took a magnet, use rightclick to pull box.';
            setTimeout(function () { gElUsrMsg.innerText = ''; }, 4000);
            gBonus.isHaveMagnet = true;
            gBoard[cellI][cellJ].bonus = 'none';
            break;
        case 'GOLD':
            gElUsrMsg.innerText = 'You took gold! +100pts';
            setTimeout(function () { gElUsrMsg.innerText = ''; }, 4000);
            gPLAYER_SCORE += 100;
            updateCount('score');
            gBoard[cellI][cellJ].bonus = 'none';
            break;
    }
}

function setRandomlyBonus() {
    var bonusTypes = ['GOLD', 'CLOCK', 'MAGNET'];
    var randBonusType = bonusTypes[getRandomInt(0, bonusTypes.length)];

    var randI = getRandomInt(0, gBoard.length);
    var randJ = getRandomInt(0, gBoard[randI].length);
    var cell = gBoard[randI][randJ];
    // Find available place.
    while (cell.type !== 'FLOOR' || cell.contain !== 'EMPTY') {
        randI = getRandomInt(0, gBoard.length);
        randJ = getRandomInt(0, gBoard[randI].length);
        cell = gBoard[randI][randJ];
    }
    cell.bonus = randBonusType;
    renderBoard(gBoard);

    // Clear after 5 seconds.
    setTimeout(function () {
        gBoard[randI][randJ].bonus = 'none';
        renderBoard(gBoard);
    }, gBonus.CLEAR_BONUS_TIME * 1000);
}

function setBonusCycle(secInterval) {
    gBonus.randomBonusInterval = setInterval(setRandomlyBonus, gBonus.APPEAR_BONUS_TIME * 1000);
}

function clearBonusCycle() {
    clearInterval(gBonus.randomBonusInterval);
}