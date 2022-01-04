var conn = new WebSocket('ws://localhost:8080');

function build(event, data)
{
    return JSON.stringify({
        type: event,
        data: data

    })
};

conn.onopen = function() {
    console.log("Connection established!");
    conn.send(build('joinroom', {
        uid: 42,
        roomId: 2929,
    }))
};

conn.onmessage = function(e) {
    var data = JSON.parse(e.data);

    if (data.type === 'start-game') {
        console.log('START THE GAME!');
    }
   
};