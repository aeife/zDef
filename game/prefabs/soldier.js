'use strict';
var Human = require('./human');

var Soldier = function(game, x, y, frame, map, layer) {
  console.log("init soldier");
  Human.call(this, game, x, y, 'soldier', map, layer);

  game.add.existing(this);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.p2.enable(this);
  this.body.setCircle(8);
  this.body.mass = 9999;

  // this.game.input.onDown.add(this.moveCommand, this);
  this.inputEnabled = true;

  this.moving = false;
  this.moveSpeed = 100;
};

Soldier.prototype = Object.create(Human.prototype);
Soldier.prototype.constructor = Soldier;

Soldier.prototype.update = function() {

  // write your prefab's specific update code here
  // this.body.velocity.set(0);

  if (this.moving) {
    this.move();
  }
};

Soldier.prototype.moveCommand = function (pointer) {
  this.calculatePathToTarget(pointer.x, pointer.y);
}

Soldier.prototype.moveAlongPath = function (path) {
  this.moving = true;
  this.movePath = path;
}

module.exports = Soldier;
