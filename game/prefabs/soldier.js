'use strict';
var Human = require('./human');

var Soldier = function(game, x, y, frame, map, layer) {
  console.log("init soldier");
  Human.call(this, game, x, y, 'soldier', map, layer);

  game.add.existing(this);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.p2.enable(this, true);
  this.body.setCircle(8);
  this.body.mass = 9999;

  // this.game.input.onDown.add(this.moveCommand, this);
  this.inputEnabled = true;

  this.moving = false;
  this.moveSpeed = 100;

  this.cursors = this.game.input.keyboard.createCursorKeys();
};

Soldier.prototype = Object.create(Human.prototype);
Soldier.prototype.constructor = Soldier;

Soldier.prototype.update = function() {

  // write your prefab's specific update code here
  // this.body.velocity.set(0);

  if (this.moving) {
    this.move();
  }

  if (this.cursors.left.isDown)
    {
        this.body.rotateLeft(100);
    }
    else if (this.cursors.right.isDown)
    {
        this.body.rotateRight(100);
    }
    else
    {
        this.body.setZeroRotation();
    }

    if (this.cursors.up.isDown)
    {
        this.body.thrust(400);
    }
    else if (this.cursors.down.isDown)
    {
        this.body.reverse(400);
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
