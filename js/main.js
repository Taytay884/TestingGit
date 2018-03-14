'use strict';

console.log('Starting up');

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})


// TODO: Add the URL link to the game.
var gProjs = [{
        id: 'sokoban', // Keep the id as the name of the file.html.
        name: 'Sokoban',
        title: 'Better push those boxes!',
        desc: 'A game that make you more organized person.',
        img: 'img/portfolio/sokoban.jpg',
        fullImg: 'img/portfolio/sokoban-full.png',
        publishedAt: 'March 2018',
        labels: ['Matrixes', 'keyboard events'],
    }, {
        id: 'minesweeper',
        name: 'Minesweeper',
        title: 'Be Aware there are mines anywhere! HAHAHA!',
        desc: 'Like the normal one just cooler, quicker, greater!',
        img: 'img/portfolio/minesweeper.png',
        fullImg: 'img/portfolio/minesweeper-full.png',
        publishedAt: 'March 2018',
        labels: ['Matrixes'],
    }, {
        id: 'poptheballoons',
        name: 'Pop The Balloons',
        title: 'They\'re so fast, Catch Em\' All!',
        desc: 'Tick the balloons before they\'re running!',
        img: 'img/portfolio/poptheballoons.png',
        fullImg: 'img/portfolio/poptheballoons-full.png',
        publishedAt: 'March 2018',
        labels: ['Mousekey events'],
    }, {
        id: 'inthepicture',
        name: 'In The Picture',
        title: 'Are you smart?',
        desc: 'If you think you\'re smart, this is the game for you.',
        img: 'img/portfolio/inthepicture.png',
        fullImg: 'img/portfolio/inthepicture-full.png',        
        publishedAt: 'March 2018',
        labels: ['Mousekey events', 'Animations'],
    },

];

initPage();

function initPage() {
    renderPortfolio();
}

function renderPortfolio() {
    var $elPortfolioCon = $('.portfolio-con');
    var strHtml = '';
    gProjs.forEach(function (proj, i) {
        strHtml += '<div class="col-md-4 col-sm-6 portfolio-item">' +
            '<a class="portfolio-link" data-toggle="modal" href="#portfolioModal' + (i + 1) + '">' +
            '<div class="portfolio-hover" data-toggle="tooltip" data-placement="top" title="' + proj.title + '">' +
            '<div class="portfolio-hover-content">' +
            '<i class="fa fa-plus fa-3x"></i>' +
            '</div>' +
            '</div>' +
            '<div class="img-croper">' +
            '<img class="img-fluid" src="' + proj.img + '" alt="">' +
            '</div>' +
            '</a>' +
            '<div class="portfolio-caption">' +
            '<h4>' + proj.name + '</h4>' +
            '<p class="text-muted">' + proj.desc + '</p>' +
            '<br />' +
            '<a href="projs/' + proj.id + '.html">' +
            '<i class="fa fa-external-link fa-3x"></i>' +
            '</a>' +
            '</div>' +
            '</div>' + '';
        console.log(strHtml);
        renderModal(i);
    })
    $elPortfolioCon.html(strHtml);
}

// TODO: Make the link from the modal too.
function renderModal(idx) {
    var $elModalBody = $('#portfolioModal' + (idx+1) + ' .modal-body');
    var proj = gProjs[idx];
    // For spliting the labels by ', ';
    var strLabels = '';
    proj.labels.forEach(function (label, idx) { 
        strLabels += label;
        if (idx !== proj.labels.length-1) strLabels += ', ';
    });
    var strHtml =
        '<h2>' + proj.name + '</h2>' +
        '<p class="item-intro text-muted">' + proj.title + '</p>' +
        '<img class="img-fluid d-block mx-auto" src="'+proj.fullImg+'" alt="">' +
        '<p>'+proj.desc+'</p>' +
        '<ul class="list-inline">' +
        '<li>Date: '+proj.publishedAt+'</li>' +
        '<li>Client: Threads</li>' +
        '<li>Category: '+strLabels+'</li>' +
        '</ul>' +
        '<button class="btn btn-primary" data-dismiss="modal" type="button">' +
        '<i class="fa fa-times"></i>' +
        'Close Project</button>';
    $elModalBody.html(strHtml);
}

function sendEmail() {
    var email = $('#email').val();
    var subject = $('#subject').val();
    var message = $('#message').val();
    subject += ' '+email;
    var strUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=Taytay884@yahoo.com&su='+subject+'&body='+message+'';
    window.open(strUrl);
}