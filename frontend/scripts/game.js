import { newGuessCard } from './boardHandle.js';
import { sendSecretCode, handlePromptColors } from './prompt.js';
import { sendFeedback, handleFeedbackColors } from './feedback.js';
import {updateWithGameStatus } from './statsTable.js';



function handleBtnState() {
    const btn = document.querySelector('.prompt .btn');

    btn.addEventListener('click', async () => {
        if(btn.classList.contains('turn-btn')){
            let response = await sendFeedback();
            updateWithGameStatus();
            newGuessCard(response['guess']);
        } else {
            
            btn.classList.add('turn-btn');
            btn.style.backgroundColor = '0077b6';
            btn.textContent = 'End Turn';
            
            const agentGuess = await sendSecretCode();
            console.log(agentGuess)
            updateWithGameStatus();
            newGuessCard(agentGuess)
        }
        handleFeedbackColors();
    });
}

handlePromptColors();
handleBtnState();




