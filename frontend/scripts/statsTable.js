import { mastermindApiUrl} from './global.js';

const statsTable = document.querySelector('.game-stats .table')

async function updateWithGameStatus(gameStatus){
    const {status, feedback, secretCode, guess, turnStates} = gameStatus;

    const guessCount = statsTable.querySelector('.guess-count .content #n-guesses');
    guessCount.textContent = turnStates.length +1
    
    const secret = statsTable.querySelector('.secret-id .content');
    secret.textContent = secretCode
    
    const lastGuess = statsTable.querySelector('.last-guess-id .content');
    lastGuess.textContent = turnStates.length ? turnStates[0]['args'][0] : '----'
    
    const feedbackCorrect = statsTable.querySelector('.feedback-id .content #correct-positions');
    const feedbackIncorrect = statsTable.querySelector('.feedback-id .content #incorrect-positions');
    feedbackCorrect.textContent = feedback[0];
    feedbackIncorrect.textContent = feedback[1];
    
    const currentGuess = statsTable.querySelector('.guess-id .content');
    currentGuess.textContent = guess;
    
    const statusComponent = statsTable.querySelector('.status .content');
    statusComponent.textContent = status['message'];
}


export {updateWithGameStatus};