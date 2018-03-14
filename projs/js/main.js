'use strict';

var gQuests = [{
        id: 1,
        question: 'Do you see the elephant?',
        opts: ['Yes', 'No'],
        correctOptIndex: 0
    },
    {
        id: 2,
        question: 'Do you see the blue paper plane?',
        opts: ['Yes', 'No'],
        correctOptIndex: 0
    },
    {
        id: 3,
        question: 'What is the name of this guy?',
        opts: ['Stewie', 'Arthur'],
        correctOptIndex: 1
    }
];

var gCurrQuestIdx = 0;
var isGameOn = false;
var elUsrMsg = document.querySelector('.usr-msg');
var gScore = 0;
initGame();


function initGame() {
    toggleModal();
    gCurrQuestIdx = 0;
    gScore = 0;
    isGameOn = true;
    elUsrMsg.classList.add('hide');
    renderQuest(0, true);
}

function toggleModal() {
    var elModal = document.querySelector('.modal-container');
    elModal.classList.toggle('hide');
}

function renderQuest() {
    if(gCurrQuestIdx >= gQuests.length) return gameOver();
    if (!isGameOn) return;
    var currQuest = gQuests[gCurrQuestIdx];
    clearAnswerButtons();

    // render question
    var elQuest = document.querySelector('#question');
    elQuest.classList.add('question-change');
    setTimeout(function() {
        elQuest.classList.remove('question-change');
    }, 3000);
    elQuest.innerText = currQuest.question;
    
    // render image
    var elImageQuest = document.querySelector('.question-image');
    elImageQuest.src = 'img/' + currQuest.id + '.jpg';

    // render answers
    for (var i = 0; i < currQuest.opts.length; i++) {
        var elButton = getAnswerButton(i);
        elButton.innerText = currQuest.opts[i];
        // elButton.classList.remove('hide');
    }
}

function checkAnswer(optIdx) {
    if (!isGameOn) return;
    var elButton = getAnswerButton(optIdx);
    var currQuest = gQuests[gCurrQuestIdx];
    var isRightAnswer = (optIdx === currQuest.correctOptIndex);
    clearAnswerButtons();
    if (isRightAnswer) {
        elButton.classList.add('right');
        elUsrMsg.innerText = 'CORRECT!! (+40 pts)';
        gScore += 40;
        gCurrQuestIdx++;
        setTimeout(renderQuest, 750, gCurrQuestIdx);
    } else {
        elButton.classList.add('wrong');
        elUsrMsg.innerText = 'WRONG!! (-10 pts)';
        gScore -= 10;
        isGameOn = false;
        setTimeout(function () {
            isGameOn = true;
            clearAnswerButtons();
        }, 1000);
    }
    renderScore();
}

function getAnswerButton(idx) {
    var btnSelector = '#ans-btn' + idx + '';
    return document.querySelector(btnSelector);
}

function clearAnswerButtons() {
    if (gQuests.length < gCurrQuestIdx) return;
    for (var i = 0; i < gQuests[gCurrQuestIdx].opts.length; i++) {
        getAnswerButton(i).classList.remove('wrong');
        getAnswerButton(i).classList.remove('right');
    }
}

function gameOver() {
    isGameOn = false;
    console.log('Game Over!')
    document.querySelector('.stewie-pic').src = 'img/questman-victory.png';
    elUsrMsg.classList.remove('hide');
    elUsrMsg.innerText = 'YOU WIN!';
    elUsrMsg.classList.add('victory');
    setTimeout(toggleModal, 3000);
    
}

function hideButtons() {
    for(var i = 0; i < 2; i++) {
        getAnswerButton(i).classList.add('hide');
    }
}

function renderScore(){
    var elScore = document.querySelector('#score');
    return elScore.innerText = gScore;
}
