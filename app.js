document.addEventListener('DOMContentLoaded', ()=>{
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div')); 
    const ScoreDisplay = document.querySelector('#score');
    const BestScoreDisplay = document.querySelector('#best-score');
    const LevelDisplay = document.querySelector('#level');
    const StartBtn = document.querySelector('#start-button')
    const RestartBtn = document.querySelector('#restart-button');
    const BreakLineAudio = document.querySelector('#break-line');
    const LevelUpAudio = document.querySelector('#lvl-up');
    const GameOverAudio = document.querySelector('#game-over');
    const width=10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    let bestScore = localStorage.getItem("bestScore");
    let speed=600;
    let level=1;

    //DisplatBestScore
    if(bestScore != null){
        BestScoreDisplay.innerHTML = bestScore;
    } else {
        BestScoreDisplay.innerHTML = 0;
    }
    

    let colors = [
        '#f6b93b',
        '#e55039',
        '#4a69bd',
        '#78e08f',
        '#b71540'
        
    ]

    const lvl3Colors = [
        '#0c2461',
        '#079992'
    ]

    const lvl5Colors = [
        '#f8c291',
        '#fa983a',
        '#b8e994'
    ]
    
    //Tetrominos
    const lTetromino = [
        [1, width+1, width*2+1, 2], 
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const lReverseTetromino = [
        [1, width+2, width*2+2, 2],
        [width, width+1, width+2, width*2],
        [1, width+1, width*2+1, width*2+2],
        [width+2, width*2, width*2+1, width*2+2]
    ]

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ]

    const zReverseTetromino = [
        [1,width,width+1,width*2],
        [width, width+1,width*2+1,width*2+2],
        [1,width,width+1,width*2],
        [width, width+1,width*2+1,width*2+2]
    ]  
    
      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ]
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ]
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ]

      const xTetromino = [
          [1, width, width+1, width+2, width*2+1],
          [1, width, width+1, width+2, width*2+1],
          [1, width, width+1, width+2, width*2+1],
          [1, width, width+1, width+2, width*2+1]
      ]
      
      const oneTetromino = [
          [1],
          [1],
          [1],
          [1]
      ]

      const dobleTetromino = [
          [0,1],
          [1,width+1],
          [0,1],
          [1,width+1]
      ]


        //let theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
        let theTetrominoes = [tTetromino];

      let currentPosition = 4;
      let currentRotation =0;

      //randomly select a Tetromino and its first rotation
      let random =Math.floor(Math.random()*theTetrominoes.length);
      let current = theTetrominoes[random][currentRotation];

      //draw the  tetromino

      function draw(){
         current.forEach(index => {
             squares[currentPosition + index].classList.add('tetromino');
             squares[currentPosition + index].style.backgroundColor = colors[random];
         }) 
      }

      function undraw(){
          current.forEach(index =>{
              squares[currentPosition + index].classList.remove('tetromino');
              squares[currentPosition + index].style.backgroundColor = '';
          })
      }

      

      

      //assign functions to ketCodes
      function control(e){
          if(e.keyCode === 37){
              moveLeft();
          }else if(e.keyCode ===38){
            rotate();
          }else if(e.keyCode === 39){
            moveRight();
          }else if(e.keyCode === 40){
            moveDown();
          }
      }

      


      //move down function
      function moveDown(){
          undraw();
          currentPosition += width;
          draw();
          freeze();
      }

      //freeze funcion
      function freeze(){
          if(current.some(index =>squares[currentPosition + index + width].classList.contains('taken'))){
              
              current.forEach(index => squares[currentPosition+index].classList.add('taken'));
              //start a new tetromino falling
              random = nextRandom;
              nextRandom = Math.floor(Math.random()*theTetrominoes.length);
              current = theTetrominoes[random][currentRotation]
              currentPosition = 4;
              //draw();
              displayShape();
              addScore();
              draw();
              gameOver();
            
          }
      }

      //move the tetromino left, unless is at the edge ir there is a blockage
      function moveLeft(){
          undraw();
          const isAtLeftEdge = current.some(index => (currentPosition + index) % width ===0)
          if(!isAtLeftEdge) currentPosition-=1

          if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
              currentPosition+=1;
          }

          draw();
      }

      //move the tetromino right, unless is at the edge ir there is a blockage
      function moveRight(){
          undraw();
          const isAtRightEdge = current.some(index => (currentPosition+index)%width === width-1);
          if(!isAtRightEdge) currentPosition +=1;
          if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
              currentPosition-=1;
          }

          draw();
      }


      //rotate the tetromino
      function rotate(){
          undraw();
          const isAtRightEdge = current.some(index => (currentPosition+index)%width === width-1);
          const isAtLeftEdge = current.some(index => (currentPosition + index) % width ===0);
          currentRotation++;
          if(currentRotation === current.length){
              currentRotation=0;
          }

          current = theTetrominoes[random][currentRotation];
          if(isAtLeftEdge && current.some(index => (currentPosition+index)%width === width-1)){
            currentPosition+=1
          }

          if(isAtRightEdge && current.some(index => (currentPosition + index) % width ===0)){
              currentPosition-=1;
          }
          draw();
      }

      //show up-next tetromino in mini-grid display
      const displaySquares = document.querySelectorAll('.mini-grid div');
      const displayWidth = 4;
      let displayIndex = 0;
      

      //The tetromino without rotation
      let upNextTetrominoes = [
          [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
          [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
          [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
          [0, 1, displayWidth, displayWidth+1], //oTetromino
          [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
      ]

      const lvl3UpNextTetromino = [
        [1, displayWidth+2, displayWidth*2+2, 2], //lReverseTetromino
        [1,displayWidth,displayWidth+1,displayWidth*2] // zReverseTetromino
      ]

      const lvl5UpNextTetromino = [
          [1, displayWidth, displayWidth+1, displayWidth+2, displayWidth*2+1],
          [1],
          [0,1]
      ]

      //display the shape in the mini-grid display
      function displayShape(){
          displaySquares.forEach(square =>{
              square.classList.remove('tetromino')
              square.style.backgroundColor ='';
          })
          upNextTetrominoes[nextRandom].forEach( index => {
              displaySquares[displayIndex+ index].classList.add('tetromino');
              displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
          })
      }

      
      //add functionality to the play/pause button
      StartBtn.addEventListener('click', ()=>{
          displayBestScore();
        if(timerId) {
            clearInterval(timerId);
            timerId = null;
            document.removeEventListener("keyup", control);
        } else {
            document.addEventListener('keyup', control);
            draw();
            timerId = setInterval(moveDown, speed);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        }
      })

      //add functionality to the restart button
      RestartBtn.addEventListener('click', () => {
          window.location.reload();
      })

    // add score function
    function addScore(){
        for(let i=0; i<199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

            if(row.every(index => squares[index].classList.contains('taken'))){
                score+=10;
                BreakLineAudio.play();
                levelUp();
                ScoreDisplay.innerHTML = score;
                row.forEach(index =>{
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                })

                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
        
    }

    //game over function
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            ScoreDisplay.innerHTML= 'end';
            GameOverAudio.play();
            clearInterval(timerId);
            document.removeEventListener("keyup", control);
            saveBestScore();
        }
    }

    //BestScore storage function
    function saveBestScore(){
        if(localStorage.getItem('bestScore')!=null){
            bestScore = localStorage.getItem('bestScore');
            if(bestScore<score){
                localStorage.setItem('bestScore', score);
            }
        }else {
            localStorage.setItem('bestScore', score);
        }
    }

    //Display bestScore
    function displayBestScore(){
        if(localStorage.getItem('bestScore') != null){
            bestScore = localStorage.getItem('bestScore');
            BestScoreDisplay.innerHTML= bestScore;
        }
    }


    //Level function 
    function levelUp(){
        //level2 
        if(score === 50){
            LevelUpAudio.play();
            speed=450;
            level=2;
            LevelDisplay.innerHTML = level;
        }else if(score === 100){
            //level3
            LevelUpAudio.play();
            level=3;
            colors = colors.concat(lvl3Colors);
            theTetrominoes.push(lReverseTetromino, zReverseTetromino);
            upNextTetrominoes = upNextTetrominoes.concat(lvl3UpNextTetromino);
            LevelDisplay.innerHTML = level;
        }else if(score === 250){
            //level4
            LevelUpAudio.play();
            speed=300;
            level=4;
            LevelDisplay.innerHTML = level;
        }else if(score === 500){
            //level5
            LevelUpAudio.play();
            level=5;
            colors = colors.concat(lvl5Colors);
            theTetrominoes.push(xTetromino, oneTetromino, dobleTetromino);
            upNextTetrominoes=upNextTetrominoes.concat(lvl5UpNextTetromino);
            LevelDisplay.innerHTML = level;
        }
    }

})