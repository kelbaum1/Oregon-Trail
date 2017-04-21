// Oregon Trail
// main.js

$(document).ready(function(){

	$("button").click(function(){
		pause();
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
				wagon.rations = result;
				$("#rations").html("rations: " + result);
			}
		});
	});

	$("#btnBuy").click(function(){
		bootbox.alert("go to the generalStore");
		// update supplies and money
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
		var days = prompt("How many days do you want to rest?");
		for(var i = 0; i < days; i++) {
			travelOneDay(true);
		}
	});
		
	$("#btnFish").click(function(){
		var fish = getRandomInt(0, 10);
		bootbox.alert("You caught " + fish + " fish.");
		wagon.food += fish*10;
		// update health?
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
				wagon.pace = result;
				$("#pace").html("pace: " + result);
			}
		});
	});

	$("#btnPause").click(function(){
		pause();
	});

	$("#btnContinue").click(function(){
		startTravel();
	});
	
	$("#btnTopScores").click(function () {
		//alert("hi");
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
		xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/JQuery/connect.php?arg=" + "getTopScores", true);
		xmlhttp.send();
	});

	$("#btnTombstones").click(function () {
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var messageText = this.responseText;
				var dialog = bootbox.dialog({
    				title: 'Tombstones',
    				message: messageText,
					buttons: {
							cancel: {
								label: '<i class="fa fa-times"></i>Close'
							}
						}
				});
			}
		};
		xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/JQuery/connect.php?arg=" + "getTombstones", true);
		xmlhttp.send();
	});
	
	//startTravel();
});

function insertTombstone() {
	var message = prompt("Enter in a message for your tombstone:");
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var messageText = this.responseText;
			var dialog = bootbox.dialog({
				title: 'Create Tombstone',
				message: messageText,
				buttons: {
						cancel: {
							label: '<i class="fa fa-times"></i>Close'
						}
					}
			});
		}
	};
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/JQuery/connect.php?arg=" + "insertTombstone" + "&dod=" + wagon.date + "&name=" + wagon.people[0] + "&mile=" + wagon.distanceTraveled + "&msg=" + message, true);
	xmlhttp.send();
}

function insertScore() {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var messageText = this.responseText;
			var dialog = bootbox.dialog({
				title: 'Score inserted.',
				message: messageText,
				buttons: {
						cancel: {
							label: '<i class="fa fa-times"></i>Close'
						}
					}
			});
		}
	};
	xmlhttp.open("GET", "https://swe.umbc.edu/~kelbaum1/JQuery/connect.php?arg=" + "insertScore" + "&usr=" + wagon.people[0] + "&points=" + wagon.points + "&rating=" + "something", true);
	xmlhttp.send();
}

function pause() {
	$("#wagonStatus").html("Wagon is stopped");
	//$("#btnPause").prop("disabled",true);
	clearInterval(loop);
}

function startTravel() {
	$("#wagonStatus").html("Wagon is moving");
	atLandmark = false;
	loop = setInterval(travelOneDay, 1000);
	
}

// upon reaching landmark, stop travel

// a method of the Wagon object??
function travelOneDay(resting = false) {

	// check if you are at a river crossing

	// get random events, both good and bad
	
	wagon.date.setDate(wagon.date.getDate() + 1);
	
	// update random-ish weather
	
	var ration;
	if(wagon.rations == "filling") ration = 3;
	if(wagon.rations == "meager") ration = 2;
	if(wagon.rations == "bare bones") ration = 1;
	wagon.food -= ration * wagon.people.length; // modify this formula
	if(wagon.food < 0) {
			wagon.food = 0;
			// diminish health?
	}
	$("#food").html("food remaining: " + wagon.food);
	
	var pace;
	if(wagon.pace == "steady") pace = 20;
	if(wagon.pace == "strenuous") pace = 30;
	if(wagon.pace == "grueling") pace = 40;
	if(pace > wagon.landmark) {
		pace = wagon.landmark;
		atLandmark = true;
	}
	
	// check for a tombstone
	
	wagon.landmark -= pace;
	$("#distanceToLandmark").html("to next landmark: " + wagon.landmark);
	wagon.distance += pace; // modify formula
	$("#distanceTraveled").html("distance traveled: " + wagon.distance);

	// update health
	// check for death
	// animate the wagon
	// update the map
	
	if(atLandmark) {
		pause();
	}
}

// launched by Submit button on the set up HTML page
function setUp() {
	// document.getElementById(month)
	// document.getElementById(leaderType)
	// document.getElementById(names)
	wagon = new Wagon();
	location.replace('generalStore.html');
}

function Wagon(month, leaderType, names) {
	
	this.date = new Date(1848, month, 1);
	this.leaderType = leaderType;
	this.people = names; // [] does each person have an individual health status??
	
	// supplies
	this.oxen = 0;
	this.clothing = 0;
	this.food = 0;
	this.lures = 0;
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
	
	this.health = "very good";
	this.pace = "steady";
	this.rations = "filling";
	
	this.atLandmark = false;
};

function Supplies() {
	
};

function Landmark(name, fort = false, river = false) {
	this.name = name;
	this.fort = fort;
	this.river = river;
};

// returns a random integer between min and max, inclusive
// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min + 1));
}

var illness = ['measles', 'snakebite', 'dysentery', 'typhoid', 'cholera', 'exhaustion'];
var randomFind = ['food', 'supplies', 'water'];
var randomBad = ['no water', 'fire', 'theft', 'lost', 'broken', 'rough trail', 'heavy fog'];

var loop;
var wagon = new Wagon(1, "banker", ["George", "Nelson", "Rachel"]);
var weather;
var speech = ["hi", "see you later", "good luck"];
var landmarks = [
	new Landmark("Independence", true),
	new Landmark("Kansas River Crossing", false, true),
	new Landmark("Big Blue River Crossing", false, true),
	new Landmark("Fort Kearney", true),
	new Landmark("Chimney Rock"),
	new Landmark("Laramie", true),
	new Landmark("Independence Rock"),
	new Landmark("South Pass"),
	new Landmark("Fort Bridger", true),
	new Landmark("Soda Springs"),
	new Landmark("Fort Hall", true),
	new Landmark("Fort Boise", true),
	new Landmark("Blue Mountains"),
	new Landmark("The Dalles"),
	new Landmark("Fort Walla Walla", true),
	new Landmark("Big Final River Crossing", false, true),
	new Landmark("Oregon City"),
];