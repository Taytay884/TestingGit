'use strict';

var gFlyInterval;
var gBalloons = [
    {bottom: getRandomInt(0, 21), speed: getRandomInt(10, 31)},
    {bottom: getRandomInt(0, 21), speed: getRandomInt(10, 31)}
];

renderBalloons();
startFly();

function startFly() {
    gFlyInterval = setInterval(function() {
        moveBalloons();
        updateBalloonInfo();
    }, 700);
    
}

function stopFly() {
    clearInterval(gFlyInterval);
}

function moveBalloons() {
    var elBalloons = document.querySelectorAll('.balloon');
    for (var i = 0; i < gBalloons.length; i++) {
        var elBalloon = elBalloons[i];
        var balloon = gBalloons[i];
        balloon.bottom = balloon.bottom + balloon.speed;
        console.log(balloon.bottom);
        elBalloon.style['bottom'] = balloon.bottom + 'px';
    }
}

function renderBalloons() {
    var elBlnsContainer = document.querySelector('.balloons-container');
    var strHtml = '';

    gBalloons.forEach(function(balloon, i) {
        strHtml += '<div class="balloon balloon'+(i+1)+'" onclick="balloonClicked(this)" style="bottom: 0px;">bottom:'+
        ' <span class="balloon-bottom">'+balloon.bottom+
            '</span><br />speed: <span class="balloon-speed">'+balloon.speed+
                    '</div>';
    });

   
    elBlnsContainer.innerHTML = strHtml;
    
}

function updateBalloonInfo() {
    // Render to DOM
    var elBalloons = document.querySelectorAll('.balloon')
    for (var i = 0; i < elBalloons.length; i++) {
        var balloon = elBalloons[i];
        var elBalloonSpeed = elBalloons[i].querySelector('.balloon-speed');
        elBalloonSpeed.innerHTML = gBalloons[i].speed;
        var elBalloonBottom = elBalloons[i].querySelector('.balloon-bottom');
        elBalloonBottom.innerHTML = gBalloons[i].bottom;
    }
}

function renderCars(cars) {
    var elRoad = document.querySelector('.road');
    var strHtml = ''
    for (var i = 0; i < cars.length; i++) {
        var car = cars[i];
        strHtml += '<div style="background-color:' + car.color +
            '" onclick="carClicked(this, ' + i + ')" class="car car' + (i + 1) + '">' +
            car.vendor +
            ' <span class="car-speed">' + car.speed + '</span>' +
            '</div>'
    }
    elRoad.innerHTML = strHtml;

}

function balloonClicked(balloon) {
    balloon.style.opacity = 0;
    var audioPop = new Audio('sound/popBalloon.wav');
    audioPop.play();
}