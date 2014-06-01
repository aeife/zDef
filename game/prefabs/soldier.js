'use strict';

var Soldier = function(game, x, y, frame) {
  console.log("init soldier");
  Phaser.Sprite.call(this, game, x, y, 'soldier', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.setSize(10, 14, 2, 1);

  //  Allow cursors to scroll around the map
  this.cursors = this.game.input.keyboard.createCursorKeys();

  // this.game.input.onDown.add(this.moveCommand, this);

  this.moving = false;
  this.moveSpeed = 100;
  console.log(this);
};

Soldier.prototype = Object.create(Phaser.Sprite.prototype);
Soldier.prototype.constructor = Soldier;

Soldier.prototype.update = function() {

  // write your prefab's specific update code here


  this.body.velocity.set(0);

  if (this.cursors.left.isDown)
  {
      this.body.velocity.x = -100;
  }
  else if (this.cursors.right.isDown)
  {
      this.body.velocity.x = 100;
  }
  else if (this.cursors.up.isDown)
  {
      this.body.velocity.y = -100;
  }
  else if (this.cursors.down.isDown)
  {
      this.body.velocity.y = 100;
  }

  if (this.moving) {
    // console.log("moving to " + this.moveTargetX + ":" + this.moveTargetY);
    this.move();
  }

};

Soldier.prototype.moveCommand = function (pointer) {
  this.moving = true;
  this.movePath = [{x: pointer.x, y: pointer.y}];
}

Soldier.prototype.move = function () {
    var targetPrecision = 3;
    this.moveTargetX = this.movePath[0].x * 16 + 8;
    this.moveTargetY = this.movePath[0].y * 16 + 8;
    // check if target is reached
    if (Math.abs(this.world.x - this.moveTargetX) < targetPrecision && Math.abs(this.world.y - this.moveTargetY) < targetPrecision) {
      this.movePath.shift();
      if (this.movePath.length === 0) {
        this.moving = false;
      }
    }
    // this.rotation = this.game.physics.arcade.angleToPointer(this, pointer);
    this.game.physics.arcade.moveToXY(this, this.moveTargetX, this.moveTargetY, this.moveSpeed);
}

Soldier.prototype.moveAlongPath = function (path) {
  this.moving = true;
  this.movePath = path;
}

module.exports = Soldier;
