// Oregon Trail
// Oregon.js
// Michael Kelbaugh

$(document).ready(function(){

	$(".setupPage").hide();
	$(".storePage").hide();
	$(".mainPage").hide();
	$(".titlePage").show();

	$("button").click(function(){
		stop();
	});

    $("#btnTitle").click(function(){
        $(".titlePage").hide();
		$(".setupPage").show();
    });
	
	$("#btnSetup").click(function() {
		setupGame();
		$(".setupPage").hide();
		$(".storePage").show();

		$("#rations").html("rations: " + wagon.rations);
		$("#pace").html("pace: " + wagon.pace);
		$("#food").html("food: " + wagon.food + " pounds");
		$("#health").html("health: " + wagon.health);
		$("#weather").html("weather: " + wagon.weather);
		$("#log").html("arrived at: " + landmarks[wagon.landmarkIndex].name);
		$("#distanceToLandmark").html("to next landmark: " + wagon.nextLandmark + " miles");
		
		$("#btnBuy").prop("disabled",false);
		$("#btnTalk").prop("disabled",false);
		$("#btnPause").prop("disabled",true);
	});
	
	$("#btnStore").click(function() {
		$(".storePage").hide();
		
		if(updateSupplies()) {
			$(".mainPage").show();
			myGameArea.start();
			$("#rations").html("rations: " + wagon.rations);
			$("#pace").html("pace: " + wagon.pace);
			$("#food").html("food: " + wagon.food + " pounds");
			$("#health").html("health: " + wagon.health);
			$("#weather").html("weather: " + wagon.weather);
			$("#log").html("arrived at: " + landmarks[wagon.landmarkIndex].name);
			$("#distanceToLandmark").html("to next landmark: " + wagon.nextLandmark + " miles");
			$("#wheels").html("wheels: " + wagon.wheels);
			$("#axles").html("axles: " + wagon.axles);
			$("#tongues").html("tongues: " + wagon.tongues);
			$("#oxen").html("oxen: " + wagon.oxen);
			$("#clothing").html("clothing: " + wagon.clothing);
			$("#bait").html("bait: " + wagon.bait);
			$("#people").html("people: " + wagon.people[0].name + " " + wagon.people[0].health + " "+ wagon.people[1].name + " " + wagon.people[1].health + " "+ wagon.people[2].name + " " + wagon.people[2].health + " "+ wagon.people[3].name + " " + wagon.people[3].health + " "+ wagon.people[4].name + " " + wagon.people[4].health);
			
		}
	});
	
	$("#btnInsertTombstone").click(function() {
		insertTombstone();
	});
	
	$("#btnInsertScore").click(function () {
		insertScore();
	});

	$("#btnRations").click(function(){
		updateRations();
		$("#rations").html("rations: " + wagon.rations);
	});

	$("#btnBuy").click(function(){
		$(".mainPage").hide();
		$(".storePage").show();
	});

	$("#btnTrade").click(function(){
		makeTrade();
	});

	$("#btnTalk").click(function(){		
		bootbox.alert("" + speech[getRandomInt(0, speech.length - 1)]);
	});

	$("#btnRest").click(function(){		
		takeRest();
	});
		
	$("#btnFish").click(function(){
		goFishing();
		$("#food").html("food remaining: " + wagon.food + " pounds");
		$("#bait").html("fishing bait remaining: " + wagon.bait);
	});

	$("#btnPace").click(function(){
		updatePace();
		$("#pace").html("pace: " + wagon.pace);
	});

	$("#btnPause").click(function(){
		stop();
	});

	$("#btnContinue").click(function(){
		startTravel();
	});
	
	$("#btnTopScores").click(function () {
		getScores();
	});

	$("#btnTombstones").click(function () {
		getTombstones();
	});

function setupGame() {
	function alphanumeric(text)  
	{   
		var letters = /^[0-9a-zA-Z]+$/;  
		if(text.match(letters)) {
			return true;  
		}  
		else {  
			alert('Please input alphanumeric characters only.');  
			return false;  
		}  
	}
	
	var leaderType = document.querySelector('input[name = "occupation"]:checked').value;
	var people = [ document.getElementById("leaderName").value,
				document.getElementById("person1").value, 
				document.getElementById("person2").value,
				document.getElementById("person3").value,
				document.getElementById("person4").value ];
	for(var i = 0; i < people.length; i++) {
		if(!alphanumeric(people[i])) {
			return false;
		}
	}
	
	var month = document.getElementById("month").value;
	wagon = new Wagon(month, leaderType, people);
}

function goFishing() {
	if(wagon.bait > 0) {
		wagon.bait--;
		var fish = getRandomInt(0, 10);
		bootbox.alert("You caught " + fish + " fish.");
		wagon.food += fish*10;
	}
	else {
		bootbox.alert("You have no fishing bait left!");
	}
}

function takeRest() {
	var maxRest = 9;
	bootbox.prompt({
		title: "How many days do you want to rest? The maximum is " + maxRest + " days.",
		inputType: 'number',
		callback: function (result) {
			console.log(result);
			for(var i = 0; i < result && i < maxRest; i++) {
				travelOneDay(true);
			}
		}
	});
}

function makeTrade() {
	// get random trade deal
	bootbox.confirm({
		message: "Do you want to make the trade?",
		buttons: {
			confirm: {
				label: 'Yes',
				value: 1,
				className: 'btn-success'
			},
			cancel: {
				label: 'No',
				value: 0,
				className: 'btn-danger'
			}
		},
		callback: function (result) {
			console.log('This was logged in the callback: ' + result);
			if(value) {
				// make the trade, update the wagon supplies and money
			}
		}
	});
}

function updatePace() {
	bootbox.prompt({
		title: "Select your pace:",
		inputType: 'select',
		inputOptions: [
			{
				text: 'Choose one...',
				value: '',
			},
			{
				text: 'Steady',
				value: 'steady',
			},
			{
				text: 'Strenuous',
				value: 'strenuous',
			},
			{
				text: 'Grueling',
				value: 'grueling',
			}
		],
		callback: function (result) {
			console.log(result);
			if(result) wagon.pace = result;
		}
	});
}

function updateRations() {
	bootbox.prompt({
		title: "Select the level of rations:",
		inputType: 'select',
		inputOptions: [
			{
				text: 'Choose one...',
				value: '',
			},
			{
				text: 'Filling',
				value: 'filling',
			},
			{
				text: 'Meager',
				value: 'meager',
			},
			{
				text: 'Bare Bones',
				value: 'bare bones',
			}
		],
		callback: function (result) {
			console.log(result);
			if(result) wagon.rations = result;
		}
	});
}

function updateSupplies() {
	var cost = 0;
	var budget = wagon.money;
	var multiplier = 1;

	var oxen = document.getElementById("buyOxen").value;
	var food = document.getElementById("buyFood").value;
	var clothes = document.getElementById("buyClothes").value;
	var bait = document.getElementById("buyBait").value;
	var wheels = document.getElementById("buyWheels").value;
	var axles = document.getElementById("buyAxles").value;
	var tongues = document.getElementById("buyTongues").value;
	
	var supplies = [oxen, food, clothes, bait, wheels, axles, tongues];
	var basePrices = [20, 0.20, 10, 1, 10, 10, 10];

	for(var i = 0; i < supplies.length; i++) {
		if(isNaN(parseInt(supplies[i]))) {
			return false;
		}
		else {
			cost += parseInt(supplies[i]) * basePrices[i] * multiplier;
			if(cost > budget) {
				bootbox.alert("You don't have enough money to buy all these supplies.");
				return false;
			}
		}
	}
	
	wagon.oxen += parseInt(oxen);
	wagon.food += parseInt(food);
	wagon.clothing += parseInt(clothes);
	wagon.bait += parseInt(bait);
	wagon.wheels += parseInt(wheels);
	wagon.axles += parseInt(axles);
	wagon.tongues += parseInt(tongues);
	wagon.money -= cost;

	return supplies;
}


function stop() {
	$("#wagonStatus").html("Wagon is stopped");
	$("#btnPause").prop("disabled",true);
	clearInterval(loop);
}

function startTravel() {
	$("#btnPause").prop("disabled",false);
	$("#btnBuy").prop("disabled",true);
	$("#btnTalk").prop("disabled",true);
	$("#btnFish").prop("disabled",false);
	$("#wagonStatus").html("Wagon is moving");
	loop = setInterval(travelOneDay, 1000);
}

function getTombstones() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			tombstones = JSON.parse(this.responseText);
		}
	};
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/connect.php?arg=" + "getTombstones", true);
	xmlhttp.send();

	/*
	$.ajax({url: "demo_test.txt", success: function(result){
        $("#div1").html(result);
    }});
    */
}

