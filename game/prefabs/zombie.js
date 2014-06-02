'use strict';

var Zombie = function(game, x, y, frame, soldiers, map, layer) {
  Phaser.Sprite.call(this, game, x, y, 'zombie', frame);

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

  // instantly start attacking nearest soldier
  this.attack();
};

Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;



// write your prefab's specific update code here


Zombie.prototype.update = function() {
  this.body.velocity.set(0);
  if (this.moving) {
    console.log("moving");
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
  var targetPrecision = 5;
  this.moveTargetX = this.movePath[0].x * 16 + 8;
  this.moveTargetY = this.movePath[0].y * 16 + 8;
  // check if target is reached
  if (Math.abs(this.world.x - this.moveTargetX) < targetPrecision && Math.abs(this.world.y - this.moveTargetY) < targetPrecision) {
    this.movePath.shift();
    if (this.movePath.length === 0) {
      console.log("STOP");
      this.moving = false;
    }
  }
  // this.rotation = this.game.physics.arcade.angleToPointer(this, pointer);
  this.game.physics.arcade.moveToXY(this, this.moveTargetX, this.moveTargetY, 100);
}

Zombie.prototype.getDistanceTo = function (x, y) {
  return (Math.abs(this.world.x - x) + Math.abs(this.world.y - y)) / 2;
}

module.exports = Zombie;
