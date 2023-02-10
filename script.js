//DOM
const swiper = document.querySelector('#swiper');

//constants
var urls = [];
//variables
let cardCount = 0;

//functions
function appendNewCard(){
    const card = new Card({
        imageUrl: urls[cardCount%5],
        onDismiss: appendNewCard
    });
    //card.element.style.setProperty('--i', cardCount % 3);
    swiper.append(card.element);
    cardCount++;

    const cards = swiper.querySelectorAll('.card:not(.dismissing');
    cards.forEach((card,index)=>{
        card.style.setProperty('--i', index);
    });
    console.log(urls);
}

//first 3 cards
   

