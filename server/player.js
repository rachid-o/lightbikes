module.exports = Player;

var C = require("./config");

function Player(id, color, size, x, y) {
	this.id = id;
  this.color = color;
	this.size = size;
	this.x = x;
	this.y = y;
	this.direction = 0;
	this.alive = true;
}


Player.prototype.isAlive = function() { 
	return this.alive;
}
Player.prototype.die = function() { 
	console.log(this.id + " dies ");
	this.alive = false;
}

Player.prototype.up = function() { 
	if(this.direction != C.DIRECTION.DOWN) {
		this.direction = C.DIRECTION.UP;
	}
};

Player.prototype.right = function() { 
	if(this.direction != C.DIRECTION.LEFT) {
		this.direction = C.DIRECTION.RIGHT;
	}
};

Player.prototype.down = function() { 
	if(this.direction != C.DIRECTION.UP) {
		this.direction = C.DIRECTION.DOWN;
	}
};

Player.prototype.left = function() { 
	if(this.direction != C.DIRECTION.RIGHT) {
		this.direction = C.DIRECTION.LEFT;
	}
};


Player.prototype.move = function() { 
	if(!this.alive) {
		return;
	}

	// var step = this.size;
	var step = 1;
	switch(this.direction) {
	case C.DIRECTION.UP:
		this.y -= step;
	    break;
	case C.DIRECTION.RIGHT:
		this.x += step;
	    break;
	case C.DIRECTION.DOWN:
		this.y += step;
	    break;
	case C.DIRECTION.LEFT:
		this.x -= step;
	    break;
	}	
};

