import { feedbackColors, mastermindApiUrl } from './global.js';


function handleFeedbackColors(){
    const feedbackSpace = document.querySelector(".board .card.selected .feedback");
    const feedbackFields = feedbackSpace.querySelectorAll(".circle-feedback");

    feedbackFields.forEach(field => {
        field.addEventListener('click', () => {
            if(!field.classList.contains('hidden')){
                let colorId = 0;
                
                if(field.hasAttribute('colorId')){
                    let currentColorId = field.getAttribute('colorId');
                    colorId = ((currentColorId+1)%feedbackColors.size())
                }
                field.setAttribute('colorId',colorId);
                field.style.backgroundColor = feedbackColors[colorId]['color'];
            }
        });
    });
}

async function sendFeedback(){
    const feedback = getFeedback();

    const response = await axios.post(`${mastermindApiUrl}feedback`, {
        'feedback':feedback
    });
    return response.data;
}


function  getFeedback() {
    const feedbackSpace = document.querySelector(".board .card.selected .feedback");
    const feedbackFields = feedbackSpace.querySelectorAll(".circle-feedback");
    feedbackSpace.classList.remove('selected');
    feedbackSpace.classList.add('disabled')

    const feedback = {'correct': 0,'incorrect':0}
    
    feedbackFields.forEach(field => {
        field.classList.add('hidden');
    
        if(field.hasAttribute('colorId')){
            const colorId = field.getAttribute('colorId');
            const feedbackLabel = feedbackColors[colorId]['label'];
            feedback[feedbackLabel] += 1;
        }
    });
    
    return [feedback['correct'], feedback['incorrect']];
}

export { sendFeedback, handleFeedbackColors };