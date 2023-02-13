var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var hostId ="";
hostId = urlParams.get('id');
var remotePeerIds=[],// You need this to link with specific DOM element
connections=[]; 

const peerIDDisplay = document.getElementById('peer-id');
const linkHost = document.getElementById('link');
const sendG = document.getElementById('sendGen');
const genreSelection = document.getElementById('div-genres');
const swiper1 = document.getElementById('bd');
const like1 = document.getElementById('like');
const dislike1 = document.getElementById('dislike');
const cardMatch = document.getElementById("cardMatch");
const matchText = document.getElementById("matchText");
cardMatch.style.visibility = 'hidden';
swiper1.style.visibility='hidden';
genreSelection.style.visibility='hidden';
like1.style.visibility='hidden';
dislike1.style.visibility = 'hidden';
matchText.style.visibility = 'hidden';


var gen = "";
var myId = "";
let peer;
var host = 0;
var stato = 0; //stato = 0 => devo prendere i generi , stato = 1=>host fa query
var passed = 0;
var counter = 0; //counter connection answer

var generiTot = "";
var showSelection = 0;
peer = new Peer({debug: 3});

var userFav =[];
peer.on('open', id => {
    peerIDDisplay.textContent = 'Your ID: ' + id;
    var url1 = new URL(document.URL);
    url1.searchParams.append('id',id);
    linkHost.textContent = 'Host Link: ' + url1;
});

var movies;

peer.on('connection', conn => connection(conn, false));

function connection(conn, byMe) {

remotePeerIds.push(conn.peer); 


if(showSelection== 0){
    genreSelection.style.visibility= 'visible';
    showSelection = 1;
}
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
    console.log("STATO" +stato)
    if(stato==0 && host ==1){
        generiTot = generiTot +data; 
        counter++;   
        if(counter-1 == connections.length){
            stato = 1;
            stato = 2;
            movies = getMovies();
        }
            li.textContent = generiTot;
            received.appendChild(li);

            
    }else if(stato == 1 && host == 1){

    }
    else if(stato == 1 && host == 0){ // non sono host ricevo il vettore di dati per le figurine
        for(var i = 0; i<data.length; i++){
        //console.log("https://image.tmdb.org/t/p/w500/"+Data.results[i].poster_path);
        urls.push("https://image.tmdb.org/t/p/w500/"+data[i].poster_path);
          }
            swiper1.style.visibility='visible';
            like1.style.visibility='visible';
            dislike1.style.visibility = 'visible';
            
            totCardurls = data.length;
            for(let i=0; i<3; i++){
                appendNewCard();
            }
            stato =2;
    }else if(stato == 2 && host == 1){
        userFav.push(data);
        checkMatch();
        li.textContent = data;
        received.appendChild(li);

    }else if(stato == 2 && host == 0){
        fireworks();
        fadeSwiper();
        like1.style.visibility='hidden';
        dislike1.style.visibility = 'hidden';
       // swiper1.style.visibility='visible';
        setTimeout( function() {  showMatchresult(data);  }, 1000);


    }
        
});

    sendG.addEventListener('click', e => {
        // conn.send(sender.value);
        var ele = document.getElementsByName('Genre');   
            for(i = 0; i < ele.length; i++) {
                if(ele[i].checked){
                    if(i== 0){
                        gen = ele[i].value;
                    }else if(gen != null){
                        gen = gen+","+ele[i].value;
                    }
                }
                
            }
        for(var i=0;i<connections.length;i++){
                //connections[i].send(sender.value);
                if(gen != null && hostId != null){
                    connections[i].send(gen);
                }
            }

            genreSelection.style.visibility='hidden';

            if(stato==0 && host ==1){
                console.log(generiTot);
                generiTot = generiTot + gen;
                const li = document.createElement('li');
                li.className = 'your message';
                li.textContent = generiTot;
                received.appendChild(li);
                gen = '';
                if(counter == connections.length){
                    stato = 2;
                    movies = getMovies();
                    //stato = 2;
                }
                counter++;
               
            }else if(stato==0 && host ==0){
                 stato = 1;
            }
           
            //stato = 2;
        });
        
});

