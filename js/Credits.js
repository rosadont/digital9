var i = 0;
state.Credits = function (game){

};

state.Credits.prototype = {
    preload: function(){

    },
    create:function(){


	this.world.setBounds(0,0,800,600);
	this.text = ["Yay! You made it out of the cave!"];
	this.creditsText = this.add.text(this.world.centerX,this.world.centerY, "Yay! You did it!", {size: "32px", fill:'#FFF',align:"center"});

    },
    update: function(){
	if(this.input.activePointer.isDown){
	    if(i < this.text.length){
		this.creditsText.setText(this.text[i++]);
	    }
	    
	}

    }

}
