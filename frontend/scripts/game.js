import { mastermindApiUrl } from './global.js';
import { newGuessCard } from './boardHandle.js';
import { sendSecretCode, handlePromptColors } from './prompt.js';
import { sendFeedback, handleFeedbackColors } from './feedback.js';
import {updateWithGameStatus } from './statsTable.js';
import {openModal } from './modal.js';

function handleBtnState() {
    const btn = document.querySelector('.prompt .btn');
    
    btn.addEventListener('click', async () => {
        let agentGuess = [];
                
        if(btn.classList.contains('turn-btn')){
            let response = await sendFeedback();
            agentGuess = response['guess']
        } else {
            btn.classList.add('turn-btn');
            btn.style.backgroundColor = '0077b6';
            btn.textContent = 'End Turn';
            agentGuess = await sendSecretCode();
        }
        
        const gameStatus = await getGameStatus(); 
        const { status } = gameStatus;
        updateWithGameStatus(gameStatus);
        
        if (status.code != 2){
            openModal(status.message);
            return
        }

        newGuessCard(agentGuess);
        handleFeedbackColors();
    });
}

async function getGameStatus(){
    const response = await axios.get(`${mastermindApiUrl}status`);
    return response.data;
}

handlePromptColors();
handleBtnState();




