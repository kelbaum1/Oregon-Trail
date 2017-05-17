// CMSC 433 Scripting Languages
// proj2.js
// Michael Kelbaugh, John Larson, Christopher Blake, Mansi Shah
/* Code Organization:
line 26 -- display the title page
line 35 -- actions for the various buttons
line 183 -- functions for the Store page
line 319 -- function for the Setup page
line 353 -- go fishing
line 368 -- stop to rest
line 386 -- trade
line 451 -- update pace
line 486 -- update rations
line 521 -- database connectivity
line 586 -- stop and start travel
line 869 -- functions for crossing rivers
line 1145 -- choose fork in the road
line 1183 -- utilities: calculate score, display health message, Random
line 1225 -- Canvas
line 1274 -- constructors for objects like the Wagon, Landmark, Person, graphical component
line 1450 -- declare global data types
line 1494 -- start the game
*/
$(document).ready(function(){

	// start the game by just showing the title page
	$(".setupPage").hide();
	$(".titlePage").show();
	$(".storePage").hide();
	$(".mainPage").hide();
	$(".endGame").hide();
	


	// by default, clicking a button, stops the wagon
	$("button").click(function(){
		stop();
	});

	// clicking the button on the title page moves you on to the setup page
    $("#btnTitle").click(function(){
        $(".titlePage").hide();
		$(".setupPage").show();
    });
	
	// clicking the button the setup page moves you on to the store page
	$("#btnSetup").click(function() {
		if (setupGame()) {
			$(".setupPage").hide();
			updateStorePrices();
			$(".storePage").show();
		}
	});
	
	// clicking the button on the store page updates your supplies and returns you to the gameplay page
	$("#btnStore").click(function() {
		
		if(updateSupplies()) {
			// return to the main page
			$(".storePage").hide();
			$(".mainPage").show();

			// update the display and status
			$("#btnPause").prop("disabled",true);
			displaySupplies();
			$("#currentDate").text(monthName[wagon.date.getMonth()] + " " + wagon.date.getDate() + ", " + wagon.date.getFullYear());
			$("#rations").text(wagon.rations);
			$("#pace").text(wagon.pace);
			var healthStr = setHealthStr();
			$("#health").text(healthStr);
			$("#weather").text(wagon.weather);
			$("#logLabel").text("arrived at: ");
			$("#log").text(landmarks[wagon.landmarkIndex].name);
			$("#nextLandmarkLabel").text("");
			$("#nextLandmark").text("");
			$("#distanceToLandmark").text(wagon.nextLandmark + " miles");
			
			// display the health of the wagon party
			$("#p1Label").text(wagon.people[0].name + ":");
			$("#p2Label").text(wagon.people[1].name + ":");
			$("#p3Label").text(wagon.people[2].name + ":");
			$("#p4Label").text(wagon.people[3].name + ":");
			$("#p5Label").text(wagon.people[4].name + ":");
			$("#p1").text(wagon.people[0].health);
			$("#p2").text(wagon.people[1].health);
			$("#p3").text(wagon.people[2].health);
			$("#p4").text(wagon.people[3].health);
			$("#p5").text(wagon.people[4].health);
		}
	});

	// leave the store without buying anything
	$("#btnCancel").click(function() {
		$(".storePage").hide();
		$(".mainPage").show();
	});
	
	/* for debugging the PHP connectivity
	$("#btnInsertTombstone").click(function() {
		insertTombstone();
	});
	
	$("#btnTombstones").click(function () {
		getTombstones();
	});
	
	$("#btnInsertScore").click(function () {
		insertScore();
	});
	*/

	// visit the general store, if you're stopped at a fort
	$("#btnBuy").click(function(){
		if(wagon.atFort) {
			$(".mainPage").hide();
			updateStorePrices();
			$(".storePage").show();
		}
		else {
			bootbox.alert("You'll have to wait until you get to a fort in order to buy more supplies.")
		}
	});

	// attempt to trade
	$("#btnTrade").click(function(){
		makeTrade();
	});

	// talk with people, if you're stopped at a fort
	$("#btnTalk").click(function(){		
		if(wagon.atFort) {
			bootbox.alert("" + speech[getRandomInt(0, speech.length - 1)]);
		}
		else {
			bootbox.alert("You'll have to wait until you get to a fort in order to talk with other travelers.")
		}
	});

	// view the top 10 scores
	$("#btnTopScores").click(function () {
		getScores();
	});

	// stop to rest
	$("#btnRest").click(function(){		
		takeRest();
	});
	
	// go fishing and get lucky
	$("#btnFish").click(function(){
		if(!wagon.atFort) {
			goFishing();
			$("#food").text(wagon.food + " lbs");
			$("#bait").text(wagon.bait);
		}
		else {
			bootbox.alert("You must leave the fort in order to go fishing.")
		}
	});

	// change your pace
	$("#btnPace").click(function(){
		updatePace();
	});

	// change the rations
	$("#btnRations").click(function(){
		updateRations();
	});

	// pause the game
	$("#btnPause").click(function(){
		stop();
	});

	// continue traveling. you'll click this button a lot.
	$("#btnContinue").click(function(){
		startTravel();
	});



/* the store page */
// call this function when you visit the store to update the prices
function updateStorePrices() {

	document.getElementById("buyOxen").value = 0;
	document.getElementById("buyFood").value = 0;
	document.getElementById("buyClothing").value = 0;
	document.getElementById("buyBait").value = 0;
	document.getElementById("buyWheels").value = 0;
	document.getElementById("buyAxles").value = 0;
	document.getElementById("buyTongues").value = 0;

	var multiplier = 1;
	if(landmarks[wagon.landmarkIndex].name == "Fort Kearney") multiplier = 1.1;
	else if(landmarks[wagon.landmarkIndex].name == "Fort Laramie") multiplier = 1.2;
	else if(landmarks[wagon.landmarkIndex].name == "Fort Hall") multiplier = 1.3;
	else if(landmarks[wagon.landmarkIndex].name == "Fort Boise") multiplier = 1.4;
	else if(landmarks[wagon.landmarkIndex].name == "Fort Walla Walla") multiplier = 1.5;
	else{}

	$("#budget").text("Money left to spend: $" + wagon.money);

	$("#priceOxen").html("Oxen: $" + basePrices.oxen * multiplier + " each" + "<span class='itemtext'>The more oxen pulling your wagon, the further you can travel in a day!</span>");
	$("#numOxen").text("You currently have " + wagon.oxen);

	$("#priceFood").html("Food: $" + (basePrices.food * multiplier).toFixed(2) + " per pound" + "<span class='itemtext'>You need food in order for your wagon party to stay healthy.</span>");
	$("#numFood").text("You currently have " + wagon.food + " pounds");

	$("#priceClothing").html("Sets of clothing: $" + basePrices.clothing * multiplier + " each" + "<span class='itemtext'>Clothing will help your wagon party stay healthy.</span>");
	$("#numClothing").text("You currently have " + wagon.clothing);

	$("#priceBait").html("Bait: $" + basePrices.bait * multiplier + " each" + "<span class='itemtext'>Each fishing lure gives you chance to fish and increase your food supply.</span>");
	$("#numBait").text("You currently have " + wagon.bait);

	$("#priceWheel").html("Wheels: $" + basePrices.wheel * multiplier + " each" + "<span class='itemtext'>Extra parts are essential if your wagon breaks down.</span>");
	$("#numWheel").text("You currently have " + wagon.wheels);

	$("#priceAxle").html("Axles: $" + basePrices.axle * multiplier + " each" + "<span class='itemtext'>Extra parts are essential if your wagon breaks down.</span>");
	$("#numAxle").text("You currently have " + wagon.axles);

	$("#priceTongue").html("Tongues: $" + basePrices.tongue * multiplier + " each" + "<span class='itemtext'>Extra parts are essential if your wagon breaks down.</span>");
	$("#numTongue").text("You currently have " + wagon.tongues);
}

// update the supplies of the wagon
function displaySupplies() {
	$("#food").text(wagon.food + " lbs");
	$("#wheels").text(wagon.wheels);
	$("#axles").text(wagon.axles);
	$("#tongues").text(wagon.tongues);
	$("#oxen").text(wagon.oxen);
	$("#clothing").text(wagon.clothing);
	$("#bait").text(wagon.bait);
}

// read user input from the store page
function updateSupplies() {
	var cost = 0;
	var budget = wagon.money;
	var multiplier = 1;

	var oxen = document.getElementById("buyOxen").value;
	var food = document.getElementById("buyFood").value;
	var clothing = document.getElementById("buyClothing").value;
	var bait = document.getElementById("buyBait").value;
	var wheels = document.getElementById("buyWheels").value;
	var axles = document.getElementById("buyAxles").value;
	var tongues = document.getElementById("buyTongues").value;
	
	var supplies = [oxen, food, clothing, bait, wheels, axles, tongues];
	var prices = Object.values(basePrices);

	if(landmarks[wagon.landmarkIndex].name == "Fort Kearney") multiplier = 1.1;
	else if(landmarks[wagon.landmarkIndex].name == "Fort Laramie") multiplier = 1.2;
	else if(landmarks[wagon.landmarkIndex].name == "Fort Hall") multiplier = 1.3;
	else if(landmarks[wagon.landmarkIndex].name == "Fort Boise") multiplier = 1.4;
	else if(landmarks[wagon.landmarkIndex].name == "Fort Walla Walla") multiplier = 1.5;
	else{}

	for(var i = 0; i < supplies.length; i++) {
		if(isNaN(parseInt(supplies[i]))) {
			return false;
		}
		else {
			if(parseInt(oxen) + wagon.oxen > 10) {
				bootbox.alert("You cannot buy so many oxen; the wagon can only support 10 oxen total.");
				return false;
			}
			if(parseInt(oxen) + wagon.oxen == 0) {
				bootbox.alert("You must have at least 1 oxen to move your wagon.");
				return false;
			}
			if(parseInt(food) + wagon.food > 2000) {
				bootbox.alert("You cannot buy that much food; the wagon can only hold 2000 pounds total.");
				return false;
			}
			if(parseInt(clothing) + wagon.clothing > 50) {
				bootbox.alert("You cannot buy so many clothes; the wagon can only hold 50 sets total.");
				return false;
			}
			if(parseInt(wheels) + wagon.wheels > 3) {
				bootbox.alert("You cannot buy so many wheels; the wagon can only hold 3 wheels total.");
				return false;
			}
			if(parseInt(axles) + wagon.axles > 3) {
				bootbox.alert("You cannot buy so many axles; the wagon can only hold 3 axles total.");
				return false;
			}
			if(parseInt(tongues) + wagon.tongues > 3) {
				bootbox.alert("You cannot buy so many tongues; the wagon can only hold 3 tongues total.");
				return false;
			}

			cost += parseInt(supplies[i]) * prices[i] * multiplier;
			if(cost > budget) {
				bootbox.alert("You don't have enough money to buy all these supplies.");
				return false;
			}
		}
	}
	
	wagon.oxen += parseInt(oxen);
	wagon.food += parseInt(food);
	wagon.clothing += parseInt(clothing);
	wagon.bait += parseInt(bait);
	wagon.wheels += parseInt(wheels);
	wagon.axles += parseInt(axles);
	wagon.tongues += parseInt(tongues);
	wagon.money -= cost;

	return supplies;
}
/* end of the the store page */



// read the user input on the setup page
function setupGame() {
	function alphanumeric(text)  
	{   
		var letters = /^[0-9a-zA-Z]+$/;  
		if(text.match(letters)) {
			return true;  
		}  
		else {  
			bootbox.alert('Please input alphanumeric characters only.');  
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
	
	return true;
}



// go fishing and hope to get lucky
function goFishing() {
	if(wagon.bait > 0) {
		wagon.bait--;
		var fish = getRandomInt(0, 20);
		bootbox.alert("You caught " + fish + " fish.  For a total of " + fish*10 + " pounds of food");
		wagon.food += fish*10;
	}
	else {
		bootbox.alert("You have no fishing bait left!");
	}
}



// stop to rest
function takeRest() {
	var maxRest = 9;
	bootbox.prompt({
		title: "How many days do you want to rest? The maximum is " + maxRest + " days.",
		inputType: 'number',
		callback: function (result) {
			for(var i = 0; i < result && i < maxRest; i++) {
				travelOneDay(true);
			}
			var healthStr = setHealthStr();
			$("#health").text(healthStr);
		}
	});
}



// attempt a random trade deal
function makeTrade() {
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



// change the pace of the wagon party
function updatePace() {
	bootbox.prompt({
		title: "Select your pace:",
		message: "A steady pace is best for your health, but is slow. You'll move much faster at a grueling pace, but your health will suffer.",
		inputType: 'select',
		inputOptions: [
			{
				text: 'Choose one...',
				value: '',
			},
			{
				text: 'Steady - a slow pace, but good for your health',
				value: 'steady',
			},
			{
				text: 'Strenuous - a moderately fast pace',
				value: 'strenuous',
			},
			{
				text: 'Grueling - a very fast pace, but bad for your health',
				value: 'grueling',
			}
		],
		callback: function (result) {
			if(result) {
				wagon.pace = result;
				$("#pace").text(wagon.pace);
			}
		}
	});
}



// change the rations of the wagon party
function updateRations() {
	bootbox.prompt({
		title: "Select the level of rations:",
		message: "Filling rations are best for your health, but you'll run out of food more quickly. Bare Bones rations will preserve your food supply for longer, but your health will suffer.",
		inputType: 'select',
		inputOptions: [
			{
				text: 'Choose one...',
				value: '',
			},
			{
				text: 'Filling - good for your health, but will deplete your food supply quickly',
				value: 'filling',
			},
			{
				text: 'Meager - a small ration, but adequate for your health',
				value: 'meager',
			},
			{
				text: 'Bare Bones - bad for your health, but will conserve your food supply',
				value: 'bare bones',
			}
		],
		callback: function (result) {
			if(result) {
				wagon.rations = result;
				$("#rations").text(wagon.rations);
			}
		}
	});
}



// download the tombstones data from the database
function getTombstones() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			tombstones = JSON.parse(this.responseText);
		}
	};
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/proj2.php?arg=" + "getTombstones", true);
	xmlhttp.send();
}

// if you die, insert a tombstone into the database
function insertTombstone() {
	bootbox.prompt({
		title: "Sadly, your entire party died on the trip to Oregon.<br>Write a moving epitaph for your tombstone:",
		inputType: 'textarea',
		value: "Requiescat In Pace",
		callback: function (result) {
			xmlhttp = new XMLHttpRequest();
			var dateFormatted = [wagon.date.getFullYear(), wagon.date.getMonth() + 1, wagon.date.getDate()].join('-');
			xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/proj2.php?arg=" + "insertTombstone" + "&dod=" + dateFormatted + "&name=" + wagon.people[0].name + "&mile=" + wagon.milesTraveled + "&msg=" + result, true);
			xmlhttp.send();
		}
	});
}

// view the top 10 scores from the game
function getScores() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {

			var players = JSON.parse(this.responseText);
			var messageText = "<table>";
			//messageText += "<tr><th>Name</th><th>Points</th><th>Rating</th></tr>";
			for(i = 0; i < players.length; i++) {
				messageText += "<tr><td>" + players[i][1] + "</td><td>" + players[i][2] + "</td><td>" + players[i][3] + "</td></tr>";
			}
			messageText += "</table>";

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
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/proj2.php?arg=" + "getTopScores", true);
	xmlhttp.send();
}

// if you win, insert your score into the database
function insertScore(newRating = 'Greenhorn') {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/Oregon/proj2.php?arg=" + "insertScore" + "&usr=" + wagon.people[0].name + "&points=" + wagon.points + "&rating=" + newRating, true);
	xmlhttp.send();
}



// stop traveling
function stop() {
	$("#wagonStatus").text("stopped");
	$("#btnPause").prop("disabled",true);
	clearInterval(loop);
}

// start traveling
function startTravel() {
	$("#btnPause").prop("disabled",false);
	//$("#btnBuy").prop("disabled",true);
	//$("#btnTalk").prop("disabled",true);
	//$("#btnFish").prop("disabled",false);
	wagon.atFort = false;
	$("#wagonStatus").text("moving");
	loop = setInterval(travelOneDay, 1000);
}

// move the wagon forward one day
function travelOneDay(resting = false) {

	/* check for landmarks */
	if(wagon.landmarkIndex == landmarks.length - 1) {
			stop();

			wagon.points = countPoints();
			var rating = 'Greenhorn';
			if(wagon.points >= 3000) rating = 'Adventurer';
			else if(wagon.points >= 6000) rating = 'Trail Guide';
			else {}
			insertScore(rating);

			bootbox.alert("Congratulations, you made it to Oregon!\nScore: " + wagon.points + " points");
			$("#log").text("Congratulations, you made it to Oregon!\nScore: " + wagon.points + " points");
			$(".mainPage").hide();
			$(".titlePage").show();
			getScores();
		}
	if(!wagon.finishedCrossing) {
		
		if(crossRiver())
			$("#logLabel").text("finished crossing: ");
			$("#log").text(landmarks[wagon.landmarkIndex].name);
			$("#btnContinue").text("Continue");
		return;
	}
	if(!wagon.passedFork) {
		chooseFork(wagon.landmarkIndex + 1, wagon.landmarkIndex + 2);
		return;
	}
	if(wagon.atLandmark)
	{
		landmarkIcon.x = 15;
		fortIcon.x = 15;
		riverIcon.x = 15;
	}
	wagon.atLandmark = false;
	$("#logLabel").text("last left: ");
	$("#log").text(landmarks[wagon.landmarkIndex].name);
	$("#nextLandmarkLabel").text("next stop: ");
	$("#nextLandmark").text(landmarks[wagon.landmarkIndex + 1].name);
	/*******************************************************************/

	// increment the date
	wagon.date.setDate(wagon.date.getDate() + 1);
	$("#currentDate").text(monthName[wagon.date.getMonth()] + " " + wagon.date.getDate() + ", " + wagon.date.getFullYear());
	
	// eat your food
	var rations = 0;
	if(wagon.rations == 'filling') rations = 3;
	else if(wagon.rations == 'meager') rations = 2;
	else if(wagon.rations == 'bare bones') rations = 1;
	else {}
	wagon.food -= rations * wagon.people.length;
	if(wagon.food < 0) {
		wagon.food = 0;
		wagon.health -= 10*wagon.people.length;
	}
	if(wagon.rations == 'filling') wagon.health += 5;
	else if(wagon.rations == 'meager') ;
	else if(wagon.rations == 'bare bones') wagon.health -=10;
	else {}
	$("#food").text(wagon.food + " lbs");
	/*****************************************************/
	
	// update the weather
	if(getRandomInt(0, 1000) < 200) {
		wagon.weather = weather[getRandomInt(0, weather.length - 1)];
		$("#weather").text(wagon.weather);
	}
	if(wagon.weather == 'fair') wagon.health += 10;
	else if(wagon.weather == 'hot') wagon.health -= 10;
	else if(wagon.weather == 'snow') wagon.health -= 10;
	else {}
	/****************************************************/

	// update health based on clothing
	var avg = wagon.clothing / wagon.people.length;
	if(avg >= 4) wagon.health += 5;
	else if(avg >= 3) wagon.health += 3;
	else if(avg >= 2) wagon.health += 1;
	else if(avg >= 1) ;
	else if(avg >= 0) wagon.health -= 2;
	else wagon.health -= 5;
	/****************************************************/

	// rest, or travel forward
	if(resting) {
		wagon.health += 25;
		return;
	}
	else {
		// update health based on pace
		var pace;
		if(wagon.pace == 'steady') {
			wagon.health += 1;
			pace = 1;
		}
		else if(wagon.pace == 'strenuous') { 
			wagon.health -= 3;
			pace = 2;
		}
		else if(wagon.pace == 'grueling') {
			wagon.health -= 5;
			pace = 3;
		}
		else {}
		
		pace *= wagon.oxen;
		
		var pixelPace = pace * (500 / landmarks[wagon.landmarkIndex].mileMarker);
		var flag = true;
		while(wagon.milesToday < pixelPace) {
			
			if(landmarks[wagon.landmarkIndex+1].name == 'Chimney Rock' || landmarks[wagon.landmarkIndex+1].name == 'Independence Rock' || 
			landmarks[wagon.landmarkIndex+1].name == 'South Pass' || landmarks[wagon.landmarkIndex+1].name == 'Soda Springs' || 
			landmarks[wagon.landmarkIndex+1].name == 'Blue Mountains')
			{
				setTimeout( function() { updateGameArea(myGameArea,landmarkIcon,wagonIcon,pixelPace);},500);	
			}
			else if(landmarks[wagon.landmarkIndex+1].name == 'Kansas River Crossing' || landmarks[wagon.landmarkIndex+1].name == 'Big Blue River Crossing' || 
			  landmarks[wagon.landmarkIndex+1].name == 'Green River Crossing' || 
			landmarks[wagon.landmarkIndex+1].name == 'Snake River Crossing' || landmarks[wagon.landmarkIndex+1].name == 'The Dalles' || 
			landmarks[wagon.landmarkIndex+1].name =='Columbia River')
			{
				setTimeout( function() { updateGameArea(myGameArea,riverIcon,wagonIcon,pixelPace);},500);
			}
			else{
				setTimeout( function() { updateGameArea(myGameArea,fortIcon,wagonIcon,pixelPace);},500);
			}
			
			wagon.milesToday++;
			
		}
		wagon.milesToday = 0;

		// check for tombstones
		while(!(tombstones === undefined || tombstones.length == 0) && wagon.milesTraveled + pace >= tombstones[0][4]) {
			bootbox.alert({
				title: "Tombstone at Mile " + tombstones[0][4],
				message: tombstones[0][2] + "<br>" + tombstones[0][3] + "<br>" + '\"' + tombstones[0][5] + '\"',
				});
			pace = tombstones[0][4] - wagon.milesTraveled;
			tombstones.splice(0, 1);
			stop();
		}

		// check again if you've hit a landmark
		if(pace > wagon.nextLandmark) {
			pace = wagon.nextLandmark;
			wagon.atLandmark = true;
		}
		wagon.nextLandmark -= pace;
		$("#distanceToLandmark").text(wagon.nextLandmark + " miles");
		wagon.milesTraveled += pace;
		$("#distanceTraveled").text(wagon.milesTraveled + " miles");
	}
	/****************************************************/

	// update the health
	if(wagon.health < 0) wagon.health = 0;
	var healthStr = setHealthStr();
	$("#health").text(healthStr);
	if(wagon.health >= 1000) wagon.multiplier = 10;
	else if(wagon.health >= 750) wagon.multiplier = 5;
	else if(wagon.health >= 300) wagon.multiplier = 2;
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
			if(random < 150) {
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
			else if(random > 5000) {
				wagon.people[i].health = 'healthy';
				//bootbox.alert(wagon.people[i].name + " recovered from sickness.");
				//stop();
				//break;
			}
			else {} // still sick
		}
		else {} // dead
	}
	
	// display the health of the wagon party
	$("#p1Label").text(wagon.people[0].name + ":");
	$("#p2Label").text(wagon.people[1].name + ":");
	$("#p3Label").text(wagon.people[2].name + ":");
	$("#p4Label").text(wagon.people[3].name + ":");
	$("#p5Label").text(wagon.people[4].name + ":");
	$("#p1").text(wagon.people[0].health);
	$("#p2").text(wagon.people[1].health);
	$("#p3").text(wagon.people[2].health);
	$("#p4").text(wagon.people[3].health);
	$("#p5").text(wagon.people[4].health);
	
	// check if you're at a landmark, to set up the next day's travel options
	if(wagon.atLandmark) {
		stop();
		// display new graphic
		drawRouteToCurPos(wagon.landmarkIndex, wagon.landmarkIndex + 1);
		wagon.landmarkIndex++;
		
		$("#logLabel").text("arrived at: ");
		$("#log").text(landmarks[wagon.landmarkIndex].name);
		$("#nextLandmarkLabel").text("next stop: ");
		$("#nextLandmark").text(landmarks[wagon.landmarkIndex + 1].name);
		
		if(landmarks[wagon.landmarkIndex].name != "The Dalles")
		{
			bootbox.alert("You've arrived at " + landmarks[wagon.landmarkIndex].name + "!");
		}
		
		if(landmarks[wagon.landmarkIndex].fort) {
			//$("#btnBuy").prop("disabled",false);
			//$("#btnTalk").prop("disabled",false);
			//$("#btnFish").prop("disabled",true);
			wagon.atFort = true;
		}
		if(landmarks[wagon.landmarkIndex].river) {
			wagon.finishedCrossing = false;
			$("#btnContinue").text("Cross River");
		}
		if(landmarks[wagon.landmarkIndex].fork) {
			wagon.passedFork = false;
		}
		// you've reached the end of the trail
		if(landmarks[wagon.landmarkIndex].name == 'The Dalles') {
			var success = playRiverCrossingGame();
			return;
		}
		wagon.nextLandmark = landmarks[wagon.landmarkIndex].mileMarker;
		$("#distanceToLandmark").text(wagon.nextLandmark + " miles");

	}
}



// cross a normal river (not the one at the end of the trail)
function crossRiver() {
	stop();
	var weight = 1000 + wagon.oxen*1000 + wagon.clothing*5 + wagon.bait*1 + wagon.wheels*75 + wagon.axles*75 + wagon.tongues*75 + wagon.food*1 + wagon.people.length*130;
	var depth = getRandomInt(0, 80) / 10;
	var width = getRandomInt(100, 1000);
	var danger = width + weight;
	if(wagon.weather == 'snowy') danger *= 1.3;
	if(wagon.weather == 'rainy') danger *= 1.2;

	function loseRandomSupplies() {
		var newStr = "You lost some supplies while crossing: \n";
		var oxen = getRandomInt(-5, Math.min(2, wagon.oxen));
		if(oxen > 0 && wagon.oxen > 2)
		{
			wagon.oxen -= oxen;
			newStr=newStr+" "+(oxen)+" oxen\n";
		}
		var food = getRandomInt(-5, Math.min(100, wagon.food));
		if(food > 0 && wagon.food > 100) 
		{
			wagon.food -= food;
			newStr=newStr+" "+food+" food\n";
		}
		var clothing = getRandomInt(-5, Math.min(2, wagon.clothing));
		if(clothing > 0)
		{
			wagon.clothing -= clothing;
			newStr=newStr+" "+clothing+" clothing\n";
		}
		var bait = getRandomInt(-5, Math.min(5, wagon.bait));
		if(bait > 0)
		{
			wagon.bait -= bait;
			newStr=newStr+" "+bait+" bait\n";
		}
		var wheels = getRandomInt(-5, Math.min(1, wagon.wheels));
		if(wheels > 0)
		{
			wagon.wheels -= wheels;
			newStr=newStr+" "+wheels+" wheels\n";
		}
		var axles = getRandomInt(-5, Math.min(1, wagon.axles));
		if(axles > 0)
		{
			wagon.axles -= axles
			newStr=newStr+" "+axels+" axels\n";
		}
		var tongues = getRandomInt(-5, Math.min(1, wagon.tongues));
		if(tongues > 0)
		{
			wagon.tongues -= tongues;
			newStr=newStr+" "+tongues+" tongues\n";
		}
		bootbox.alert(newStr);
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
					text: 'pay $10 and take a ferry across',
					value: 'ferry',
				},
				{
					text: 'wait to see if conditions improve',
					value: 'wait',
				}
			],
			callback: function (result) {

				if(result == 'ford') {
					if(depth > 3.5) {
						loseRandomSupplies();
						displaySupplies();
					}
					else {
						bootbox.alert("You didn't have any trouble crossing the river!");
					}
					wagon.finishedCrossing = true;
					return true;
				}
				else if(result == 'caulk') {
					if(danger > getRandomInt(5000,10000)) {
						loseRandomSupplies();
						displaySupplies();
					}
					else {
						bootbox.alert("You didn't have any trouble crossing the river!");
					}
					wagon.finishedCrossing = true;
					return true;
				}
				else if(result == 'ferry') {
					if(wagon.money >= 10) {

							wagon.money -= 10;

							if(danger > 0.75*getRandomInt(5000,10000)) {
							loseRandomSupplies();
							displaySupplies();
							}
							else {
								bootbox.alert("You didn't have any trouble crossing the river!");
							}
							wagon.finishedCrossing = true;
							return true;
						}
					else {
						bootbox.alert("You don't have enough money to pay the ferry toll.")
						return false;
					}
					wagon.finishedCrossing = true;
					return true;
				}

				else if(result == 'wait') {
					//travelOneDay(true);
				}
				else {
					//return false;
				}
			}
		});
}

