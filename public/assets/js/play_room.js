// COLORS
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

let colorsPicked = [];

generateInputColors();

function generateInputColors() {
    for (let i = 1; i <= 6; i++) {
        let selectColorInput = document.getElementById('colorPicker' + i);
        selectColorInput.dataset.color = "";

        selectColorInput.addEventListener('change', () => {
            setColorInput(selectColorInput);
            updateColorInputs();
            // console.log(colorsPicked);
        })

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

// USERS
let users = [];

// Liste des utilisateurs inscrits
let usersList = document.getElementById('usersList');
let usersListChilds = Array.from(usersList.children);
for (let i = 0; i < usersListChilds.length; i++) {
    users.push(usersListChilds[i].innerText);
}
console.log(users);

let player = document.getElementById('player1');
player.addEventListener('keyup', function (e) {
    showResults(e.target.value);
});

let propositions = document.getElementsByName('propositions');

// Fonction d'auto-completion
function autocompleteMatch(input) {
    if (input == '') {
        return [];
    }
    var reg = new RegExp(input)
    return users.filter(function (term) {
        if (term.match(reg)) {
            return term;
        }
    });
}

// Montre les résultats de la recherche
function showResults(val) {
    res = document.getElementById("results");
    res.innerHTML = '';
    let list = '';
    let terms = autocompleteMatch(val);
    for (i = 0; i < terms.length; i++) {
        list += '<li name="proposition">' + terms[i] + '</li>';
    }
    res.innerHTML = '<ul>' + list + '</ul>';
}

/*

var search_terms = ['apple', 'apple watch', 'apple macbook', 'apple macbook pro', 'iphone', 'iphone 12'];
 
function autocompleteMatch(input) {
  if (input == '') {
    return [];
  }
  var reg = new RegExp(input)
  return search_terms.filter(function(term) {
	  if (term.match(reg)) {
  	  return term;
	  }
  });
}
 
function showResults(val) {
  res = document.getElementById("result");
  res.innerHTML = '';
  let list = '';
  let terms = autocompleteMatch(val);
  for (i=0; i<terms.length; i++) {
    list += '<li>' + terms[i] + '</li>';
  }
  res.innerHTML = '<ul>' + list + '</ul>';
}

 */