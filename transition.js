document.addEventListener('DOMContentLoaded', ()=>{
const screenWidth = window.outerWidth;
const screenHeight = window.outerHeight;
const btnTransition = document.querySelector('#transition');
const game = document.querySelector('#game');
const about = document.querySelector('#about');
const grid = document.querySelector('#grid-transition');
let items;
var isGame =true;
const colors = [
    '#f6b93b',
    '#e55039',
    '#4a69bd',
    '#78e08f',
    '#b71540',
    '#0c2461',
    '#079992',
    '#f8c291',
    '#fa983a',
    '#b8e994'
]

//Creer une grille
function createGrid(){
    itemsInRow = Math.trunc(screenWidth/20)+1;
    itemsInColumn = Math.trunc(screenHeight/20)+1;
    console.log(itemsInColumn + ' -  ' + itemsInRow)

     for(i=0; i<itemsInRow*itemsInColumn; i++){
        let div = document.createElement("div");
        grid.appendChild(div);
    }
    
        items = Array.from(document.querySelectorAll('#grid-transition div'));
        
        
        items.forEach(item => {
            item.classList.add('items')
            item.style.backgroundColor = colors[Math.floor(Math.random()* colors.length)]  
        });

        

        
   
    
}

createGrid();

 function executeTransition(){
    
    var time = 1; 
    items.forEach(item => {
        setTimeout(()=>{
        item.style.opacity = 1;
        }, time)
        time +=1;  
    });
    setTimeout(()=>{
        if(isGame){
            game.style.display= "none";
            about.style.display="block";
            isGame = !isGame;
            btnTransition.innerHTML = " Retourner au jeu ";
        } else{
            game.style.display = "block";
            about.style.display = "none";
            isGame = !isGame;
            btnTransition.innerHTML = " A propos ";
        }
    }, (itemsInColumn*itemsInRow))
    
    

    items.forEach(item => {
        setTimeout(()=>{
        item.style.opacity = 0;
        }, time)
        time +=1;
        
    });
    setTimeout(()=>{
        grid.style.zIndex = -5;
        
    }, time+1)

    
    
}


 btnTransition.addEventListener('click',()=> {
   
    grid.style.zIndex = 6;
    executeTransition();
    
    
})



})