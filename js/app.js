const spriteWidth = 101;
const spriteHeigth = 171;
// random generator function
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function jam() {
  addEnemy();
}
// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.yOffset = 20;
  this.x = 0;
  this.y = 0 - this.yOffset;
  this.speed = 1;
};
// randomize the starting point for the enemy
Enemy.prototype.randomize = function() {
  this.x = getRandomIntInclusive(0, 4) * 101;
  this.y = getRandomIntInclusive(1, 3) * 83 - this.yOffset;
  this.speed = getRandomIntInclusive(1, 10);
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  let endGameField = 505;
  if (this.x > endGameField) {
    this.x = -200;
  }
  this.x += this.speed * 40 * dt;
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor(name) {
    this.name = name;
    this.skins = [
      'char-boy',
      'char-cat-girl',
      'char-horn-girl',
      'char-pink-girl',
      'char-princess-girl'
    ];
    this.sprite = `images/${this.skins[0]}.png`;
    this.yOffset = 10;
    this.heigth = 83;
    this.width = 101;
    this.collisionOffset = 15;
    this.y0 = this.heigth * 5 - this.yOffset;
    this.x = 0; //in pixel! vedi canvas dimensions
    this.y = this.y0;
    this.oneTimeFlag = 0;
  }
  // invoked when [P] is pressed. Change the player skin.
  switchPlayer() {
    let firstOut = this.skins.shift();
    this.skins.push(firstOut);
    this.sprite = `images/${this.skins[0]}.png`;
  }
  render(data) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  //ending animation
  onWater() {
    //store the current skin
    let currentSkin = this.sprite;
    // the following while loop ensures the ending animtion start
    // only one time till the game rest
    while (this.oneTimeFlag == 0) {
      // a transparent skin (dummy.png) makes the player blink when you win the game
      let intervalId = setInterval(() => {
        this.sprite =
          this.sprite == currentSkin ? 'images/dummy.png' : currentSkin;
      }, 200);
      this.oneTimeFlag = 1;
      let timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        this.reset(currentSkin);
      }, 1500);
    }
  }
  update() {
    allEnemies.forEach(e => {
      if (
        this.x + this.collisionOffset < e.x + 101 &&
        this.x + this.collisionOffset + 101 > e.x &&
        e.y == this.y - this.yOffset
      ) {
        // debug the collision point
        //console.log("collision at: " + (e.x + 101).toString());
        this.reset(this.sprite);
      }
    });
    items.forEach(e => {
      if (this.x == e.x - 25 && this.y == e.y - 45) {
        e.handleCollision(e.id);
      }
    });
    if (this.y == -this.yOffset) {
      this.onWater();
    }
  }
  reset(currentSkin) {
    this.y = this.y0;
    this.oneTimeFlag = 0;
    this.sprite = currentSkin;
    allEnemies = [];
    items = [];
    populateBoard();
  }
  handleInput(key) {
    switch (key) {
      case 'right':
        if (this.x == 101 * 4) {
          break;
        } else {
          this.x += this.width;
          break;
        }
      case 'left':
        if (this.x == 0) {
          break;
        } else {
          this.x -= this.width;
          break;
        }
      case 'up':
        if (this.y == -10) {
          break;
        } else {
          this.y -= this.heigth;
          break;
        }
      case 'down':
        if (this.y == 405) {
          break;
        } else {
          this.y += this.heigth;
          break;
        }
      case 'switchPlayer':
        this.switchPlayer();
      default:
    }
  }
}
// items class
class Goodies {
  constructor(id, type, row, col) {
    this.id = id;
    this.type = type;
    this.sprite = `images/${this.type}.png`;
    this.row = row;
    this.col = col;
    this.scaleFactor = 2;
    this.width = 101 / this.scaleFactor;
    this.heigth = 171 / this.scaleFactor;
    this.xOffset = -25;
    this.yOffset = -35;
    this.x = this.col * 101 - this.xOffset;
    this.y = this.row * 83 - this.yOffset;
  }
  render() {
    ctx.drawImage(
      Resources.get(this.sprite),
      this.x,
      this.y,
      this.width,
      this.heigth
    );
  }
  update() {}
  handleCollision(id) {
    let temp = items.filter(e => {
      return !(e.id == id);
    });
    items = temp;
    switch (this.type) {
      case 'Gem Blue':
        console.log('you hit a blue one\n no more headache! ');
        allEnemies = [];
        break;
      case 'Gem Green':
        console.log('you hit a green one\n slooooow...');
        allEnemies.forEach(e => {
          e.speed--;
        });
        break;
      case 'Gem Orange':
        console.log('you hit a orange one\n one is missing :-)');
        allEnemies.shift();
        break;
      default:
    }
  }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
vw = new Enemy();
let allEnemies = [];
let id = 0;

function addEnemy() {
  let enemy = Object.create(vw);
  enemy.randomize();
  allEnemies.push(enemy);
}
let items = [];
const possibleItems = ['Gem Orange', 'Gem Green', 'Gem Blue'];
// take care that no gem drops over another one
let forbiddenPosition = [];

function dropItem() {
  let type = possibleItems[getRandomIntInclusive(0, possibleItems.length - 1)];
  let position = {};
  let doppelganger = true;
  while (doppelganger == true) {
    let rand = {
      x: getRandomIntInclusive(1, 3),
      y: getRandomIntInclusive(0, 4)
    };
    if (
      forbiddenPosition.every(e => {
        // debug
        // console.log(Object.values(e), Object.values(rand));
        return !_.isEqual(e, rand);
      })
    ) {
      position = rand;
      doppelganger = false;
      forbiddenPosition.push(position);
    } else {
      doppelganger = true;
    }
  }
  let gem = new Goodies(id++, type, position.x, position.y);
  // let gem = new Goodies(id++, type, getRandomIntInclusive(1, 3), getRandomIntInclusive(0, 4));
  items.push(gem);
}

function populateEnemies() {
  for (let i = 0; i < 3; i++) {
    addEnemy();
  }
}

function populateItems() {
  for (let i = 0; i < 3; i++) {
    dropItem();
  }
}

function shuffle() {
  setInterval(() => {
    allEnemies.forEach(e => {});
    populateEnemies();
  }, 5000);
}
populateEnemies();
populateItems();
// shuffle();
var player = new Player();
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    80: 'switchPlayer'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
