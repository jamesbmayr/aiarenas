/* my modules */
	const processes = require("../processes");

/* create(user, parameters) */
	function create(user, parameters) {
		var arena = {
			id: processes.random(),
			users: [user.id],
			state: {
				playing: false,
				start: new Date().getTime(),
				pauseTo: null,
				end: null,
				victors: []
			},
			rules: {
				execute: function(arena) {
					if (arena.rounds.length === 0) { //first round
						//create newRound object
							var newRound = {
								cubes: null,
								robots: [],
								winner: null
							}

						//spawn cubes
							arena = arena.rules.cubes.actions.spawn(arena);

						//add robots
							var robots = [];
							for (var i = 0; i < Object.keys(arena.entrants).length; i++) {
								var cubes = {};
								for (var j = 0; j < arena.rules.cubes.colors.length; j++) {
									cubes[arena.rules.cubes.colors[j]] = 0;
								}

								for (var j = 0; j < arena.rules.cubes.startingCount; j++) {
									var color = arena.rules.cubes.colors[Math.floor(Math.random() * arena.rules.cubes.colors.length)];
									cubes[color] += 1;
								}

								robots.push({
									name: Object.keys(arena.entrants)[i],
									power: arena.rules.robots.startPower,
									cubes: cubes,
								});
							}							
					}
					else { //all future rounds
						//execute player-created code to determine actions
							var actions = [];

							for (var i = 0; i < Object.keys(arena.rounds[arena.rounds.length - 1].robots).length; i++) {
								var name = arena.rounds[arena.rounds.length - 1].robots[i].name;
								
								try {
									var action = vm.createNewContext({arena: arena}).executeScript(arena.entrants[name].code(),{timeout: 1000}); //something like this???
								}
								catch (error) {
									console.log(error);
									var action = arena.rules.robots.defaultAction;
								}

								if (typeof arena.rules.robots.action[action] === "undefined") {
									action = arena.rules.robots.defaultAction;
								}
								
								actions.push(action);
							}

							for (var i = 0; i < actions.length; i++) { //put player actions into the arena *afterwards* so they're not readable by later players
								arena.rounds[arena.rounds.length - 1].robots[i] = actions[i];
							}

						//duplicate currentRound to newRound
							var newRound = arena.rounds[arena.rounds.length - 1]; //this new round will be a copy of the current round
							arena.rounds.push(newRound); //add it to the rounds array

						//perform robot actions
							for (var i = 0; i < Object.keys(arena.rules.robots.actions).length; i++) {
								arena = arena.rules.robots.actions[Object.keys(arena.rules.robots.actions)[i]](arena);
							}

						//set robots' newRound actions to null
							for (var i = 0; i < Object.keys(arena.rounds[arena.rounds.length - 1].robots).length; i++) {
								arena.rounds[arena.rounds.length - 1].robots[i].action = null;
							}
						
						//update cubes
							for (var i = 0; i < Object.keys(arena.rules.cubes.actions).length; i++) {
								arena = arena.rules.cubes.actions[Object.keys(arena.rules.cubes.actions)[i]](arena);
							}

						//check for victory
							arena = arena.rules.victory.check(arena);

						//resolve ties
							arena = arena.rules.victory.tie(arena);

						//check for pause
							if ((arena.playing) && ((arena.rounds.length - 1) % arena.rules.pause.period == 0)) {
								arena.state.playing = false;
								arena.state.pauseTo = (new Date().getTime() + arena.rules.pause.duration);
							}
					}

					return arena;
				},
				cubes: {
					animation: parameters.cubes.animation || false,
					spawnRate: parameters.cubes.spawnRate || 1,
					spawnMemory: parameters.cubes.spawnMemory || 3,
					dissolveRate: parameters.cubes.dissolveRate || 0,
					dissolveIndex: parameters.cubes.dissolveIndex || "Math.floor(Math.random() * cubes.length)",
					startingCount: parameters.cubes.startingCount || 1,
					colors: parameters.cubes.colors || ["red", "orange", "yellow", "green", "blue", "purple"],
					actions: {
						dissolve: function (arena) {
							var dissolveRate = arena.rules.cubes.dissolveRate;
							var cubes = arena.rounds[arena.rounds.length - 1].cubes; //get the cubes from the newRound (a copy of currentRound)
							var dissolveIndex = arena.rules.cubes.dissolveIndex; //get the index (first, last, random) of which cube gets dissolved

							for (var i = 0; i < dissolveRate; i++) { //loop through to dissolve the dissolveRate number of cubes
								cubes.splice(dissolveIndex,1); //remove one cube from the dissolveIndex position
							}

							arena.rounds[arena.rounds.length - 1].cubes = cubes; //update the newRound's cubes accordingly

							return arena;
						},
						spawn: function(arena) {
							var colors = arena.rules.cubes.colors;
							var spawnRate = arena.rules.cubes.spawnRate;
							var spawnMemory = arena.rules.cubes.spawnMemory;

							var cubes = arena.rounds[arena.rounds.length - 1].cubes || []; //get the cubes from the newRound (a modified copy of currentRound)
							var pastCubes = [];

							for (var i = 1; i < Math.min(spawnMemory, arena.rounds.length); i++) { //go back to each round that should be remembered...
								pastCubes.push(arena.rounds[arena.rounds.length - i].cubes.slice(-spawnRate)); //and get which cubes were created
							}
							colors = colors.filter(function(color) {return pastCubes.indexOf(color) < 0}); //filter out those colors
							
							for (var i = 0; i < spawnRate; i++) {
								var newCube = colors[Math.floor(Math.random() * colors.length)]; //pick a random color from the remaining colors
								cubes.push(newCube);
							}

							arena.rounds[arena.rounds.length - 1].cubes = cubes; //update the newRound's cubes accordingly

							return arena;
						}
					}
				},
				robots: {
					minCount: parameters.robots.minCount || 2,
					maxCount: parameters.robots.maxCount || 6,
					visibleNames: parameters.robots.visibleNames || true,
					visibleCode: parameters.robots.visibleCode || false,
					animation: parameters.robots.animation || false,
					startPower: parameters.robots.startPower || 0,
					chargeRate: parameters.robots.chargeRate || 1,
					defaultAction: parameters.robots.defaultAction || "charge",
					takeTie: parameters.robots.takeTie || "cascade",
					maxCharge: parameters.robots.maxCharge || 256,
					maxTake: parameters.robots.maxTake || "currentRound.cubes.length",
					actions: {
						take: function(arena) {
							//get the variables
								var currentRound = arena.rounds[arena.rounds.length - 1]; //data from the newRound is actually a copy of the currentRound
								var robots = currentRound.robots;
								var takers = []; //empty array of robots attempting to take

							//get a list of all takers
								for (var i = 0; i < robots.length; i++) {
									if ((robots[i].action == "take") && (robots[i].power > 0)) { //add all the takers with power to the takers array
										takers.push(robots[i]); //focus on that robot's currentRound status
									}	
								}

							//sort that list descending
								takers.sort(function(a, b) { //sort in descending order
									return a.power < b.power;
								});

							//resolve ties
								if (takers[0].power === takers[1].power) {
									switch (arena.rules.robots.takeTie) {
										case "none": //no one gets the cube
											var winner = null;
										break;

										case "random": //pick a random robot from the tied robots
											var power = takers[0].power;

											var winners = [];
											for (var i = 0; i < takers.length; i++) {
												if (takers[i].power === power) {
													winners.push(takers[i]); //get all the robots with the winning power
												}
											}

											var winner = winners[Math.floor(Math.random() * winners.length)]; //pick one randomly
										break;

										case "catchup": //pick the robot from the tied robots with the fewest cubes
											var power = takers[0].power;

											var winners = [];
											for (var i = 0; i < takers.length; i++) {
												if (takers[i].power === power) {
													winners.push(takers[i]); //get all the robots with the winning power
												}
											}

											winners.sort(function(a, b) { //sort in ascending order of cubeCount
												var a = {};

												a.cubeCount = 0;
												for (var i = 0; i < Object.keys(a.cubes).length; i++) {
													a.cubeCount += a.cubes[Object.keys(a.cubes)[i]];
												}

												var b = {};
												b.cubeCount = 0;
												for (var i = 0; i < Object.keys(b.cubes).length; i++) {
													b.cubeCount += b.cubes[Object.keys(b.cubes)[i]];
												}

												return a.cubeCount > b.cubeCount;
											});

											var winner = winners[0]; //pick the robot with the fewest cubes
										break;

										case "cascade": //find the winner by cancelling out ties
										default:
											var winner = takers[0]; //set the first as the current winner
											takers.shift();

											do {
												var reset = false;

												for (var i = 0; i < takers.length; i++) { 
													if (takers[i].power == winner.power) { //if anyone ties with the current winner...
														takers.shift(); //...remove them...
														i--; //...keep checking the rest...
														reset = true;
													}
												}

												if (reset) {
													winner = takers[0]; //...and then set a new winner
													takers.shift();
												}
											}
											while (reset); //keep going every time a reset is necessary
										break;
									}
								}
								else {
									var winner = takers[0];
								}

							//set everyone's power to 0, and give the winner all the cubes, up to the maxTake
								for (var i = 0; i < robots.length; i++) {
									if (robots[i].action == "take") {
										arena.rounds[arena.rounds.length - 1].robots[i].power = 0; //set the robot's power to 0 for newRound

										if ((winner !== null) && (winner.name == robots[i].name)) { //if there is a winner, find by name
											arena.rounds[arena.rounds.length - 2].winner = i; //log the winner to the previous round

											for (var j = 0; i < Math.min(currentRound.cubes.length, eval(arena.rules.robots.maxTake)); j++) { //for each cube up for grabs...
												arena.rounds[arena.rounds.length - 1].robots[i].cubes[currentRound.cubes[j]]++; //give it to the winner
											}

											arena.rounds[arena.rounds.length - 1].cubes = null; //set the newRound's cubes to null;
										}
									}
								}

							return arena;
						},
						charge: function(arena) {
							//get the variables
								var chargeRate = arena.rules.robots.chargeRate; //get the rate of charge
							
							//charge up
								for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
									if (robots[i].action == "charge") { //for all robots charging...
										arena.rounds[arena.rounds.length - 1].robots[i].power += chargeRate; //... add to their power

										if (arena.rounds[arena.rounds.length - 1].robots[i].power > arena.rules.robots.maxCharge) { //don't let anyone go over the maxCharge
											arena.rounds[arena.rounds.length - 1].robots[i].power = arena.rules.robots.maxCharge;
										}
									}
								}

							return arena;
						}
					}
				},
				pause: {
					roundLength: parameters.pause.roundLength || (1000 * 10),
					duration: parameters.pause.duration || (1000 * 60 * 5),
					period: parameters.pause.period || 10,
				},
				victory: {
					conditions: parameters.victory.conditions || ["6_of_1", "2_of_3", "1_of_6"],
					tieMethod: parameters.victory.tieMethod || "efficient",
					check: function(arena) { //check for victory
						var conditions = arena.rules.victory.conditions;
						var robots = arena.rounds[arena.rounds.length - 1].robots;

						for (var c = 0; c < conditions.length; c++) { //loop through for all conditions
							switch(conditions[c]) {
								case "6_of_1": //6 cubes of 1 color
									for (var i = 0; i < robots.length; i++) {
										for (j = 0; j < Object.keys(robots[i].colors).length; j++) {
											if (robots[i].colors[Object.keys(robots[i].colors)[j]] > 5) {
												arena.state.victors.push(robots[i].name);
												arena.state.playing = false;
											}
										}
									}
								break;

								case "2_of_3": //2 of all primary or all secondary cubes
									for (var i = 0; i < robots.length; i++) {
										if ((robots[i].red > 1) && (robots[i].yellow > 1) && (robots[i].blue > 1)) {
											arena.state.victors.push(robots[i].name);
											arena.state.playing = false;
										}
										else if ((robots[i].orange > 1) && (robots[i].green > 1) && (robots[i].purple > 1)) {
											arena.state.victors.push(robots[i].name);
											arena.state.playing = false;
										}
									}
								break;

								case "1_of_6": //one of each color
									for (var i = 0; i < robots.length; i++) {
										var victory = true;

										for (j = 0; j < Object.keys(robots[i].colors).length; j++) {
											if (robots[i].colors[Object.keys(robots[i].colors)[j]] < 1) {
												victory = false;
											}
										}

										if (victory) {
											arena.state.victors.push(robots[i].name);
											arena.state.playing = false;
										}
									}
								break;

								case "3_of_2": //3 of each of 2 complementary colors
									for (var i = 0; i < robots.length; i++) {
										if ((robots[i].red > 2) && (robots[i].green > 2)) {
											arena.state.victors.push(robots[i].name);
											arena.state.playing = false;
										}
										else if ((robots[i].orange > 2) && (robots[i].blue > 2)) {
											arena.state.victors.push(robots[i].name);
											arena.state.playing = false;
										}
										else if ((robots[i].yellow > 2) && (robots[i].purple > 2)) {
											arena.state.victors.push(robots[i].name);
											arena.state.playing = false;
										}
									}
								break;

								case "100_power": //charge up for 100 straight rounds
									for (var i = 0; i < robots.length; i++) {
										if (robots[i].power > 23) {
											arena.state.victors.push(robots[i].name);
											arena.state.playing = false;
										}
									}
								break;
							}
						}

						//remove duplicates
							arena.state.victors = arena.state.victors.filter(function (victor, position) {
								return arena.state.victors.indexOf(victor) === position;
							});

						return arena;
					},
					tie: function(arena) { //resolve ties...
						var victors = arena.state.victors;

						if (victors.length > 1) {
							switch (arena.rules.victory.tieMethod) {
								case "multiple":
									//do nothing
								break;

								case "random":
									arena.state.victors = arena.state.victors[Math.floor(Math.random() * arena.state.victors.length)];
								break;

								case "greedy":
									victors.sort(function(a, b) { //order the tied victors based on total cubeCount, ascending
										var aCubes = arena.rounds[arena.rounds.length - 1].robots[a].cubes;
										var bCubes = arena.rounds[arena.rounds.length - 1].robots[b].cubes;

										var aCubeCount = 0;
										for (var j = 0; j < Object.keys(aCubes).length; j++) {
											aCubeCount += aCubes[Object.keys(aCubes)[j]];
										}

										var bCubeCount = 0;
										for (var j = 0; j < Object.keys(bCubes).length; j++) {
											bCubeCount += bCubes[Object.keys(bCubes)[j]];
										}

										return aCubeCount > bCubeCount;
									});

									arena.state.victors = victors[0]; //whoever has the *most* cubes is the victor
								break;

								case "efficient":
									victors.sort(function(a, b) { //order the tied victors based on total cubeCount, descending
										var aCubes = arena.rounds[arena.rounds.length - 1].robots[a].cubes;
										var bCubes = arena.rounds[arena.rounds.length - 1].robots[b].cubes;

										var aCubeCount = 0;
										for (var j = 0; j < Object.keys(aCubes).length; j++) {
											aCubeCount += aCubes[Object.keys(aCubes)[j]];
										}

										var bCubeCount = 0;
										for (var j = 0; j < Object.keys(bCubes).length; j++) {
											bCubeCount += bCubes[Object.keys(bCubes)[j]];
										}

										return aCubeCount < bCubeCount;
									});

									arena.state.victors = victors[0]; //whoever has the *least* cubes is the victor
								break;
							}
						}

						return arena;
					}
				}
			},
			entrants: {},
			rounds: [],
		}

		return arena;
	}

/* update(arena) */
	function update(arena) {
		if ((!arena.state.playing) && (arena.state.victors.length === 0)) { //if paused...
			if (arena.state.pauseTo < new Date().getTime()) { //if it's time to unpause...
				arena.state.playing = true; //... unpause
			}
		}

		while (arena.state.playing) { //while playing...
			arena.rules.execute(arena); //...perform a round (this will stop after arena.rules.pause.period # of rounds)
		}

		return arena; //return all the new rounds
	}

/* exports */
	module.exports = {
		create: create,
		update: update,
	};
