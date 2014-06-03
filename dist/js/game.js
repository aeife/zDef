(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(960, 480, Phaser.AUTO, 'zdef');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
'use strict';

var Human = function(game, x, y, key, map, layer) {
  Phaser.Sprite.call(this, game, x, y, key);

  this.game = game;
  this.map = map;
  this.layer = layer;

  this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
  this.pathfinder.setGrid(this.map.layers[0].data, [3]);

  // initialize your prefab here

  // move attributes
  this.movePath = null;
  this.targetPrecision = 3;
  this.moving = false;
  this.moveSpeed = 100;
};

Human.prototype = Object.create(Phaser.Sprite.prototype);
Human.prototype.constructor = Human;

Human.prototype.move = function () {
    // check if target is reached
    // console.log(this.body.velocity.y);
    this.moveToXY(this.getCurrentMoveTarget().x, this.getCurrentMoveTarget().y, this.moveSpeed);
    if (Math.abs(this.world.x - this.getCurrentMoveTarget().x) < this.targetPrecision && Math.abs(this.world.y - this.getCurrentMoveTarget().y) < this.targetPrecision) {
      this.movePath.shift();
      if (this.movePath.length !== 0) {
        console.log("checkpoint reached, going to next");
        // this.rotation = this.game.physics.arcade.angleToPointer(this, pointer);
        
      } else {
        console.log("target reached");
        this.stopMoving();
      }
    }
}

Human.prototype.startMoving = function () {
  this.moving = true;
  console.log("START ");
  console.log(this.body);
//  this.body.moves = true;
  // var target = this.getCurrentMoveTarget();
  // this.game.physics.arcade.moveToXY(this, target.x, target.y, this.moveSpeed);
}

Human.prototype.stopMoving = function () {
  console.log("stop moving");
  this.moving = false;
  this.body.velocity.x = 0;
  this.body.velocity.y = 0;
}

Human.prototype.getCurrentMoveTarget = function () {
  return {
    x: this.movePath[0].x * 16 + 8,
    y: this.movePath[0].y * 16 + 8
  }
}

Human.prototype.calculatePathToTarget = function (targetX, targetY) {
  var self = this;
  this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
  this.pathfinder.setGrid(this.map.layers[0].data, [3]);
  this.pathfinder.setCallbackFunction(function(path) {
    // for(var i = 0, ilen = path.length; i < ilen; i++) {
    //       self.map.putTile(1, path[i].x, path[i].y);
    //   }
    console.log("calculated path");
    self.movePath = path;
    console.log(self.movePath);
    console.log(path[path.length - 1].x);
    self.startMoving();
  });

  this.pathfinder.preparePathCalculation([this.layer.getTileX(this.world.x), this.layer.getTileY(this.world.y)], [this.layer.getTileX(targetX), this.layer.getTileY(targetY)]);
  this.pathfinder.calculatePath();
}

Human.prototype.getDistanceTo = function (x, y) {
  return (Math.abs(this.world.x - x) + Math.abs(this.world.y - y)) / 2;
}

Human.prototype.moveToXY = function (x, y, speed) {
  console.log()
    var dx = this.body.x - x;
    var dy = this.body.y - y;
    this.body.rotation = Math.atan2(dy, dx) + this.game.math.degToRad(90);
    var angle = this.body.rotation + (Math.PI / 2);
    this.body.velocity.x = speed * Math.cos(angle);
    this.body.velocity.y = speed * Math.sin(angle);
}



module.exports = Human;

},{}],3:[function(require,module,exports){
'use strict';
var Human = require('./human');

var Soldier = function(game, x, y, frame, map, layer) {
  console.log("init soldier");
  Human.call(this, game, x, y, 'soldier', map, layer);

  game.add.existing(this);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.p2.enable(this);
  this.body.setCircle(8);
  this.body.mass = 9999;

  // this.game.input.onDown.add(this.moveCommand, this);
  this.inputEnabled = true;

  this.moving = false;
  this.moveSpeed = 100;
};

Soldier.prototype = Object.create(Human.prototype);
Soldier.prototype.constructor = Soldier;

Soldier.prototype.update = function() {

  // write your prefab's specific update code here
  // this.body.velocity.set(0);

  if (this.moving) {
    this.move();
  }
};

Soldier.prototype.moveCommand = function (pointer) {
  this.calculatePathToTarget(pointer.x, pointer.y);
}

Soldier.prototype.moveAlongPath = function (path) {
  this.moving = true;
  this.movePath = path;
}

module.exports = Soldier;

},{"./human":2}],4:[function(require,module,exports){
'use strict';

var Human = require('./human');

var Zombie = function(game, x, y, frame, soldiers, map, layer) {
  Human.call(this, game, x, y, 'zombie', map, layer);
  game.add.existing(this);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.p2.enable(this);
  this.body.setCircle(16);
  this.body.mass = 9999;

  this.soldiers = soldiers;
  this.map = map;
  this.layer = layer;

  this.moving = false;
  this.moveSpeed = 150;

  // instantly start attacking nearest soldier
  this.attack();
};

Zombie.prototype = Object.create(Human.prototype);
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function() {
  if (this.moving) {
    this.move();
  }
};

Zombie.prototype.attack = function () {
  // calculate nearest soldier and start moving towards it
  var nearestSoldier = this.getNearestSoldier();
  this.calculatePathToTarget(nearestSoldier.x, nearestSoldier.y);
}

Zombie.prototype.getNearestSoldier = function () {
  var nearest = {
    distance: null,
    soldier: null
  }

  for (var i = 0, len = this.soldiers.length; i < len; i++) {
    var distance = this.getDistanceTo(this.soldiers[i].world.x, this.soldiers[i].world.y);
    if (!nearest.distance || distance < nearest.distance) {
      nearest.distance = distance;
      nearest.soldier = this.soldiers[i];
    }
  }
  return nearest.soldier;
}

module.exports = Zombie;

},{"./human":2}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],8:[function(require,module,exports){

  'use strict';

  var Soldier = require('../prefabs/soldier');
  var Zombie = require('../prefabs/zombie');

  function Play() {}
  Play.prototype = {
    create: function() {
      console.log("create play");
      this.game.physics.startSystem(Phaser.Physics.P2JS);
    

      this.game.stage.backgroundColor = '#FFFFFF';

      this.map = this.game.add.tilemap('map');
      this.map.addTilesetImage('tileset1');


      this.layerBg = this.map.createLayer('Background');
      this.layer = this.map.createLayer('Walls');
      this.layer.resizeWorld();
      this.physics.p2.convertTilemap(this.map, this.layer);
      this.game.physics.p2.setBoundsToWorld(true, true, true, true, false);
      // this.layer.debug = true;

      this.spawnLocations = [
        {x: 300, y: 370},
        {x: 320, y: 370},
        {x: 340, y: 370},
        {x: 360, y: 370},
        {x: 380, y: 370},
        {x: 400, y: 370},
        {x: 420, y: 370},
      ];

      this.spawnSoldiers(3);
      this.zombie = new Zombie(this.game, 420, 55, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 440, 55, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 460, 55, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 480, 55, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 500, 55, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 520, 55, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 540, 55, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 560, 55, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 420, 35, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 440, 35, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 460, 35, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 480, 35, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 500, 35, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 520, 35, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 540, 35, null, this.soldiers, this.map, this.layerBg);
      // this.zombie = new Zombie(this.game, 560, 35, null, this.soldiers, this.map, this.layerBg);

      this.game.input.onDown.add(this.clickListener, this);
    },
    update: function() {

    },
    soldiers: [],
    spawnSoldiers: function (soldierCount) {
      for (var i = 0; i < soldierCount; i++) {
        this.soldiers.push(new Soldier(this.game, this.spawnLocations[i].x, this.spawnLocations[i].y, null, this.map, this.layerBg));
        // add click listener
        this.soldiers[this.soldiers.length - 1].events.onInputDown.add(this.soldierClickListener, this);
      }
    },
    soldierClickListener: function (soldier) {
      console.log("clicked");
      console.log(soldier);
      this.selectedSoldier = soldier;
    },
    clickListener: function(pointer) {
      if (this.selectedSoldier) {
        this.selectedSoldier.moveCommand(pointer);
        // this.findPathTo(pointer);
        this.selectedSoldier = null;
      }
    }



  };

  module.exports = Play;

},{"../prefabs/soldier":3,"../prefabs/zombie":4}],9:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    console.log("preloading");

    // load tilemap and tileset
    this.game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tileset1', 'assets/tileset1.png');
    this.game.load.image('ground_1x1', 'assets/tiles/ground_1x1.png');
    this.game.load.image('walls_1x2', 'assets/tiles/walls_1x2.png');
    this.game.load.image('tiles2', 'assets/tiles/tiles2.png');

    // load player image
    this.game.load.image('soldier', 'assets/soldier.png');

    this.game.load.spritesheet('zombie', 'assets/zombie.png', 16, 16);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  },
  create: function() {
    // this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    console.log("ready");
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])