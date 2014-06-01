
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
      this.layer.debug = true;

      // Create a new soldier object
      this.soldier = new Soldier(this.game, 400, this.game.height/2);
      // and add it to the game
      this.game.add.existing(this.soldier);

      this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
      this.pathfinder.setGrid(this.map.layers[0].data, [3]);

      this.game.input.onDown.add(this.findPathTo, this);
    },
    update: function() {
      this.game.physics.arcade.collide(this.soldier, this.layer);
    },
    clickListener: function() {
      this.game.state.start('gameover');
    },
    findPathTo: function (pointer) {
      var self = this;
      this.pathfinder.setCallbackFunction(function(path) {
        self.soldier.moveAlongPath(path);
      });

      this.pathfinder.preparePathCalculation([this.layer.getTileX(this.soldier.world.x), this.layer.getTileY(this.soldier.world.y)], [this.layer.getTileX(pointer.x),this.layer.getTileY(pointer.y)]);
      this.pathfinder.calculatePath();
    }
  };

  module.exports = Play;
