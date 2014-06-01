
  'use strict';

  var Soldier = require('../prefabs/soldier');

  function Play() {}
  Play.prototype = {
    create: function() {
      console.log("create play");
      this.game.stage.backgroundColor = '#FFFFFF';
      // this.game.physics.startSystem(Phaser.Physics.ARCADE);
      // this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      // this.sprite.inputEnabled = true;
      //
      // this.game.physics.arcade.enable(this.sprite);
      // this.sprite.body.collideWorldBounds = true;
      // this.sprite.body.bounce.setTo(1,1);
      // this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      // this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);
      //
      // this.sprite.events.onInputDown.add(this.clickListener, this);

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
    },
    update: function() {
      this.game.physics.arcade.collide(this.soldier, this.layer);

      var marker = {
        x: this.layer.getTileX(this.game.input.activePointer.worldX) * 16,
        y: this.layer.getTileY(this.game.input.activePointer.worldY) * 16
      }
      if (this.game.input.mousePointer.isDown)
      {

          this.findPathTo(this.layer.getTileX(marker.x), this.layer.getTileY(marker.y));
      }
    },
    clickListener: function() {
      this.game.state.start('gameover');
    },
    findPathTo: function (tilex, tiley) {
        console.log("finding path to " + tilex + ":" + tiley);
        var self = this;
        this.pathfinder.setCallbackFunction(function(path) {
            path = path || [];
            console.log(path.length);
            for(var i = 0, ilen = path.length; i < ilen; i++) {
                console.log("putting tile");
                self.map.putTile(1, path[i].x, path[i].y);
            }

        });

        var fromX = this.layer.getTileX(this.soldier.world.x);
        var fromY = this.layer.getTileX(this.soldier.world.y);
        console.log("calculate from " + fromX + ":" + fromY);
        this.pathfinder.preparePathCalculation([fromX, fromY], [tilex,tiley]);
        this.pathfinder.calculatePath();
    }
  };

  module.exports = Play;
