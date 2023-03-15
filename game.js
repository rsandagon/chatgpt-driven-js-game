// Define the player object
let c = document.getElementById("gameCanvas");
let ctx = c.getContext("2d");

let player = {
  x: 0,
  y: 0,
  width: 50,
  height: 85,
  speed: 5,
  jumpHeight: 100,
  isJumping: false,
  isShooting: false,
  bullets: [],
  frame: 0, // current frame of the walk cycle
  maxFrame: 3, // maximum frame of the walk cycle
  walkCycleSpeed: 1, // speed at which the walk cycle changes frames
  shoot: function() {
    if (this.isShooting) return;
    this.isShooting = true;
    this.bullets.push({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      speed: 10
    });
    setTimeout(() => {
      this.isShooting = false;
    }, 500);
  },
  moveLeft: function () {
    this.x -= this.speed;
  },
  moveRight: function () {
    this.x += this.speed;
  },
  moveUp: function () {
    this.y -= this.speed;
  },
  moveDown: function () {
    this.y += this.speed;
  },
};

// Load the bg sprite sheet
let bgSprite = new Image();
bgSprite.src = "bg.png";

function drawBg() {
  ctx.drawImage(
    bgSprite,
    0,
    0,
    c.width,
    c.height,
    0,
    0,
    c.width,
    c.height
  );  
}

// Load the player sprite sheet
let playerSprite = new Image();
playerSprite.src = "player.jpg";

// Draw the player sprite on the canvas
function drawPlayer() {
  // Calculate the source x coordinate of the current frame
  let sourceX = player.frame * player.width;

  // Draw the current frame of the sprite on the canvas
  ctx.drawImage(
    playerSprite,
    sourceX,
    0,
    player.width,
    player.height,
    player.x,
    player.y,
    player.width,
    player.height
  );

  // Update the frame counter for the walk cycle animation
  if (++player.frame > player.maxFrame * player.walkCycleSpeed) {
    player.frame = 0;
  }
}

function updatePlayer() {
  // Check for collision with the edge of the canvas
  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > c.width) {
    player.x = c.width - player.width;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.y + player.height > c.height) {
    player.y = c.height - player.height;
  }
  // Render the player
  drawPlayer();
}

// Add event listeners for shooting
document.addEventListener("keydown", function (event) {
  if (event.code === "ArrowLeft") {
    player.moveLeft();
  }
  if (event.code === "ArrowRight") {
    player.moveRight();
  }
  if (event.code === "ArrowUp") {
    player.moveUp();
  }
  if (event.code === "ArrowDown") {
    player.moveDown();
  }
  if (event.code === "KeyX") {
    player.shoot();
  }
});

// Update and render bullets
function updateBullets() {
  player.bullets.forEach((bullet) => {
    bullet.x += bullet.speed;
  });
  player.bullets = player.bullets.filter((bullet) => {
    return bullet.x < c.width; // remove bullets that are off-screen
  });
  player.bullets.forEach((bullet) => {
    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, 10, 5); // render the bullets
  });
}

// Define the enemy object
let enemy = {
  x: 500,
  y: 250,
  width: 50,
  height: 50,
  speed: 3,
  isDead: false,
};

// Check for bullet collisions with enemy
function checkBulletCollisions() {
  player.bullets.forEach((bullet) => {
    if (
      bullet.x > enemy.x &&
      bullet.x < enemy.x + enemy.width &&
      bullet.y > enemy.y &&
      bullet.y < enemy.y + enemy.height
    ) {
      enemy.isDead = true;
    }
  });
}

// Update and render the enemy
function updateEnemy() {
  
  
  
  if (!enemy.isDead) {
    enemy.x -= enemy.speed;
  }else{
    enemy.width -= 2;
    enemy.height -= 2;
    enemy.x += 2;
    enemy.y += 2;
  }

  //respawn
  if(enemy.width < 0){
    enemy.x = 500;
    enemy.y = Math.random()*c.height;
    enemy.isDead = false;
    enemy.height = 50;
    enemy.width = 50
  }

  if (enemy.x < 0) {
    enemy.x = 500;
    enemy.y = Math.random()*c.height;
  }
  if (enemy.x + enemy.width > c.width) {
    enemy.x = c.width - enemy.width;
  }
  
  if (!enemy.isDead) {
    ctx.fillStyle = "red";
  }else{
    ctx.fillStyle = "green";
  }

  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

  
}

// Update the game state and render the game on the canvas
function update() {
  ctx.clearRect(0, 0, c.width, c.height);
  drawBg();
  updatePlayer();
  updateBullets();
  checkBulletCollisions();
  updateEnemy();
  requestAnimationFrame(update);
}

// Call the update function to start the game loop
update();
