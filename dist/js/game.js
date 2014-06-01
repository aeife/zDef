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
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
'use strict';

var Soldier = function(game, x, y, frame) {
  console.log("init soldier");
  Phaser.Sprite.call(this, game, x, y, 'soldier', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.setSize(10, 14, 2, 1);

  //  Allow cursors to scroll around the map
  this.cursors = this.game.input.keyboard.createCursorKeys();

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

  if (this.cursors.left.isDown)
  {
      this.body.velocity.x = -100;
  }
  else if (this.cursors.right.isDown)
  {
      this.body.velocity.x = 100;
  }
  else if (this.cursors.up.isDown)
  {
      this.body.velocity.y = -100;
  }
  else if (this.cursors.down.isDown)
  {
      this.body.velocity.y = 100;
  }

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

},{}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){

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

},{}],6:[function(require,module,exports){

  'use strict';

  var Soldier = require('../prefabs/soldier');

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
        var newSoldier = new Soldier(this.game, this.spawnLocations[i].x, this.spawnLocations[i].y);
        this.soldiers.push(newSoldier);
        this.game.add.existing(newSoldier);
        // add click listener
        newSoldier.events.onInputDown.add(this.soldierClickListener, this);
      }
    },
    soldierClickListener: function (soldier) {
      console.log("clicked");
      console.log(soldier);
      this.selectedSoldier = soldier;
    }
  };

  module.exports = Play;

},{"../prefabs/soldier":2}],7:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    console.log("preloading");
    // this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    // this.asset.anchor.setTo(0.5, 0.5);
    //
    // this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    // this.load.setPreloadSprite(this.asset);
    // this.load.image('yeoman', 'assets/yeoman-logo.png');

    // load tilemap and tileset
    this.game.load.tilemap('level', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'assets/tileset1.png');

    // load player image
    this.game.load.spritesheet('soldier', 'assets/soldier.png', 16, 16);

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