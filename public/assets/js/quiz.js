var conn = new WebSocket('ws://localhost:8080');

let roomId = document.getElementById('roomId').innerHTML;
let currentUserId = document.getElementById('currentUserId').innerHTML;
let currentUserSession = document.getElementById('currentUserSession').dataset.user;
    currentUserSession = JSON.parse(currentUserSession);
let usersList = document.getElementById('usersList');

function build(event, data) {
    return JSON.stringify({
        type: event,
        data: data
    });
};

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

        case 'showQuestions':
            let questionServerReturn = document.getElementById('question');
                questionServerReturn.textContent = data.data.question;
            break;

        case 'start-game':
            
            let numTour = document.getElementById('numTour');
            let currentPlayer = document.getElementById('currentPlayer');

            let divChoixDifficulte = document.getElementById('choixDifficulte');
            let divAffichage = document.getElementById('affichage');

            let choixDifficulte1 = document.getElementById('difficulty1');
            let choixDifficulte2 = document.getElementById('difficulty2');
            let choixDifficulte3 = document.getElementById('difficulty3');

            let question = document.getElementById('question');
            let difficulty = document.getElementById('difficulty');
            let trueAnswer = document.getElementById('trueAnswer');
            // 4 réponses possibles
            let divChoix = document.getElementById('choix');
            let reponse1 = document.getElementById('reponse1');
            let reponse2 = document.getElementById('reponse2');
            let reponse3 = document.getElementById('reponse3');
            let reponse4 = document.getElementById('reponse4');
            let reponse = document.getElementsByName('reponse');
            // Vrai ou faux
            let divVraiFaux = document.getElementById('vraiFaux');
            let btnFaux = document.getElementById('btnFaux');
            let btnVrai = document.getElementById('btnVrai');
            // Réponse ouverte
            let divRepOuverte = document.getElementById('repOuverte');
                // Côté Admin
            let divRepOuverteAdmin = document.getElementById('repOuverteAdmin');
            let player = document.getElementById('player');
            let reponseProposeeAdmin = document.getElementById('reponseProposeeAdmin');
            let btnReponseProposeeFaux = document.getElementById('reponseProposeeFaux');
            let btnReponseProposeeVrai = document.getElementById('reponseProposeeVrai');
                // Côté Joueur
            let inputReponseProposee = document.getElementById('reponseProposee');
            let divRepOuverteJoueur = document.getElementById('repOuverteJoueur');
            let btnReponseProposee = document.getElementById('btnReponseProposee');

            let i = 0;
            let ordre = 1;

            conn.send(build('showQuestions', {
                roomId: roomId,
                question: "Combien tu as de dents?",
                command: "showQuestions",
                response: "45 et demi",
                currentPlayer: data.allClients[0].username
            }))
            

            document.getElementById('mdj').innerText = data.allClients[0].username;

            let questions = document.getElementById('questions').dataset.questions;
            questions = JSON.parse(questions);
            console.log('START THE GAME!');

            document.getElementById('waiting').hidden = true;
            document.getElementById('game').hidden = false;

            let $usernames = data.allClients;
            let players = [];

            function getPlayers() {
                for (let i = 0; i < $usernames.length; i++) {
                    players.push({ "name": $usernames[i].username, "score": 0 });
                }
                return players;
            }
            console.log(getPlayers());

            let whoAmI = document.getElementById('whoAmI');
            numTour.innerHTML = 1;
            currentPlayer.innerHTML = `${players[0].name}`;
            divChoixDifficulte.style.display = 'block';
            divAffichage.style.display = 'none';
            divChoix.style.display = 'none';
            divVraiFaux.style.display = 'none';
            divRepOuverteAdmin.style.display = 'none';
            divRepOuverteJoueur.style.display = 'none';



            // ================== PARTIE ADMIN ================== //
            if (currentUserSession.username === data.allClients[0].username) {

                whoAmI.textContent = 'MAITRE DU JEU';

                console.log(questions);

            }
            // ================== PARTIE JOUEUR ================== //
            else {

                whoAmI.textContent = 'JOUEUR';
                
            }

            choixDifficulte1.addEventListener('click', () => { difficultyChoice('1');});
            choixDifficulte2.addEventListener('click', () => { difficultyChoice('2'); });
            choixDifficulte3.addEventListener('click', () => { difficultyChoice('3'); });

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
                console.log("Tableau des gagnants :");
                console.log(winners);
                return winners;
            }

            // Choix de la difficulté
            function difficultyChoice(level) {
                divChoixDifficulte.style.display = 'none';
                divAffichage.style.display = 'block';
                // On met dans un tableau les questions avec la difficulté choisie
                let selectedQuestions = [];
                for (let i = 0; i < questions.length; i++) {
                    if (questions[i].difficulty === level) {
                        selectedQuestions.push(questions[i]);
                    }
                }
                showQuestion(selectedQuestions);
            }

            // Affiche la question et ses réponses
            function showQuestion(tabQuestions) {
                const random = Math.floor(Math.random() * tabQuestions.length);
                question.innerHTML = `${tabQuestions[random].question}`;
                difficulty.innerHTML = `${tabQuestions[random].difficulty}`;
                trueAnswer.innerHTML = `${tabQuestions[random].correct}`;

                if (tabQuestions[random].answers.length > 2) {
                    divChoix.style.display = 'block';
                    divVraiFaux.style.display = 'none';
                    divRepOuverteJoueur.style.display = 'none';
                    reponse1.innerHTML = `${tabQuestions[random].answers[0]}`;
                    reponse2.innerHTML = `${tabQuestions[random].answers[1]}`;
                    reponse3.innerHTML = `${tabQuestions[random].answers[2]}`;
                    reponse4.innerHTML = `${tabQuestions[random].answers[3]}`;
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
            console.log('Joueurs connectés: ', data.countNow);
            console.log('Joueurs attendus: ', data.countRequired);
            console.log(data.usersList);
            console.log(data.test); 

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