// the game to cross the final river at the end of the Oregon Trail
function playRiverCrossingGame() {

	$(".setupPage").hide();
	$(".storePage").hide();
	$(".mainPage").hide();
	$(".titlePage").hide();
	$(".endGame").show();
	
	confirm("You have reached the Dalles River Crossing.  You will have to float your wagon and navigate using the arrow keys to avoid rocks!  Be careful, each rock you hit will cause you to lose supplies!");
	var endGameArea = new gameArea("endCanvas");
	endGameArea.start();
	
	var newWagon = new component(50,50,"wagon2",800,200,endGameArea);
	var rock = new component(40,40,"rock",200,200,endGameArea);
	newWagon.speedX = 0;
	
	endGameArea.interval = setInterval(function() {updateRiverCrossing(endGameArea,newWagon),1000}); 
	
	//bootbox.alert("Congrats, you crossed the final river! That was easy.");
	//$(".mainPage").show();
	//$(".endGame").hide();
	return true;
}

// update supplies after a river crossing
function updateRiverCrossing(gameArea,riverWagon) {
	for (i = 0; i < rocks.length; i += 1) {
		if (riverWagon.crashWith(rocks[i])) {
			var newStr = "You may have lost some supplies while crossing: \n";
			var oxen = getRandomInt(-5, Math.min(2, wagon.oxen));
			if(oxen > 0 && wagon.oxen > 2)
			{
				wagon.oxen -= oxen;
				newStr=newStr+" "+(oxen)+" oxen\n";
			}
			var food = getRandomInt(-5, Math.min(100, wagon.food));
			if(food > 0 && wagon.food > 100) 
			{
				wagon.food -= food;
				newStr=newStr+" "+food+" food\n";
			}
			var clothing = getRandomInt(-5, Math.min(2, wagon.clothing));
			if(clothing > 0)
			{
				wagon.clothing -= clothing;
				newStr=newStr+" "+clothing+" clothing\n";
			}
			var bait = getRandomInt(-5, Math.min(5, wagon.bait));
			if(bait > 0)
			{
				wagon.bait -= bait;
				newStr=newStr+" "+bait+" bait\n";
			}
			var wheels = getRandomInt(-5, Math.min(1, wagon.wheels));
			if(wheels > 0)
			{
				wagon.wheels -= wheels;
				newStr=newStr+" "+wheels+" wheels\n";
			}
			var axles = getRandomInt(-5, Math.min(1, wagon.axles));
			if(axles > 0)
			{
				wagon.axles -= axles
				newStr=newStr+" "+axels+" axels\n";
			}
			var tongues = getRandomInt(-5, Math.min(1, wagon.tongues));
			if(tongues > 0)
			{
				wagon.tongues -= tongues;
				newStr=newStr+" "+tongues+" tongues\n";
			}
			confirm(newStr);
	
			riverWagon.x-=100;
			//return;
		} 
    }
	window.addEventListener('keydown',function(e){
		if(e.keyCode == 37)
		{
			riverWagon.speedX = -1;
			riverWagon.speedY = 0;
		}
		else if(e.keyCode == 38)
		{
			riverWagon.speedY = -1;
			riverWagon.speedX = 0;
		}
		else if(e.keyCode == 39)
		{
			riverWagon.speedX = 1;
			riverWagon.speedY = 0;
		}
		else if(e.keyCode == 40)
		{
			riverWagon.speedY = 1;
			riverWagon.speedX = 0;
		}
	});
	if(riverWagon.count%200 == 0)
	{
		var randomNum = Math.floor(Math.random() * 500);
		rocks.push( new component(40,40,"rock",0,randomNum,gameArea));
		
	}

	riverWagon.count++;
	gameArea.clear();
	riverWagon.updateCrossing();
	riverWagon.draw();
	for (i = 0; i < rocks.length; i += 1) {
		rocks[i].update(1);
		rocks[i].draw();
	}
	if(riverWagon.count == 10000)
	{
		gameArea.stop();
		
		wagon.points = countPoints();
		var rating = 'Greenhorn';
		if(wagon.points >= 3000) rating = 'Adventurer';
		else if(wagon.points >= 6000) rating = 'Trail Guide';
		else {}
		insertScore(rating);

		bootbox.alert("Congratulations you crossed the Dalles River and arrived in Oregon City! <br> Score: " + wagon.points + " points");
		$("#log").text("Congratulations, you made it to Oregon!\nScore: " + wagon.points + " points");
		$(".mainPage").hide();
		$(".titlePage").show();
		getScores();			

	}
}



