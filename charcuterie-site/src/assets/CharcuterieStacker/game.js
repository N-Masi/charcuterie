//Canvas for the background
const canvasBack  = document.getElementById('back');
const contextBack = canvasBack.getContext('2d');
canvasBack.width = 576;
canvasBack.height = 576;

//Placing in the Image
const backImage = new Image();
backImage.src = './gameAssets/vanWickleBackground.PNG'
backImage.onload = function(){
  contextBack.drawImage(backImage,0,0,backImage.width*.75,backImage.height*.75)
}

// Get the canvas context
const canvas = document.getElementById('gameArea');
const context = canvas.getContext('2d');
canvas.width = 576;
canvas.height = 576;

//Array to hold images in boardStack
var boardStack = [];

//Score variable
var score = 0

//Lost lives variable
var livesLost = 0

//Stores what part of the game we are in
var isGameActive = false
var isGameOver = false
var isTitle = true
var isCharSelect = false

//Grabbing the score and heart elements from the score div
var heart1 = document.getElementById('heart1');
var heart2 = document.getElementById('heart2');
var heart3 = document.getElementById('heart3');
var scoreText = document.getElementById('scoreText');
heart1.src = './gameAssets/transparent.png'
heart2.src = './gameAssets/transparent.png'
heart3.src = './gameAssets/transparent.png'

//loading in Nas and Nick sprites
var nasSprite = new Image();
nasSprite.src = './gameAssets/nasStanding.png'
var nickSprite = new Image();
nickSprite.src = './gameAssets/nickSprite.png'

// Determines which sprite is in play
var charImage = nasSprite

//Load the gameOverImage and restart Image
const gameOverImage = new Image();
gameOverImage.src = './gameAssets/gameOver.png'
const restartImage = new Image();
restartImage.src = './gameAssets/restart.png'

//Variables that store Mouse position
var mouseX = 0;
var mouseY = 0;

// Add an event listener to the canvas to track the position of the mouse
canvas.addEventListener('mousemove', function(e) {
    // Update the position of the mouse variables
    if (isGameActive){
      mouseX = e.clientX - canvas.offsetLeft;
      mouseY = e.clientY - canvas.offsetTop;
    }
  });


function loseHearts(){
  if (livesLost == 1){
    heart3.src = './gameAssets/transparent.png'
  }
  if (livesLost == 2){
    heart2.src = './gameAssets/transparent.png'
  }
  if (livesLost == 3){
    heart1.src = './gameAssets/transparent.png'
    stopGame()
  }
}

//Allows user to clear stack to add to their score
function submitBoard(){
  // Adds multiplier to score and rounds to 10th
  score = Math.round((score + boardStack.length + (boardStack.length*boardStack.length* .2)) * 10) / 10 
  boardStack = []
  char.topBox = canvas.height - (charImage.height *.125)
}

//Add an event listener to allow user to clear stack
document.addEventListener('keydown', function(event) {
  if (event.key === ' ' && isGameActive) {
    submitBoard();
  }
});


// Create a new sprite object
const char = {
  posx: 0,
  posy: 0,
  width: charImage.width*.125,
  height: charImage.height*.125,
  leftBox: 0,
  rightBox: charImage.width*.125,
  topBox: canvas.height - (charImage.height *.125)
};

//Limits that determine where the character can move
var heightLim = canvas.height - (.125*charImage.height)
var widthLim = canvas.width -(.125*charImage.width)

// Draw the sprite on the canvas
function drawChar() {


  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the sprite image
  context.drawImage(charImage, char.posx, heightLim, char.width, char.height);

  for (i = 0; i < boardStack.length; i ++){
    context.drawImage(boardStack[i],char.posx,boardStack[i].ypos)
  }
}

// Update the sprite position
function updateCharPosition() {
    if (mouseX < widthLim){
      char.posx = mouseX;
      char.leftBox = mouseX;
      char.rightBox = mouseX + char.width;
    }
}

