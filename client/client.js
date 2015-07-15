$(function() {
  var $window = $(window);
  var $logArea = $('.logArea'); // Char area
  var $body = $('body');

  var socket = io();
  var ctx = $('#world')[0].getContext("2d");


  function setupWorld(world) {
    console.log("Setup world: ", Object.keys(world), world);
    ctx.canvas.width = world.width;
    ctx.canvas.height = world.height;
  }


  function draw(data) {
    var world = data.world;
    var grid = world.grid;
    for(var x = 0; x < world.tiles_width; x++) {
      for(var y = 0; y < world.tiles_height; y++) {
        if(grid[x][y] != null) {
          // console.log("nonu: ", grid[x][y]);
          drawRect(x * world.tileSize, y * world.tileSize, world.tileSize, grid[x][y])
        }
      }
    }
  }

  function drawRect(x, y, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.rect(x, y, size, size);
      ctx.closePath();
      ctx.fill();      
  }


  function logClients(data) {
    var msg = "clients: " + data.totalPlayers;
    if(data.world.paused) {
      msg += "   (paused) ";
    }
    $logArea.text(msg);
  }


  // Keyboard events
  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      // $currentInput.focus();
    }

    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
    }

    var newDirection = 0;
    switch(event.keyCode) {

    case 32: // SPACE
      socket.emit("toggle pause", newDirection);
      break;
    case 37: // LEFT
    case 38: // UP
    case 39: // RIGHT 
    case 40: // DOWN
      newDirection = event.keyCode;
      break;
    }
    if(newDirection > 0) {
      // console.log("newDirection: ", newDirection);
      // TODO: check if current direction is changed
      socket.emit("change direction", newDirection);
    }

  });

  function showConnectionStatus() {
    if(socket.connected) {
      $body.css("background-color", "#F6FAFC");
    } else {
      $body.css("background-color", "#FFBFB7");
    }
  }
  

  socket.on('connected', function (data) {
    console.log("Connected to server, got ID: ", data.id);
    showConnectionStatus();
    console.log("data: ", data);
    setupWorld(data.world);
    // logClients(data);
    draw(data);
  });

  socket.on("disconnect", function(){
    console.log("disconnected from server");
    showConnectionStatus();
  });

  socket.on('user joined', function (data) {
    // console.log(data.player + ' joined, ', data);
    // logClients(data);
  });

  socket.on('user left', function (data) {
    // console.log(data.player + ' left. ', data);
    // logClients(data);
  });

  socket.on('draw', function (data) {
    // console.log("draw: ", data);
    draw(data);
    logClients(data);
  });


});