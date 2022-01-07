var conn = new WebSocket('ws://localhost:8080');

/**
 * TODO: 
 * - cacher réponses admin
 * - Tableau des gagnants
 */

// ==================== VARIABLES ====================
let roomId = document.getElementById('roomId').innerHTML;
let currentUserId = document.getElementById('currentUserId').innerHTML;
let currentUserSession = document.getElementById('currentUserSession').dataset.user;
    currentUserSession = JSON.parse(currentUserSession);
let usersList = document.getElementById('usersList');

let whoAmI = document.getElementById('whoAmI');
let numTour = document.getElementById('numTour'); // Numéro du tour actuel
let currentPlayer = document.getElementById('currentPlayer'); // Joueur actuel

let divChoixDifficulte = document.getElementById('choixDifficulte'); // Div qui contient les choix de difficulté
let divAffichage = document.getElementById('affichage'); // Div qui contient les questions et réponses

let choixDifficulte = document.getElementsByName('difficulty');

let question = document.getElementById('question'); // Label de la question actuelle
let difficulty = document.getElementById('difficulty'); // Difficulté de la question actuelle
let trueAnswer = document.getElementById('trueAnswer'); // Réponse vraie de la question actuelle
// =========== 4 réponses possibles ===========
let divChoix = document.getElementById('choix'); // Div qui contient les choix de réponses
    let reponse1 = document.getElementById('reponse1'); // Bouton réponse 1 => pour afficher a l'intérieur
    let reponse2 = document.getElementById('reponse2'); // Bouton réponse 2 => pour afficher a l'intérieur
    let reponse3 = document.getElementById('reponse3'); // Bouton réponse 3 => pour afficher a l'intérieur
    let reponse4 = document.getElementById('reponse4'); // Bouton réponse 4 => pour afficher a l'intérieur
    let reponse = document.getElementsByName('reponse'); // Tous les boutons assemblés
      
// =========== Vrai ou faux ===========
let divVraiFaux = document.getElementById('vraiFaux'); // Div qui contient les choix de réponses
    let btnFaux = document.getElementById('btnFaux'); // Bouton faux
    let btnVrai = document.getElementById('btnVrai'); // Bouton vrai

// =========== Réponse ouverte ===========
let divRepOuverte = document.getElementById('repOuverte'); // Div qui contient les choix de réponses
    // Côté Admin
    let divRepOuverteAdmin = document.getElementById('repOuverteAdmin'); // div qui contient ce que le joueur a saisi
    let player = document.getElementById('player'); // Joueur qui a proposé la réponse
    let reponseProposeeAdmin = document.getElementById('reponseProposeeAdmin'); // Validation de la part de l'admin
    let btnReponseProposeeFaux = document.getElementById('reponseProposeeFaux'); // Bouton faux
    let btnReponseProposeeVrai = document.getElementById('reponseProposeeVrai'); // Bouton vrai
    // Côté Joueur
    let divRepOuverteJoueur = document.getElementById('repOuverteJoueur'); // div qui contient l'input pour répondre
    let inputReponseProposee = document.getElementById('reponseProposee'); // Saisie de la réponse
    let btnValiderReponseProposee = document.getElementById('btnReponseProposee'); // Valider l'envoi de la réponse

divAffichage.style.display = 'none';
divChoix.style.display = 'none';
divVraiFaux.style.display = 'none';
divRepOuverteAdmin.style.display = 'none';
divRepOuverteJoueur.style.display = 'none';

let players = [];
let winners = {};
let i = 0; // Afin de retrouver le joueur actuel
let ordre = 1; // Afin de placer dans le tableau des winners

// ====================================================

function build(event, data) {
    return JSON.stringify({
        type: event,
        data: data
    });
};

// Fonction qui fusionne le tableau des questions avec leurs réponses correspondantes
function arrayQR(objQuestions, objAnswers){
    let arrayQR = [];

    for (let i = 0; i < objQuestions.length; i++) {
        // Push des questions
        arrayQR.push({
            id: objQuestions[i].id,
            question: objQuestions[i].label,
            difficulty: objQuestions[i].level,
            answers: [],
            correct: ""
        });

        // Push des réponses correspondantes
        for (let j = 0; j < objAnswers.length; j++) {
            if (objQuestions[i].id == objAnswers[j].question_id) {
                arrayQR[i].answers.push({
                    answer: objAnswers[j].answer,
                });
                if (objAnswers[j].is_correct == 1) {
                    arrayQR[i].correct = objAnswers[j].answer;
                }
            }
        }    
    }
    return arrayQR;
}

