var conn = new WebSocket('ws://localhost:8080');

let roomId = document.getElementById('roomId').innerHTML;
let currentUserId = document.getElementById('currentUserId').innerHTML;
let currentUserSession = document.getElementById('currentUserSession').dataset.user;
    currentUserSession = JSON.parse(currentUserSession);

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
        username: currentUserSession.username
    }))
};

//En fonction de ce que l'on recoit du server, 
//on éffectue l'action du IF

conn.onmessage = function(e) {
    var data = JSON.parse(e.data);

    switch (data.type) {
        case 'start-game':
            let questions = document.getElementById('questions').dataset.questions;
            questions = JSON.parse(questions);
            console.log('START THE GAME!');

            document.getElementById('waiting').hidden = true;
            document.getElementById('game').hidden = false;

            break;
        
        case 'usersList':
            console.log('Oui on est dans Userlist', data.usersList);
            console.log('Joueurs connectés: ', data.countNow);
            console.log('Joueurs attendus: ', data.countRequired);

            let usersList = document.getElementById('usersList');
            document.getElementById('countNow').textContent = data.countNow;
            document.getElementById('countRequired').textContent = data.countRequired;

            usersList.innerHTML = "";
            for (let i = 0; i < data.usersList.length; i++) {
                let li = document.createElement('li');
                li.innerText = data.usersList[i];
                usersList.appendChild(li);
            }
            break;

    }
};