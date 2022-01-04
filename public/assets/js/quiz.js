var conn = new WebSocket('ws://localhost:8080');

function build(event, data) {
    return JSON.stringify({
        type: event,
        data: data
    });
};

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
};

//récupérer l'id de l'utilisateur qui ouvre la page ainsi que la Room ID qui se trouve dans l'URL
conn.onopen = function() {
    console.log("Connection established!");
    conn.send(build('joinroom', {
        uid: 18,
        roomId: '3x7f0b6s5v' ,
    }))
};

conn.onmessage = function(e) {
    var data = JSON.parse(e.data);

    switch(data.type) {
        case 'createroom':
            console.log('Room created!');
            break;

        case 'joinroom':
            if (data.data.success) {
                console.log("Joined room successfully");
            } else {
                console.log("Failed to join room");
            }
            break;

        case 'startgame':
            console.log("Starting game");
            break;

        case 'endgame':
            console.log("Game ended");
            break;
    }   
};