//récupérer l'id de l'utilisateur qui ouvre la page ainsi que la Room ID qui se trouve dans l'URL
conn.onopen = function() {
    console.log("Connexion à la room " + roomId);
    console.log(currentUserSession);
    //Si on veut transmettre une info au server
    conn.send(build('joinroom', {
        uid: currentUserId,
        roomId: roomId,
        userSession: currentUserSession,
        username: currentUserSession.username,
    }))
};


conn.onmessage = function(e) {
    var data = JSON.parse(e.data);

    switch (data.type) {

        case 'difficultyChosen':
            divAffichage.style.display = 'block';
            question.innerText = data.data.question;
            difficulty.innerText = data.data.difficulty;
            switch (data.data.difficulty) {
                case "1":
                    difficulty.style.backgroundColor = "DodgerBlue";
                    break;
                case "2":
                    difficulty.style.backgroundColor = "LawnGreen";
                    break;
                case "3":
                    difficulty.style.backgroundColor = "Gold";
                    break;
                case "4":
                    difficulty.style.backgroundColor = "Orange";
                    break;
                case "5":
                    difficulty.style.backgroundColor = "Crimson";
                    break;
                case "6":
                    difficulty.style.backgroundColor = "Black";
                    difficulty.style.color = "white";
                    break;
            }
            trueAnswer.innerText = data.data.trueAnswer;
            divChoixDifficulte.style.display = 'none';

            if (whoAmI.textContent === "MAITRE DU JEU") {
                trueAnswer.style.display = 'block';
            } else {
                trueAnswer.style.display = 'block';
                document.getElementById('h5TrueAnswer').style.display = 'none';
            } 

            if (currentUserSession.username.toLowerCase() === currentPlayer.innerText.toLowerCase()) {
                if ((data.data.answers).length > 2) {
                    divChoix.style.display = 'block';
                    divVraiFaux.style.display = 'none';
                    divRepOuverteAdmin.style.display = 'none';
                    divRepOuverteJoueur.style.display = 'none';
                    reponse1.innerText = `${data.data.answers[0].answer}`;
                    reponse2.innerText = `${data.data.answers[1].answer}`;
                    reponse3.innerText = `${data.data.answers[2].answer}`;
                    reponse4.innerText = `${data.data.answers[3].answer}`;
                } else if (data.data.answers.length === 2) {
                    divChoix.style.display = 'none';
                    divVraiFaux.style.display = 'block';
                    divRepOuverteJoueur.style.display = 'none';
                } else {
                    divChoix.style.display = 'none';
                    divVraiFaux.style.display = 'none';
                    divRepOuverteJoueur.style.display = 'block';
                }
            }

            break;

        case 'goodAnswer':
            console.log(i, "/", data.allClients.length);
            if (i > data.allClients.length-1) { i = 0; }

            numTour.innerHTML = parseInt(numTour.innerHTML) + 1;

            let $usernames2 = data.allClients;
            for (let i = 0; i < $usernames2.length; i++) {
                players.push({ "name": $usernames2[i].username, "score": 0 });
            }

            if (difficulty.innerText === '1') {
                players[i].score += 1;
            } else if (difficulty.innerText === '2') {
                players[i].score += 2;
            } else if (difficulty.innerText === '3') {
                players[i].score += 3;
            } else if (difficulty.innerText === '4') {
                players[i].score += 4;
            } else if (difficulty.innerText === '5') {
                players[i].score += 5;
            } else if (difficulty.innerText === '6') {
                players[i].score += 6;
            }

            document.getElementById(`score${i}`).innerHTML = players[i].score;

            trueAnswer.innerText = "";
            divAffichage.style.display = 'none';
            divChoix.style.display = 'none';
            divVraiFaux.style.display = 'none';
            divRepOuverteAdmin.style.display = 'none';
            divRepOuverteJoueur.style.display = 'none';
        
            //skipIfWin();
            i++;
            currentPlayer.innerHTML = players[i].name;
            if (currentUserSession.username.toLowerCase() === currentPlayer.innerText.toLowerCase()) {
                divChoixDifficulte.style.display = 'block';
            } else {
                divChoixDifficulte.style.display = 'none';
            }
            tableWinners();

            break;

        case 'badAnswer':
            console.log(i, "/", data.allClients.length);
            if (i > data.allClients.length-1) { i = 0; }

            numTour.innerHTML = parseInt(numTour.innerHTML) + 1;

            let $usernames3 = data.allClients;
            for (let i = 0; i < $usernames3.length; i++) {
                players.push({ "name": $usernames3[i].username, "score": 0 });
            }

            if (difficulty.innerText === '1') {
                players[i].score -= 1;
            } else if (difficulty.innerText === '2') {
                players[i].score -= 2;
            } else if (difficulty.innerText === '3') {
                players[i].score -= 3;
            } else if (difficulty.innerText === '4') {
                players[i].score -= 4;
            } else if (difficulty.innerText === '5') {
                players[i].score -= 5;
            } else if (difficulty.innerText === '6') {
                players[i].score -= 6;
            }

            // Si le score est négatif, on le remet à 0
            if (players[i].score < 0) {
                players[i].score = 0;
            }
            document.getElementById(`score${i}`).innerHTML = players[i].score;

            trueAnswer.innerText = "";
            divAffichage.style.display = 'none';
            divChoixDifficulte.style.display = 'block';
            divChoix.style.display = 'none';
            divVraiFaux.style.display = 'none';
            divRepOuverteAdmin.style.display = 'none';
            divRepOuverteJoueur.style.display = 'none';

            // skipIfWin();
            i++;
            currentPlayer.innerHTML = players[i].name;
            if (currentUserSession.username.toLowerCase() === currentPlayer.innerText.toLowerCase()) {
                divChoixDifficulte.style.display = 'block';
            } else {
                divChoixDifficulte.style.display = 'none';
            }
            tableWinners();

            break;

        case 'demandeValidationReponse':
            console.log(data.data);
            if (currentUserSession.username.toLowerCase() === document.getElementById('mdj').innerText.toLowerCase()) {
                divRepOuverteAdmin.style.display = 'block';
                player.innerHTML = `${players[i].name}`;
                reponseProposeeAdmin.innerText = data.data.reponseProposee;
            }

            break;

        case 'start-game':
            console.log('START THE GAME!');
            document.getElementById('mdj').innerText = data.allClients[0].username;
            document.getElementById('waiting').classList.remove('d-sm-flex');
            document.getElementById('waiting').hidden = true;
            document.getElementById('game').hidden = false;

            // LES COULEURS SONT LA
            console.log(data.users_infos);

            // Récupération des questions et des réponses
            let allQuestions = document.getElementById('questions').dataset.questions; // Tableau des questions
                allQuestions = JSON.parse(allQuestions);
            let allAnswers = document.getElementById('answers').dataset.answers; // Tableau des réponses
                allAnswers = JSON.parse(allAnswers);
            let tabQandA = arrayQR(allQuestions, allAnswers); // Tableau des questions et réponses fusionnées

            // Récupération des données de l'utilisateur
            let $usernames = data.allClients;
            for (let i = 0; i < $usernames.length; i++) {
                players.push({ "name": $usernames[i].username, "score": 0 });
            }
           
            // Initialisation
            numTour.innerText = 1;
            currentPlayer.innerText = players[0].name;

            // ================== PARTIE ADMIN ================== //
            if (currentUserSession.username === data.allClients[0].username) {
                whoAmI.textContent = 'MAITRE DU JEU';
                console.log("Tableau des joueurs actuels :", players);
                console.log("Tableau des questions et réponses :", tabQandA);
                trueAnswer.style.display = 'block';
            }
            // ================== PARTIE JOUEUR ================== //
            else {
                whoAmI.textContent = 'JOUEUR'; 
            }

            if (currentUserSession.username.toLowerCase() === currentPlayer.innerText.toLowerCase()) {
                divChoixDifficulte.style.display = 'block';
                            
            } else {
                divChoixDifficulte.style.display = 'none';
            }

            // Affichage de la question
            for (let j = 0; j < 6; j++) {
                (choixDifficulte[j]).addEventListener('click', function() {
                    let questionChoisie = difficultyChoice(String(j+1));
                    conn.send(build('difficultyChosen', {
                        roomId: roomId,
                        question: questionChoisie.question,
                        difficulty: questionChoisie.difficulty,
                        answers: questionChoisie.answers,
                        trueAnswer: questionChoisie.correct,
                    }));
                });
            }
        
            // Vrai ou faux
            btnVrai.addEventListener('click', function() {
                if(i > data.allClients.length) { i = 0; }
                conn.send(build('goodAnswer', {
                    roomId: roomId,
                }));
            });
            btnFaux.addEventListener('click', function() {
                if(i > data.allClients.length) { i = 0; }
                conn.send(build('badAnswer', {
                    roomId: roomId,
                }));
            });

            // Plusieurs réponses
            for (let j = 0; j < reponse.length; j++) {
                reponse[j].addEventListener('click', () => {
                    console.log("i :", i);
                    if(i > data.allClients.length) { i = 0; }
                    if (reponse[j].innerText === trueAnswer.innerText) {
                        conn.send(build('goodAnswer', {
                            roomId: roomId,
                        }));
                    } else {
                        conn.send(build('badAnswer', {
                            roomId: roomId,
                        }));
                    }
                });
            }

            // Question ouverte
            btnValiderReponseProposee.addEventListener('click', () => {
                conn.send(build('demandeValidationReponse', {
                    roomId: roomId,
                    reponseProposee: inputReponseProposee.value,
                }));
            });
            btnReponseProposeeVrai.addEventListener('click', () => {
                conn.send(build('goodAnswer', {
                    roomId: roomId,
                }));
                divRepOuverteAdmin.style.display = 'none';
            });
            btnReponseProposeeFaux.addEventListener('click', () => {
                conn.send(build('badAnswer', {
                    roomId: roomId,
                }));
                divRepOuverteAdmin.style.display = 'none';
            });

        // ================== LES FONCTIONS ================== //

            // Génération du tableau des scores
            function tableScore() {
                let table = document.createElement('table');
                table.setAttribute('id', 'table');
                document.getElementById('tabScore').appendChild(table);
                let header = document.createElement('tr');
                header.innerHTML = `<th>Player</th><th>Score</th>`;
                table.appendChild(header);
                let body = document.createElement('tbody');
                body.setAttribute('id', 'body');
                table.appendChild(body);
                for (let i = 0; i < players.length; i++) {
                    let row = document.createElement('tr');
                    row.setAttribute('id', `row${i}`);
                    body.appendChild(row);
                    let player = document.createElement('td');
                    player.setAttribute('id', `player${i}`);
                    player.style.color = data.users_infos[i].color;
                    player.innerHTML = players[i].name;
                    row.appendChild(player);
                    let score = document.createElement('td');
                    score.setAttribute('id', `score${i}`);
                    score.innerHTML = players[i].score;
                    row.appendChild(score);
                }
            }

            // Tableau des gagnants
            function tableWinners() {
                // Tableau associatif avec les gagnants et leur ordre d'arrivée
                for (let i = 0; i < players.length; i++) {
                    if (players[i].score >= 10) {
                        // Si le joueur est déjà dans le tableau, alors on ne l'ajoute pas
                        if (winners.hasOwnProperty(players[i].name)) {
                            continue;
                        } else {
                            document.getElementById(`score${i}`).style.color = 'red';
                            winners[players[i].name] = ordre;
                            ordre++;
                        }
                    }
                }
                console.log("Tableau des gagnants :", winners);

                if (Object.keys(winners).length = players.length) {
                    console.log("Tous les joueurs ont gagné");
                }
                console.log("Combien de gagnants :", Object.keys(winners).length);
                console.log("Combien de joueurs : ", players.length);
                return winners;
            }

            // Choix de la difficulté
            // Retourne un tableau avec les question de la difficulté choisie
            function difficultyChoice(level) {
                divChoixDifficulte.style.display = 'none';
                divAffichage.style.display = 'block';
                // On met dans un tableau les questions avec la difficulté choisie
                let selectedQuestions = [];
                for (let i = 0; i < tabQandA.length; i++) {
                    if (tabQandA[i].difficulty === level) {
                        selectedQuestions.push(tabQandA[i]);
                    }
                }
                const random = Math.floor(Math.random() * selectedQuestions.length)
                return selectedQuestions[random];
            }

            tableScore();
            break;
        
        case 'usersList':
            // console.log(data.countNow + " joueur présent sur " + data.countRequired + " attendus");
            // console.log("usersList", data.usersList);
            // console.log(data.users_infos);
            console.log(data.getClientsInRoom);
        
            document.getElementById('countNow').textContent = data.countNow;
            document.getElementById('countRequired').textContent = data.countRequired;

            //Actualisation de la liste des utilisateurs grâce au tableau data.usersList
            usersList.innerHTML = "";

            for (let i = 0; i < data.usersList.length; i++) {
                let li = document.createElement('h2');
                li.innerText = (data.usersList[i].username).toUpperCase();
                li.style.fontWeight = "bold";
                li.style.color = data.users_infos[i].color;
                usersList.appendChild(li);
            }

            break;
    }
};