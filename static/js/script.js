
let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'],
    'cardsMap': {'2':2, '3':3, '4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':[1,11]},
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'isStand': false,
    'isTurnOver': false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('static/sounds/swish.mp3');
const winSound = new Audio('static/sounds/win.mp3');
const lossSound = new Audio('static/sounds/loss.mp3');



document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit(){
    if(blackjackGame['isStand']===false){
        let card = randomCard();
        showCard(YOU, card);
        updateScore(YOU, card);
        showScore(YOU);
    }
}

function randomCard(){
    let random = Math.floor(Math.random()*13);
    return(blackjackGame['cards'][random]);
}

function showCard(activePlayer, card){
    if(activePlayer['score']<=21){
        let cardImage = document.createElement('img');
        if (card=='6' || card=='7' || card=='J'){
            cardImage.src = `static/images/${card}.jpeg`;
        }
        else {
            cardImage.src = `static/images/${card}.png`;
        }
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }
}   

function blackjackDeal(){
    if(blackjackGame['isTurnOver']===true){
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for(i=0;i<yourImages.length;i++){
            yourImages[i].remove();
        }
        for(i=0;i<dealerImages.length;i++){
            dealerImages[i].remove();
        }
        YOU['score'] = 0;
        DEALER['score'] = 0;
        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
        document.querySelector(YOU['scoreSpan']).textContent = 0;
        document.querySelector(DEALER['scoreSpan']).textContent = 0;
        document.querySelector('#blackjack-result').textContent = "Let's Play";
        document.querySelector('#blackjack-result').style.color = "black";

        blackjackGame['isTurnOver'] = false;
    }
}

function updateScore(activePlayer, card){
    if(card==='A'){
        if(activePlayer['score']+11 <= 21){
            activePlayer['score']+=11;
        }
        else{
            activePlayer['score']+=1;
        }
    }
    else{
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
    console.log(activePlayer['score']);
}

function showScore(activePlayer){
    if(activePlayer['score']<=21){
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
    else {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUSTED!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerLogic(){
    blackjackGame['isStand'] = true;
    while(DEALER['score']<=15){
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(DEALER, card);
        showScore(DEALER);
        await sleep(1000);
    }

    blackjackGame['isTurnOver'] = true;
    let winner =  computeWinner();
    showResult(winner);
}

// funtion to compute winner
function computeWinner(){
    let winner;
    if(YOU['score']<=21){
        if(YOU['score']>DEALER['score'] || DEALER['score']>21){
            blackjackGame['wins']++;
            winner = YOU;
        }
        else if(YOU['score']<DEALER['score']){
            blackjackGame['losses']++;
            winner = DEALER;
        }
        else if(YOU['score']===DEALER['score']){
            blackjackGame['draws']++;
        }
    }
    else {
        if(DEALER['score']>21){
            blackjackGame['draws']++;
        }
        else{
            blackjackGame['losses']++;
            winner = DEALER;
        }
    }
    return winner;

}

function showResult(winner){
    let message, messageColour;
    if(blackjackGame['isTurnOver']===true){
        if(winner==YOU){
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You Won!!';
            messageColour = 'green';
            winSound.play();
        }
        else if(winner==DEALER){
            document.querySelector('#losses').textContent = blackjackGame['losses'];
            message = 'You Lost!';
            messageColour = 'red';
            lossSound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'Its a Draw!';
            messageColour = 'black';
        }
        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColour;
    }
}