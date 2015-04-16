var keys = Phaser.Keyboard;
var jumpEnable = false;
var timer = 0;

state.Game2 = function (game){

};

state.Game2.prototype = {
    preload: function(){
	this.load.image('healthBar','assets/health_bar.png');
	this.load.audio('jump',['assets/audio/mario_jump.mp3']);
	this.load.tilemap('map','assets/lab.json',null,Phaser.Tilemap.TILED_JSON);
	this.load.image('gate','assets/tiles/gate.png');
	this.load.image('gate2','assets/tiles/gate.png');
	this.load.image('tiles','assets/tiles/tiles.png');
	this.load.spritesheet('scientist','assets/dude.png',32, 48);
	this.load.spritesheet('dude','assets/girl-sprite.png',31, 48);
	this.load.image('heart','assets/pill.png')

    },

    create: function(){

	this.jump = this.add.audio('jump');
	
	//Importing tilemap stuff
	this.map = this.add.tilemap('map');
	this.map.addTilesetImage('tiles','tiles');
	//this.map.addTilesetImage('tiles3','tiles3');
	this.map.addTilesetImage('gate');
	this.map.addTilesetImage('gate2');
	this.layer = this.map.createLayer('ground');
	this.enemyBounds = this.map.createLayer('enemyBounds');
	this.enemyBounds.alpha = 0; //Make the ice cubes invisible
	this.layer.resizeWorld() //Resize world to JSON size

	//Enabling game physics
	this.physics.startSystem(Phaser.Physics.ARCADE);
	this.physics.arcade.enable(this.enemyBounds);
	this.map.setCollisionBetween(0,6); //Tile index for Ground layer
	this.map.setCollisionBetween(7,7, true, 'enemyBounds'); //Ice cube that will check bounds to prevent NPC from falling
	

	//Adding object groups
	this.gates = this.add.group();
	this.gate = this.gates.create(2400,this.world.height-250,'gate');
	this.physics.arcade.enable(this.gate);
	this.gates.enableBody = true;
	this.gates2 = this.add.group();
	this.gate2 = this.gates2.create(10,this.world.height-100,'gate2');
	this.physics.arcade.enable(this.gate2);
	this.gates2.enableBody = true;
	
	this.enemies = this.add.group();
	this.createEnemy();
	
	this.hearts = this.add.group();
	this.hearts.enableBody = true;
	this.createHearts();

	//Spawning the player and the animations
	this.player = this.add.sprite(this.world.width - 3000,this.world.height - 200, 'dude');
	this.physics.arcade.enable(this.player);
	this.player.animations.add('left',[0, 1, 2, 3],10,true);
	this.player.animations.add('right',[5, 6, 7, 8],10,true);
	this.player.body.bounce.y = 0.1;
	this.player.body.gravity.y =  400;
	this.player.body.collideWorldBounds = true;
	
	//Adding the camera again
	this.camera.follow(this.player);
	
	//enemy Moves
	this.time.events.loop(Phaser.Timer.SECOND, this.enemyMove,this);
	
	//ALlow the player to jump LOLOLOLOL every 2 seconds LULZ
	this.time.events.loop(Phaser.Timer.SECOND*2, function(){this.jumpEnable = true;},this);
	
	//Loop the ALert text
	this.alertText = this.add.text(this.camera.width/2, this.camera.height/2, "ALERT!",{fontSize:'36px', fill: '#FFF'});
	this.alertText.anchor.setTo(0.5,0.5);
	this.alertText.fixedToCamera = true;
	this.alertText.visible = false;
	
	//Health text to be setup
	this.healthText = this.add.text(0,0,'Health: ',{fontSize: '24px', fill: '#FFF'});
	this.healthText.fixedToCamera = true;
	this.healthBar = this.add.image(100,1,'healthBar');
	this.healthBar.fixedToCamera = true;
	this.healthBar.width = 180; //The width of the image

	//The health value that will resize the health bar throughout game
	this.healthVal = this.healthBar.width;

    },

    update: function(){

	this.physics.arcade.collide(this.player, this.layer);
	this.physics.arcade.collide(this.enemies, this.layer);
	this.physics.arcade.collide(this.hearts, this.layer);
	this.physics.arcade.collide(this.enemies, this.enemyBounds);
	this.physics.arcade.collide(this.player, this.enemies, this.enemyHurt,null,this);
	this.physics.arcade.overlap(this.player, this.hearts, this.collectHeart,null,this);
	//this.physics.arcade.overlap(this.player, this.gates, this.endGame,null,this);
	this.physics.arcade.overlap(this.player, this.gates2, this.endGame,null,this);

	//Stop the player from moving when no keys are pressed
	this.player.body.velocity.x = 0;

	if(this.input.keyboard.isDown(keys.RIGHT)){

	    this.player.body.velocity.x = 200;
	    this.player.animations.play('right');

	}
	else if(this.input.keyboard.isDown(keys.LEFT)){
	    
	    this.player.body.velocity.x = -200;
	    this.player.animations.play('left');

	}else{
	    this.player.animations.stop();
	    this.player.frame = 4;
	}
	
	//Jumping mechanic
	if(this.input.keyboard.isDown(keys.UP) &&
	   this.jumpEnable === true) {
	    this.jump.volume = 0.4;
	    this.jump.play();
	    this.player.body.velocity.y = -400;
	    this.jumpEnable = false;
	}
	
	this.updateHealthBar(this.healthVal);
	
	//Alert function
	timer += this.time.elapsed;
	if(timer >= 5000){ //5 seconds
	    timer -= 5000;
	    this.alertText.visible = !(this.alertText.visible);
	    }
    },
    
    createEnemy: function(){

	//Spawn X amount of enemies
	for(var i=0; i<35; i++){
	    this.enemy = this.enemies.create(this.world.randomX,this.rnd.integerInRange(100,600),'scientist');
	    this.physics.arcade.enable(this.enemy);
	    this.enemy.body.gravity.y = 400;
	    this.enemy.body.bounce.y = 0.2;
	    this.enemy.animations.add('left',[4,3,2,1], 10,true);
	    this.enemy.animations.add('right',[5,6,7,8], 10, true);
	    this.enemy.body.collideWorldBounds = true;
	}
    },
    
    //Adds movement for the enemies
    enemyMove: function(){
	this.enemies.forEach(function(enemy) {
	    var x = Math.round(Math.random())
	    if(x == 1){
		enemy.animations.play('left');
		enemy.body.velocity.x = -100;
	    }
	    if(x == 0) {
		enemy.animations.play('right');
		enemy.body.velocity.x = 100;
	    }
	},this);
    },
    
    enemyHurt: function(player, enemies){
	this.player.x = this.player.x - 5;
	this.player.y = this.player.y - 10

	if(this.healthVal > 0){
	    this.healthVal -= 9;
	    this.updateHealthBar(this.healthVal);
	}
	if(this.healthVal <= 0){
	    player.kill();
	    this.state.restart('Game'); //Does this work?
	}
	
    },
    
    createHearts: function(){
	for(var i = 0; i < 65; i++) {
	    this.heart = this.hearts.create(this.rnd.integerInRange(100,this.world.width - 100),this.rnd.integerInRange(100,this.world.height - 400),'heart'); //Spawn a heart with an offset of 100 from the left game border and minus 100 which is 100 off the right game border. Do the same with the height for top and bottom

	    this.physics.arcade.enable(this.heart)
	    this.heart.body.gravity.y = 400;
	    this.heart.body.bounce.y = 0.1;
	    this.heart.body.collideWorldBounds = true;
	    
	}
    },

    collectHeart: function(player, hearts){
	hearts.kill();
	//Check to see that the health is less than 180 but not 0
	//Make sure that health val is NOT 180 or higher
	if(this.healthVal > 0 && !(this.healthVal >= 180)){

	    this.healthVal +=9; //9 is a factor of 180, so increment it by this much

	}

	
	
	this.updateHealthBar(this.healthVal);
		
    },
    
    alert: function(){
	var blinks = 0;
	this.alertText.setText("ALERT!");
	var loop = this.time.events.loop(Phaser.Timer.SECOND*1, function(){
	    if(blinks <=3){
		this.alertText.visible = !this.alertText.visible
		blinks += 1;
	    }else{
		this.time.events.remove(loop);
	    }

	},this);

		     
			     
    },

    updateHealthBar: function(healthVal){
	this.healthBar.width = this.healthVal;
	return this.healthBar.width;
    },

    endGame: function(){
	this.state.start('Credits',true,false);
    },

}
