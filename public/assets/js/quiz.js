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
        username: currentUserSession.username
    }))
};

conn.onclose = function() {

    let left = document.getElementById('left');
        left.textContent = "PLAYER" + currentUserSession.username;

    
}

//En fonction de ce que l'on recoit du server, 
//on éffectue l'action du IF

conn.onmessage = function(e) {
    var data = JSON.parse(e.data);

    switch (data.type) {
        case 'start-game':
            let questions = document.getElementById('questions').dataset.questions;
            questions = JSON.parse(questions);
            console.log('START THE GAME!');
            break;
        
        case 'usersList':
            console.log('Joueurs connectés: ', data.countNow);
            console.log('Joueurs attendus: ', data.countRequired);
            console.log(data.usersList);
            console.log(data.test); 
            console.log(data.clients);

            document.getElementById('countNow').textContent = data.countNow;
            document.getElementById('countRequired').textContent = data.countRequired;


            //Actualisation de la liste des utilisateurs grâce au tableau data.usersList
            usersList.innerHTML = "";

            for (let i = 0; i < data.usersList.length; i++) {
                let li = document.createElement('li');
                li.innerText = data.usersList[i];
                usersList.appendChild(li);
            }
            break;

    }
};