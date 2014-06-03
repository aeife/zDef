'use strict';

var Human = function(game, x, y, key, map, layer) {
  console.log("CONSTRUCTOR");
  console.log(game);
  console.log(map);
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
