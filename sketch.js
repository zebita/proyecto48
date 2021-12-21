var playerPc,playerPc2, player1img,player2img, database;
var position;
var suelo,arma,arma2,armaimg,arma2img,bulletimg;
var PcVida = 600;
var Pc2Vida = 600;
var Armas,Armas2;
var bullet2,bullet;
var estadodejuego = "serve";
var start,startimg;
var bulletsleft = 20;
var bulletsleft2 =20;
var bulletsleftimg,balasrestantes,balasrestantes2;
var vidasimg,vidas,vidas2;
var bulletsextrimg,bulletsextr;
var vidaextra, vidaextraimg,vidagrp;
var button1;
var bg1,bg2;
function preload(){
  startimg=loadImage("images/start.png");
  bulletimg=loadImage("images/bullet.png");
  bulletsextrimg=loadImage("images/bulletsextr.png");
  vidaextraimg=loadImage("images/vidaextra.png");
  bg2=loadImage("images/fondo.jpg");
  bulletsleftimg=loadImage("images/bulletsleft.png");
  vidasimg=loadImage("images/vidas.png");
  player1img=loadImage("images/player.png");
  player2img=loadImage("images/player 2.png");
}

function setup(){
  database = firebase.database();
  console.log(database);
  createCanvas(800,500);

  bulletsextr=createSprite(20,600);
  bulletsextr.visible=false;

  playerPc = createSprite(200,250,30,100);
  playerPc.addImage(player1img);
  playerPc.scale=0.3


  playerPc2 = createSprite(550,250,30,100);
  playerPc2.addImage(player2img);
  playerPc2.scale=0.3;

  suelo = createSprite(350,490,700,20)
  suelo,visible=false;

  Armas = new Group();
  Armas2 = new Group();
  vidagrp = new Group();

  start = createSprite(320,300,10,10);
  start.addImage(startimg)
  start.scale=0.2;

  vidas = createSprite(95,45,20,20)
  vidas.addImage(vidasimg);
  vidas.scale=0.1;

  vidas2 = createSprite(495,45,20,20)
  vidas2.addImage(vidasimg);
  vidas2.scale=0.1;

  balasrestantes = createSprite(95,75,20,20);
  balasrestantes.addImage(bulletsleftimg);
  balasrestantes.scale=0.1;

  balasrestantes2 = createSprite(495,75,20,20);
  balasrestantes2.addImage(bulletsleftimg);
  balasrestantes2.scale=0.1;

  //conectar players con la base de datos
  var playerPcPosition = database.ref('playerPc/Position');
  playerPcPosition.on("value", readPosition, showError);

  var playerPc2Position = database.ref('playerPc2/Position');
  playerPc2Position.on("value", readPosition2, showError);
}

function draw(){
  
    if(estadodejuego === "serve"){
      text("Reglas: ", 300,80);
      text("1. Cada Jugador tiene 600 de vida, si alguno de la vida de alguno de los 2 llega a 0, se acabara el juego.", 60,100)
      text("2. apareceran vidas extra en lugares random del mapa cada cierto tiempo, estas te regenaran 50 de vida.",60,120)
      text("3. cada bala quitara 20 de vida, pero si una de las balas toca al jugador contrario el resto de balas que esten en el mapa desapareceran",60,140)
      text("4.  ")

      playerPc.visible = false;
      playerPc2.visible = false;
      vidas.visible = false;
      balasrestantes.visible=false;
      vidas2.visible = false;
      balasrestantes2.visible=false;
      if(mousePressedOver(start)){
        estadodejuego = "play";
      }
    }

    if(estadodejuego === "play"){

      background(bg2);

      playerPc.visible = true;
      playerPc2.visible = true;
      start.visible = false;
      vidas.visible = true;
      balasrestantes.visible = true;
      vidas2.visible = true;
      balasrestantes2.visible = true;

    if(keyDown(LEFT_ARROW)){
      typePosition(-3,0);
    }
    else if(keyDown(RIGHT_ARROW)){
      typePosition(3,0);
    }
    else if(keyDown(UP_ARROW)){
      typePosition(0,-3);
    }
    else if(keyDown(DOWN_ARROW)){
      typePosition(0,+3);
    }

    if(keyDown('A')){
      writePosition(-3,0);
    }
    else if(keyDown('D')){
      writePosition(3,0);
    }
    else if(keyDown('W')){
      writePosition(0,-3);
    }
    else if(keyDown('S')){
      writePosition(0,+3);
    }

    if(Armas.isTouching(playerPc2)){
      Pc2Vida = Pc2Vida-20;
      Armas.destroyEach();
    }

    if(Armas2.isTouching(playerPc)){
      PcVida = PcVida-20;
      Armas2.destroyEach();
    }

    text(" : " + PcVida,105,50)

    text(" : " + Pc2Vida, 505,50)

    text("balas restantes player 1: " + bulletsleft,105,80);

    text("balas restantes player 2: " + bulletsleft2,505,80)

    if(PcVida < 400 || Pc2Vida < 400){
    spawnHp();
    }

    if(bulletsleft < 10 || bulletsleft2 < 10){
      spawnBullets();
    }

    if(Pc2Vida <= 0 || PcVida <= 0){
      text("Game ended",200,200);
    }
  }
  drawSprites();
}
//conexion con la base de datos para el movimiento de los players
function writePosition(x,y){
  database.ref('playerPc/Position').set({
    'x': position.x + x ,
    'y': position.y + y
  })
}

