var conn = new WebSocket('ws://localhost:8080');

function build(event, data) {
    return JSON.stringify({
        type: event,
        data: data
    });
};

//récupérer l'id de l'utilisateur qui ouvre la page ainsi que la Room ID qui se trouve dans l'URL
conn.onopen = function() {
    console.log("Connection established!");

    let currentUserId = document.getElementById('currentUserId').innerHTML;
    let roomId = document.getElementById('roomId').innerHTML;

   

    conn.send(build('joinroom', {
        uid: currentUserId,
        roomId: roomId,
    }))

};

conn.onmessage = function(e) {
    var data = JSON.parse(e.data);

    if (data.type === 'start-game') {
        console.log('START THE GAME!');
    }
    
    if (data.type === 'usersList') {
        console.log(data.data);
    }

};