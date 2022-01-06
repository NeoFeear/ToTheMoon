var conn = new WebSocket('ws://localhost:8080');


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

let choixDifficulte1 = document.getElementById('difficulty1'); // Difficulté 1 : very easy
let choixDifficulte2 = document.getElementById('difficulty2'); // Difficulté 2 : easy
let choixDifficulte3 = document.getElementById('difficulty3'); // Difficulté 3 : medium
let choixDifficulte4 = document.getElementById('difficulty4'); // Difficulté 4 : hard
let choixDifficulte5 = document.getElementById('difficulty5'); // Difficulté 5 : very hard
let choixDifficulte6 = document.getElementById('difficulty6'); // Difficulté 6 : impossible

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
            console.log(data);break;
            let questionServerReturn = document.getElementById('question');
                questionServerReturn.textContent = data.data.question;
            break;

        case 'start-game':
            console.log('START THE GAME!');
            document.getElementById('mdj').innerText = data.allClients[0].username;
            document.getElementById('waiting').hidden = true;
            document.getElementById('game').hidden = false;

            // Récupération des questions et des réponses
            let allQuestions = document.getElementById('questions').dataset.questions; // Tableau des questions
                allQuestions = JSON.parse(allQuestions);
            let allAnswers = document.getElementById('answers').dataset.answers; // Tableau des réponses
                allAnswers = JSON.parse(allAnswers);
            let tabQandA = arrayQR(allQuestions, allAnswers); // Tableau des questions et réponses fusionnées

            let i = 0; // Afin de retrouver le joueur actuel
            let ordre = 1; // Afin de placer dans le tableau des winners

            // Récupération des données de l'utilisateur
            let $usernames = data.allClients;
            let players = [];
            function getPlayers() {
                // players = [];
                for (let i = 0; i < $usernames.length; i++) {
                    players.push({ "name": $usernames[i].username, "score": 0 });
                }
                return players;
            }
            getPlayers();
           
            // Initialisation
            numTour.innerText = 1;
            currentPlayer.innerText = players[0].name;
            divChoixDifficulte.style.display = 'block';
            divAffichage.style.display = 'none';
            divChoix.style.display = 'none';
            divVraiFaux.style.display = 'none';
            divRepOuverteAdmin.style.display = 'none';
            divRepOuverteJoueur.style.display = 'none';

            // ================== PARTIE ADMIN ================== //
            if (currentUserSession.username === data.allClients[0].username) {
                whoAmI.textContent = 'MAITRE DU JEU';
                console.log("Tableau des joueurs actuels :", players);
                console.log("Tableau des questions et réponses :", tabQandA);
            }
            // ================== PARTIE JOUEUR ================== //
            else {
                whoAmI.textContent = 'JOUEUR'; 
            }

            // JOUEUR ACTUEL
            if (currentUserSession.username === data.allClients[i].username) {
                console.log("Joueur actuel :", players[i]);
            } else {
                divChoixDifficulte.style.display = 'none';
            }

            choixDifficulte1.addEventListener('click', () => { 
                conn.send(build('difficultyChosen', {
                    roomId: roomId,
                    question: "TEST"
                })); 
            });
            choixDifficulte2.addEventListener('click', () => { 
                conn.send(build('difficultyChosen', {
                    roomId: roomId,
                    question: "TEST"
                })); 
            });
            choixDifficulte3.addEventListener('click', () => { 
                conn.send(build('difficultyChosen', {
                    roomId: roomId,
                    question: "TEST"
                })); 
            });
            choixDifficulte4.addEventListener('click', () => { 
                conn.send(build('difficultyChosen', {
                    roomId: roomId,
                    question: "TEST"
                })); 
            });
            choixDifficulte5.addEventListener('click', () => { 
                conn.send(build('difficultyChosen', {
                    roomId: roomId,
                    question: "TEST"
                })); 
            });
            choixDifficulte6.addEventListener('click', () => { 
                conn.send(build('difficultyChosen', {
                    roomId: roomId,
                    question: "TEST"
                })); 
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
                    if (players[i].score >= 48) {
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
                return winners;
            }

            // Choix de la difficulté
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
                showQuestion(selectedQuestions);
            }

            // Affiche la question et ses réponses
            function showQuestion(tabQuestions) {
                const random = Math.floor(Math.random() * tabQuestions.length);
                question.innerText = `${tabQuestions[random].question}`;
                difficulty.innerText = `${tabQuestions[random].difficulty}`;
                trueAnswer.innerText = `${tabQuestions[random].correct}`;

                if (tabQuestions[random].answers.length > 2) {
                    divChoix.style.display = 'block';
                    divVraiFaux.style.display = 'none';
                    divRepOuverteJoueur.style.display = 'none';
                    reponse1.innerText = `${tabQuestions[random].answers[0]}`;
                    reponse2.innerText = `${tabQuestions[random].answers[1]}`;
                    reponse3.innerText = `${tabQuestions[random].answers[2]}`;
                    reponse4.innerText = `${tabQuestions[random].answers[3]}`;
                } else if (tabQuestions[random].answers.length === 2) {
                    divChoix.style.display = 'none';
                    divVraiFaux.style.display = 'block';
                    divRepOuverteJoueur.style.display = 'none';
                } else {
                    divChoix.style.display = 'none';
                    divVraiFaux.style.display = 'none';
                    divRepOuverteJoueur.style.display = 'block';
                }
            }

            // Ajout d'un tour
            function incrementTour() {
                numTour.innerHTML = parseInt(numTour.innerHTML) + 1;
            }

            // Bonne réponse
            function goodAnswer(noPlayer) {
                if (difficulty.innerText === 'easy') {
                    players[noPlayer].score += 1;
                } else if (difficulty.innerText === 'medium') {
                    players[noPlayer].score += 2;
                } else if (difficulty.innerText === 'hard') {
                    players[noPlayer].score += 3;
                }
                document.getElementById(`score${noPlayer}`).innerHTML = players[noPlayer].score;

                trueAnswer.innerText = "";
                divChoixDifficulte.style.display = 'block';
                divAffichage.style.display = 'none';
                currentPlayer.innerHTML = players[(noPlayer + 1) % players.length].name;
            }
            // Mauvaise réponse
            function badAnswer(noPlayer) {
                if (difficulty.innerText === 'easy') {
                    players[noPlayer].score -= 1;
                } else if (difficulty.innerText === 'medium') {
                    players[noPlayer].score -= 2;
                } else if (difficulty.innerText === 'hard') {
                    players[noPlayer].score -= 3;
                }
                // Si le score est négatif, on le remet à 0
                if (players[noPlayer].score < 0) {
                    players[noPlayer].score = 0;
                }
                document.getElementById(`score${noPlayer}`).innerHTML = players[noPlayer].score;

                trueAnswer.innerText = "";
                divChoixDifficulte.style.display = 'block';
                divAffichage.style.display = 'none';
                currentPlayer.innerHTML = players[(noPlayer + 1) % players.length].name;
            }

            // Passe le tour du joueur s'il a déjà gagné
            function skipIfWin() {
                while(players[(i + 1) % players.length].score >= 48) {
                    i++;
                    currentPlayer.innerHTML = players[(i + 1) % players.length].name;
                    if (i > 5) { i = 0; }
                }
            }

            tableScore();
            break;
        
        case 'usersList':
            console.log(data.countNow + " joueur présent sur " + data.countRequired + " attendus");
            console.log("usersList", data.usersList);

            document.getElementById('countNow').textContent = data.countNow;
            document.getElementById('countRequired').textContent = data.countRequired;

            //Actualisation de la liste des utilisateurs grâce au tableau data.usersList
            usersList.innerHTML = "";

            for (let i = 0; i < data.usersList.length; i++) {
                let li = document.createElement('li');
                li.innerText = data.usersList[i].username;
                usersList.appendChild(li);
            }

            break;
    }
};