// at a fork in the road, choose your next destination
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
			if(result == i1) {
				landmarks.splice(i2, 1);
				wagon.passedFork = true;
			}
			else if(result == i2) {
				landmarks.splice(i1, 1);
				wagon.passedFork = true;
			}
			else {}
			$("#nextLandmarkLabel").text("next stop: ");
			$("#nextLandmark").text(landmarks[wagon.landmarkIndex + 1].name);
		}
	});
}



// return the string message of the wagon party's health
function setHealthStr() {
	if(wagon.health >= 1000)
		return health[0];
	else if(wagon.health >= 750)
		return health[1];
	else if(wagon.health >= 300)
		return health[2];
	else if(wagon.health >= 150)
		return health[3];
	else
		return "Death's Door";
}


// total up your points at the end of the game
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
	return Math.max(0, Math.round(points));
}

// returns a random integer between min and max, inclusive
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}



// constructor for graphics and animation canvas
class gameArea {
	
	constructor (canvasName){
		this.canvas = document.getElementById(canvasName);

	}
	start(){
	//clearrect on this.context
		this.context = this.canvas.getContext("2d");
	}
	clear(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	
	stop(){
		clearInterval(this.interval);
	}
}

// update the wagon animation
function updateGameArea(myGameArea,landmarkIcon,wagonIcon,pace) {
	myGameArea.clear();

	//to prevent the landmark from going inside the wagon
	if(landmarkIcon.x < (wagonIcon.x-60))
	{
		landmarkIcon.update(1);
	}
	landmarkIcon.draw();

	//setTimeout(100);
	wagonIcon.draw();
}

// draw your route on the map
function drawRouteToCurPos(from, to) {
	var canvas = document.getElementById("mapCanvas");
	var ctx = canvas.getContext("2d");

	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.strokeStyle = "purple";
	ctx.moveTo(landmarks[from].x, landmarks[from].y);
	ctx.lineTo(landmarks[to].x, landmarks[to].y);
	ctx.stroke();
};


// constructor for the Wagon
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
	this.atFort = true;
};

