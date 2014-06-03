
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
      // this.zombie = new Zombie(this.game, 450, 100, null, this.soldiers, this.map, this.layer);
    },
    update: function() {
      for (var i = 0, len = this.soldiers.length; i < len; i++) {
        this.game.physics.arcade.collide(this.soldiers[i], this.layer);
        // TODO: collision soldier - soldier
      }
    },
    clickListener: function(pointer) {
      if (this.selectedSoldier) {
        this.selectedSoldier.moveCommand(pointer);
        // this.findPathTo(pointer);
        this.selectedSoldier = null;
      }
    },
    soldiers: [],
    spawnSoldiers: function (soldierCount) {
      for (var i = 0; i < soldierCount; i++) {
        this.soldiers.push(new Soldier(this.game, this.spawnLocations[i].x, this.spawnLocations[i].y, null, this.map, this.layer));
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