// Loop that updates character position
function charLoop() {
  if (isGameActive){
    scoreText.innerHTML = "Score: " + score.toString();
    updateCharPosition();
    drawChar();
    requestAnimationFrame(charLoop);
  }
}

// Get the canvas context for the food items
const canvasItems = document.getElementById('gameObjects');
const contextItems = canvasItems.getContext('2d');
canvasItems.width = 576;
canvasItems.height = 576;


//Helper function to generate random numbers
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//Rendering all of the images for the food items
var imageList = ['./gameAssets/applesmaller.png','./gameAssets/breadsmaller.png','./gameAssets/cheesesmaller.png','./gameAssets/glizzySmall.png'];

//Array to hold images on the screen
var onScreen = [];

//Drop Speed for items and Spawn rate for new items
var dropSpeed = 2;
var spawnRate = 2000;

//updates dropSpeed and spawnRate
function updateDifficulty(){
  if(spawnRate > 400){
    spawnRate = 2000 - Math.floor((score/10))*200
  }
  dropSpeed = 2 + Math.floor((score/10)) * .2
}

//variable that keeps track of time to for item spawn rate
var lastSpawnTime = Date.now()

// //Function to spawn a random image above the screen
function spawnItems(){
  var timeNow = Date.now()
  if (timeNow > lastSpawnTime + spawnRate){
    lastSpawnTime = timeNow
    var image = new Image();
    image.src = imageList[getRandomInt(imageList.length)];
    const promise = new Promise((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = reject;
    });
    promise.then(() => {
      image.topBox = -1 *image.height;
      image.botBox = 0
      image.xpos = getRandomInt(canvasItems.width - image.width)
      image.leftBox = image.xpos
      image.rightBox = image.xpos + image.width
      image.ypos = -1* image.height; // Draw the image above the canvas
      onScreen.push(image);
    });
  }
}


//Detects whether an item hits the character hitbox
function collisionDetect(item){
  if (item.botBox > char.topBox -2 && char.topBox +5 > item.botBox ){
    if(item.leftBox >= char.leftBox && char.rightBox >= item.leftBox){
      return true
    }
    else if (item.rightBox >= char.leftBox && char.rightBox >= item.rightBox){
      return true
    }
    else if (char.leftBox >= item.leftBox && item. rightBox >= char.leftBox){
      return true
    }
    else if (char.rightBox >= item.leftBox && item.rightBox >= char.rightBox){
      return true
    }
    else{
      return false
    }
  }
  else{
    return false
  }
}

//Checks if an image has gone offscreen, updates position, draws images and clears screen
function updateItems(){
  contextItems.clearRect(0,0,canvasItems.width,canvasItems.height)
  for (let i = 0; i < onScreen.length; i++){
    if (collisionDetect(onScreen[i])){
      onScreen[i].ypos = char.topBox - onScreen[i].height
      boardStack.push(onScreen[i]);
      char.topBox -= onScreen[i].height
      onScreen.splice(i,1);
    }
    else if (onScreen[i].botBox > canvasItems.height){
      livesLost += 1
      loseHearts()
      onScreen.splice(i,1)
    }
    try{
      onScreen[i].ypos += dropSpeed;
    onScreen[i].topBox += dropSpeed;
    onScreen[i].botBox += dropSpeed;
    contextItems.drawImage(onScreen[i],onScreen[i].xpos,onScreen[i].ypos)
    }catch (exceptionVar){
      console.log('This is an error that i dont understand but this try catch fixes it somehow')
      console.log(onScreen)
    }
  }
}

//function to check if board is full and reset
function boardFull(){
  if (char.topBox < 100){
    submitBoard()
  }
}


// Loop that updates Item positions
function itemLoop() {
  if (isGameActive){
    updateDifficulty()
    spawnItems()
    updateItems()
    boardFull()
    contextItems.shadowColor = "blue"
    contextItems.shadowBlur = 20;
    requestAnimationFrame(itemLoop);
  }
}