// constructor for a Landmark. x and y are coordinates for display on the map canvas
function Landmark(name, x, y, distToNextLandmark, fort = false, river = false, fork = false) {
	this.name = name;
	this.mileMarker = distToNextLandmark;
	this.x = x;
	this.y = y;
	this.fort = fort;
	this.river = river;
	this.fork = fork;
};

// constructor for a Person
function Person(name, health = 'healthy') {
	this.name = name;
	this.health = health;
}

// constructor for a graphic
function component(width, height, name, x, y, myGameArea) {
	this.width = width;
	this.height = height;
	this.speedX = 1;
	this.speedY = 0;
	this.x = x;
	this.y = y;    
	this.name = name;
	this.count = 0;
	this.draw = function() {
		ctx = myGameArea.context;
		
		if(this.name == "wagon")
		{
			var wagon = new Image();
			wagon.src = "pics/oxen1.png";
			ctx.drawImage(wagon,this.x,this.y,this.width, this.height);
		}
		else if(this.name == "landmark")
		{
			var landmark = new Image();
			landmark.src = "pics/landmark.png";
			ctx.drawImage(landmark,this.x, this.y, this.width, this.height);
		}
		
		else if(this.name == "fort")
		{
			var fort = new Image();
			fort.src = "pics/fort.png";
			ctx.drawImage(fort,this.x, this.y, this.width, this.height);
		}
		
		else if(this.name == "river")
		{
			var river = new Image();
			river.src = "pics/river.jpg";
			ctx.drawImage(river,this.x, this.y, this.width, this.height);
		}
		
		else if(this.name == "rock")
		{
			var river = new Image();
			river.src = "pics/rock.png";
			ctx.drawImage(river,this.x, this.y, this.width, this.height);
		}
		
		else if(this.name == "wagon2")
		{
			var landmark = new Image();
			landmark.src = "pics/wagon2.png";
			ctx.drawImage(landmark,this.x, this.y, this.width, this.height);
		}
		
		else{
			ctx.fillStyle = this.name;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	}
		
		this.update = function(pace) {
			this.x += pace;
		 
		}    
		
		this.updateCrossing = function()
		{
 //checking to see if out of bounds before update
			if(this.x == 0)
			{
				this.x++;
				this.y += this.speedY; 
			}
			if(this.y == 0)
			{
				this.x += this.speedX;
				this.y++; 
			}
			if(this.x == 830)
			{
				this.x--;
				this.y += this.speedY; 
			}
			if(this.y == 480)
			{
				this.x += this.speedX;
				this.y--; 
			}
			else{
				this.x += this.speedX;
				this.y += this.speedY; 
			}
		}
		this.stop = function()
		{
			this.speedX = 0;
			this.speedY = 0;
		}

		
		this.crashWith = function(otherobj) {
			var myleft = this.x;
			var myright = this.x + (this.width);
			var mytop = this.y;
			var mybottom = this.y + (this.height);
			var otherleft = otherobj.x;
			var otherright = otherobj.x + (otherobj.width);
			var othertop = otherobj.y;
			var otherbottom = otherobj.y + (otherobj.height);
			var crash = true;
			if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
				crash = false;
			}
			return crash;
    }
}



