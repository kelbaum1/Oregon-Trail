var prevLandmark = 0;
var nextLandmark = 1;

function landmark(name, x, y, miles) {
	this.name = name;
	this.xCoor = x;
	this.yCoor = y;
	this.milesTo = miles;
}

var landmarks = [];

landmarks.push(new landmark("Independence", 598, 158, 0));
landmarks.push(new landmark("Kansas River Crossing", 567, 151, 102)); //change coors
landmarks.push(new landmark("Big Blue River Crossing", 552, 144, 83)); // change coors
landmarks.push(new landmark("Fort Kearney", 520, 142, 119));
landmarks.push(new landmark("Chimney Rock", 479, 138, 250));
landmarks.push(new landmark("Laramie", 429, 130, 86));
landmarks.push(new landmark("Independence Rock", 384, 117, 190));
landmarks.push(new landmark("South Path", 349, 124, 102));
landmarks.push(new landmark("Fort Bridger", 315, 144, 125));
landmarks.push(new landmark("Green River Crossing", 319, 126, 57)); //change coors
landmarks.push(new landmark("Soda Springs", 300, 122, 162)); //change milesTo = 144 if Green River is taken
landmarks.push(new landmark("Fort Hall", 264, 114, 57));
landmarks.push(new landmark("Snake River Crossing", 221, 108, 182)); // change coors
landmarks.push(new landmark("Fort Boise", 200, 90, 114));
landmarks.push(new landmark("Blue Mountains", 172, 75, 160));
landmarks.push(new landmark("Fort Walla Walla", 165, 60, 55));
landmarks.push(new landmark("The Dalles", 144, 66, 125)); //change milesTo = 120 if Fort Walla Walla is taken
landmarks.push(new landmark("Oregon City", 112, 60, 100)); //change milesTo = 0 if Columbia River is taken



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
		//loadMap();	
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
			
/*function loadMap() {
var canvas = document.getElementById("mapCanvas");
var ctx = canvas.getContext("2d");
var img = document.getElementById("newmap");
ctx.drawImage(img, 0,0,665,215);
};*/


function getCoordinates(event)
{
	var canvas = document.getElementById("mapCanvas");
	var rect = canvas.getBoundingClientRect();
	x=Math.floor((event.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
	y=Math.floor((event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);
	
	document.getElementById("text").innerHTML="Coordinates: (" + x + "," + y + ")";
};

function clearCoordinates()
{
	document.getElementById("text").innerHTML="";
};

function connectTheDots(){
	var canvas = document.getElementById("mapCanvas");
	var ctx = canvas.getContext("2d");

	ctx.beginPath();
	
	for (i=1; i < landmarks.length; i++){
		ctx.moveTo(landmarks[i-1].xCoor, landmarks[i-1].yCoor);
		ctx.lineTo(landmarks[i].xCoor, landmarks[i].yCoor);
		ctx.stroke();
	}
};

function drawRouteToCurPos(from, to) {
	var canvas = document.getElementById("mapCanvas");
	var ctx = canvas.getContext("2d");

	ctx.beginPath();
	
	ctx.moveTo(landmarks[from].xCoor, landmarks[from].yCoor);
	ctx.lineTo(landmarks[to].xCoor, landmarks[to].yCoor);
	ctx.stroke();
};

console.log(document.getElementById("graphicsCanvas"));		

window.onload = startGame();
connectTheDots();
/*drawRouteToCurPos(0, 1);
drawRouteToCurPos(1, 2);
drawRouteToCurPos(2, 3);
drawRouteToCurPos(3, 4);
drawRouteToCurPos(4, 5);
drawRouteToCurPos(5, 6);
drawRouteToCurPos(6, 7);
drawRouteToCurPos(7, 9);
drawRouteToCurPos(9, 10);
*/
