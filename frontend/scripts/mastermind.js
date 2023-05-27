const colors = {
    1: '#007bff',
    2: '#00cc00',
    3: '#ff4500',
    4: '#8a2be2',
    5: '#ffcc00',
    6: '#ff6600'
};
const reversedColors = Object.fromEntries(Object.entries(colors).map(a => a.reverse()))
const colorsLength = Object.keys(colors).length

function changeSecretColors(){
    const colorsFields = document.querySelectorAll('#secret-code > .circle-code');
    
    colorsFields.forEach(field => {
        field.addEventListener('click', () =>{
            if(!field.classList.contains('hidden')){
                let color = colors[1]
                
                if(field.hasAttribute('color')){
                    currentcolor = field.getAttribute('color');
                    colorIndex = reversedColors[currentcolor] -1;
                    newColorId = ((colorIndex+1)%colorsLength) +1
                    color = colors[newColorId]
                }

                field.setAttribute('color',color);
                field.style.backgroundColor = color
            }
        });
    });
}


function btnStateHadle() {
    const btn = document.querySelector('.prompt .btn');

    btn.addEventListener('click', () => {
        if(btn.classList.contains('turn-btn')){
            turnGame();
        }else{
            btn.classList.add('turn-btn');
            startGame();
        }
    });

}

function turnGame() {
    const feedbackSpace = document.querySelector(".board .card.selected:last-child .feedback");
    feedbackSpace.classList.remove('selected');
    feedbackSpace.classList.add('disabled')

}

function startGame() {
    const colorsFields = document.querySelectorAll('#secret-code > .circle-code');
    const secretCode = []

    colorsFields.forEach(field => {
        field.classList.add('hidden')
        if(field.hasAttribute('color')){
            currentcolor = field.getAttribute('color');
            colorId = reversedColors[currentcolor];
            secretCode.push(colorId);
        }
    });

    if(secretCode.length < 4){
        //chame o endpoint que invoque a rule run do prolog semparametros
        console.log("Código Secreto Será Gerado Aleatóriamente");
    }else{
        //chame o endpoint que invoque a rule run do prolog informando o secret code
        console.log(`Código Secreto:${secretCode}`);
    }
}

function handleFeedback(){
    const feedbackSpace = document.querySelector(".board .card.selected:last-child .feedback");
    const feedbackFields = feedbackSpace.querySelectorAll(".circle-feedback")
    const feedbackColors = ['white','black','#d8d8d857'];
    
    feedbackFields.forEach(field => {
        field.addEventListener('click', () => {
            if(!feedbackSpace.classList.contains('disabled')){
                let colorId = 0;
                
                if(field.hasAttribute('colorId')){
                    let currentColorId = field.getAttribute('colorId');
                    colorId = ((currentColorId+1)%feedbackColors.length)
                }
                
                field.setAttribute('colorId',colorId);
                field.style.backgroundColor = feedbackColors[colorId];
            }
        });
    });

}

changeSecretColors();
btnStateHadle();
handleFeedback();