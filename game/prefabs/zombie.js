'use strict';

var Zombie = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'zombie', frame);

  // initialize your prefab here
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.setSize(10, 14, 2, 1);
};

Zombie.prototype = Object.create(Phaser.Sprite.prototype);
Zombie.prototype.constructor = Zombie;

Zombie.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Zombie;
