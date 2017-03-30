/* my modules */
	const processes = require("../processes");
	const vm = require("vm");

/* create(session, post, callback) */
	function create(session, post, callback) {
		var parameters = JSON.parse(post.data) || null;

		var arena = {
			id: processes.random(),
			created: new Date().getTime(),
			users: [session.user.id],
			state: {
				playing: false,
				start: null,
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
									action: null,
								});
							}							
					}
					else { //all future rounds
						//use vm & sandbox to execute player action
							var actions = [];

							for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) { //for each robot
								var name = arena.rounds[arena.rounds.length - 1].robots[i].name; //get its name...
								var code = String(arena.entrants[name].code); //...its code...
								var random = processes.random(); //...and a random string to use as a results variable

								var contextArena = { //create a "contextArena" that has all info except the entrants
									id: arena.id,
									state: arena.state,
									rules: arena.rules,
									rounds: arena.rounds,
									entrants: {}
								}
								contextArena.entrants[name] = arena.entrants[name]; //put the current entrant's info back in

								var sandbox = {}; //create a sandbox
								sandbox = {
									name: name, //use the name of the robot
									arena: contextArena, //and the contextArena, as above
									rules: contextArena.rules, //generate useful variables a user might want...
									rounds: contextArena.rounds,
									roundNumber: contextArena.rounds.length - 1,
									currentRound: contextArena.contextArena[arena.rounds.length - 1],
									robotCount: contextArena.rounds[contextArena.rounds.length - 1].robots.length,
									robots: contextArena.rounds[contextArena.rounds.length - 1].robots,
									newCube: contextArena.rounds[contextArena.rounds.length - 1].cubes[contextArena.rounds[contextArena.rounds.length - 1].cubes.length - 1],
									newCubes: contextArena.rounds[contextArena.rounds.length - 1].cubes.slice(-contextArena.rules.cubes.spawnRate),
									slot: contextArena.entrants[name].slot,
									self: contextArena.rounds[contextArena.rounds.length - 1].robots[contextArena.entrants[name].slot],
									power: contextArena.rounds[contextArena.rounds.length - 1].robots[contextArena.entrants[name].slot].power,
									cubes: contextArena.rounds[arena.rounds.length - 1].robots[contextArena.entrants[name].slot].cubes,
									lastAction: contextArena.rounds[contextArena.rounds.length - 2].robots[contextArena.entrants[name].slot].action,
									lastWinner: contextArena.rounds[contextArena.rounds.length - 2].winners[0],
									lastWinners: contextArena.rounds[contextArena.rounds.length - 2].winners,
									opponents: contextArena.rounds[contextArena.rounds.length - 1].robots.splice(contextArena.entrants[name].slot,1),
								};

								try {
									vm.runInNewContext("function " + name + "() {" + code + "}; var " + random + " = " + name + "();", sandbox, {timeout: 1000}); //try to run the code, like:::   function robotName() { var something = "something"; return something; } var h2034723492134x = robotName();
									var action = sandbox[random]; //extract that randomly named variable's contents
								}
								catch (error) {
									var action = arena.rules.robots.defaultAction; //or else use the defaultAction
								}

								actions.push(action || arena.rules.robots.defaultAction); //be super sure something gets submitted to the actions array
							}

							for (var i = 0; i < actions.length; i++) { //once that process is done, put all those actions back in their respective robots
								arena.rounds[arena.rounds.length - 1].robots[i].action = actions[i];
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
							if ((arena.playing) && ((arena.rounds.length - 1) % arena.rules.players.pausePeriod == 0)) {
								arena.state.playing = false;
								arena.state.pauseTo = (new Date().getTime() + arena.rules.players.pauseDuration);
							}
					}

					return arena;
				},
				players: {
					minimum: parameters.players.minimum || 2,
					maximum: parameters.players.maximum || 8,
					pauseDuration: parameters.players.pauseDuration || (1000 * 60 * 5),
					pausePeriod: parameters.players.pausePeriod || 10,
				},
				cubes: {
					colors: parameters.cubes.colors || ["red", "orange", "yellow", "green", "blue", "purple"],
					startCount: parameters.cubes.startCount || 1,
					maximum: parameters.cubes.maximum || 255,
					spawnRate: parameters.cubes.spawnRate || 1,
					spawnMemory: parameters.cubes.spawnMemory || 3,
					dissolveRate: parameters.cubes.dissolveRate || 0,
					dissolveIndex: parameters.cubes.dissolveIndex || "Math.floor(Math.random() * cubes.length)",
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
					startPower: parameters.robots.startPower || 0,
					maxPower: parameters.robots.maxPower || 255,
					powerRate: parameters.robots.powerRate || 1,
					tieBreaker: parameters.robots.tieBreaker || "cascade",
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
						power: function(arena) {
							//get the variables
								var powerRate = arena.rules.robots.powerRate; //get the rate of charge
							
							//charge up
								for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
									if (robots[i].action == "power") { //for all robots charging...
										arena.rounds[arena.rounds.length - 1].robots[i].power += powerRate; //... add to their power

										if (arena.rounds[arena.rounds.length - 1].robots[i].power > arena.rules.robots.maxPower) { //don't let anyone go over the maxCharge
											arena.rounds[arena.rounds.length - 1].robots[i].power = arena.rules.robots.maxPower;
										}
									}
								}

							return arena;
						}
					}
				},
				
				victory: {
					conditions: parameters.victory.conditions || ["6_of_1", "2_of_3", "1_of_6"],
					tieBreaker: parameters.victory.tieBreaker || "efficient",
					multiplier: parameters.victory.multiplier || 1,
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
								case "tie":
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

		processes.store("users", {id: session.user.id}, {$push: {arenas: arena.id}}, function(user) {
			processes.store("arenas", null, arena, function(data) {
				callback({success: true, redirect: "../../../../arenas/" + arena.id.substring(0,3)});
			});
		});
	}

