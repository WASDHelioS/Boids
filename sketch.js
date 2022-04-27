var boids = [];
var quadtree;

var tick;

var canvas, ctx;
var wWidth = 1000;
var wHeight = 800;

var showTree;
var targetAmountOfBoids;
var targetAmountOfBoidsLabel;

function setup() {
  
  showTree = document.getElementById('showTree');
  targetAmountOfBoids = document.getElementById('boidSlider');
  targetAmountOfBoids.step = "10";
  targetAmountOfBoidsLabel = document.getElementById('boidSliderLabel');
  
  targetAmountOfBoidsLabel.innerHTML = targetAmountOfBoids.value;

  for(let i = 0; i < targetAmountOfBoids.value; ++i) {
    this.boids.push(new Boid(wWidth, wHeight));
  }

  this.tick = 0;
  canvas = document.getElementById('canvas');
  if (canvas.getContext) 
      ctx = canvas.getContext('2d');

  
  this.quadtree = new QuadTree(this.boids, wWidth, wHeight);
  draw(ctx); //start the loops
}


function killBoids(n) {
  var boidsToKill = [];
  for(let i = 0; i < n; i++) {
    boidsToKill.push(boids.pop());
  }

  for(var boid of boidsToKill) {
    quadtree.removeBoid(boid);
  }
  boidsToKill = [];
}

function addBoids(n) {
  for(let i = 0; i < n; i++) {
    this.boids.push(new Boid(wWidth, wHeight));
  }
}

function determineAmount() {
  if(boids.length > targetAmountOfBoids.value) {
    killBoids(boids.length - targetAmountOfBoids.value);
  } else if(boids.length < targetAmountOfBoids.value) {
    addBoids(targetAmountOfBoids.value - boids.length);
  }
  targetAmountOfBoidsLabel.innerHTML = targetAmountOfBoids.value;
}

function draw() {

  determineAmount();
  
  this.ctx.fillStyle = "BLACK";
  this.ctx.fillRect(0,0, wWidth, wHeight);
  this.ctx.fillStyle = "WHITE";

  if(showTree.checked) {
    quadtree.showAll(quadtree.node, this.ctx);
  }

  for(var boid of boids) {

    var nearbyBoids = quadtree.findBoidsNear(boid.position, 30);

    quadtree.removeBoid(boid);
    
    boid.flock(nearbyBoids);
    boid.update();

    quadtree.addABoid(boid);    

    boid.draw(this.ctx);
    
    ctx.stroke();
    tick++;

    if(tick == 15000) {
      quadtree.clean(quadtree.node);
      tick = 0;
    }
  }
  requestAnimationFrame(draw);
}

window.onload = setup();