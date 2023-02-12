var cardHost = [];
class Card{
    constructor({
        imageUrl,
        onDismiss,
        onLike,
        onDislike,
        index
    }){
        this.imageUrl = imageUrl;
        this.onDismiss = onDismiss;
        this.onLike = onLike;
        this.onDislike = onDislike;
        this.#init();
        this.index = index;
    }

    //private properties
    #startPoint;
    #offsetX;
    #offsetY;
    currentX;
    currentY;
    touchOrMouse=0;

    //private methods
    #init = ()=>{
        const card = document.createElement('div');
        card.classList.add('card');
        const img = document.createElement('img');
        img.src = this.imageUrl;
        card.append(img);
        this.element = card;
        this.#listenToMouseEvents();
    }

    #listenToMouseEvents=()=>{
        //mousedown
        this.element.addEventListener('mousedown',(e)=>{
            const{clientX, clientY}=e;
            this.#startPoint = {x:clientX, y:clientY};
            // no transition when moving
            this.element.style.transition= '';
            document.addEventListener('mousemove', this.#handleMouseMove);
        });

        //mouseup
        document.addEventListener('mouseup', this.#handleMouseUp);

        //touchstart
        this.element.addEventListener('touchstart', (e)=>{
            this.#startPoint = {x:e.touches[0].clientX, y:e.touches[0].clientY};
            // no transition when moving
            this.element.style.transition= '';
            document.addEventListener('touchmove', this.#handleTouchMove);
        });

        //touchend
        document.addEventListener('touchend', this.#handleTouchEnd);

        //prevent drag
        this.element.addEventListener('dragstart', (e)=>{
            e.preventDefault();
        });
    }

    #handleMouseMove = (e) =>{

        if(!this.#startPoint) return;
        const {clientX, clientY} = e;
        this.#offsetX = clientX - this.#startPoint.x;
        this.#offsetY = clientY - this.#startPoint.y;

        const rotate = this.#offsetX * 0.1;

        this.element.style.transform = `translate(${this.#offsetX}px, ${this.#offsetY}px) rotate(${rotate}deg)`;

        //dismiss card when moving too far away
        if(Math.abs(this.#offsetX) > this.element.clientWidth * 0.7){
            const direction = this.#offsetX > 0?1:-1;
            this.touchOrMouse=0;
            this.#dismiss(direction);
        }
    }

    #handleMouseUp = (e) => {
        this.#startPoint = null;
        document.removeEventListener('mousemove', this.#handleMouseMove);
        //transition when move back
        this.element.style.transition = 'transform 0.5s';
        this.element.style.transform = '';
    }

    #handleTouchMove = (e) =>{

        e.preventDefault();
        e.stopPropagation();

        this.currentX = e.touches[0].clientX;
        this.currentY = e.touches[0].clientY;

        this.#offsetX = this.currentX - this.#startPoint.x;
        this.#offsetY = this.currentY - this.#startPoint.y;

        const rotate = this.#offsetX * 0.1;

        this.element.style.transform = `translate(${this.#offsetX}px, ${this.#offsetY}px) rotate(${rotate}deg)`;

        //dismiss card when moving too far away
        if(Math.abs(this.#offsetX) > this.element.clientWidth * 0.7){
            const direction = this.#offsetX > 0?1:-1;
            this.touchOrMouse=1;
            this.#dismiss(direction);
        }
    }

    #handleTouchEnd = (e) => {
        this.#startPoint = null;
        document.removeEventListener('touchmove', this.#handleTouchMove);
        //transition when move back
        this.element.style.transition = 'transform 0.5s';
        this.element.style.transform = '';
    }

    #dismiss = (direction) => {
        this.#startPoint = null;
        if(this.touchOrMouse === 0){
            document.removeEventListener('mouseup', this.#handleMouseUp);
            document.removeEventListener('mousemove', this.#handleMouseMove);
        }

        if(this.touchOrMouse === 1){
            document.removeEventListener('touchend', this.#handleTouchEnd);
            document.removeEventListener('touchmove', this.#handleTouchMove);
        }

        this.element.style.transition = 'transform 1s';
        this.element.style.transform = `translate(${direction * window.innerWidth}px, ${this.#offsetY}px) rotate(${90 * direction}deg)`;
        this.element.classList.add('dismissing');
        setTimeout(() => {
            this.element.remove();
        }, 1000);

        if(typeof this.onDismiss === 'function'){
            this.onDismiss();
        }

        if(typeof this.onLike === 'function' && direction === 1){
            this.onLike();
            console.log(this.index);
            
            if(host == 1){
                cardHost.push(this.index);
                checkMatch();
            }else{
                for(var i=0;i<connections.length;i++){
                //connections[i].send(sender.value);
                    connections[i].send(this.index);
                
                }
            } 
            
            
        }

        if(typeof this.onDislike === 'function' && direction === -1){
            this.onDislike();
        }
    }
}
