
function startGame() {
	console.log(document.getElementById("graphicsCanvas"));
	
	class gameArea {
		
		constructor (){
			this.canvas = document.getElementById("graphicsCanvas");
			console.log(this.canvas);
		}
		start(){
		//clearrect on this.context
			console.log(this.canvas);
			this.context = this.canvas.getContext("2d");
			this.interval = setInterval(updateGameArea, 20);
		}
		clear(){
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

		
		function updateGameArea() {
			myGameArea.clear();
			landmark.update();    
			landmark.draw();
			myGamePiece.draw();
		}
		var myGameArea = new gameArea();
		var myGamePiece = new component(30, 30, "red", 575, 77.75,myGameArea);
		var landmark = new component(20,60,"blue",15,50,myGameArea);
		myGameArea.start();
		loadMap();	
}
					
		function component(width, height, color, x, y, myGameArea) {
			this.width = width;
			this.height = height;
			this.speedX = 1;
			this.speedY = 0;
			this.x = x;
			this.y = y;    
			this.draw = function() {
				ctx = myGameArea.context;
				ctx.fillStyle = color;
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}
			this.update = function() {
				this.x += this.speedX;
				this.y += this.speedY;        
			}    
		}
					
		
		function loadMap() {
		var canvas = document.getElementById("mapCanvas");
		var ctx = canvas.getContext("2d");
		var img = document.getElementById("newmap");
		ctx.drawImage(img, 0,0,665,215);
		};
		
		console.log(document.getElementById("graphicsCanvas"));						
		window.onload = startGame();
		
		