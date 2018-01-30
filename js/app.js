/*
global variable
 */
const spriteWidth = 101;
const spriteHeigth = 171;
// random utilities
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function jam() {
  console.log('enemy increased');
  populateEnemies();
}
// Enemies our player must avoid
var Enemy = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.yOffset = 20
  this.x = 0;
  this.y = 0 - this.yOffset;
  this.speed = 1;
  this.name = "iggy"
};
// randomize the starting point for the enemy
Enemy.prototype.randomize = function() {
  let spriteXDim = 1;
  let spriteYDim = 101;
  // min = Math.ceil(0);
  // max = Math.floor(5);
  this.x += 100;
  this.x = getRandomIntInclusive(0, 4) * 101;
  this.y = getRandomIntInclusive(1, 3) * 83 - this.yOffset;
  this.speed = getRandomIntInclusive(1, 10);
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  let endGameField = 500;
  if (this.x > endGameField) {
    this.x = 0;
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
    this.name = name
    this.players = ['char-boy', 'char-cat-girl', 'char-horn-girl', 'char-pink-girl', 'char-princess-girl'];
    this.sprite = `images/${this.players[0]}.png`;
    this.yOffset = 10;
    this.heigth = 83;
    this.width = 101;
    this.collisionOffset = 15
    this.y0 = this.heigth * 5 - this.yOffset;
    this.x = 0; //in pixel! vedi canvas dimensions
    this.y = this.y0;
    this.crash = 0;
  }
  switchPlayer() {
    let firstOut = this.players.shift();
    console.log(firstOut);
    this.players.push(firstOut);
    this.sprite = `images/${this.players[0]}.png`;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  update() {
    //console.log((player.x < (e.x + 101) && player.x + 101 > e.x));
    allEnemies.forEach(function(e) {
      // TODO: set the right collision head to head
      if ((player.x + player.collisionOffset < (e.x + 101) && player.x + player.collisionOffset + 101 > e.x) && (e.y == player.y - player.yOffset)) {
        // debug the collision point
        console.log('collision at: ' + (e.x + 101).toString());
        player.resetPlayer();
      }
      if (player.y == -player.yOffset) {
        // player.sprite = 'images/dummy.png';
        function blink() {
           player.sprite = (player.sprite == 'images/char-boy') ?  'images/dummy.png' : 'images/char-boy.png';
        }
        let intervalId = setInterval(blink, 300);
        function stopBlink() {
          console.log('stopped blink');
          clearInterval(intervalId);
        }
         let timeoutId = setTimeout(stopBlink, 1000);


        // let delayId = window.setTimeout(function() {
        //   player.sprite = 'images/char-boy.png';
        //   player.resetPlayer();
        // }, 500);
      }
    })
  }
  resetPlayer() {
    player.y = player.y0;;
    player.crash++;
  }
  handleInput(key) {
    // TODO: set canvas limits or all
    switch (key) {
      case 'right':
        if (this.x == 101 * 4) {
          break;
        } else {
          this.x += this.width;
          // console.log(this.x);
          break;
        }
      case 'left':
        if (this.x == 0) {
          break;
        } else {
          this.x -= this.width;
          // console.log(this.x);
          break;
        }
      case 'up':
        if (this.y == -10) {
          break;
        } else {
          this.y -= this.heigth;
          // console.log(this.y);
          break;
        }
      case 'down':
        if (this.y == 405) {
          break;
        } else {
          this.y += this.heigth;
          // console.log(this.y);
          break;
        }
      case 'switchPlayer':
        console.log('cambia player');
        this.switchPlayer();
      default:
    }
  }
}
class Goodies {
  constructor(type, row, col) {
    this.type = type;
    this.sprite = `images/${this.type}.png`;
    this.row = row;
    this.col = col;
    this.scaleFactor = 2;
    this.width = 101 / this.scaleFactor;
    this.heigth = 171 / this.scaleFactor;
    this.xOffset = -25;
    this.yOffset = -35;
    this.x = (this.col * 101) - this.xOffset;
    this.y = (this.row * 83) - this.yOffset;
  }
  render() {
    // ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 50, 85);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.heigth);
  }
  update() {
    let myThis = this;
    items.forEach.call(myThis, function(e) {
      if (true) {
        console.log(this);
        this.handleCollision();
        //debug
      }
    })
  }
  handleCollision() {
    console.log('you hit some shit...');
  }
}
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
kcroach = new Enemy();
const allEnemies = [];
let id = 0;

function populateEnemies() {
  let last = allEnemies.length;
  allEnemies.push(Object.create(kcroach));
  allEnemies[last].name += id;
  id++;
  allEnemies.forEach(function(e) {
    // e.randomize();
  });
  console.log(allEnemies);
};
populateEnemies();
const items = [];
let itemSet = new Set();
while (itemSet.size < 5) {
  var item = {};
  item.row = getRandomIntInclusive(1, 3);
  item.col = getRandomIntInclusive(0, 4);
  itemSet.add(item);
}
let iterator = itemSet.values();
console.log(itemSet);
const possibleItems = ['Gem Orange', 'Gem Green', 'Gem Blue'];

function dropItem() {
  let position = iterator.next();
  // console.log(position.done);
  console.log(position.value);
  if (!position.done) {
    let type = possibleItems[getRandomIntInclusive(0, possibleItems.length - 1)];
    console.log(type);
    // items.push(new Goodies(type, iterator.next().value.row, iterator.next().value.col))
    items.push(new Goodies(type, position.value.row, position.value.col))
  } else {}
}
dropItem();
// console.log(items);
const kindOfGems = new Set(['Gem Blue', 'Gem Orange', 'Gem Green']);
var player = new Player('sergio');
// console.log(player.name);
// console.log(player.x, player.y);
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  console.log(e.keyCode);
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    80: 'switchPlayer'
  };
  // console.log(allowedKeys[e.keyCode]);
  player.handleInput(allowedKeys[e.keyCode]);
});
