let grid = [];
let gridSize = 15;
let islands = [];
let agents = [];
let gates = [];

let futura;
let sourceRegular;
let sourceLight;
let sourceExtraLight;

let gui;
let ctrl;

let creatingIsland = false;
let creatingGate = false;

let logging = true;
let displayLogger = true;
let logger;

function Controls(){
  this.addLanguage = function(){
    let v = prompt("Start the language of the island with a vocabulary word");
    let newWord = new Word(v, floor(random(100000)));
    let i = new Island(islands.length, color(random(360), 100, 90), newWord);
    islands.push(i);
    let f = gui.addFolder("Language " + i.id);
    f.add(i, 'nextWord').listen();
    f.add(i, 'addWord');
    f.add(i, 'populate');
    f.open();
    creatingIsland = true;
  }
  this.addGate = function(){
    let g = new Gate();
    gates.push(g);
    creatingGate = true;
  }
}

function Gate(){
  this.points = [];
}

function GridItem(x_, y_, type_, gx_, gy_){
  //item's location on the canvas
  this.x = x_;
  this.y = y_;
  //item's location in grid array
  this.gridX = gx_;
  this.gridY = gy_;
  this.type = type_;
  this.currentAgent = false;
  this.gateTo;
}

function preload(){
  futura = loadFont('styles/Futura.ttf');
  sourceRegular = loadFont('styles/SourceSansPro-Regular.ttf');
  sourceLight = loadFont('styles/SourceSansPro-Light.ttf');
  sourceExtraLight = loadFont('styles/SourceSansPro-ExtraLight.ttf');
}

function setup(){
  createCanvas(15 * floor(window.innerWidth / 15), 15 * floor(window.innerHeight/15));
  colorMode(HSL);
  noStroke();

  logger = createDiv("");
  logger.id("logger");

  //initialize gui
  ctrl = new Controls();
  gui = new dat.GUI();
  gui.add(ctrl, 'addLanguage');
  gui.add(ctrl, 'addGate');

  //create grid
  for(let i = 0; i < width; i+=15){
    let col = [];
    for(let j = 0; j < height; j+=15){
      col.push(new GridItem(i, j, 'ocean', grid.length, col.length));
    }
    grid.push(col);
  }
}

function draw(){
  background(255);

  //draw islands
  for(let i of islands){
    for(let p of i.points){
      fill(i.color);
      rect(p.x, p.y, 15, 15);
    }
  }

  //draw cursor
  fill(90);
  rect(15 * floor(mouseX/15), 15 * floor(mouseY/15), 15, 15);

  //create new islands if in proper mode
  if(mouseIsPressed){
    if(creatingIsland && grid[floor(mouseX/15)] && grid[floor(mouseX/15)][floor(mouseY/15)]){
      //if we haven't added this point to the new island, add it
      if(!islands[islands.length - 1].points.includes(grid[floor(mouseX/15)][floor(mouseY/15)])){
        islands[islands.length - 1].points.push(grid[floor(mouseX/15)][floor(mouseY/15)]);
        //also change the type of the grid tile to the island's id
        grid[floor(mouseX/15)][floor(mouseY/15)].type = islands.length - 1;
      }
    }
  }

  for(let g of gates){
    stroke(80);
    if(g.points.length == 2){
      line(g.points[0].x + 7.5, g.points[0].y + 7.5, g.points[1].x + 7.5, g.points[1].y + 7.5);
    }
    noStroke();
    for(let p of g.points){
      fill(95);
      rect(p.x, p.y, 15, 15);
    }
  }

  //draw agents
  for(let agent of agents){
    agent.draw();
  }

  if(logging){
    fill(0);
    textStyle(NORMAL);
    textSize(48);
    textFont(futura);
    text("Remark.", 10, 45);
    textSize(18);
    fill(40);
    text("A Language Evolution Simulator", 225, 44);
    for(let i = 0; i < islands.length; i++){
      fill(islands[i].color);
      textSize(28);
      rect(14, 67 + (i * 70), 20, 53);
      fill(40);
      textStyle(NORMAL);
      textFont(sourceExtraLight);
      text("Language " + i, 39, 90 + (i * 70));
      textSize(18);
      textStyle(ITALIC);
      let vocabString = "";
      for(let j = 0; j < islands[i].vocabulary.length; j++){
        if(j > 0){
          vocabString += ", ";
        }
        vocabString += islands[i].vocabulary[j].content;
      }
      textFont(sourceLight);
      text(vocabString, 39, 115 + (i * 70));
    }
  }
}

function mousePressed(){
  if(creatingGate){
    let currentGate = gates[gates.length - 1];
    switch(currentGate.points.length){
      case 0:
        currentGate.points.push(grid[floor(mouseX/15)][floor(mouseY/15)]);
        grid[floor(mouseX/15)][floor(mouseY/15)].type = 'gate';
        break;
      case 1:
        currentGate.points.push(grid[floor(mouseX/15)][floor(mouseY/15)]);
        grid[floor(mouseX/15)][floor(mouseY/15)].type = 'gate';

        let aX = currentGate.points[0].gridX;
        let aY = currentGate.points[0].gridY;
        let bX = currentGate.points[1].gridX;
        let bY = currentGate.points[1].gridY;

        grid[aX][aY].gateTo = grid[bX][bY];
        grid[bX][bY].gateTo = grid[aX][aY];

        creatingGate = false;
        break;
    }
  }
}

function mouseReleased(){
  if(creatingIsland){
    console.log(islands[islands.length-1]);
    //populate island with agents
    // islands[islands.length - 1].populate(floor(random(islands[islands.length-1].points.length / 4)) + 1);
    creatingIsland = false;
  }
}

function keyPressed(){
  switch(keyCode){
    case 76:
      if(logging){
        logging = false;
        // logger.hide();
      }else{
        logging = true;
        // logger.show();
      }
      break;
    case 73:
      if(displayLogger){
        displayLogger = false;
        logger.hide();
      }else{
        displayLogger = true;
        logger.show();
      }
      break;
    default:
      console.log(keyCode);
      break;
  }
}
