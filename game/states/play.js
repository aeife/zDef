
  'use strict';

  var Soldier = require('../prefabs/soldier');
  var Zombie = require('../prefabs/zombie');
  var cursors, ship;

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

      ship = this.game.add.sprite(300, 350, 'soldier');
      this.game.physics.p2.enable(ship);
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
