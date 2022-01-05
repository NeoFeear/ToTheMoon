// COLORS
let colorsTable = ['green','red','blue','yellow','Tomato','cyan','Plum','Indigo','LightPink','Khaki','DeepSkyBLue'];

let colorsPicked = [];

generateInputColors();

function generateInputColors() {
    for (let i = 1; i <= 6; i++) {
        let selectColorInput = document.getElementById('colorPicker' + i);
        selectColorInput.dataset.color = "";

        selectColorInput.addEventListener('change', () => {
            setColorInput(selectColorInput);
            updateColorInputs();
        });

        for (let i = 0; i < colorsTable.length; i++) {
            let addOption = document.createElement('option');

            addOption.value = colorsTable[i];
            addOption.style.backgroundColor = colorsTable[i];

            selectColorInput.appendChild(addOption);
            selectColorInput.style.backgroundColor = selectColorInput.value;
        }
    }
}

function setColorInput(selected) {
    if (colorsPicked.includes(selected.dataset.color)) {
        const index = colorsPicked.indexOf(selected.dataset.color);
        colorsPicked.splice(index, 1);
    }

    selected.style.backgroundColor = selected.value
    selected.dataset.color = selected.value;
    colorsPicked.push(selected.value);

    console.log(colorsPicked);
}

function updateColorInputs() {
    for (let i = 1; i <= 6; i++) {
        let si = document.getElementById('colorPicker' + i);
        let childs = Array.from(si.children);

        for (let j = 0; j < childs.length; j++) {
            if (colorsPicked.includes(childs[j].value)) {
                childs[j].disabled = true;
                childs[j].hidden = true;
            } else {
                childs[j].disabled = false;
                childs[j].hidden = false;
            }
        }
    }
}

// ============================================================

// USERS
let users = [];
let usersList = document.getElementById('usersList');
let usersListChilds = Array.from(usersList.children);
for (let i = 0; i < usersListChilds.length; i++) {
    users.push(usersListChilds[i].innerText);
}
console.log(users); // Liste des utilisateurs inscrits

let player = document.getElementsByName('inputPlayer');
for (let i = 0; i < player.length; i++) {
    player[i].addEventListener('keyup', function (e) {
        showResults(e.target.value, i);
    });
}

document.addEventListener('click', function (e) {
    if (e.target.tagName === 'LI') {
        e.target.hidden = true;
        player.value = e.target.innerText;
    }
});

function autocompleteMatch(input) {
    if (input == '') {
        return [];
    }
    
    var reg = new RegExp(input);
    
    return users.filter(function (term) {
        if (term.match(reg)) {
            return term;
        }
        if (term.toLowerCase().match(reg)) {
            return term;
        }
        if (term.toUpperCase().match(reg)) {
            return term;
        }
    });
}

res = document.getElementsByName("results");
function showResults(val, num) {
    res[num].innerHTML = "";
    let list = '';
    let terms = autocompleteMatch(val);
    for (let i = 0; i < terms.length; i++) {
        list += '<li name="proposition">' + terms[i] + '</li>';
    }
    res[num].innerHTML = '<ul>' + list + '</ul>';
}
/* {
    for (let i = 0; i < res.length; i++) {
        res[num].innerHTML = '';
        let list = '';
        let terms = autocompleteMatch(val);
        for (i = 0; i < terms.length; i++) {
            list += '<li name="proposition">' + terms[i] + '</li>';
        }
        res[num].innerHTML = '<ul>' + list + '</ul>';
    }
} */