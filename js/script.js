document.addEventListener('DOMContentLoaded', function () {
  let playerName = '';
  function getPlayerName() {
    playerName = prompt("Enter your name:");

    if (!playerName) {
      playerName = "Player"; 
    }
    document.querySelector('#blackjack-result').textContent = `Гра почалась, ${playerName}!`;
  }
  getPlayerName();

  
  let blackjackGame = {
    'user': { 'scorespan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    'computer': { 'scorespan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    'cards': ['6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsmap': { '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 4, 'Q': 3, 'J': 2, 'A': [1, 1] },
    'wins': 0,
    'losses': 0,
    'draws': 0,
    'rounds': 0,
    'maxRounds': 4,
    'isstand': false,
    'turnover': false,
  };

  const USER = blackjackGame['user'];
  const COMPUTER = blackjackGame['computer'];

  
  document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
  document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);
  document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

  function blackjackHit() {
    if (blackjackGame['isstand'] === false) {
      let card = randomCard();
      showCard(card, USER);
      updateScore(card, USER);
      showScore(USER);
    }
  }

  function blackjackDeal() {
    if (blackjackGame['turnover'] === true) {
      blackjackGame['isstand'] = false;

      let userImages = document.querySelector('#your-box').querySelectorAll('img');
      let computerImages = document.querySelector('#dealer-box').querySelectorAll('img');

      userImages.forEach(img => img.remove());
      computerImages.forEach(img => img.remove());

      USER['score'] = 0;
      COMPUTER['score'] = 0;
      document.querySelector('#your-blackjack-result').textContent = 0;
      document.querySelector('#dealer-blackjack-result').textContent = 0;
      document.querySelector('#blackjack-result').textContent = `Гра почалась, ${playerName}!`;
      document.querySelector('#blackjack-result').style.color = 'black';

      blackjackGame['turnover'] = false;
      blackjackGame['rounds']++;

      if (blackjackGame['rounds'] > blackjackGame['maxRounds']) {
        displayFinalResult();
        return;
      }
    }
  }

  function updateScore(card, activePlayer) {
    if (card === 'A') {
      if (activePlayer['score'] + blackjackGame['cardsmap'][card][1] <= 21) {
        activePlayer['score'] += blackjackGame['cardsmap'][card][1];
      } else {
        activePlayer['score'] += blackjackGame['cardsmap'][card][0];
      }
    } else {
      activePlayer['score'] += blackjackGame['cardsmap'][card];
    }
  }

  function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
      document.querySelector(activePlayer['scorespan']).textContent = 'Перебір!';
      document.querySelector(activePlayer['scorespan']).style.color = 'red';
    } else {
      document.querySelector(activePlayer['scorespan']).textContent = activePlayer['score'];
    }
  }

  function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
      let cardImage = document.createElement('img');
      cardImage.src = `images/imagess/${card}.png`;
      cardImage.alt = card;
      document.querySelector(activePlayer['div']).appendChild(cardImage);
    }
  }

  function randomCard() {
    let randomIndex = Math.floor(Math.random() * blackjackGame['cards'].length);
    return blackjackGame['cards'][randomIndex];
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function dealerLogic() {
    blackjackGame['isstand'] = true;
    while (COMPUTER['score'] < 16 && blackjackGame['isstand'] === true) {
      let card = randomCard();
      showCard(card, COMPUTER);
      updateScore(card, COMPUTER);
      showScore(COMPUTER);
      await sleep(1000);
    }

    blackjackGame['turnover'] = true;
    let winner = computeWinner();
    showresult(winner);
  }

 function computeWinner() {
  let winner;

  if (USER['score'] > 21 && COMPUTER['score'] > 21) {
    blackjackGame['draws']++;
    winner = null;
  } else if (USER['score'] <= 21) {
    if (USER['score'] > COMPUTER['score'] || (COMPUTER['score'] > 21)) {
      blackjackGame['wins']++;
      winner = USER;
    } else if (USER['score'] < COMPUTER['score']) {
      blackjackGame['losses']++;
      winner = COMPUTER;
    } else {
      blackjackGame['draws']++;
      winner = null;
    }
  } else {
    blackjackGame['losses']++;
    winner = COMPUTER;
  }

  blackjackGame['rounds']++;

  return winner;
}


  function handleDraw() {
    blackjackGame['draws']++;
    updateScoreboard();
    resetGame();
    document.querySelector('#blackjack-result').textContent = "Ничія";
    document.querySelector('#blackjack-result').style.color = 'black';
  }

  function updateScoreboard() {
    document.querySelector('#wins').textContent = blackjackGame['wins'];
    document.querySelector('#losses').textContent = blackjackGame['losses'];
    document.querySelector('#draws').textContent = blackjackGame['draws'];
  }

  function showresult(winner) {
    let message, messageColor;

    if (blackjackGame['turnover'] === true) {
      if (winner === USER) {
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = `${playerName}, ти виграв!`;
        messageColor = 'green';
      } else if (winner === COMPUTER) {
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        message = `${playerName}, ти програв!`;
        messageColor = 'red';
      } else {
        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = `${playerName}, ничия!`;
        messageColor = 'black';
      }
      document.querySelector('#blackjack-result').textContent = message;
      document.querySelector('#blackjack-result').style.color = messageColor;
    }
  }

  
  function displayFinalResult() {
    let overallWinner;
    if (blackjackGame['wins'] > blackjackGame['losses']) {
      overallWinner = `${playerName}, ти виграв!`;
    } else if (blackjackGame['wins'] < blackjackGame['losses']) {
      overallWinner = `${playerName}, ти програв!`;
    } else {
      overallWinner = `${playerName}, ничия!`;
    }

    
    alert(`Гра завершена. ${overallWinner}\nWins: ${blackjackGame['wins']} Losses: ${blackjackGame['losses']} Draws: ${blackjackGame['draws']}`);

    
    resetGame();
  }

  function resetGame() {
    blackjackGame['rounds'] = 0;
    blackjackGame['wins'] = 0;
    blackjackGame['losses'] = 0;
    blackjackGame['draws'] = 0;
    blackjackGame['maxRounds'] = 3;
    blackjackGame['isstand'] = false;
    blackjackGame['turnover'] = false;
  }

}, false);
