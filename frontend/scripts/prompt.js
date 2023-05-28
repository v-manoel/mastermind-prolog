import { colors, mastermindApiUrl } from './global.js';

const promptFields = document.querySelectorAll('#secret-code > .circle-code');

function handlePromptColors(){
    promptFields.forEach(field => {
        field.addEventListener('click', () =>{
            if(!field.classList.contains('hidden')){
                let colorId = 1
                
                if(field.hasAttribute('colorId')){
                    const currentColorId = field.getAttribute('colorId');
                    colorId = ((currentColorId) % colors.size()) +1;
                }

                field.setAttribute('colorId',colorId);
                field.style.backgroundColor = colors[colorId];
            }
        });
    });
}

async function sendSecretCode(){
    
    const secretCode = getSecretCode();
    const response = await axios.post(`${mastermindApiUrl}start`, {
        'secretCode':secretCode
    });
    const data = response.data

    updateSecretCode(data['secretCode'])

    return data['guess']
}

function  getSecretCode() {
    const secretCode = []
    
    promptFields.forEach(field => {
        field.classList.add('hidden');
    
        if(field.hasAttribute('colorId')){
            const colorId = field.getAttribute('colorId');
            secretCode.push(colorId);
        }
    });
    
    return secretCode.length < 4 ? '' : secretCode;
}

function updateSecretCode(secretCode){
    for (let index = 0; index < secretCode.length; index++) {
        const codeId = secretCode[index];
        const promptField = promptFields[index]; 
        promptField.setAttribute('colorId',codeId);
        promptField.style.backgroundColor = colors[codeId];
    }
}

export { sendSecretCode, handlePromptColors };