var state = {};

state.Boot = function (game){

};

state.Boot.prototype = {

    preload: function(){
	//this.load.spritesheet('dude','assets/dude.png',32,48);
//	this.load.spritesheet('baddie','assets/baddie.png', 32,32);
//	this.load.spritesheet('heart','assets/heart.png');
    },

    create: function(){
	this.intro = this.add.text(this.world.centerX, this.world.centerY, "", {size: "32px", fill:"#FFF", align: "center"}); //Setting the text object's spawn location
	
	this.intro.anchor.setTo(0.5,0.5); //Anchoring it to the top center
	this.introText(); //calling the text
    },

    update: function(){
	if(this.input.activePointer.isDown){
	    this.intro.setText("Be alert for monsters and obstacles!");
	    this.time.events.add(Phaser.Timer.SECOND*3,this.startGame,this);
	    }
    },
    
    introText: function(){

	this.intro.setText("Get out of the cave! \n\nGo find the right door!");
	this.time.events.add(Phaser.Timer.SECOND*2,function(){
	    
	    this.intro.setText("Don't get confused with the wrong doors! \nIt can hurt you!\n\nClick to continue...");}, this);
    },

    startGame: function(){
	this.state.start('Game');
    }

}
