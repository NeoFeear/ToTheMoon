let colorsTable = [
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

let colorsPicked = [
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


for(let i = 0; i < 6; i++){

    let selectColorInput = document.getElementById('colorPicker'+i);

    
    
    selectColorInput.addEventListener('change', () => {
        updateColors('colorPicker'+i);
        
    })

    for(let i = 0; i < colorsTable.length; i++){

        let addOption = document.createElement('option');

        addOption.value = colorsTable[i];
        addOption.innerHTML = colorsTable[i].toUpperCase();
        addOption.style.backgroundColor = colorsTable[i];
        
        selectColorInput.appendChild(addOption);
        selectColorInput.style.backgroundColor =selectColorInput.value; 

    }
    
}


function updateColors(selected){
    let si = document.getElementById(selected);

    //On parcours le tableau de couleurs
    for( var i = 0; i < colorsTable.length; i++){ 
        
        //Si la couleur est présente, on la retire du tableau
        if (colorsTable[i] == si.value) { 
            si.style.backgroundColor = si.value;

            colorsTable.splice(i, 1); 
            i--; 

        }    

    }
    console.log(colorsTable);

    //On retire les childs de tous les selects qui ont comme valeur la valeur du select
    for(let i = 0; i < 6; i++){

        let selectColorInput = document.getElementById('colorPicker'+i);
        let childs = Array.from(selectColorInput.children);

        if(selectColorInput.id !== selected){

            for(let j = 0; j < childs.length; j++){

                if(childs[j].value == si.value){
                    childs[j].remove();
                };
         
            }
        }
            
    }   

}


function compareArray(Array1, Arary2){
    let missing = Array1.filter(e=>!Arary2.includes(e));
    console.log(missing);
}


