// Oregon Trail
// main.js

$(document).ready(function(){

	$(".title").show();
	$(".setup").hide();
	$(".store").hide();
	$(".mainGameScreen").hide();

    $("#playGame").click(function(){
        $(".title").hide();
		$(".setup").show();
    });

	$("#rations").html("rations: filling");
	$("#pace").html("pace: steady");
	$("#food").html("food: " + wagon.food + " pounds");
	$("#health").html("health: good");
	$("#weather").html("weather: sunny");
	$("#log").html("arrived at: " + landmarks[wagon.landmarkIndex].name);
	$("#distanceToLandmark").html("to next landmark: " + wagon.nextLandmark + " miles");
	
	$("#btnBuy").prop("disabled",true);
	$("#btnTalk").prop("disabled",true);
	$("#btnPause").prop("disabled",true);

	$("button").click(function(){
		stop();
	});
	
	$("#btnSetup").click(function() {
		
		function alphanumeric(text)  
		{   
			var letters = /^[0-9a-zA-Z]+$/;  
			if(text.match(letters)) {
				return true;  
			}  
			else {  
				alert('Please input alphanumeric characters only');  
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
		
		$(".setup").hide();
		$(".store").show();
	});
	
	$("#btnStore").click(function() {
		goToStore();
	});
	
	$("#btnInsertTombstone").click(function() {
		insertTombstone();
	});
	
	$("#btnInsertScore").click(function () {
		insertScore();
	});

	$("#btnRations").click(function(){
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
				if(result == 'filling') wagon.rations = 3;
				else if(result == 'meager') wagon.rations = 2;
				else if(result == 'bare bones') wagon.rations = 1;
				else wagon.rations = 0;
				$("#rations").html("rations: " + result);
			}
		});
	});

	$("#btnBuy").click(function(){
		bootbox.alert("go to the general store");
		goToStore();
	});

	$("#btnTrade").click(function(){
		// get random trade deal
		bootbox.confirm({
			message: "Do you want to make the trade?",
			buttons: {
				confirm: {
					label: 'Yes',
					className: 'btn-success'
				},
				cancel: {
					label: 'No',
					className: 'btn-danger'
				}
			},
			callback: function (result) {
				console.log('This was logged in the callback: ' + result);
				// update the wagon supplies and money
			}
		});
	});

	$("#btnTalk").click(function(){		
		bootbox.alert("" + speech[getRandomInt(0, speech.length - 1)]);
		$("#log").html(speech[getRandomInt(0, speech.length - 1)]);
	});

	$("#btnRest").click(function(){		
		var maxRest = 9;
		bootbox.prompt({
			title: "How many days do you want to rest? The maximum is "+maxRest+" days.",
			inputType: 'number',
			callback: function (result) {
				console.log(result);
				for(var i = 0; i < result && i < maxRest; i++) {
					travelOneDay(true);
				}
			}
		});
	});
		
	$("#btnFish").click(function(){
		if(wagon.lures > 0) {
			wagon.lures--;
			var fish = getRandomInt(0, 10);
			bootbox.alert("You caught " + fish + " fish.");
			wagon.food += fish*10;
			$("#food").html("food remaining: " + wagon.food + " pounds");
			$("#lures").html("fishing lures remaining: " + wagon.lures);
		}
		else {
			bootbox.alert("You have no fishing lures left!");
		}
	});

	$("#btnPace").click(function(){
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
				if(result == 'steady') wagon.pace = 5;
				else if(result == 'strenuous') wagon.pace = 7;
				else if(result == 'grueling') wagon.pace = 10;
				else wagon.pace = 0;
				$("#pace").html("pace: " + result);
			}
		});
	});

	$("#btnPause").click(function(){
		stop();
	});

	$("#btnContinue").click(function(){
		startTravel();
	});
	
	$("#btnTopScores").click(function () {
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
	});

	$("#btnTombstones").click(function () {
		getTombstones();
	});
});

function goToStore() {
	var cost = 0;
	var budget = wagon.money;
	var multiplier = 1;

	var oxen = document.getElementById("oxen").value;
	var food = document.getElementById("buyFood").value;
	var clothes = document.getElementById("clothes").value;
	var lures = document.getElementById("lures").value;
	var wheels = document.getElementById("wheels").value;
	var axles = document.getElementById("axles").value;
	var tongues = document.getElementById("tongues").value;
	
	var supplies = [oxen, food, clothes, lures, wheels, axles, tongues];
	var basePrices = [40, 0.20, 10, 1, 10, 10, 10];

	for(var i = 0; i < supplies.length; i++) {
		if(isNaN(parseInt(supplies[i]))) {
			return false;
		}
		else {
			cost += parseInt(supplies[i]) * basePrices[i] * multiplier;
			if(cost > budget) {
				return false;
			}
		}
	}
	
	wagon.oxen += oxen;
	wagon.food += food;
	wagon.clothing += clothes;
	wagon.lures += lures;
	wagon.wheels += wheels;
	wagon.axles += axles;
	wagon.tongues += tongues;
	wagon.money -= cost;
	
	$(".store").hide();
	$(".mainGameScreen").show();
	return supplies;
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

function insertTombstone() {
	bootbox.prompt({
		title: "Enter in a message for your tombstone",
		inputType: 'textarea',
		callback: function (result) {
			console.log(result);
			xmlhttp = new XMLHttpRequest();
			var dateFormatted = [wagon.date.getFullYear(), wagon.date.getMonth() + 1, wagon.date.getDate()].join('-');
			xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/connect.php?arg=" + "insertTombstone" + "&dod=" + dateFormatted + "&name=" + wagon.people[0] + "&mile=" + wagon.milesTraveled + "&msg=" + result, true);
			xmlhttp.send();
		}
	});
}

function insertScore() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/connect.php?arg=" + "insertScore" + "&usr=" + wagon.people[0] + "&points=" + wagon.points + "&rating=" + "something", true);
	xmlhttp.send();
}

