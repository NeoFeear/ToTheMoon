var conn = new WebSocket('ws://localhost:8080');


function build(event, data) {
    return JSON.stringify({
        type: event,
        data: data
    });
};

//récupérer l'id de l'utilisateur qui ouvre la page ainsi que la Room ID qui se trouve dans l'URL
conn.onopen = function() {
    let roomId = document.getElementById('roomId').innerHTML;
    let currentUserId = document.getElementById('currentUserId').innerHTML;
    let currentUserSession = document.getElementById('currentUserSession').dataset.user;
        currentUserSession = JSON.parse(currentUserSession);
    
    console.log("Connection à la room " + roomId);

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

    if (data.type === 'start-game') {
        let questions = document.getElementById('questions').dataset.questions;
        questions = JSON.parse(questions);



        console.log('START THE GAME!');
        
    }
    
    if (data.type === 'usersList') {

        console.log('Oui on est dans Userlist');
        console.log(data.usersList);
    }

};