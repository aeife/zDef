'use strict';

var Human = require('./human');

var Zombie = function(game, x, y, frame, soldiers, map, layer) {
  Phaser.Sprite.call(this, game, x, y, 'zombie', frame);
  Human.call(this, game, map, layer);
  game.add.existing(this, this.game, this.map, this.layer);

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

  this.moveSpeed = 110;

  // instantly start attacking nearest soldier
  // this.attack();
};

Zombie.prototype = Object.create(Human.prototype);
Zombie.prototype.constructor = Zombie;


Zombie.prototype.update = function() {
  this.body.velocity.set(0);
  if (this.moving) {
    this.move();
  }
};

Zombie.prototype.attack = function () {
  // calculate nearest soldier and start moving towards it
  console.log(this.getNearestSoldier());
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

module.exports = Zombie;
