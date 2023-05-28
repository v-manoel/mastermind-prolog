import { colors } from './global.js';


const board = document.querySelector('.board');

function newGuessCard(colorsId){
    if(colorsId.length < 4)
        return

    const card = document.createElement('div');
    card.classList.add('card', 'game-turn', 'selected');
    const code = document.createElement('div');
    code.classList.add('code');
    const feedback = document.createElement('feedback');
     feedback.classList.add('feedback');
    
    colorsId.forEach(colorId => {
        const codeField = document.createElement('div');
        const feedbackField = document.createElement('div');
        
        codeField.classList.add('circle', 'circle-code');
        feedbackField.classList.add('circle', 'circle-feedback');

        codeField.style.backgroundColor = colors[colorId];
        code.appendChild(codeField);
        feedback.appendChild(feedbackField);
    });

    disableSelectedCards();
    card.appendChild(code);
    card.appendChild(feedback);
    board.prepend(card);
}

function disableSelectedCards(){
    const selectedCards = board.querySelectorAll('.card.selected');
    selectedCards.forEach(card => {
        card.classList.remove('selected');
        card.classList.add('disabled');
    });
}


export { newGuessCard };