// Canvas context for gameOver screen
const canvasGameOver = document.getElementById('gameOver');
const contextGameOver = canvasGameOver.getContext('2d');
canvasGameOver.width = 576;
canvasGameOver.height = 576;

function startGame(){
  canvasGameOver.style.zIndex = "1";
  canvasTitle.style.zIndex = "0";
  canvasBack.style.zIndex = "3";
  canvasCharSelect.style.zIndex = '2'
  heart1.src = './gameAssets/heart.png'
  heart2.src = './gameAssets/heart.png'
  heart3.src = './gameAssets/heart.png'
  isGameActive = true;
  isGameOver = false;
  isTitle = false;
  isCharSelect = false;
  onScreen = []
  boardStack = []
  score = 0
  livesLost = 0
  dropSpeed = 2
  spawnRate = 2000
  char.topBox = canvas.height - (charImage.height *.125)
  // Start the character loop
  charLoop();
  // Start the item loop
  itemLoop();
  //Makes items spawn offscreen at spawnRate
}

//Stops all of the animations that make the game run
function stopGame(){
  isGameActive = false
  isGameOver = true
  isTitle = false
  isCharSelect = false
  canvasGameOver.style.zIndex = "6";
  canvasTitle.style.zIndex = "0";
  canvasCharSelect.style.zIndex = '2'
  contextGameOver.drawImage(gameOverImage,(canvasGameOver.width -gameOverImage.width)/2,canvasGameOver.height/3)
  contextGameOver.drawImage(restartImage,(canvasGameOver.width -restartImage.width)/2,canvasGameOver.height/1.9)
}

//resets canvases and booleans to title screen
function backtoTitle() {
  isTitle = true
  isGameActive = false
  isGameOver = false
  isCharSelect = false
  canvasGameOver.style.zIndex = "1";
  canvasTitle.style.zIndex = "6";
  canvasCharSelect.style.zIndex = '2'
}


//boolean to store whether the restart button can be clicked
var mouseOverRestart = false

//Eventhandler that checks whether you are hovering over the restart button
canvasGameOver.addEventListener("mousemove", function(event) {
  if(isGameOver){
    mouseX = event.clientX - canvasGameOver.offsetLeft;
  mouseY = event.clientY - canvasGameOver.offsetTop;
  if (mouseX >= ((canvas.width -restartImage.width)/2) && mouseX <= ((canvas.width -restartImage.width)/2 + restartImage.width) 
  && mouseY >= canvas.height/1.9 && mouseY <= canvas.height/1.9 + restartImage.height){
    restartImage.src = './gameAssets/restartHover.png'
    restartImage.onload = function(){
      contextGameOver.clearRect(0, 0, canvasGameOver.width, canvasGameOver.height);
      contextGameOver.drawImage(gameOverImage,(canvas.width -gameOverImage.width)/2,canvas.height/3)
      contextGameOver.drawImage(restartImage,(canvas.width -restartImage.width)/2,canvas.height/1.9)
    }
    mouseOverRestart = true
  }
  else{
    restartImage.src = './gameAssets/restart.png'
    restartImage.onload = function(){
      contextGameOver.clearRect(0, 0, canvasGameOver.width, canvasGameOver.height);
      contextGameOver.drawImage(gameOverImage,(canvas.width -gameOverImage.width)/2,canvas.height/3)
      contextGameOver.drawImage(restartImage,(canvas.width -restartImage.width)/2,canvas.height/1.9)
    }
    mouseOverRestart = false
  }
  }
});

//Eventhandler that checks whether you are hovering over the startGame button
canvasGameOver.addEventListener("click", function(event) {
  event.preventDefault()
  console.log('work')
  
  if (isGameOver && mouseOverRestart){
    backtoTitle();
}
else{console.log('this is annoying')}
});

