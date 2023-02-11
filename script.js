//DOM
const swiper = document.querySelector('#swiper');
const like = document.querySelector('#like');
const dislike = document.querySelector('#dislike');

//constants
var urls = [];
//variables
let cardCount = 0;
var totCardurls =0;

//functions
function appendNewCard(){
    const card = new Card({
        imageUrl: urls[cardCount%totCardurls],
        onDismiss: appendNewCard,
        onLike:()=>{
            like.style.animationPlayState = 'running';
            //always trigger animation when toggling class
            like.classList.toggle('trigger');

        },
        onDislike:()=>{
            dislike.style.animationPlayState = 'running';
            //always trigger animation when toggling class
            dislike.classList.toggle('trigger');
        },
        index: cardCount
    });
    //card.element.style.setProperty('--i', cardCount % 3);
    swiper.append(card.element);
    cardCount++;

    const cards = swiper.querySelectorAll('.card:not(.dismissing');
    cards.forEach((card,index)=>{
        card.style.setProperty('--i', index);
    });
    
}

//first 3 cards
   

