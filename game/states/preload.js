
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    console.log("preloading");

    // load tilemap and tileset
    this.game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tileset1', 'assets/tileset1.png');
    this.game.load.image('ground_1x1', 'assets/tiles/ground_1x1.png');
    this.game.load.image('walls_1x2', 'assets/tiles/walls_1x2.png');
    this.game.load.image('tiles2', 'assets/tiles/tiles2.png');

    // load player image
    this.game.load.image('soldier', 'assets/soldier.png');

    this.game.load.spritesheet('zombie', 'assets/zombie.png', 16, 16);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  },
  create: function() {
    // this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    console.log("ready");
    this.ready = true;
  }
};

module.exports = Preload;