//Canvas for titlescreen
const canvasTitle = document.getElementById('titleScreen');
const contextTitle = canvasTitle.getContext('2d');
canvasTitle.width = 576;
canvasTitle.height = 576;

//Loading background image for title screen
titleImage = new Image();
titleImage.src = './gameAssets/titleScreenOpaque.png'
titleImage.onload = function() {
  contextTitle.drawImage(titleImage,0,0)
}

//loading logo for title screen
logoImage = new Image();
logoImage.src = './gameAssets/charcuterieLogoPixel.png'
logoImage.onload = function() {
  contextTitle.drawImage(logoImage,(canvas.width -logoImage.width*.75)/2,canvas.height/3.59,logoImage.width*.75,logoImage.height*.75)
}

//loading startgame button image
startGameImage = new Image();
startGameImage.src = './gameAssets/startGame.png'
startGameImage.onload = function() {
  contextTitle.drawImage(startGameImage,(canvas.width -startGameImage.width)/2,canvas.height/1.25)
}

//Boolean to see if mouse is hovering over button
var mouseOverStart = false

//Eventhandler that checks whether you are hovering over the startGame button
canvasTitle.addEventListener("mousemove", function(event) {
  if (isTitle){
  mouseX = event.clientX - canvasTitle.offsetLeft;
  mouseY = event.clientY - canvasTitle.offsetTop;
  console.log('bruh')
  if (mouseX >= ((canvas.width -startGameImage.width)/2) && mouseX <= ((canvas.width -startGameImage.width)/2 + startGameImage.width) 
  && mouseY >= canvas.height/1.25 && mouseY <= canvas.height/1.25 + startGameImage.height){
    startGameImage.src = './gameAssets/startGameHover.png'
    startGameImage.onload = function(){
      contextTitle.clearRect(0, 0, canvasGameOver.width, canvasGameOver.height);
      contextTitle.drawImage(titleImage,0,0)
      contextTitle.drawImage(logoImage,(canvas.width -logoImage.width*.75)/2,canvas.height/3.59,logoImage.width*.75,logoImage.height*.75)
      contextTitle.drawImage(startGameImage,(canvas.width -startGameImage.width)/2,canvas.height/1.25)
    }
    mouseOverStart = true
  }
  else{
    startGameImage.src = './gameAssets/startGame.png'
    startGameImage.onload = function(){
      contextTitle.clearRect(0, 0, canvasGameOver.width, canvasGameOver.height);
      contextTitle.drawImage(titleImage,0,0)
      contextTitle.drawImage(logoImage,(canvas.width -logoImage.width*.75)/2,canvas.height/3.59,logoImage.width*.75,logoImage.height*.75)
      contextTitle.drawImage(startGameImage,(canvas.width -startGameImage.width)/2,canvas.height/1.25)
    }
    mouseOverStart = false
  }
  }
});

//Eventhandler that checks whether you are hovering over the startGame button
canvasTitle.addEventListener("click", function(event) {
  event.preventDefault()
  console.log('work')
  
  if (isTitle && mouseOverStart){
    gotoCharacterSelect()
}
else{console.log('this is annoying')}
});

canvasCharSelect = document.getElementById("characterSelect")
contextCharSelect = canvasCharSelect.getContext('2d')
canvasCharSelect.width = 576;
canvasCharSelect.height = 576;



//A bunch of images being loaded for the character select screen
charSelectScreen = new Image()
charSelectScreen.src = './gameAssets/charSelectScreen.png'
charSelectScreen.onload = function() {
  contextCharSelect.drawImage(charSelectScreen,0,0)
}

transparent = new Image()
transparent.src = './gameAssets/transparent.png'
charSelected = transparent
charSelected.onload =function() {
  contextCharSelect.drawImage(charSelected,340,150,charSelected.width*.175,charSelected.height*.175)
}