function insertTombstone() {
	bootbox.prompt({
		title: "Sadly, your entire party died on the trip to Oregon. Write a message for your tombstone:",
		inputType: 'textarea',
		callback: function (result) {
			console.log(result);
			xmlhttp = new XMLHttpRequest();
			var dateFormatted = [wagon.date.getFullYear(), wagon.date.getMonth() + 1, wagon.date.getDate()].join('-');
			xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/connect.php?arg=" + "insertTombstone" + "&dod=" + dateFormatted + "&name=" + wagon.people[0].name + "&mile=" + wagon.milesTraveled + "&msg=" + result, true);
			xmlhttp.send();
		}
	});
}

function getScores() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var messageText = this.responseText;
			var dialog = bootbox.dialog({
				title: 'Top Scores',
				message: messageText,
				buttons: {
					cancel: {
						label: '<i class="fa fa-times"></i>Close'
					}
				}
			});
		}
	};
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/connect.php?arg=" + "getTopScores", true);
	xmlhttp.send();
}

function insertScore() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/connect.php?arg=" + "insertScore" + "&usr=" + wagon.people[0] + "&points=" + wagon.points + "&rating=" + "something", true);
	xmlhttp.send();
}

function travelOneDay(resting = false) {

	// check for landmarks
	if(!wagon.finishedCrossing) {
		crossRiver();
		return;
	}
	if(!wagon.passedFork) {
		chooseFork(wagon.landmarkIndex + 1, wagon.landmarkIndex + 2);
		return;
	}
	wagon.atLandmark = false;

	// increment the date
	wagon.date.setDate(wagon.date.getDate() + 1);
	$("#currentDate").html("date: " + monthName[wagon.date.getMonth()] + " " + wagon.date.getDate() + ", " + wagon.date.getFullYear());
	
	// update food
	var rations = 0;
	if(wagon.rations == 'filling') rations = 3;
	else if(wagon.rations == 'meager') rations = 2;
	else if(wagon.rations == 'bare bones') rations = 1;
	else {}
	wagon.food -= rations * wagon.people.length;
	if(wagon.food < 0) {
		wagon.food = 0;
		wagon.health -= 15;
	}
	if(wagon.rations == 'filling') wagon.health += 3;
	else if(wagon.rations == 'meager') ;
	else if(wagon.rations == 'bare bones') wagon.health -=5;
	else {}
	$("#food").html("food remaining: " + wagon.food + " pounds");
	
	// update weather
	if(getRandomInt(0, 1000) < 200) {
		wagon.weather = weather[getRandomInt(0, weather.length - 1)];
		$("#weather").html("weather: " + wagon.weather);
	}
	if(wagon.weather == 'fair') wagon.health += 10;
	else if(wagon.weather == 'hot') wagon.health -= 10;
	else if(wagon.weather == 'snow') wagon.health -= 10;
	else {}

	// update health based on clothing
	var avg = wagon.clothing / wagon.people.length;
	if(avg >= 4) wagon.health += 5;
	else if(avg >= 3) wagon.health += 3;
	else if(avg >= 2) wagon.health += 1;
	else if(avg >= 1) ;
	else if(avg >= 0) wagon.health -= 2;
	else wagon.health -= 5;

	// rest
	if(resting) {
		wagon.health += 25;
		return;
	}
	else {
		// update health based on pace
		var pace;
		if(wagon.pace == 'steady') {
			wagon.health += 1;
			pace = 5;
		}
		else if(wagon.pace == 'strenuous') { 
			wagon.health -= 3;
			pace = 7;
		}
		else if(wagon.pace == 'grueling') {
			wagon.health -= 5;
			pace = 10;
		}
		else {}
		pace *= wagon.oxen;
		pace = 5;
		var pixelPace = pace * (560 / landmarks[wagon.landmarkIndex].mileMarker);
		var flag = true;
		//setTimeout(100);
		while(wagon.milesToday < pixelPace)
		{
			setTimeout( function() { updateGameArea(myGameArea,landmarkIcon,wagonIcon,pixelPace);},500);
			
			wagon.milesToday++;
			console.log(wagon.milesToday,pixelPace);
		}
		wagon.milesToday = 0;
		// check for tombstones
		while(!(tombstones === undefined || tombstones.length == 0) && wagon.milesTraveled + pace >= tombstones[0][4]) {
			bootbox.alert({
				title: "Tombstone at Mile " + tombstones[0][4],
				message: tombstones[0][2] + " " + tombstones[0][3] + " " + tombstones[0][5]}
				);
			pace = tombstones[0][4] - wagon.milesTraveled;
			tombstones.splice(0, 1);
			stop();
		}

		if(pace > wagon.nextLandmark) {
			pace = wagon.nextLandmark;
			wagon.atLandmark = true;
		}

		wagon.nextLandmark -= pace;
		$("#distanceToLandmark").html("to next landmark: " + wagon.nextLandmark + " miles");
		wagon.milesTraveled += pace;
		$("#distanceTraveled").html("distance traveled: " + wagon.milesTraveled + " miles");
	}

	$("#health").html("health: " + wagon.health);
	if(wagon.health >= 850) wagon.multiplier = 1.5;
	else if(wagon.health >= 500) wagon.multiplier = 1.25;
	else wagon.multiplier = 1;

	// decide the health of individuals
	for (var i = 0; i < wagon.people.length; i++) {
		if(i == 0 && !(wagon.people[1].health == 'dead' && wagon.people[2].health == 'dead' && wagon.people[3].health == 'dead' && wagon.people[4].health == 'dead')) continue;
		if(wagon.people[i].health == 'healthy') {
			var random = getRandomInt(0, 1000*wagon.multiplier)
			if(random < 30) {
				wagon.people[i].health = 'sick';
				bootbox.alert(wagon.people[i].name + " has " + illness[getRandomInt(0,illness.length-1)]);
				stop();
				//break;
			}
		}
		else if(wagon.people[i].health == 'sick') {
			var random = getRandomInt(0, 1000*wagon.multiplier)
			if(random < 200) {
				wagon.people[i].health = 'dead';
				bootbox.alert(wagon.people[i].name + " died.");
				if(i == 0) {
					// the game is over
					insertTombstone();
				}
				stop();
				//break;
			}
			else if(random > 950) {
				wagon.people[i].health = 'healthy';
				bootbox.alert(wagon.people[i].name + " recovered from sickness.");
				stop();
				//break;
			}
			else {} // still sick
		}
		else {} // dead
	}
	$("#people").html("people: " + wagon.people[0].name + " " + wagon.people[0].health + " "+ wagon.people[1].name + " " + wagon.people[1].health + " "+ wagon.people[2].name + " " + wagon.people[2].health + " "+ wagon.people[3].name + " " + wagon.people[3].health + " "+ wagon.people[4].name + " " + wagon.people[4].health);
	var allDead = true;
	for(var i = 0; i < wagon.people.length; i++) {
		if(wagon.people[i].health != 'dead') allDead = false;
	}
	if(allDead) {
		// game over
	}
	
	// get random events, both good and bad
	
	// animate the wagon
	
	// update the map
	
	if(wagon.atLandmark) {
		stop();
		// display new graphic
		landmarkIcon.x = 15;
		wagon.landmarkIndex++;
		$("#log").html("arrived at: " + landmarks[wagon.landmarkIndex].name);
		
		if(landmarks[wagon.landmarkIndex].fort) {
			$("#btnBuy").prop("disabled",false);
			$("#btnTalk").prop("disabled",false);
			$("#btnFish").prop("disabled",true);
		}
		if(landmarks[wagon.landmarkIndex].river) {
			wagon.finishedCrossing = false;
			crossRiver();	
		}
		if(landmarks[wagon.landmarkIndex].fork) {
			wagon.passedFork = false;
		}
		// you've reached the end of the trail
		if(wagon.landmarkIndex == landmarks.length - 1) {
			var success = playRiverCrossingGame();
			if(success) {
				countPoints();
				insertScore();
				bootbox.alert("Congratulations, you made it to Oregon!\nScore: " + wagon.points + " points");
				$("#log").html("Congratulations, you made it to Oregon!\nScore: " + wagon.points + " points");
			}
			else {
				bootbox.alert("You failed to cross the river.");
				$("#log").html("Game over");
			}
			return;
		}

		wagon.nextLandmark = landmarks[wagon.landmarkIndex].mileMarker;
		$("#distanceToLandmark").html("to next landmark: " + wagon.nextLandmark + " miles");
	}
}