// a method of the Wagon object??
function travelOneDay(resting = false) {

	if(!wagon.finishedCrossing) {
		crossRiver();
		return;
	}
	
	if(!wagon.passedFork) {
		chooseFork(wagon.landmarkIndex + 1, wagon.landmarkIndex + 2);
		return;
	}

	wagon.atLandmark = false;

	wagon.date.setDate(wagon.date.getDate() + 1);
	$("#currentDate").html("date: " + monthName[wagon.date.getMonth()] + " " + wagon.date.getDate() + ", " + wagon.date.getFullYear());
	
	wagon.food -= wagon.rations * wagon.people.length; // modify this formula
	if(wagon.food < 0) {
		wagon.food = 0;
	}
	$("#food").html("food remaining: " + wagon.food + " pounds");
	
	
	if(resting) {
		return;
	}

	// if health < 0:
	// you died
	// insertTombstone();
	
	// get random events, both good and bad
	
	// update random-ish weather
	
	// animate the wagon
	var pace = wagon.pace * wagon.oxen;
	
	// update health based on food consumption and travel pace, check for death
	
	// check for a tombstone
	// if the wagon has reached or passed the first tombstone: pop it
	if(!(tombstones === undefined || tombstones.length == 0) && wagon.milesTraveled + pace >= tombstones[0][4]) {
		bootbox.alert(tombstones[0][2] + " " + tombstones[0][3] + " " + tombstones[0][5]);
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
	
	// update the map
	
	if(wagon.atLandmark) {
		stop();
		// display new graphic
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
	points += health_of_party_per_person * wagon.people.length;
	points += 50; // for bringing the wagon
	points += 4 * wagon.oxen;
	points += 2 * wagon.wheels;
	points += 2 * wagon.axles;
	points += 2 * wagon.tongues;
	points += 2 * wagon.clothing;
	points += 1 * wagon.lures;
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
				console.log(result);
				if(result == 'ford') {
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
	bootbox.alert("Congrats, you crossed the river! That was easy.");
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
				text: 'to ' + landmarks[i1].name,
				value: i1,
			},
			{
				text: 'to ' + landmarks[i2].name,
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

/*
function setupSubmit() {
	var leaderType = document.querySelector('input[name = "occupation"]:checked').value;
	alert(leaderType);
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
	
	var month = parseInt(document.getElementById("month").value);
	wagon = new Wagon(month, leaderType, people);
}
	
function alphanumeric(text)  
{   
	var letters = /^[0-9a-zA-Z]+$/;  
	if(text.match(letters)) {
		return true;  
	}  
	else {  
		alert('Please input alphanumeric characters only');  
		return false;  
	}  
}
*/

function Wagon(month, leaderType, names) {
	
	this.date = new Date(1848, month, 0);
	this.leaderType = leaderType;
	this.people = names; // [] does each person have an individual health status??
	
	this.weather = "cloudy";
	
	// supplies
	this.oxen = 4;
	this.clothing = 0;
	this.food = 0;
	this.lures = 10;
	this.wheels = 0;
	this.axles = 0;
	this.tongues = 0;
	this.money = 0;
	if(leaderType == "banker") this.money = 1600;
	if(leaderType == "carpenter") this.money = 800;
	if(leaderType == "farmer") this.money = 400;
	
	this.multiplier = 0;
	this.points = 0;
	this.distance = 0;
	
	this.milesTraveled = 0;
	this.nextLandmark = 102;
	
	this.health = "very good";
	this.pace = 5; // steady
	this.rations = 3; // filling
	
	this.landmarkIndex = 0;
	this.atLandmark = false;
	this.finishedCrossing = true;
	this.passedFork = true;
};

function updateSupplies() {
	return;
};

function Landmark(name, mileMarker, fort = false, river = false, fork = false) {
	this.name = name;
	this.mileMarker = mileMarker;
	this.fort = fort;
	this.river = river;
	this.fork = fork;
};

// returns a random integer between min and max, inclusive
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

var illness = ['measles', 'snakebite', 'dysentery', 'typhoid', 'cholera', 'exhaustion'];
var randomFind = ['food', 'supplies', 'water'];
var randomBad = ['no water', 'fire', 'theft', 'lost', 'broken', 'rough trail', 'heavy fog'];
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var speech = ['hi', 'see you later', 'good luck'];
var health = ['good', 'fair', 'poor', 'very poor', 'dead'];

var loop;
var wagon = new Wagon(4, "banker", ["Rachel", "Sarah", "Henry", "George", "Nancy"]);
var tombstones = getTombstones();


var landmarks = [
	new Landmark("Independence, Missouri", 102, true),
	new Landmark("Kansas River Crossing", 82, false, true),
	new Landmark("Big Blue River Crossing", 118, false, true),
	new Landmark("Fort Kearney", 250, true, false),
	new Landmark("Chimney Rock", 86),
	new Landmark("Fort Laramie", 190, true),
	new Landmark("Independence Rock", 102),
	new Landmark("South Pass", 57, false, false, true),
		new Landmark("Green River Crossing", 143, false, true),
		new Landmark("Fort Bridger", 150, true),
	new Landmark("Soda Springs", 57),
	new Landmark("Fort Hall", 164, true),
	new Landmark("Snake River Crossing", 113, false, true),
	new Landmark("Fort Boise", 160, true),
	new Landmark("Blue Mountains", 180, false, false, true),
		new Landmark("The Dalles", 100),
		new Landmark("Fort Walla Walla", 150, true),
	new Landmark("Columbia River", 50, false, true),
	new Landmark("Oregon City, Oregon", 0)
];