charSelect = new Image()
charSelect.src = './gameAssets/charSelect.png'
charSelect.onload = function() {
  contextCharSelect.drawImage(charSelect,(canvas.width -charSelect.width)/2,10)
}

nametagNas = new Image()
nametagNas.src = './gameAssets/nametagNas.png'
nametagNas.onload = function() {
  contextCharSelect.drawImage(nametagNas,20,200)
}

nametagNick = new Image()
nametagNick.src = './gameAssets/nametagNick.png'
nametagNick.onload = function() {
  contextCharSelect.drawImage(nametagNick,20,300)
}

//resets booleans and canvases to go to character select screen
function gotoCharacterSelect () {
  canvasGameOver.style.zIndex = "1";
  canvasTitle.style.zIndex = "0";
  canvasCharSelect.style.zIndex = '6'
  isTitle = false
  isCharSelect = true
  isGameActive = false
  isGameOver = false
}

//variables to store which character you are about to click
var isOverNas = false
var isOverNick = false

//Eventhandler that checks what character you are hovering over and updates images to account
canvasCharSelect.addEventListener("mousemove", function(event) {
  if (isCharSelect){
  mouseX = event.clientX - canvasTitle.offsetLeft;
  mouseY = event.clientY - canvasTitle.offsetTop;
    if (mouseX >= (20) && mouseX <= (20 + nametagNas.width) 
    && mouseY >= 200 && mouseY <= 200 + nametagNas.height){
      nametagNas.src = './gameAssets/nametagNasHover.png'
      charSelected = nasSprite
      nametagNas.onload = function(){
        contextCharSelect.clearRect(0, 0, canvas.width, canvas.height);
        contextCharSelect.drawImage(charSelectScreen,0,0)
        contextCharSelect.drawImage(charSelected,340,150,charSelected.width*.175,charSelected.height*.175)
        contextCharSelect.drawImage(charSelect,(canvas.width -charSelect.width)/2,10)
        contextCharSelect.drawImage(nametagNas,20,200)
        contextCharSelect.drawImage(nametagNick,20,300)
      }
      isOverNas = true
    }
    else if(mouseX >= (20) && mouseX <= (20 + nametagNick.width) 
    && mouseY >= 300 && mouseY <= 300 + nametagNick.height){
      nametagNick.src = './gameAssets/nametagNickHover.png'
      charSelected = nickSprite
      nametagNick.onload = function(){
        contextCharSelect.clearRect(0, 0, canvas.width, canvas.height);
        contextCharSelect.drawImage(charSelectScreen,0,0)
        contextCharSelect.drawImage(charSelected,340,150,charSelected.width*.175,charSelected.height*.175)
        contextCharSelect.drawImage(charSelect,(canvas.width -charSelect.width)/2,10)
        contextCharSelect.drawImage(nametagNas,20,200)
        contextCharSelect.drawImage(nametagNick,20,300)
    }
    isOverNick = true
  }
    else{
      nametagNas.src = './gameAssets/nametagNas.png'
      nametagNick.src = './gameAssets/nametagNick.png'
      charSelected = transparent
      nametagNas.onload = function(){
        contextCharSelect.clearRect(0, 0, canvas.width, canvas.height);
        contextCharSelect.drawImage(charSelectScreen,0,0)
        contextCharSelect.drawImage(charSelected,340,150,charSelected.width*.175,charSelected.height*.175)
        contextCharSelect.drawImage(charSelect,(canvas.width -charSelect.width)/2,10)
        contextCharSelect.drawImage(nametagNas,20,200)
        contextCharSelect.drawImage(nametagNick,20,300)
      }
      isOverNas = false
      isOverNick = false
    }
  }
});

//handler for when you select a character to start the game
canvasCharSelect.addEventListener("click", function(event) {
  event.preventDefault()
  
  if (isCharSelect && isOverNas){
    charImage = nasSprite
    startGame()
}
  else if( isCharSelect && isOverNick){
    charImage = nickSprite
    startGame()
  }
});