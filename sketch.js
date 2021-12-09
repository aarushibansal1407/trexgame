var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var score;
var gameOverImg, restartImg;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");     
}
//https://editor.p5js.org/aarushibansal1407/sketches/_DNBR4xYH
function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(750,980,1500,40);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.2;
  restart.scale = 0.3;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;

  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
}

function draw() {
  background(180);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    gameOver.visible = false;
    restart.visible = false;

    trex.changeAnimation("running", trex_running);
    
    ground.velocityX = -(4+3*score/100)
    
    score = score+Math.round(frameCount/60);

    if(ground.x<0){
      ground.x = ground.width/2;
    }

    if(keyDown("space")&&trex.y>=100){
      trex.velocityY = -12;
    }
    trex.velocityY = trex.velocityY+0.8

    spawnClouds();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
    }
  }
  else if(gameState===END){
    gameOver.visible = true;
    restart.visible = true;

    trex.changeAnimation("collided",trex_collided);

    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }
  trex.collide(invisibleGround);

  drawSprites();
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + score/100);
    
     var rand = Math.round(random(1,4));
     switch(rand) {
       case 1: obstacle.addImage(obstacle1);
               break;
       case 2: obstacle.addImage(obstacle2);
               break;
       case 3: obstacle.addImage(obstacle3);
               break;
       case 4: obstacle.addImage(obstacle4);
               break;
       default: break;
     }
     obstacle.scale = 0.5;
     obstacle.lifetime = 300;
    
     obstaclesGroup.add(obstacle);
  }
 }

 function spawnClouds() {
 if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
    cloud.lifetime = 200;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloudsGroup.add(cloud);
  }
}