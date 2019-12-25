// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var flippedCouplesCount = 0;

var endGame = false; //a flag to know when the game is over
var firstTime = true;  // a flag to know if its start or play again text
var isProcessing = false; // a flag to contain boolean expression

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 4;

var firstCardTime = 0;
var gameTime = 0;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioRight = new Audio('sound/right.mp3')
var audioWrong = new Audio('sound/wrong.mp3')

var cardGameField = document.querySelector('#game-container');
var startBtn = document.querySelector('#start');
var userNameBtn = document.querySelector('.user-name');
var welcomeText = document.querySelector('.welcome-headline h2');

userNameBtn.onclick = function() {
    changeUsername();
}
startBtn.onclick = function() {
    startToPlay();
}
window.onload = insertUsername;

function insertUsername() {
    // fetching the username from localstorage
    var storedUsername = localStorage.getItem('name'); 

    // checked if the localstorage is empty
    if((storedUsername !== null) && (storedUsername !== '')) {
        welcomeText.textContent="Welcomeback, " + storedUsername + "!";
    } else {
        var myName; // var to keep user input

        // while loop to insure the user insert name in prompt
        while ((myName == null) || (myName == '')) {
            myName = prompt('Please Enter Your Name.');
        }
        localStorage.setItem('name', myName);
        welcomeText.textContent = "Welcome " + myName + " Enjoy!";
    }

    // welcome the user headline and change buttons content
    welcomeText.style.visibility = 'visible'; 
    userNameBtn.textContent = 'Change User';
    startBtn.style.visibility = 'visible';
}

function changeUsername(){
    var myName = '';
    do {
        myName = prompt('Please Enter Your Name:')
    } while (myName === '')

    // set the user new name in local storage
    localStorage.setItem('name', myName);
    // changing the welcome headline according to new user name
    welcomeText.textContent = "Welcome, " + myName + "!";
}

function startToPlay() {
    if( (endGame === false) && (firstTime) ) {                        
        console.log(endGame + " start to play");
        cardGameField.style.visibility = 'visible'; // first time see the cardGameField 
        startBtn.textContent = 'Play Again';     // change the button's name 

    } else {
        endGame = false;                          
        var flippedCard = document.querySelectorAll('.flipped');

        // Cover all the cards
        for (var i = 0; i < flippedCard.length; ++i) {
            flippedCard[i].classList.remove('flipped');
        }
        firstTime = true;    
        flippedCouplesCount = 0;
    }
} 

// This function is called whenever the user click a card
function cardClicked(elCard) {
    
    // Start timer on the first time the user clicks a card
    if (firstTime) {
        firstCardTime = Date.now();
        firstTime = false;
    }
    
    //if this is a processing of match - do nothing and return from the function
    if(isProcessing){
        return;
    }

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }

    // Flip it
    elCard.classList.add('flipped');

    // If this is the first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2){
            audioWrong.play();
            isProcessing = true; //true while the user try to flippe cards (bug fixed in task4)
            setTimeout(function(){
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                isProcessing = false;
            }, 1000)
             
        } else {
            // Yes! a match!
            audioRight.play();
            flippedCouplesCount++;
            elPreviousCard = null;

            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                endGame = true;
                calcGameTime();
                calcBestTime();
                setTimeout(function(){
                    audioWin.play();
                },2000);   
            }
        }
    }
}

function saveGameTime() {
    localStorage.setItem('gameTime', gameTime); 
}

function calcGameTime() {
    gameTime = Date.now() - firstCardTime;
}

function calcBestTime() {
    // fetching the score record from localstorage
    var storedGameTime = localStorage.getItem('gameTime');
    
    if (storedGameTime === null) {
        saveGameTime();
        document.querySelector('.best-game-time h2').innerHTML = ("Your best time is " + formatMSecToTimeStr(gameTime));
    } else {
        if(storedGameTime > gameTime) {
            saveGameTime();
            document.querySelector('.best-game-time h2').innerHTML =  ("Your best time is " + formatMSecToTimeStr(gameTime));
        } else {
            document.querySelector('.best-game-time h2').innerHTML =  ("Your best time is " + formatMSecToTimeStr(storedGameTime));
        }
    }

}

function formatMSecToTimeStr(mSec) {
    var hours = Math.floor(mSec / (60 * 60 * 1000));
    var mins = Math.floor(((mSec - (hours * 60 * 60 * 1000)) / (60 * 1000)));
    var secs = Math.floor(((mSec - (hours * 60 * 60 * 1000) - (mins * 60 * 1000)) / 1000)); 
    return (hours + ':' + mins + ':' + secs);
}