// global types
var illness = ['measles', 'a snakebite', 'dysentery', 'typhoid', 'cholera', 'exhaustion'];
var randomFind = ['food', 'supplies', 'water'];
var randomBad = ['no water', 'fire', 'theft', 'lost', 'broken', 'rough trail', 'heavy fog'];
var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var speech = ['Good luck!'];
speech.push('You encounter an old settler in a small wooden house:  "Be careful about travelling too much each day.  Spending too much time on the trail can be bad for your health!  Being tired can make your travelers more weary and likely to catch disease.  A tired traveler might not be paying attention and get bitten by a snake or worse!"');
speech.push('You encounter a young woman in a large wheat field: "Back when I traveled the trail, we got stuck in a snowstorm without enough clothes or blankets!  It was terrifying, and we lost my sister.  Be sure to bring enough clothes with you, at least one pair for each person in your wagon.  Doing anything else is downright dangerous in the cold, or even in warm weather at night!"');
speech.push('You encounter a middle-aged fisherman at the edge of a creek: "You know that along the trail, food can be very hard to come by.  Trading is unreliable and you can\'t buy food unless you come across a fort!  Fishing can be a very good way to get extra food, you can fish anywhere you want, all you have to do is find a stream or river, which are all over the place.  I\'d estimate that a strong, able person could take back at least 200 pounds of fish in a single trip!  Oregon trail travelers are pretty strong."');
speech.push('"You should take extra sets of clothing. Trade them to Indians for fresh vegetables, fish, or meat."');
speech.push('"Did you read the Missouri Republican today? -- Says some folk start for Oregon without carrying spare parts, not even an extra wagon axle. Must think they grow on trees! Hope they\'re lucky enough to find an abandoned wagon."');
speech.push('"Some folks seem to think that two oxen are enough to get them to Oregon! Two oxen can barely move a fully loaded wagon, and if one of them gets sick or dies, you won\'t be going anywhere. I wouldn\'t go overland with less than six."');
speech.push('"The trails from the jumping off places -- Independence, St. Joseph, Council Bluffs -- come together at Fort Kearney. This new fort was built by the U.S. Army to protect those bound for California and Oregon."');
speech.push('"The Platte River valley forms a natural roadway from Fort Kearney to Fort Laramie. Travelers bound for California, Utah, and Oregon all take this road. Could be the easiest stretch of the whole trip. Should see antelope and plenty of buffalo."');
speech.push('"Don\'t try to ford any river deeper than the wagon bed -- about two and a half feet. You\'ll swamp your wagon and lose your supplies."');
speech.push('"This prairie is mighty pretty with all the wild flowers and tall grasses. But there\'s too much of it! I miss not having a town nearby. I wonder how many days until I see a town -- a town with real shops, a church, people…"');
speech.push('"Be careful you don\'t push your animals too hard! Keep them moving but set them a fair pace. You can\'t keep driving them so fast or you\'ll end up with lame-footed animals. A lame ox is about as good to you as a dead one!"');

