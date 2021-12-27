//CONSTANTES GLOBALES
const colorsTable = [
    'green',
    'red',
    'blue',
    'yellow',
    'Tomato',
    'cyan',
    'Plum',
    'Indigo',
    'LightPink',
    'Khaki',
    'DeepSkyBLue'  
];

//VARIABLES

let colorsPicked = [];

//Récupération des utilisateurs 

//GENERATION DES COLORS PICKER POUR LES JOUEURS
generateInputColors();

/**
 * Fonction qui permet de générer les couleurs dans les selecteurs
 */
function generateInputColors(){

    for(let i = 0; i < 6; i++){

    let selectColorInput = document.getElementById('colorPicker'+i);
        selectColorInput.dataset.color = "";

    selectColorInput.addEventListener('change', () => {

        setColorInput(selectColorInput);
        updateColorInputs();
        // console.log(colorsPicked);

    })

        for(let i = 0; i < colorsTable.length; i++){

            let addOption = document.createElement('option');

            addOption.value = colorsTable[i];
            addOption.style.backgroundColor = colorsTable[i];
            
            selectColorInput.appendChild(addOption);
            selectColorInput.style.backgroundColor =selectColorInput.value; 

        }

    }
}

/**
 * Fonction qui permet de setter une couleur a un joueur 
 * @param {HTMLelement} selected 
 */
function setColorInput(selected){

    if(colorsPicked.includes(selected.dataset.color)){
        const index = colorsPicked.indexOf(selected.dataset.color);
        colorsPicked.splice(index,1);
    }

    selected.style.backgroundColor = selected.value
    selected.dataset.color = selected.value;
    colorsPicked.push(selected.value);

    console.log(colorsPicked);
}

/**
 * Fonction qui met a jour les couleurs disponibles pour les autres joueurs
 */
function updateColorInputs(){
 
    for(let i = 0; i < 6; i++){

        let si = document.getElementById('colorPicker'+i);
        let childs = Array.from(si.children);

        for(let j = 0; j < childs.length; j++){

            if(colorsPicked.includes(childs[j].value)){
                childs[j].disabled = true;
                childs[j].hidden = true;
            }else{
                childs[j].disabled = false;
                childs[j].hidden = false;
            }
        
        }
        
    }

}


