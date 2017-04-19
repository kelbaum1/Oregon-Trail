
function startGame() {
	//console.log(document.getElementById("graphicsCanvas"));
	
	class gameArea {
		
		constructor (){
			this.canvas = document.getElementById("graphicsCanvas");
			console.log(this.canvas);
		}
		start(){
		//clearrect on this.context
			//console.log(this.canvas);
			this.context = this.canvas.getContext("2d");
			this.interval = setInterval(updateGameArea, 20);
		}
		clear(){
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

		
		function updateGameArea() {
			myGameArea.clear();
			if(landmark.x == myGamePiece.x)
			{
				landmark.stop();
			}
			landmark.update();    
			landmark.draw();
			myGamePiece.draw();
		}
		var myGameArea = new gameArea();
		var myGamePiece = new component(40, 40, "wagon", 575, 77.75,myGameArea);
		var landmark = new component(20,60,"landmark",15,50,myGameArea);
		myGameArea.start();
		loadMap();	
}
					
		function component(width, height, name, x, y, myGameArea) {
			this.width = width;
			this.height = height;
			this.speedX = 1;
			this.speedY = 0;
			this.x = x;
			this.y = y;    
			this.name = name;
			this.draw = function() {
				ctx = myGameArea.context;
				
			if(this.name == "wagon")
			{
				var wagon = new Image();
				wagon.src = "pics/shittywagon.jpg";
				ctx.drawImage(wagon,this.x,this.y,this.width, this.height);
			}
			else{
				ctx.fillStyle = "blue";
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}
		}
			
			this.update = function() {
				this.x += this.speedX;
				this.y += this.speedY;        
			}    
			this.stop = function()
			{
				this.speedX = 0;
				this.speedY = 0;
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
		
		