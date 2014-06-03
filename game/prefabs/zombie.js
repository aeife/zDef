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
