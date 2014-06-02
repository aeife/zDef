'use strict';

var Human = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'human', frame);

  // initialize your prefab here

};

Human.prototype = Object.create(Phaser.Sprite.prototype);
Human.prototype.constructor = Human;

Human.prototype.update = function() {

  // write your prefab's specific update code here

};

module.exports = Human;