function typePosition(x,y){
  database.ref('playerPc2/Position').set({
    'x': position.x + x ,
    'y': position.y + y 
  })
}

function readPosition(data){
  position = data.val();
  playerPc.x = position.x;
  playerPc.y = position.y;
}

function readPosition2(data){
  position = data.val();
  playerPc2.x = position.x;
  playerPc2.y = position.y;
}

function showError(){
  console.log("Error in writing to the database");
}
//disparar las balas
function keyPressed(){
  if(keyDown('R') && bulletsleft2 >= 0){
    createBullet2();
    bulletsleft2 = bulletsleft2 -1;
  }

  if(keyDown('Space') && bulletsleft >= 0){
    createBullet();
    bulletsleft = bulletsleft -1;
  }
}
//crear las balas
function createBullet(){
  bullet = createSprite(100,100,20,20)
  bullet.x=playerPc.x;
  bullet.y=playerPc.y;
  bullet.velocityX=10;
  bullet.lifetime=100
  bullet.addImage(bulletimg)
  bullet.scale=0.1;
  Armas.add(bullet);
}

function createBullet2(){
  bullet2 = createSprite(100,100,20,20)
  bullet2.x=playerPc2.x;
  bullet2.y=playerPc2.y;
  bullet2.velocityX=-10;
  bullet2.lifetime=100
  bullet2.addImage(bulletimg)
  bullet2.scale=0.1;
  Armas2.add(bullet2);
}
// crear vidas extras 
function spawnHp(){
  if(frameCount%60===0){
  vidaextra = createSprite(300,200,20,20);
  vidaextra.addImage(vidaextraimg);
  vidaextra.scale=0.2;
  vidaextra.lifetime = 120;
  vidaextra.y=Math.round(random(50,350));
  vidaextra.x=Math.round(random(100,500));
  vidagrp.add(vidaextra)
  } 
  if (playerPc.isTouching(vidagrp)){
    PcVida = PcVida+50;
    vidaextra.destroy();
  }

  if (playerPc2.isTouching(vidagrp)){
    Pc2Vida = Pc2Vida+50;
    vidaextra.destroy()
  }
}
//crear balas extra
function spawnBullets(){
 if (frameCount%60===0){
   bulletsextr = createSprite(300,200,20,20);
   bulletsextr.addImage(bulletsextrimg);
   bulletsextr.scale=0.2;
   bulletsextr.lifetime=120;
   bulletsextr.y=Math.round(random(50,350));
   bulletsextr.x=Math.round(random(100,600));
 }
 if(playerPc.isTouching(bulletsextr)){
  bulletsleft = bulletsleft+10;
  bulletsextr.destroy();
}
if(playerPc2.isTouching(bulletsextr)){
  bulletsleft2 = bulletsleft2+10;
  bulletsextr.destroy();
}
}