conn.on('close', () => {
    status.innerHTML = `<strong>Closed</strong>`;
    connections.splice(connections.indexOf(conn), 1);
});
connections.push(conn);

}

if(hostId != null){
    const otherID = hostId;
    if (otherID) {
        connection(peer.connect(otherID), true);
    }
    linkHost.style.visibility = "hidden";
}else{
    host = 1;
}
function fadeSwiper()
{
   
    var oppArray = ["0.9", "0.8", "0.7", "0.6", "0.5", "0.4", "0.3", "0.2", "0.1", "0"];
    var x = 0;
    (function next() {
        swiper1.style.opacity = oppArray[x];
        if(++x < oppArray.length) {
            setTimeout(next, 100); //depending on how fast you want to fade
        }
    })();
}

function getMovies(){
    //loadJSON("https://jsonplaceholder.typicode.com/posts", myData,'jsonp');
	/*(async () => {
      await get()
      console.log()
      // handle the tags result here
    })()*/

    const myArray = generiTot.split(",");
    var geners =myArray[1];
    for(var i = 2; i< myArray.length; i++){
        geners = geners +"2%C"+myArray[i]
    }
    console.log(geners);
    var url = "https://api.themoviedb.org/3/discover/movie?api_key=03504e692774bc37a2813d009ea907f8&language=en-US&page=5&with_genres="+geners;
    loadJSON(url, myData,'jsonp');



    /*
    let obj = await (await fetch(url)).json();
    //console.log(obj);
    console.log(obj);
    swiper1.style.visibility='visible';
    parsMovies(obj);
    return obj;
}*/
}

function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      }
      else {
        error(xhr);
      }
    }
  };
  xhr.open('GET', path, true);
  xhr.send();
}

function myData(Data){

  // Output only the details on the first post
  //console.log(Data.results[0]);
  for(var i = 0; i<Data.results.length; i++){
        //console.log("https://image.tmdb.org/t/p/w500/"+Data.results[i].poster_path);
        urls.push("https://image.tmdb.org/t/p/w500/"+Data.results[i].poster_path);
  }
    swiper1.style.visibility='visible';
    like1.style.visibility='visible';
    dislike1.style.visibility = 'visible';
    totCardurls = Data.results.length;
    for(let i=0; i<3; i++){
        appendNewCard();
    }
    for(var i=0;i<connections.length;i++){
            //connections[i].send(sender.value);
           connections[i].send(Data.results);
    }
    
  // output the details of first three posts
  
}
function fireworks(){
     var duration = 5 * 1000;
                        var animationEnd = Date.now() + duration;
                        var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                        function randomInRange(min, max) {
                          return Math.random() * (max - min) + min;
                        }

                        var interval = setInterval(function() {
                          var timeLeft = animationEnd - Date.now();

                          if (timeLeft <= 0) {
                            return clearInterval(interval);
                          }

                          var particleCount = 70 * (timeLeft / duration);
                          // since particles fall down, start a bit higher than random
                          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                        }, 250);
                                 
}
function checkMatch(){
    for(var j =0; j<cardHost.length; j++){
            if(userFav.includes(cardHost[j]) >= connections.length/2){ // metodi di selzione di maggiranza
                console.log("match");
                 //fireWorks
                fireworks();           
                fadeSwiper();  
                like1.style.visibility='hidden';
                dislike1.style.visibility = 'hidden'; 
                
                console.log(urls[cardHost[j]]) ;

                for(var i=0;i<connections.length;i++){
                    //connections[i].send(sender.value);
                    connections[i].send(j);
                    
                } 
                swiper1.remove("card");
                //appendMatchedCard(urls[cardHost[j]]);
 

                matchText.style.visibility = 'visible';
                setTimeout( function() {   cardMatch.style.visibility = 'visible';
                cardMatch.src = urls[cardHost[j]];; 
                matchText.style.visibility = 'hidden';
            }, 3000);

                break;
                //MATCH

            }
        }
}
function showMatchresult(data){
    matchText.style.visibility = 'visible';
    setTimeout( function() {   cardMatch.style.visibility = 'visible';
    cardMatch.src = urls[data]; 
    matchText.style.visibility = 'hidden';
}, 3000);
    
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