var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var hostId ="";
hostId = urlParams.get('id')
var remotePeerIds=[],// You need this to link with specific DOM element
connections=[]; 

const peerIDDisplay = document.getElementById('peer-id');
const linkHost = document.getElementById('link');
const sendG = document.getElementById('sendGen');
const genreSelection = document.getElementById('div-genres');
genreSelection.style.visibility='hidden';
var gen = "";
var myId = "";
let peer;
peer = new Peer({debug: 3});
peer.on('open', id => {
    peerIDDisplay.textContent = 'Your ID: ' + id;
    var url1 = new URL(document.URL);
    url1.searchParams.append('id',id);
    linkHost.textContent = 'Host Link: ' + url1;
});

peer.on('connection', conn => connection(conn, false));

function connection(conn, byMe) {
remotePeerIds.push(conn.peer); 
genreSelection.style.visibility='visible';
const box = document.createElement('div');
box.className = 'boxed connection';
box.innerHTML = `<h3>Connection with ${conn.peer}</h3><p>Made by ${byMe ? 'me' : 'them'}</p>`;
const status = document.createElement('p');
box.appendChild(status);
const received = document.createElement('ul');
box.appendChild(received);
//const sender = document.createElement('input');
//sender.placeholder = 'Press enter to send';
//box.appendChild(sender);
document.body.appendChild(box);

conn.on('open', () => {
    status.innerHTML = `Open`;
    conn.on('data', data => {
    const li = document.createElement('li');
    li.className = 'their message';
    li.textContent = data;
    received.appendChild(li);
    });

    sendG.addEventListener('click', e => {
        // conn.send(sender.value);
        var ele = document.getElementsByName('Genre');   
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked)
                gen = ele[i].value + ","+ gen;
            }
        for(var i=0;i<connections.length;i++){
                //connections[i].send(sender.value);
                if(gen != "" && hostId != ""){
                    console.log(hostId);
                    connections[i].send(gen);
                }
            }
        const li = document.createElement('li');
        li.className = 'your message';
        li.textContent = gen;
        received.appendChild(li);
        gen = '';
    });
});

conn.on('close', () => {
    status.innerHTML = `<strong>Closed</strong>`;
    connections.splice(connections.indexOf(conn), 1);
});
connections.push(conn);

}

if(hostId != ""){
    const otherID = hostId;
    if (otherID) {
        connection(peer.connect(otherID), true);
    }

}



/* handleConnection(conn){
    remotePeerIds.push(conn.peer); // Add remote peer to list

    conn.on('open', function() {
        console.log("Connected with peer: "+remotePeerId);
        conn.on('data',function(data){
        // You can do whatever you want with the data from this connection - this is also the main part
        dataHandler(conn,data);
        });
        conn.on('error',function(){
        // handle error 
        connectionError(conn);
        });

        conn.on('close',function(){
        // Handle connection closed
        connectionClose(conn);
        });
        connections.push(conn);
    });
}*/
//CIAO 2