/* destroy(session, post, callback) */
	function destroy(session, post, callback) {
		var data = JSON.parse(post.data);

		processes.retrieve("arenas", {id: data.id}, function(arena) {
			if (typeof arena.id === "undefined") { arena = arena[0]; }
			
			if ((typeof arena === "undefined") || (typeof arena.users === "undefined") || (arena.users[0].id !== session.user.id)) {
				callback({success: false, messages: {top: "//not authorized"}});
			}
			else {
				proceses.store("users", {id: {$in: arena.users}}, {$pull: {arenas: arena.id}}, function(user) {
					processes.store("arenas", {id: arena.id}, null, function(results) {
						callback({success: true, messages: {top: "//arena deleted"}, redirect: "../../../../arenas"});
					});
				});
			}
		});
	}

/* join(session, post, callback) */
	function join(session, post, callback) {
		var data = JSON.parse(post.data);

		if ((typeof post.arena_id === "undefined") || (post.arena_id.length !== 4)) {
			callback({success: false, messages: {top: "//invalid arena id", navbar: "//invalid arena id"}});
		}
		else {
			processes.retrieve("arenas", {$where: "this.id.substring(0,3) === " + data.arena_id}, function(arena) {
				if (typeof arena.id === "undefined") { arena = arena[0]; }

				if (typeof arena !== "undefined") {
					if (arena.users.length >= arena.rules.robots.maxCount) {
						callback({success: false, arena: arena,	messages: {navbar: "//unable to join; maxCount exceeded", top: "//unable to join; maxCount exceeded"}});
					}
					else if (arena.users.indexOf(session.user.id) > -1) {
						callback({success: false, arena: arena,	messages: {navbar: "//already joined", top: "//already joined"}});
					}
					else {
						arena.users.push(session.user.id);
						
						processes.store("users", {id: session.user.id}, {$push: {arenas: arena.id}}, function(user) {
							processes.store("arenas", {id: arena.id}, {$push: {users: session.user.id}}, function(arena) {
								callback({success: true, messages: {navbar: "//successfully joined", top: "//successfully joined"}, redirect: "../../../../arenas/" + arena.id.substring(0,3)});
							});
						});
					}
				}
				else {
					callback({success: false, messages: {navbar: "//invalid arena id"}});
				}
			});
		}
	}

/* leave(session, post, callback) */
	function leave(session, post, callback) {
		var data = JSON.parse(post.data);
		
		if ((typeof post.arena_id === "undefined") || (post.arena_id.length !== 4)) {
			callback({success: false, messages: {top: "//invalid arena id"}});
		}
		else {
			processes.store("users", {id: session.user.id}, {$pull: {arenas: arena.id}}, function(user) {
				processes.store("arenas", {$where: "this.id.substring(0,3) === " + post.arena_id}, {$pull: {users: session.user.id}}, function(arena) {
					callback({success: true, messages: {top: "//successfully left arena"}, redirect: "../../../../arenas/"});
				});
			});
		}
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
		join: join,
		leave: leave,
		update: update,
		destroy: destroy,
	};
