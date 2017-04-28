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

		$("#budget").html("Money left to spend: $" + wagon.money);
	});
	
	$("#btnStore").click(function() {
		
		if(updateSupplies()) {
			$(".storePage").hide();
			$(".mainPage").show();

			$("#currentDate").html("date: " + monthName[wagon.date.getMonth()] + " " + wagon.date.getDate() + ", " + wagon.date.getFullYear());
			$("#rations").html("rations: " + wagon.rations);
			$("#pace").html("pace: " + wagon.pace);
			$("#health").html("health: " + wagon.health);
			$("#weather").html("weather: " + wagon.weather);
			$("#log").html("arrived at: " + landmarks[wagon.landmarkIndex].name);
			$("#distanceToLandmark").html("to next landmark: " + wagon.nextLandmark + " miles");

			displaySupplies();
			$("#people").html("people: " + wagon.people[0].name + " " + wagon.people[0].health + " "+ wagon.people[1].name + " " + wagon.people[1].health + " "+ wagon.people[2].name + " " + wagon.people[2].health + " "+ wagon.people[3].name + " " + wagon.people[3].health + " "+ wagon.people[4].name + " " + wagon.people[4].health);

			//$("#btnBuy").prop("disabled",false);
			//$("#btnTalk").prop("disabled",false);
			//$("#btnPause").prop("disabled",true);
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

function displaySupplies() {
	$("#food").html("food: " + wagon.food + " pounds");
	$("#wheels").html("wheels: " + wagon.wheels);
	$("#axles").html("axles: " + wagon.axles);
	$("#tongues").html("tongues: " + wagon.tongues);
	$("#oxen").html("oxen: " + wagon.oxen);
	$("#clothing").html("clothing: " + wagon.clothing);
	$("#bait").html("bait: " + wagon.bait);
}

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
	var supplies = ['oxen', 'food', 'clothing', 'bait', 'wheels', 'axles', 'tongues'];
	var buy = supplies[getRandomInt(0, supplies.length - 1)];
	supplies.splice(supplies.indexOf(buy), 1);
	var sell = supplies[getRandomInt(0, supplies.length - 1)];

	var buyQuantity = 0;
	if(buy == 'food') {
		buyQuantity = getRandomInt(20, 100);
	}
	else if(buy == 'bait') {
		buyQuantity = getRandomInt(2, 5);
	}
	else {
		buyQuantity = getRandomInt(1, 2);
	}

	var sellQuantity = 0;
	if(sell == 'food') {
		sellQuantity = getRandomInt(20, 100);
	}
	else if(sell == 'bait') {
		sellQuantity = getRandomInt(2, 5);
	}
	else {
		sellQuantity = getRandomInt(1, 2);
	}

	if(sellQuantity > eval("wagon." + sell)) {
		bootbox.alert("A traveler will give you " + buyQuantity + " " + buy + " in exchange for " + sellQuantity + " " + sell + ". You don't have this.");
	}
	else {
		bootbox.confirm({
			message: "A traveler will give you " + buyQuantity + " " + buy + " in exchange for " + sellQuantity + " " + sell + ". Do you want to make the trade?",
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
				if(result) {
					// make the trade, update the wagon supplies and money
					var buyCommand = "wagon." + buy + " += " + buyQuantity;
					var sellCommand = "wagon." + sell + " -= " + sellQuantity;
					eval(buyCommand);
					eval(sellCommand);
					displaySupplies();
				}
			}
		});
	}

	travelOneDay(true);
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
	var basePrices = [20, 0.20, 10, 15, 10, 10, 10];



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
	//$("#btnBuy").prop("disabled",true);
	//$("#btnTalk").prop("disabled",true);
	//$("#btnFish").prop("disabled",false);
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
		$("#log").html("finished crossing: " + landmarks[wagon.landmarkIndex].name);
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
		wagon.health -= 15*wagon.people.length;
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

	if(wagon.health < 0) wagon.health = 0;
	$("#health").html("health: " + wagon.health);
	if(wagon.health >= 850) wagon.multiplier = 1.5;
	else if(wagon.health >= 500) wagon.multiplier = 1.25;
	else if(wagon.health >= 300) wagon.multiplier = 1;
	else if(wagon.health >= 150) wagon.multiplier = 0.75;
	else wagon.multiplier = 0.5;

	// decide the health of individuals
	for (var i = 0; i < wagon.people.length; i++) {
		if(i == 0 && !(wagon.people[1].health == 'dead' && wagon.people[2].health == 'dead' && wagon.people[3].health == 'dead' && wagon.people[4].health == 'dead')) continue;
		if(wagon.people[i].health == 'healthy') {
			var random = getRandomInt(0, 1000*wagon.multiplier)
			if(random < 50) {
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
				if(i == 0) {
					// the game is over
					insertTombstone();
					$(".mainPage").hide();
					$(".titlePage").show();
				}
				else {
					bootbox.alert(wagon.people[i].name + " died.");
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
	
	// get random events, both good and bad
	
	// animate the wagon
	
	// update the map
	
	if(wagon.atLandmark) {
		stop();
		// display new graphic
		wagon.landmarkIndex++;
		$("#log").html("arrived at: " + landmarks[wagon.landmarkIndex].name);
		
		if(landmarks[wagon.landmarkIndex].fort) {
			//$("#btnBuy").prop("disabled",false);
			//$("#btnTalk").prop("disabled",false);
			//$("#btnFish").prop("disabled",true);
		}
		if(landmarks[wagon.landmarkIndex].river) {
			wagon.finishedCrossing = false;
		}
		if(landmarks[wagon.landmarkIndex].fork) {
			wagon.passedFork = false;
		}
		// you've reached the end of the trail
		if(wagon.landmarkIndex == landmarks.length - 1) {
			var success = playRiverCrossingGame();
			if(success) {
				insertScore();
				bootbox.alert("Congratulations, you made it to Oregon!\nScore: " + countPoints + " points");
				$("#log").html("Congratulations, you made it to Oregon!\nScore: " + wagon.points + " points");
				$(".mainPage").hide();
				$(".titlePage").show();
			}
			else {
				bootbox.alert("You failed to cross the river.");
				$("#log").html("Game over");
				insertTombstone();
				$(".mainPage").hide();
				$(".titlePage").show();
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
	return Math.max(0, points);
}

function crossRiver() {
	stop();
	var weight = 1000 + wagon.oxen*1000 + wagon.clothing*5 + wagon.bait*1 + wagon.wheels*75 + wagon.axles*75 + wagon.tongues*75 + wagon.food*1 + wagon.people.length*130;
	var depth = getRandomInt(0, 80) / 10;
	var width = getRandomInt(100, 1000);
	var danger = width + weight;
	if(wagon.weather == 'snowy') danger *= 1.3;
	if(wagon.weather == 'rainy') danger *= 1.2;

	function loseRandomSupplies() {
		var oxen = getRandomInt(-5, Math.min(2, wagon.oxen));
		if(oxen > 0) wagon.oxen -= oxen;
		var food = getRandomInt(-5, Math.min(100, wagon.food));
		if(food > 0) wagon.food -= food;
		var clothing = getRandomInt(-5, Math.min(2, wagon.clothing));
		if(clothing > 0) wagon.clothing -= clothing;
		var bait = getRandomInt(-5, Math.min(5, wagon.bait));
		if(bait > 0) wagon.bait -= bait;
		var wheels = getRandomInt(-5, Math.min(1, wagon.wheels));
		if(wheels > 0) wagon.wheels -= wheels;
		var axles = getRandomInt(-5, Math.min(1, wagon.axles));
		if(axles > 0) wagon.axles -= axles;
		var tongues = getRandomInt(-5, Math.min(1, wagon.tongues));
		if(tongues > 0) wagon.tongues -= tongues;
	}

	bootbox.prompt({
			title: landmarks[wagon.landmarkIndex].name + ": " + depth + " feet deep and " + width + " feet wide",
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

				if(result == 'ford') {
					if(depth > 3.5 || danger > getRandomInt(4000,6000)) {
						bootbox.alert("You lost some supplies while crossing.");
						loseRandomSupplies();
						displaySupplies();
					}
					else {
						bootbox.alert("You didn't have any trouble crossing the river!");
					}
					wagon.finishedCrossing = true;
				}
				else if(result == 'caulk') {
					if(danger > getRandomInt(4000,6000)) {
						bootbox.alert("You lost some supplies while crossing.");
						loseRandomSupplies();
						displaySupplies();
					}
					else {
						bootbox.alert("You didn't have any trouble crossing the river!");
					}
					wagon.finishedCrossing = true;
				}
				else if(result == 'ferry') {
					if(danger > 0.75*getRandomInt(4000,6000)) {
						bootbox.alert("You lost some supplies while crossing.");
						loseRandomSupplies();
						displaySupplies();
					}
					else {
						bootbox.alert("You didn't have any trouble crossing the river!");
					}
					wagon.finishedCrossing = true;
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

function Landmark(name, x, y, distToNextLandmark, fort = false, river = false, fork = false) {
	this.name = name;
	this.mileMarker = distToNextLandmark;
	this.x = x;
	this.y = y;
	this.fort = fort;
	this.river = river;
	this.fork = fork;
};

function Person(name, health = 'healthy') {
	this.name = name;
	this.health = health;
}

// global types
var illness = ['measles', 'a snakebite', 'dysentery', 'typhoid', 'cholera', 'exhaustion'];
var randomFind = ['food', 'supplies', 'water'];
var randomBad = ['no water', 'fire', 'theft', 'lost', 'broken', 'rough trail', 'heavy fog'];
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var speech = ['hi', 'see you later', 'good luck'];
var health = ['good', 'fair', 'poor', 'very poor', 'dead'];
var weather = ['cloudy', 'sunny', 'fair', 'rainy', 'snowy'];

var landmarks = [
	new Landmark('Independence, Missouri', 598, 158, 102, true),
	new Landmark('Kansas River Crossing', 567, 151, 82, false, true),
	new Landmark('Big Blue River Crossing', 552, 144, 118, false, true),
	new Landmark('Fort Kearney', 520, 142, 250, true),
	new Landmark('Chimney Rock', 479, 138, 86),
	new Landmark('Fort Laramie', 429, 130, 190, true),
	new Landmark('Independence Rock', 384, 117, 102),
	new Landmark('South Pass', 349, 124, 57, false, false, true),
		new Landmark('Green River Crossing', 319, 126, 143, false, true),
		new Landmark('Fort Bridger', 315, 144, 150, true),
	new Landmark('Soda Springs', 300, 122, 57),
	new Landmark('Fort Hall', 264, 114, 164, true),
	new Landmark('Snake River Crossing', 221, 108, 113, false, true),
	new Landmark('Fort Boise', 200, 90, 160, true),
	new Landmark('Blue Mountains', 172, 75, 180, false, false, true),
		new Landmark('The Dalles', 144, 66, 100),
		new Landmark('Fort Walla Walla', 165, 60, 150, true),
	//new Landmark('Columbia River', 50, false, true),
	new Landmark('Oregon City, Oregon', 112, 60, 0)
];

/*
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
*/

// returns a random integer between min and max, inclusive
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

var loop;
var wagon;
var tombstones = getTombstones();

});