
  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      console.log("create play");
      this.game.stage.backgroundColor = '#FFFFFF';
      // this.game.physics.startSystem(Phaser.Physics.ARCADE);
      // this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      // this.sprite.inputEnabled = true;
      //
      // this.game.physics.arcade.enable(this.sprite);
      // this.sprite.body.collideWorldBounds = true;
      // this.sprite.body.bounce.setTo(1,1);
      // this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      // this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);
      //
      // this.sprite.events.onInputDown.add(this.clickListener, this);

      // load tilemap
      this.map = this.game.add.tilemap('level', 16, 16);
      // load tileset
      this.tileset = this.map.addTilesetImage('tileset1', 'tiles');
      //  Create our layer
      this.layer = this.map.createLayer(0);
      // this.layer = this.map.createBlankLayer('Bg');

      //  Resize the world
      this.layer.resizeWorld();

      //  set tiles collision
      this.map.setCollision([2, 4], true);
      this.layer.debug = true;

      //  Player
      this.player = this.game.add.sprite(400, 16, 'player', 1);
      this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
      this.player.body.setSize(10, 14, 2, 1);
      //  Allow cursors to scroll around the map
      this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    update: function() {
      this.game.physics.arcade.collide(this.player, this.layer);

      this.player.body.velocity.set(0);

      if (this.cursors.left.isDown)
      {
          this.player.body.velocity.x = -100;

      }
      else if (this.cursors.right.isDown)
      {
          this.player.body.velocity.x = 100;

      }
      else if (this.cursors.up.isDown)
      {
          this.player.body.velocity.y = -100;

      }
      else if (this.cursors.down.isDown)
      {
          this.player.body.velocity.y = 100;

      }

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
