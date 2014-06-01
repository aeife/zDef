'use strict';

var Soldier = function(game, x, y, frame) {
  console.log("init soldier");
  Phaser.Sprite.call(this, game, x, y, 'soldier', frame);
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.setSize(10, 14, 2, 1);

  //  Allow cursors to scroll around the map
  this.cursors = this.game.input.keyboard.createCursorKeys();
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

};

module.exports = Soldier;