function countPoints() {
	var points = 0;
	points += wagon.health/2 * wagon.people.length;
	points += 50; // for bringing the wagon
	points += 4 * wagon.oxen;
	points += 2 * wagon.wheels;
	points += 2 * wagon.axles;
	points += 2 * wagon.tongues;
	points += 2 * wagon.clothing;
	points += 1 * wagon.bait;
	points += 0.04 * wagon.food;
	points += 0.2 * wagon.money;
	if (wagon.leaderType == 'carpenter') points *= 2;
	else if (wagon.leaderType == 'farmer') points *= 3;
	else {}
	return points;
}

function crossRiver() {
	stop();
	bootbox.prompt({
			title: landmarks[wagon.landmarkIndex].name,
			inputType: 'select',
			inputOptions: [
				{
					text: 'How do you want to cross the river?',
					value: '',
				},
				{
					text: 'attempt to ford the river',
					value: 'ford',
				},
				{
					text: 'caulk the wagon and float it across',
					value: 'caulk',
				},
				{
					text: 'take a ferry across',
					value: 'ferry',
				},
				{
					text: 'wait to see if conditions improve',
					value: 'wait',
				}
			],
			callback: function (result) {
				var weight = 1000 + wagon.oxen*1000 + wagon.clothing*5 + wagon.bait*1 + wagon.wheels*75 + wagon.axles*75 + wagon.tongues*75 + wagon.food*1 + wagon.people.length*130;
				var depth = getRandomInt(0, 80) / 10;
				var width = getRandomInt(100, 1000);
				if(result == 'ford') {
					if(depth > 3.5) {
						bootbox.alert("It was not a good crossing.")
						// you lose random supplies
					}
					wagon.finishedCrossing = true;
					$("#log").html("finished crossing: " + landmarks[wagon.landmarkIndex].name);
				}
				else if(result == 'caulk') {
					wagon.finishedCrossing = true;
					$("#log").html("finished crossing: " + landmarks[wagon.landmarkIndex].name);
				}
				else if(result == 'ferry') {
					wagon.finishedCrossing = true;
					$("#log").html("finished crossing: " + landmarks[wagon.landmarkIndex].name);
				}
				else if(result == 'wait') {
					
				}
				else {}
			}
		});
}

