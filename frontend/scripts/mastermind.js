const colors = {
    1: 'red',
    2: 'blue',
    3: 'green',
    4: 'purple',
    5: 'pink',
    6: 'yellow'
};
const reversedColors = Object.fromEntries(Object.entries(colors).map(a => a.reverse()))
const colorsLength = Object.keys(colors).length

function changeSecretColors(){
    const colorsFields = document.querySelectorAll('#secret-code > .circle-code');
    
    colorsFields.forEach(field => {
        field.addEventListener('click', () =>{
            if(!field.classList.contains('hidden')){
                color = colors[1]
                
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

changeSecretColors();
btnStateHadle() ;