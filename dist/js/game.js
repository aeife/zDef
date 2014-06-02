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
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
'use strict';

var Soldier = function(game, x, y, frame) {
  console.log("init soldier");
  Phaser.Sprite.call(this, game, x, y, 'soldier', frame);
  game.add.existing(this);
  
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.setSize(10, 14, 2, 1);

  // this.game.input.onDown.add(this.moveCommand, this);
  this.inputEnabled = true;

  this.moving = false;
  this.moveSpeed = 100;
  console.log(this);
};

Soldier.prototype = Object.create(Phaser.Sprite.prototype);
Soldier.prototype.constructor = Soldier;

Soldier.prototype.update = function() {

  // write your prefab's specific update code here
  this.body.velocity.set(0);

  if (this.moving) {
    // console.log("moving to " + this.moveTargetX + ":" + this.moveTargetY);
    this.move();
  }

};

Soldier.prototype.moveCommand = function (pointer) {
  this.moving = true;
  this.movePath = [{x: pointer.x, y: pointer.y}];
}

Soldier.prototype.move = function () {
    var targetPrecision = 3;
    this.moveTargetX = this.movePath[0].x * 16 + 8;
    this.moveTargetY = this.movePath[0].y * 16 + 8;
    // check if target is reached
    if (Math.abs(this.world.x - this.moveTargetX) < targetPrecision && Math.abs(this.world.y - this.moveTargetY) < targetPrecision) {
      this.movePath.shift();
      if (this.movePath.length === 0) {
        this.moving = false;
      }
    }
    // this.rotation = this.game.physics.arcade.angleToPointer(this, pointer);
    this.game.physics.arcade.moveToXY(this, this.moveTargetX, this.moveTargetY, this.moveSpeed);
}

Soldier.prototype.moveAlongPath = function (path) {
  this.moving = true;
  this.movePath = path;
}

module.exports = Soldier;

},{}],3:[function(require,module,exports){
'use strict';

var Zombie = function(game, x, y, frame, soldiers, map, layer) {
  Phaser.Sprite.call(this, game, x, y, 'zombie', frame);
  game.add.existing(this);
  
  // initialize your prefab here
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.setSize(10, 14, 2, 1);

  this.soldiers = soldiers;
  console.log(this.soldiers)
  this.map = map;
  this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
  this.pathfinder.setGrid(this.map.layers[0].data, [3]);
  this.layer = layer;

  this.moving = false;
  this.movingSpeed = 300;

  // instantly start attacking nearest soldier
  this.attack();
};

Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;


Zombie.prototype.update = function() {
  this.body.velocity.set(0);
  if (this.moving) {
    this.move();
  }
};

Zombie.prototype.attack = function () {
  // calculate nearest soldier and start moving towards it
  this.calculatePathToTarget(this.getNearestSoldier());
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

Zombie.prototype.calculatePathToTarget = function (target) {
  var self = this;
  this.pathfinder.setCallbackFunction(function(path) {
    console.log(path);
    self.moving = true;
    self.movePath = path;
  });

  // TODO: recalculate path if soldier moved / dead
  this.pathfinder.preparePathCalculation([this.layer.getTileX(this.world.x), this.layer.getTileY(this.world.y)], [this.layer.getTileX(target.world.x), this.layer.getTileY(target.world.y)]);
  this.pathfinder.calculatePath();
}

Zombie.prototype.move = function () {
  console.log ("navigate to " + this.movePath[0].x + ":" + this.movePath[0].y);
  var targetPrecision = 10;
  this.moveTargetX = this.movePath[0].x * 16 + 8;
  this.moveTargetY = this.movePath[0].y * 16 + 8;
  // check if target is reached
  if (Math.abs(this.world.x - this.moveTargetX) < targetPrecision && Math.abs(this.world.y - this.moveTargetY) < targetPrecision) {
    this.movePath.shift();
    if (this.movePath.length === 0) {
      this.moving = false;
    }
  }

  this.game.physics.arcade.moveToXY(this, this.moveTargetX, this.moveTargetY, this.movingSpeed);
}

Zombie.prototype.getDistanceTo = function (x, y) {
  return (Math.abs(this.world.x - x) + Math.abs(this.world.y - y)) / 2;
}

module.exports = Zombie;

},{}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){

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

},{}],6:[function(require,module,exports){

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

},{}],7:[function(require,module,exports){

  'use strict';

  var Soldier = require('../prefabs/soldier');
  var Zombie = require('../prefabs/zombie');

  function Play() {}
  Play.prototype = {
    create: function() {
      console.log("create play");
      this.game.stage.backgroundColor = '#FFFFFF';

      // load tilemap
      this.map = this.game.add.tilemap('level', 16, 16);

      // load tileset
      this.tileset = this.map.addTilesetImage('tileset1', 'tiles');
      //  Create our layer
      this.layer = this.map.createLayer(0);
      // this.layer = this.map.createBlankLayer('Bg');

      //  Resize the world
      this.layer.resizeWorld();

      //  set tiles collision
      this.map.setCollision([2, 4], true);
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

      this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
      this.pathfinder.setGrid(this.map.layers[0].data, [3]);
      console.log(this.game);
      this.game.input.onDown.add(this.clickListener, this);

      // zombies
      console.log(this.map);
      this.zombie = new Zombie(this.game, 450, 100, null, this.soldiers, this.map, this.layer);
    },
    update: function() {
      for (var i = 0, len = this.soldiers.length; i < len; i++) {
        this.game.physics.arcade.collide(this.soldiers[i], this.layer);
        // TODO: collision soldier - soldier
      }
    },
    clickListener: function(pointer) {
      if (this.selectedSoldier) {
        this.findPathTo(pointer);
        this.selectedSoldier = null;
      }
    },
    findPathTo: function (pointer) {
      var self = this;
      this.pathfinder.setCallbackFunction(function(path) {
        self.selectedSoldier.moveAlongPath(path);
      });

      this.pathfinder.preparePathCalculation([this.layer.getTileX(this.selectedSoldier.world.x), this.layer.getTileY(this.selectedSoldier.world.y)], [this.layer.getTileX(pointer.x),this.layer.getTileY(pointer.y)]);
      this.pathfinder.calculatePath();
    },
    soldiers: [],
    spawnSoldiers: function (soldierCount) {
      for (var i = 0; i < soldierCount; i++) {
        this.soldiers.push(new Soldier(this.game, this.spawnLocations[i].x, this.spawnLocations[i].y));
        // add click listener
        this.soldiers[this.soldiers.length - 1].events.onInputDown.add(this.soldierClickListener, this);
      }
    },
    soldierClickListener: function (soldier) {
      console.log("clicked");
      console.log(soldier);
      this.selectedSoldier = soldier;
    }
  };

  module.exports = Play;

},{"../prefabs/soldier":2,"../prefabs/zombie":3}],8:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    console.log("preloading");

    // load tilemap and tileset
    this.game.load.tilemap('level', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/tileset1.png');

    // load player image
    this.game.load.spritesheet('soldier', 'assets/soldier.png', 16, 16);

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