function playRiverCrossingGame() {
	bootbox.alert("Congrats, you crossed the final river! That was easy.");
	return true;
}

function chooseFork(i1, i2) {
	stop();
	bootbox.prompt({
		title: "There's a fork in the road:",
		inputType: 'select',
		inputOptions: [
			{
				text: 'Which path do you want to take?',
				value: '',
			},
			{
				text: 'head to ' + landmarks[i1].name,
				value: i1,
			},
			{
				text: 'head to ' + landmarks[i2].name,
				value: i2,
			}
		],
		callback: function (result) {
			console.log(result);
			if(result == i1) {
				landmarks.splice(i2, 1);
				wagon.passedFork = true;
			}
			else if(result == i2) {
				landmarks.splice(i1, 1);
				wagon.passedFork = true;
			}
			else {}
		}
	});
}

function Wagon(month, leaderType, names) {
	
	this.date = new Date(1848, month, 0);
	this.leaderType = leaderType;
	this.people = [];
	for(var i = 0; i < names.length; i++) {
		this.people.push(new Person(names[i]))
	}
	
	this.weather = 'fair';
	
	// supplies
	this.oxen = 0;
	this.clothing = 0;
	this.food = 0;
	this.bait = 0;
	this.wheels = 0;
	this.axles = 0;
	this.tongues = 0;
	this.money = 0;
	if(leaderType == 'banker') this.money = 1600;
	if(leaderType == 'carpenter') this.money = 800;
	if(leaderType == 'farmer') this.money = 400;
	
	this.health = 1000; // max = 1250, min 0
	this.pace = 'steady';
	this.rations = 'filling';
	this.multiplier = 1.5; // health multiplier
	this.points = 0;
	
	this.milesTraveled = 0;
	this.nextLandmark = landmarks[0].mileMarker;
	this.landmarkIndex = 0;
	this.atLandmark = true;
	this.finishedCrossing = true;
	this.passedFork = true;
};

