module.exports = World;

var Uuid = require('uuid');
var Player = require("./player.js");


function World(width, height, tileSize, onWorldRestart) {
	this.width = width;
	this.height = height;
	this.tileSize = tileSize;
	this.paused = true;
	if (width % tileSize !== 0) {
		throw ("ERROR: WORLD.WIDTH should be a multiple of tileSize");
	}
	if (height % tileSize !== 0) {
		throw ("ERROR: WORLD.HEIGHT should be a multiple of tileSize");
	}
	this.players = {};
	this.onWorldRestart = onWorldRestart;

	this.tiles_width = width / tileSize;
	this.tiles_height = height / tileSize;

	this.grid = new Array([this.tiles_width]);

	this.resetGrid();
}

World.prototype.resetGrid = function() {
	console.log("Reset Grid");
	for (var x = 0; x < this.tiles_width; x++) {
		this.grid[x] = new Array([this.tiles_height]);
		for (var y = 0; y < this.tiles_height; y++) {
			this.grid[x][y] = null;
		}
	}
	console.log("Created new grid of", this.tiles_width, "x", this.tiles_height, "tiles");
};


World.prototype.restart = function() {
	this.resetGrid();
	for (var id in this.players) {
		var p = this.players[id];
		p.alive = true;
		this.addPlayer(p);
	}
	this.paused = true;
	this.onWorldRestart();
};

World.prototype.restartWhenAllPlayersDied = function() {
	var playerAlive = null;
	for (var id in this.players) {
		var p = this.players[id];
		if (p.alive) {
			playerAlive = p;
			// return false;
			break;
		}
	}
	// this.restart();
	return playerAlive === null;
};

World.prototype.update = function(player) {
	if (this.paused) {
		return;
	}

	for (var id in this.players) {
		var p = this.players[id];
		if (!p.alive) {
			continue;
		}
		var nextPos = p.calcNextPosition();
		if (nextPos.x < 0 || nextPos.y < 0 || nextPos.x >= this.grid.length || nextPos.y >= this.grid[nextPos.x].length) {
			// Player collide with wall!
			p.die();
			if (this.restartWhenAllPlayersDied()) {
				return;
			}
		} else if (this.grid[nextPos.x][nextPos.y] !== null) {
			// Someone was already here
			p.die();
			if (this.restartWhenAllPlayersDied()) {
				return;
			}
		} else {
			// Set player to new position on grid
			p.setPostion(nextPos.x, nextPos.y);
			this.grid[nextPos.x][nextPos.y] = p.color;
		}
	}
};

World.prototype.createPlayer = function() {
	var player = new Player(Uuid.v4(), getNextColor(), this.tileSize);
	this.addPlayer(player);
	return player;
};

World.prototype.addPlayer = function(player) {
	// Initial direction is random
	player.direction = Math.floor((Math.random() * 4)) + 1;
	position = this.randomEmptyPosition();
	if (position !== null) {
		player.x = position.x;
		player.y = position.y;
		this.grid[player.x][player.y] = player.color;
		this.players[player.id] = player;
	}
};


World.prototype.randomEmptyPosition = function() {
	var x, y;
	var attemptsLeft = this.tiles_width * this.tiles_height;
	while (true) {
		if (attemptsLeft < 1) {
			console.log("Player can not be added. World is over crowded! ");
			break;
		}
		x = Math.floor(Math.random() * this.tiles_width);
		y = Math.floor(Math.random() * this.tiles_height);
		if (this.grid[x][y] !== null) {
			// This spot is already taken, try again...
			attemptsLeft--;
			continue;
		} else {
			return {
				x: x,
				y: y
			};
		}
	}
	return null;
};

World.prototype.getTotalPlayers = function(player) {
	return Object.keys(this.players).length;
};

World.prototype.togglePause = function() {
	this.paused = !this.paused;
};

World.prototype.pause = function(paused) {
	this.paused = paused;
};

World.prototype.removePlayer = function(player_id) {
	delete this.players[player_id];
};



var COLORS = [
	'#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a',
	'#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2',
	'#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5',
	'#e21400', '#91580f', '#f8a700', '#f78b00', '#58dc00', '#287b00',
	'#a8f07a', '#4ae8c4', '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
];
var currentColorIndex = 0;

function getNextColor() {
	currentColorIndex++;
	return COLORS[currentColorIndex % COLORS.length];
}
