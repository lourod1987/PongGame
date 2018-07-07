let canvas;
let canvasContext; 

let ballX = 50;
let ballSpeedX = 8;
let ballY = 50;
let ballSpeedY = 4;

let playerScore = 0;
let compScore = 0;
const winCondition = 5;
let winState = false;

let paddeLeftY = 250;
let paddeRightY = 250;
const paddleH = 80;
const paddleThickness = 15;



      
      function calculateMousePos(evt) {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        let mouseX = evt.clientX - rect.left - root.scrollLeft;
        let mouseY = evt.clientY - rect.top - root.scrollTop;
        return {
          x: mouseX,
          y: mouseY
        }
      }
      
      function clickHandler(evt) {
        if (winState) {
          playerScore = 0;
          compScore = 0;
          winState = false;
        }
      }
      
      window.onload = () => {
        canvas = document.getElementById("gameCanvas");
        canvasContext = canvas.getContext("2d");
        
        let framesPerSecond = 50;
        setInterval( () => {
          moveAll();
          drawEverything();
        }, 1000 / framesPerSecond);
        
        canvas.addEventListener('click', clickHandler);
        
        canvas.addEventListener('mousemove', (evt) => {
          let mousePos = calculateMousePos(evt);
          paddeLeftY = mousePos.y - (paddleH / 2);
        });
        
      }
      
      function ballReset() {
        
        canvasContext.fillStyle = '#fff';
        
        if (playerScore >= winCondition) {
          winState = true;
        }
        
        if (compScore >= winCondition) {
          winState = true;
        }
        
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        
        ballSpeedX = -ballSpeedX;
      }
      
      function computerAI() {
        let paddleRightCenter = paddeRightY + (paddleH / 2);
        
        if (paddleRightCenter < ballY - 30) {
          paddeRightY += 6;
        } else if (paddleRightCenter > ballY + 30){
          paddeRightY -= 6;
        }
      }
      
      function moveAll() {
        const playerScoreAudio = document.getElementById("playerScore-sound");
        const compScoreAudio = document.getElementById("compScore-sound");
        const ballPaddleBounce = document.getElementById("ballPaddleBounce");
        const ballWallBounce = document.getElementById("ballWallBounce");
        if (winState) {
          return;
        }
        
        computerAI();
        
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        //left paddle collision check
        if (ballX < 10) {
          if (ballY > paddeLeftY && ballY < paddeLeftY + paddleH) {
            ballPaddleBounce.play();
            ballSpeedX = -ballSpeedX;
            
            let deltaY = ballY - (paddeLeftY + paddleH / 2);
            ballSpeedY = deltaY * 0.4;
          }
        }
        
        //right paddle collision check
        if (ballX > 780) {
          if (ballY > paddeRightY && ballY < paddeRightY + paddleH) {
            ballPaddleBounce.play();
            ballSpeedX = -ballSpeedX;
            
            let deltaY = ballY - (paddeRightY + paddleH / 2);
            ballSpeedY = deltaY * 0.4;
          }
        }
        
        //reset if balls hits max X bounds
        if (ballX >= canvas.width) {
          playerScoreAudio.play();
          playerScore++;
          ballReset();
        }
        
        //reset if balls hits min X bounds
        if (ballX < 0) {
          compScoreAudio.play();
          compScore++;
          ballReset();
        }

        //bounce ball on top and bottom bounds
        if (ballY >= canvas.height) {
          ballWallBounce.play();
          ballSpeedY = -ballSpeedY;
        }
        
        if (ballY < 0) {
          ballWallBounce.play();
          ballSpeedY = -ballSpeedY;
        } 
        
      }
      
      function drawNet() {
        for (let i = 0; i < canvas.height; i += 30) {
          colorRect(canvas.width / 2 - 1, i, 2, 20, 'white')
        }
      }
      
      function drawEverything() {
        //BG
        colorRect(0, 0, canvas.width, canvas.height, 'black');
        
        if (winState) {
          canvasContext.fillStyle = '#fff';
        
          if (playerScore >= winCondition) {
            canvasContext.fillText(`You won with a score of ${playerScore} points!`, 320, 200);
            winState = true;
          }

          if (compScore >= winCondition) {
            canvasContext.fillText(`You lost! The computer scored ${compScore} points.`, 300, 200);
            winState = true;
          }
          
          canvasContext.fillStyle = '#fff';
          canvasContext.fillText("Click to Play Again!", 350, canvas.height / 2);
          return;
        }
        
        drawNet();
        
        //Ball
        colorCircle(ballX, ballY, 10, '#fff');
        
        //Left Paddle
        colorRect(10, paddeLeftY, paddleThickness, paddleH, '#fff');
        
        //Right Paddle
        colorRect(canvas.width - 25, paddeRightY, paddleThickness, paddleH, '#fff');
        
        //score
        canvasContext.fillText(playerScore, 100, 50);
        canvasContext.fillText(compScore, canvas.width - 100, 50);
      }
      
      function colorCircle(centerX, centerY, radius, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        canvasContext.fill();
      }
      
      function colorRect(leftX, topY, width, height, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.fillRect(leftX, topY, width, height);
      }