function Landmark(name, distToNextLandmark, fort = false, river = false, fork = false) {
	this.name = name;
	this.mileMarker = distToNextLandmark;
	this.fort = fort;
	this.river = river;
	this.fork = fork;
};

function Person(name, health = 'healthy') {
	this.name = name;
	this.health = health;
}

class gameArea {
	
	constructor (){
		this.canvas = document.getElementById("graphicsCanvas");

	}
	start(){
	//clearrect on this.context
;
		this.context = this.canvas.getContext("2d");
	}
	clear(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

function updateGameArea(myGameArea,landmarkIcon,wagonIcon,pace) {
	myGameArea.clear();
	landmarkIcon.update(1);    
	landmarkIcon.draw();
	//setTimeout(100);
	wagonIcon.draw();

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
	
	this.update = function(pace) {
		this.x += pace;
     
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

// global types
var illness = ['measles', 'a snakebite', 'dysentery', 'typhoid', 'cholera', 'exhaustion'];
var randomFind = ['food', 'supplies', 'water'];
var randomBad = ['no water', 'fire', 'theft', 'lost', 'broken', 'rough trail', 'heavy fog'];
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var speech = ['hi', 'see you later', 'good luck'];
var health = ['good', 'fair', 'poor', 'very poor', 'dead'];
var weather = ['cloudy', 'sunny', 'fair', 'rainy'];

var landmarks = [
	new Landmark('Independence, Missouri', 102, true),
	new Landmark('Kansas River Crossing', 82, false, true),
	new Landmark('Big Blue River Crossing', 118, false, true),
	new Landmark('Fort Kearney', 250, true),
	new Landmark('Chimney Rock', 86),
	new Landmark('Fort Laramie', 190, true),
	new Landmark('Independence Rock', 102),
	new Landmark('South Pass', 57, false, false, true),
		new Landmark('Green River Crossing', 143, false, true),
		new Landmark('Fort Bridger', 150, true),
	new Landmark('Soda Springs', 57),
	new Landmark('Fort Hall', 164, true),
	new Landmark('Snake River Crossing', 113, false, true),
	new Landmark('Fort Boise', 160, true),
	new Landmark('Blue Mountains', 180, false, false, true),
		new Landmark('The Dalles', 100),
		new Landmark('Fort Walla Walla', 150, true),
	new Landmark('Columbia River', 50, false, true),
	new Landmark('Oregon City, Oregon', 0)
];

// returns a random integer between min and max, inclusive
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

var loop;
var wagon;
var tombstones = getTombstones();


var myGameArea = new gameArea();
var wagonIcon = new component(40, 40, "wagon", 575, 77.75,myGameArea);
var landmarkIcon = new component(20,60,"landmark",15,50,myGameArea);
//loadMap();
});