var health = ['good', 'fair', 'poor', 'very poor', 'dead'];
var weather = ['cloudy', 'sunny', 'fair', 'rainy', 'snowy'];
var basePrices = {oxen:40, food:0.20, clothing:10, bait:15, wheel:10, axle:10, tongue:10};

var landmarks = [
	new Landmark('Independence, Missouri', 598, 168, 102, true),
	new Landmark('Kansas River Crossing', 567, 161, 82, false, true),
	new Landmark('Big Blue River Crossing', 552, 154, 118, false, true),
	new Landmark('Fort Kearney', 520, 152, 250, true),
	new Landmark('Chimney Rock', 479, 148, 86),
	new Landmark('Fort Laramie', 429, 140, 190, true),
	new Landmark('Independence Rock', 384, 127, 102),
	new Landmark('South Pass', 349, 134, 57, false, false, true),
		new Landmark('Green River Crossing', 319, 136, 143, false, true),
		new Landmark('Fort Bridger', 315, 154, 150, true),
	new Landmark('Soda Springs', 300, 132, 57),
	new Landmark('Fort Hall', 264, 124, 164, true),
	new Landmark('Snake River Crossing', 221, 118, 113, false, true),
	new Landmark('Fort Boise', 200, 100, 160, true),
	new Landmark('Blue Mountains', 172, 85, 180, false, false, true),
		new Landmark('The Dalles', 144, 76, 100),
		new Landmark('Fort Walla Walla', 165, 70, 150, true),
	//new Landmark('Columbia River', 50, false, true),
	new Landmark('Oregon City, Oregon', 112, 70, 0)
];

// start the game
var loop;
var wagon;
var tombstones = getTombstones();
var myGameArea = new gameArea("graphicsCanvas");
var wagonIcon = new component(65, 40, "wagon", 575, 95,myGameArea);
var landmarkIcon = new component(55,55,"landmark",15,85,myGameArea);
var fortIcon = new component(55,55,"fort",15,85,myGameArea);
var riverIcon = new component(55,55,"river",15,85,myGameArea);
var rocks = [];
myGameArea.start();

});