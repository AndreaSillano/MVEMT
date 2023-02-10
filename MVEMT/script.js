//DOM
const swiper = document.querySelector('#swiper');

//constants
const urls = [
    'bcs.jpg',
    'bcs2.jpg',
    'The-Last-of-Us-Ellie.jpg'
];

//variables
let cardCount = 0;

//functions
function appendNewCard(){
    const card = new Card({
        imageUrl: urls[cardCount % 3],
        onDismiss: appendNewCard
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
for(let i=0; i<3; i++){
    appendNewCard();
}