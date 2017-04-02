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
			entrants: {},
			state: {
				start: null,
				locked: true,
				pauseFrom: null,
				pauseTo: null,
				end: null,
				victors: []
			},
			rules: {
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
				},
				robots: {
					startPower: parameters.robots.startPower || 0,
					maxPower: parameters.robots.maxPower || 255,
					powerRate: parameters.robots.powerRate || 1,
					tieBreaker: parameters.robots.tieBreaker || "cascade",
					actions: parameters.robots.actions || ["power", "take", "sleep"],
				},
				victory: {
					conditions: parameters.victory.conditions || ["6_of_1", "2_of_3", "1_of_6"],
					tieBreaker: parameters.victory.tieBreaker || "efficient",
					multiplier: parameters.victory.multiplier || 1,
				}
			},	
			rounds: [],
		}

		processes.store("users", {id: session.user.id}, {$push: {arenas: arena.id}}, function(user) {
			processes.store("arenas", null, arena, function(data) {
				callback({success: true, redirect: "../../../../arenas/" + arena.id.substring(0,4)});
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

		if ((typeof data.arena_id === "undefined") || (data.arena_id.length !== 4)) {
			callback({success: false, messages: {top: "//invalid arena id", navbar: "//invalid arena id"}});
		}
		else {
			processes.retrieve("arenas", {$where: "this.id.substring(0,4) === '" + data.arena_id + "'"}, function(arena) {
				if (typeof arena.id === "undefined") { arena = arena[0]; }

				if (typeof arena !== "undefined") {
					if (arena.users.length >= arena.rules.robots.maxCount) {
						callback({success: false, messages: {navbar: "//unable to join; maxCount exceeded", top: "//unable to join; maxCount exceeded"}});
					}
					else if (arena.users.indexOf(session.user.id) > -1) {
						callback({success: false, messages: {navbar: "//already joined", top: "//already joined"}});
					}
					else if ((((session.user.statistics.wins * 5) + session.user.statistics.losses) < 15) && ((arena.rules.robots.actions.indexOf("sap") > -1) || (arena.rules.robots.actions.indexOf("halftake") > -1) || (arena.rules.robots.actions.indexOf("fliptake") > -1))) {
						callback({success: false, messages: {navbar: "//unable to join; arena contains advanced actions", top: "//unable to join; arena contains advanced actions"}});
					}
					else if ((((session.user.statistics.wins * 5) + session.user.statistics.losses) < 30) && ((arena.rules.robots.actions.indexOf("shock") > -1) || (arena.rules.robots.actions.indexOf("burn") > -1) || (arena.rules.robots.actions.indexOf("swaptake") > -1))) {
						callback({success: false, messages: {navbar: "//unable to join; arena contains expert actions", top: "//unable to join; arena contains expert actions"}});
					}
					else {
						arena.users.push(session.user.id);
						
						processes.store("users", {id: session.user.id}, {$push: {arenas: arena.id}}, function(user) {
							processes.store("arenas", {id: arena.id}, {$push: {users: session.user.id}}, function(data) {
								callback({success: true, messages: {navbar: "//successfully joined", top: "//successfully joined"}, redirect: "../../../../arenas/" + arena.id.substring(0,4)});
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

/* selectRobot(session, post, callback) */
	function selectRobot(session, post, callback) {
		var data = JSON.parse(post.data);

		if (typeof data.arena_id === "undefined") {
			callback({success: false, messages: {top: "//invalid arena id"}});
		}
		else if (typeof data.robot_id === "undefined") {
			callback({success: false, messages: {top: "//no robot selected"}});
		}
		else {
			processes.retrieve("arenas", {id: data.arena_id}, function(arena) {
				if (typeof arena.id === "undefined") { arena = arena[0]; }

				if ((typeof arena.id !== "undefined") && (arena.id !== null)) {
					if ((arena.users.indexOf(session.user.id) > -1) && (arena.state.start === null)) {
						processes.retrieve("robots", {$and: [{id: data.robot_id}, {"user.id": session.user.id}]}, function(robot) {
							if (typeof robot.id === "undefined") { robot = robot[0]; }

							if ((typeof robot.id !== "undefined") && (robot.id !== null)) {
								arena.entrants[robot.id] = robot;

								processes.store("arenas", {id: arena.id}, arena, function(arena) {
									if (typeof arena.id === "undefined") { arena = arena[0]; }

									callback({success: true, messages: {top: "//successfully joined arena"}, redirect: "../../../../arenas/" + arena.id.substring(0,4)});
								});
							}
							else {
								callback({success: false, messages: {top: "//unable to retrieve robot"}});
							}				
						});
					}
					else {
						callback({success: false, messages: {top: "//join arena first"}});
					}
				}
				else {
					callback({success: false, messages: {top: "//unable to retrieve arena"}});
				}
			});
		}
	}

/* leave(session, post, callback) */
	function leave(session, post, callback) {
		var data = JSON.parse(post.data);
		
		if ((typeof data.arena_id === "undefined") || (data.arena_id.length !== 32)) {
			callback({success: false, messages: {top: "//invalid arena id"}});
		}
		else {
			processes.retrieve("arenas", {id: data.arena_id}, function(arena) {
				if (typeof arena.id === "undefined") { arena = arena[0]; }

				if ((typeof arena.id === "undefined") || (arena.id == null)) {
					callback({success: false, messages: {top: "//not a valid arena id"}});
				}
				else if (!(arena.users.indexOf(session.user.id) > -1)) {
					callback({success: false, messages: {top: "//already left this arena"}});
				}
				else {
					var robot_id = Object.keys(arena.entrants).find(function(i) { return arena.entrants[i].user.id === session.user.id });

					if ((typeof robot_id !== "undefined") && (robot_id !== null) && (robot_id.length > 0)) {
						var unset = {};
						unset["entrants." + robot_id] = "";
						processes.store("users", {id: session.user.id}, {$pull: {arenas: data.arena_id}}, function(user) {
							processes.store("arenas", {id: data.arena_id}, {$pull: {users: session.user.id}}, function(arena) {
								processes.store("arenas", {id: data.arena_id}, {$unset: unset}, function(arena) {
									callback({success: true, messages: {top: "//successfully left arena"}, redirect: "../../../../arenas/"});
								});
							});
						});
					}
					else {
						callback({success: false, messages: {top: "//unable to find robot in this arena"}});
					}
				}
			});
		}
	}

/* launch(session, post, callback) */
	function launch(session, post, callback) {
		var data = JSON.parse(post.data);
		
		if ((typeof data.arena_id === "undefined") || (data.arena_id.length !== 32)) {
			callback({success: false, messages: {top: "//invalid arena id"}});
		}
		else {
			processes.retrieve("arenas", {id: data.arena_id}, function(arena) {
				if (typeof arena.id === "undefined") { arena = arena[0]; }

				if ((typeof arena.id !== "undefined") && (arena.id !== null)) {
					arena.state.start = new Date().getTime(); //start the game!
					var arena = update(arena); //update the arena for the first batch of rounds
					arena.state.locked = false; //unlock it for the future
								
					processes.store("arenas", {id: arena.id}, arena, function(data) { //store it
						callback({success: true, arena: arena, messages: {top: "//this arena is in play"}}); //send back the updated arena
					});
				}
				else {
					callback({success: false, messages: {top: "//unable to retrieve arena"}});
				}
			});
		}
	}

/* adjustRobot(session, post, callback) */
	function adjustRobot(session, post, callback) {
		//???
		//based on edit_robot, but only for code/inputs, and only update this iteration of the robot (in the arena)
	}

/* read(session, post, callback) */
	function read(session, post, callback) {
		var arena_id = post.arena_id; //arena we're asking for
		var round_number = post.round_number; //which round we need
		var timeNow = new Date().getTime(); //millisecond we're at

		if ((typeof arena_id !== "undefined") && (arena_id !== null)) {
			processes.retrieve("arenas",{id: arena_id}, function(arena) {
				if (typeof arena.id === "undefined") { arena = arena[0]; }

				if ((typeof arena.id !== "undefined") && (arena.id !== null)) {
					if ((timeNow >= arena.state.pauseFrom) && (timeNow < arena.state.pauseTo)) { //if the game is paused...
						callback({success: true, arena: arena, messages: {top: "//this arena is paused"}});
					}
					else if (arena.state.end !== null) { //if the game is over...
						callback({success: true, arena: arena, messages: {top: "//this arena has concluded"}});
					}
					else { //if the game is in play...
						if (arena.rounds.length >= round_number) { //asking for a round that * does * exist already
							callback({success: true, arena: arena, messages: {top: "//this arena is in play"}});
						}
						else if (round_number > arena.rounds.length) { //asking for a round that hasn't been evaluated yet
							processes.store("arenas",{$and: [{id: arena_id}, {"state.locked":false}]},{$set:{"state.locked": true}}, function(locked_arena) { //try to lock it so we can update it without someone else also updating it
								if (typeof locked_arena.id === "undefined") { locked_arena = locked_arena[0]; }

								if ((typeof locked_arena.id === "undefined") || (locked_arena.id === null)) { //unable to update because somebody beat us to it... gonna have to wait
									var loopCount = 0;

									var loopCheck = setInterval(function() { //every 3 seconds, ask the database for updates
										if (loopCount > 9) { //if we've looped through for 30 seconds already...
											clearInterval(loopCheck);
											callback({success: false, arena: arena, messages: {top: "//unable to retrieve or update arena"}}); //give up
										}
										else {
											processes.retrieve("arenas",{id: arena_id}, function(arena) { //otherwise, try to retrieve the arena
												if (typeof arena.id === "undefined") { arena = arena[0]; }
												
												if (arena.rounds.length >= round_number) { //if the arena now contains new rounds...
													clearInterval(loopCheck);
													callback({success: true, arena: arena, messages: {top: "//this arena is in play"}}); //...send back the updated arena
												}
												else { //loop through
													loopCount++;
												}
											});
										}
									}, 3000);
								}
								else { //evaluate it yourself
									var arena = update(locked_arena); //update the arena
									arena.state.locked = false; //unlock it

									if (arena.state.end === null) { //if the arena has not concluded...
										processes.store("arenas", {id: arena.id}, arena, function(data) { //store it
											callback({success: true, arena: arena, messages: {top: "//this arena is in play"}}); //send back the updated arena
										});
									}
									else { //if it has concluded...
										if (arena.state.victors.length > 0) { //update stats for those robots
											var robot_ids = Object.keys(arena.entrants);
											var robot_victors = arena.state.victors;
											var robot_losers = robot_ids.filter(function(robot_id) { return (!(robot_victors.indexOf(robot_id) > -1))});
											
											var user_victors = [];
											var user_losers = [];
											
											for (var i = 0; i < robot_ids.length; i++) {
												if (robot_victors.indexOf(robot_ids[i]) > -1) {
													user_victors.push(arena.entrants[robot_ids[i]].user.id);
												}
												else {
													user_losers.push(arena.entrants[robot_ids[i]].user.id);	
												}
											}

											processes.store("users", {id: {$in: user_victors}}, {$inc: {"statistics.wins": 1}}, function(data) { //users +1 win
												processes.store("users", {id: {$in: user_losers}}, {$inc: {"statistics.losses": 1}}, function(data) { //users +1 loss
													processes.store("robots", {id: {$in: robot_victors}}, {$inc: {"statistics.wins": 1}}, function(data) { //robots +1 win
														processes.store("robots", {id: {$in: robot_losers}}, {$inc: {"statistics.losses": 1}}, function(data) { //robots +1 loss
															processes.store("arenas", {id: arena.id}, arena, function(data) { //store the arena
																callback({success: true, arena: arena, messages: {top: "//this arena has concluded"}});
															});
														});
													});
												});
											});
										}
									}
								}
							});
						}
					}
				}
				else {
					callback({success: false, messages: {top: "//unable to retrieve arena"}});
				}
			});
		}
		else {
			callback({success: false, messages: {top: "//unable to retrieve arena"}});
		}
	}

/* update(arena) */
	function update(arena) {
		arena.state.pauseFrom = null;
		arena.state.pauseTo = null;
		var startLength = arena.rounds.length; //get the round # where we're starting

		while ((arena.rounds.length < (startLength + 10)) && (arena.state.pauseFrom === null) && (arena.state.pauseTo === null)) { //until pause or 10 rounds
			//phase 0: create newRound
				if (arena.rounds.length === 0) { //first round
					//create newRound object
						var newRound = {
							cubes: [],
							robots: [],
							winner: null
						}

					//add robots
						for (var i = 0; i < Object.keys(arena.entrants).length; i++) {
							//set cubes to 0
								var cubes = {
									red: 0,
									orange: 0,
									yellow: 0,
									green: 0,
									blue: 0,
									purple: 0
								};

							//give the robot some starting cubes (maybe)
								for (var j = 0; j < arena.rules.cubes.startCount; j++) {
									var color = arena.rules.cubes.colors[Math.floor(Math.random() * arena.rules.cubes.colors.length)];
									cubes[color] += 1;
								}

							//add the robot to the new round
								newRound.robots.push({
									name: Object.keys(arena.entrants)[i],
									power: arena.rules.robots.startPower,
									cubes: cubes,
									action: null,
								});
						}							
				}
				else { //all subsequent rounds
					var newRound = JSON.parse(JSON.stringify(arena.rounds[arena.rounds.length - 1])); //copy the current round data into a newRound
				}

			//phase 1: running the user scripts
				if (arena.rounds.length > 0) { //don't do this for the first round
					var robot_actions = [];

					for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
						//get robot data
							var robot = arena.rounds[arena.rounds.length - 1].robots[i];
								var name = robot.name //this is actually the id - we won't use the robot's string name except for display
								var inputs = String(arena.entrants[name].inputs);
								var code = String(arena.entrants[name].code);
						
						//build the sandbox
							var sandbox = {}; //clear existing sandbox
							for (var j = 0; j < inputs.length; j++) { //only add the variables specified by the user's code
								switch(inputs[j]) {
									case "arena": //all other inputs can be derived from this one
										sandbox.arena = { //for arena, only include state, rules, and rounds data (no id, created, users, or entrants)
											state: arena.state,
											rules: arena.rules,
											rounds: arena.rounds
										};
									break;

									case "name":
										sandbox.name = name; //can be derived in robot-code as `arguments.callee.name` - it'll still actually be the robot's id
									break;

									case "rules":
										sandbox.rules = arena.rules;
									break;

									case "rounds":
										sandbox.rounds = arena.rounds;
									break;

									case "roundCount":
										sandbox.roundCount = arena.rounds.length - 1;
									break;

									case "currentRound":
										sandbox.currentRound = arena.rounds[arena.rounds.length - 1];
									break;

									case "lastRound":
										sandbox.lastRound = arena.rounds[arena.rounds.length - 2];
									break;

									case "robots":
										sandbox.robots = arena.rounds[arena.rounds.length - 1].robots;
									break;

									case "robotCount":
										sandbox.robotCount = arena.rounds[arena.rounds.length - 1].robots.length;
									break;

									case "newCube":
										sandbox.newCube = arena.rounds[arena.rounds.length - 1].cubes[arena.rounds[arena.rounds.length - 1].cubes.length - 1];
									break;

									case "newCubes":
										sandbox.newCubes = arena.rounds[arena.rounds.length - 1].cubes.slice(-arena.rules.cubes.spawnRate);
									break;

									case "self":
										sandbox.self = arena.rounds[arena.rounds.length - 1].robots.find(function(robot) {return robot.name === name});
									break;

									case "slot":
										sandbox.slot = arena.rounds[arena.rounds.length - 1].robots.indexOf(arena.rounds[arena.rounds.length - 1].robots.find(function(robot) {return robot.name === name}));
									break;

									case "power":
										sandbox.power = arena.rounds[arena.rounds.length - 1].robots.find(function(robot) {return robot.name === name}).power;
									break;

									case "cubes":
										sandbox.cubes = arena.rounds[arena.rounds.length - 1].robots.find(function(robot) {return robot.name === name}).cubes;
									break;

									case "lastAction":
										sandbox.lastAction = arena.rounds[arena.rounds.length - 2].robots.find(function(robot) {return robot.name === name}).action;
									break;

									case "lastWinner":
										sandbox.lastWinner = arena.rounds[arena.rounds.length - 2].winners[0];
									break;

									case "lastWinners":
										sandbox.lastWinners = arena.rounds[arena.rounds.length - 2].winners;
									break;

									case "opponents":
										sandbox.opponents = arena.rounds[arena.rounds.length - 1].robots.filter(function(robot) {return robot.name !== name});
									break;

									case "colors":
										sandbox.colors = arena.rules.cubes.colors;
									break;
								}
							}

						//run robot code
							var random = processes.random(); //the results variable will have an unpredictable name so it's almost impossible for the user to mess with it
							try {
								vm.runInNewContext(
									"function " + name + "() {" + (code || "") + "}; var " + random + " = " + name + "();",
									sandbox,
									{timeout: 1000}
								); //try to run the code --> function 12345678() { return "something"; } var abcdefgh = 12345678();
								robot_actions[i] = sandbox[random] || "sleep"; //extract that randomly named variable's contents or default to sleep
							}
							catch (error) {
								robot_actions[i] = "sleep"; //if the code breaks, default to sleep
							}

						//prevent illegal actions
							if (!(arena.rules.robots.actions.indexOf(robot_actions[i]) > -1)) {
								robot_actions[i] = "sleep"; //robots who perform actions outside the scope of this arena will instead sleep
							}
					}

					for (var i = 0; i < actions.length; i++) { //then put all those actions back in their respective robots
						arena.rounds[arena.rounds.length - 1].robots[i].action = robot_actions[i];
					}
				}

			//phase 2: robot actions: shock, power, sap, burn, sleep
				if (arena.rounds.length > 0) { //don't do this for the first round
					//shock
						for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
							if (arena.rounds[arena.rounds.length - 1].robots[i].action === "shock") { //for all robots shocking...
								var shocker = arena.rounds[arena.rounds.length - 1].robots[i];
								var cubeCount = (shocker.cubes.red + shocker.cubes.orange + shocker.cubes.yellow + shocker.cubes.green + shocker.cubes.blue + shocker.cubes.purple); //add up the shocker's cubes

								for (var j = 0; j < arena.rounds[arena.rounds.length - 1].robots.length; j++) { //loop through all robots to find potential shockees
									var opponent = arena.rounds[arena.rounds.length - 1].robots[j]; //we can call them "opponents" because we know that the "if" will filter out the shocker anyway
									if ((opponent.action !== "shock") && ((opponent.cubes.red + opponent.cubes.orange + opponent.cubes.yellow + opponent.cubes.green + opponent.cubes.blue + opponent.cubes.purple) > cubeCount)) {
										arena.rounds[arena.rounds.length - 1].robots[j].action = "sleep"; //sleep all robots who aren't themselves shocking and have more cubes than the shocker
									}
								}
							}
						}

					//power
						var powerRate = arena.rules.robots.powerRate; //get the rate of powering
					
						for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
							if (arena.rounds[arena.rounds.length - 1].robots[i].action === "power") { //for all robots powering...
								newRound.robots[i].power += powerRate; //... add to their newRound's power

								if (newRound.robots[i].power > arena.rules.robots.maxPower) { //don't let anyone go over the maxPower
									newRound.robots[i].power = arena.rules.robots.maxPower;
								}
							}
						}

					//sap
						var powerRate = arena.rules.robots.powerRate; //get the rate of powering

						for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
							if (arena.rounds[arena.rounds.length - 1].robots[i].action === "sap") { //for all robots sapping...
								var sapper = arena.rounds[arena.rounds.length - 1].robots[i];

								for (var j = 0; j < arena.rounds[arena.rounds.length - 1].robots.length; j++) {
									var opponent = arena.rounds[arena.rounds.length - 1].robots[j]; //we can call them "opponents" because we know that the "if" will filter out the sapper anyway
									if ((opponent.action === "power") && (opponent.power > sapper.power)) { //for all opponents who have more power and are powering up now
										newRound.robots[j].power = Math.max(0, (newRound.robots[j].power - powerRate)); //reduce their power for the newRound by the powerRate, with a minimum of 0
										newRound.robots[i].power += powerRate; //add that power to this sapper for the newRound
									}
								}

								if (newRound.robots[i].power > arena.rules.robots.maxPower) { //don't let anyone go over the maxPower
									newRound.robots[i].power = arena.rules.robots.maxPower;
								}
							}
						}

					//burn
						var powerRate = arena.rules.robots.powerRate; //get the rate of powering

						for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
							if (arena.rounds[arena.rounds.length - 1].robots[i].action === "burn") { //for all robots burning...
								var burner = arena.rounds[arena.rounds.length - 1].robots[i];
								var cubeCount = (burner.cubes.red + burner.cubes.orange + burner.cubes.yellow + burner.cubes.green + burner.cubes.blue + burner.cubes.purple); //add up the burner's cubes

								if (cubeCount > 0) {
									var burnIndex = Math.floor(Math.random() * cubeCount);
									
									if (burnIndex < burner.cubes.red) {
										newRound.robots[i].cubes.red--;
										newRound.robots[i].power += (powerRate * 2);
									}
									else if (burnIndex < (burner.cubes.red + burner.cubes.orange)) {
										newRound.robots[i].cubes.orange--;
										newRound.robots[i].power += (powerRate * 2);
									}
									else if (burnIndex < (burner.cubes.red + burner.cubes.orange + burner.cubes.yellow)) {
										newRound.robots[i].cubes.yellow--;
										newRound.robots[i].power += (powerRate * 2);
									}
									else if (burnIndex < (burner.cubes.red + burner.cubes.orange + burner.cubes.yellow + burner.cubes.green)) {
										newRound.robots[i].cubes.green--;
										newRound.robots[i].power += (powerRate * 2);
									}
									else if (burnIndex < (burner.cubes.red + burner.cubes.orange + burner.cubes.yellow + burner.cubes.green + burner.cubes.blue)) {
										newRound.robots[i].cubes.blue--;
										newRound.robots[i].power += (powerRate * 2);
									}
									else if (burnIndex < (burner.cubes.red + burner.cubes.orange + burner.cubes.yellow + burner.cubes.green + burner.cubes.blue + burner.cubes.purple)) {
										newRound.robots[i].cubes.purple--;
										newRound.robots[i].power += (powerRate * 2);
									}
									else {
										//error
										arena.rounds[arena.rounds.length - 1].robots[i].action = "sleep";
									}

									if (newRound.robots[i].power > arena.rules.robots.maxPower) { //don't let anyone go over the maxPower
										newRound.robots[i].power = arena.rules.robots.maxPower;
									}
								}
								else {
									arena.rounds[arena.rounds.length - 1].robots[i].action = "sleep"; //if the robot has no cubes to burn, just sleep
								}
							}
						}
				}

			//phase 3: robot actions: take, halftake, swaptake, fliptake
				if (arena.rounds.length > 0) { //don't do this for the first round
					var takers = []; //empty array of robots attempting to take

					//get a list of all takers
						for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
							if (["take","halftake","swaptake","fliptake"].indexOf(arena.rounds[arena.rounds.length - 1].robots[i].action) > -1) { //all robots with one of those actions
								if (!(arena.rounds[arena.rounds.length - 1].robots[i].power > 0)) { //no power?
									arena.rounds[arena.rounds.length - 1].robots[i].action = "sleep"; //sleep!
								}
								else {
									takers.push(arena.rounds[arena.rounds.length - 1].robots[i]); //focus on that robot's current status
								}
							}
						}

					//swaptake and halftake use 50% power
						for (var i = 0; i < takers.length; i++) {
							if (["halftake","swaptake"].indexOf(takers[i].action) > -1) {
								takers[i].power = Math.ceiling(takers[i].power / 2); //use 50% power, rounded up
							}
						}

					//sort that list descending
						takers.sort(function(a, b) { //sort in descending order
							return a.power < b.power;
						});

					//resolve ties
						if ((takers.length > 1) && (takers[0].power === takers[1].power)) {
							switch (arena.rules.robots.tieBreaker) {
								case "leave": //no one gets the cube
									var winner = null;
								break;

								case "dissolve": //cube disappears
									var winner = null;
									newRound.cubes = [];
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
										a.cubeCount = a.cubes.red + a.cubes.orange + a.cubes.yellow + a.cubes.green + a.cubes.blue + a.cubes.purple;
										b.cubeCount = b.cubes.red + b.cubes.orange + b.cubes.yellow + b.cubes.green + b.cubes.blue + b.cubes.purple;

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

					//give the winner all the cubes, up to the maximum
						if ((typeof winner !== "undefined") && (winner !== null)) {
							arena.rounds[arena.rounds.length - 1].winner = winner.name; //log the winner's id in the current round

							if (winner.action === "swaptake") { //for swaptakers, build a swapBack pile
								var swapBack = [];
							}		
							
							var cubes = arena.rounds[arena.rounds.length - 1].cubes; //get all the cubes from this round
							while ((cubes.length) && ((winner.cubes.red + winner.cubes.orange + winner.cubes.yellow + winner.cubes.green + winner.cubes.blue + winner.cubes.purple) < arena.rules.cubes.maximum)) { //while there are cubes and the winner has fewer than the max
								
								if (winner.action === "fliptake") { //for fliptakers, change the color to the complimentary color
									if (cubes[0] === "red") {cubes[0] === "green";}
									else if (cubes[0] === "orange") {cubes[0] === "blue";}
									else if (cubes[0] === "yellow") {cubes[0] === "purple";}
									else if (cubes[0] === "green") {cubes[0] === "red";}
									else if (cubes[0] === "blue") {cubes[0] === "orange";}
									else if (cubes[0] === "purple") {cubes[0] === "yellow";}
								}

								winner.cubes[cubes[0]]++; //add the new cube to the winner's correspondingly colored cube stack
								cubes.shift(); //remove it from the round's cubes

								if (winner.action === "swaptake") { //for swaptakers, add to the swapBack pile and remove a cube from that color
									var swapIndex = Math.floor(Math.random() * (swapper.cubes.red + swapper.cubes.orange + swapper.cubes.yellow + swapper.cubes.green + swapper.cubes.blue + swapper.cubes.purple));
									
									if (swapIndex < swapper.cubes.red) {
										winner.cubes.red--;
										swapBack.push("red");
									}
									else if (swapIndex < (swapper.cubes.red + swapper.cubes.orange)) {
										winner.cubes.orange--;
										swapBack.push("orange");
									}
									else if (swapIndex < (swapper.cubes.red + swapper.cubes.orange + swapper.cubes.yellow)) {
										winner.cubes.yellow--;
										swapBack.push("yellow");
									}
									else if (swapIndex < (swapper.cubes.red + swapper.cubes.orange + swapper.cubes.yellow + swapper.cubes.green)) {
										winner.cubes.green--;
										swapBack.push("green");
									}
									else if (swapIndex < (swapper.cubes.red + swapper.cubes.orange + swapper.cubes.yellow + swapper.cubes.green + swapper.cubes.blue)) {
										winner.cubes.blue--;
										swapBack.push("blue");
									}
									else if (swapIndex < (swapper.cubes.red + swapper.cubes.orange + swapper.cubes.yellow + swapper.cubes.green + swapper.cubes.blue + swapper.cubes.purple)) {
										winner.cubes.purple--;
										swapBack.push("purple");
									}
								}
							}

							if (winner.action === "swaptake") { //for swaptakers, add the swapBack pile to the end of the remaining cubes
								cubes = cubes.concat(swapBack);
							}

							newRound.robots.find(function(robot) {return robot.name = winner.name}).cubes = winner.cubes; //the winner gets the cubes in the new round
							newRound.cubes = cubes || []; //remaining cubes go to the new round
						}
						
					//remove power from all takers
						for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
							if (arena.rounds[arena.rounds.length - 1].robots[i].action === "take") {
								newRound.robots[i].power = 0; //set the robot's power to 0 for newRound
							}
							else if (arena.rounds[arena.rounds.length - 1].robots[i].action === "fliptake") {
								newRound.robots[i].power = 0; //set the robot's power to 0 for newRound
							}
							else if (arena.rounds[arena.rounds.length - 1].robots[i].action === "halftake") {
								newRound.robots[i].power = Math.floor(arena.rounds[arena.rounds.length - 1].robots[i].power / 2); //set the robot's power to 50%, rounded down
							}
							else if (arena.rounds[arena.rounds.length - 1].robots[i].action === "swaptake") {
								newRound.robots[i].power = Math.floor(arena.rounds[arena.rounds.length - 1].robots[i].power / 2); //set the robot's power to 50%, rounded down
							}
						}
				}

			//phase 4: robot actions: sleep
				if (arena.rounds.length > 0) { //don't do this for the first round
					//sleep
						for (var i = 0; i < arena.rounds[arena.rounds.length - 1].robots.length; i++) {
							if (arena.rounds[arena.rounds.length - 1].robots[i].action === "sleep") { //for all robots sleeping...
								//do nothing
							}
						}
				}

			//phase 5: spawn & dissolve cubes
				//dissolve
					var i = 0;
					while ((i < arena.rules.cubes.dissolveRate) && (newRound.cubes > 0)) { //loop through to dissolve the dissolveRate number of cubes (or until none remain)
						switch (arena.rules.cubes.dissolveIndex) { //figure out which cube is getting dissolved
							case "none":
								var dissolveIndex = 256;
							break;

							case "newest":
								var dissolveIndex = newRound.cubes.length - 1;
							break;

							case "oldest":
								var dissolveIndex = 0;
							break;

							case "random":
							default:
								var dissolveIndex = Math.floor(Math.random() * newRound.cubes.length);
							break;
						}

						newRound.cubes.splice(dissolveIndex,1); //remove one cube from the dissolveIndex position
						i++;
					}

				//spawn
					var colors = arena.rules.cubes.colors;
					var spawnRate = arena.rules.cubes.spawnRate;
					var spawnMemory = arena.rules.cubes.spawnMemory;

					var pastCubes = [];

					for (var i = 1; i < Math.min(spawnMemory, arena.rounds.length); i++) { //go back to each round that should be remembered...
						pastCubes.push(arena.rounds[arena.rounds.length - i].cubes.slice(-spawnRate)); //and get which cubes were created
					}
					colors = colors.filter(function(color) {return pastCubes.indexOf(color) < 0}); //filter out those colors
					
					for (var i = 0; i < spawnRate; i++) {
						var newCube = colors[Math.floor(Math.random() * colors.length)] || null; //pick a random color from the remaining colors
						if (newCube !== null) {
							newRound.cubes.push(newCube);
						}
					}

			//phase 6: merge newRound
				arena.rounds.push(newRound); //merge the newRound into the existing rounds array

			//phase 7: check for victory
				//loop through all conditions
					for (var c = 0; c < arena.rules.victory.conditions.length; c++) { //loop through for all conditions
						switch(arena.rules.victory.conditions[c]) {
							case "6of1": //6 cubes of 1 color
								for (var i = 0; i < newRound.robots.length; i++) {
									for (j = 0; j < arena.rules.cubes.colors.length; j++) {
										if (newRound.robots[i].colors[arena.rules.cubes.colors[j]] >= (6 * arena.rules.victory.multiplier)) {
											arena.state.victors.push(newRound.robots[i].name);
										}
									}
								}
							break;

							case "2of3": //2 of all primary or all secondary cubes
								for (var i = 0; i < newRound.robots.length; i++) {
									if ((newRound.robots[i].red >= (2 * arena.rules.victory.multiplier)) && (newRound.robots[i].yellow >= (2 * arena.rules.victory.multiplier)) && (newRound.robots[i].blue >= (2 * arena.rules.victory.multiplier))) {
										arena.state.victors.push(newRound.robots[i].name);
									}
									else if ((newRound.robots[i].orange >= (2 * arena.rules.victory.multiplier)) && (newRound.robots[i].green >= (2 * arena.rules.victory.multiplier)) && (newRound.robots[i].purple >= (2 * arena.rules.victory.multiplier))) {
										arena.state.victors.push(newRound.robots[i].name);
									}
								}
							break;

							case "1of6": //one of each color
								for (var i = 0; i < newRound.robots.length; i++) {
									var victory = true;

									for (j = 0; j < arena.rules.cubes.colors.length; j++) {
										if (newRound.robots[i].colors[arena.rules.cubes.colors[j]] < (1 * arena.rules.victory.multiplier)) {
											victory = false;
										}
									}

									if (victory) {
										arena.state.victors.push(newRound.robots[i].name);
									}
								}
							break;

							case "3of2": //3 of each of 2 complementary colors
								for (var i = 0; i < newRound.robots.length; i++) {
									if ((newRound.robots[i].red >= (3 * arena.rules.victory.multiplier)) && (newRound.robots[i].green >= (3 * arena.rules.victory.multiplier))) {
										arena.state.victors.push(newRound.robots[i].name);
									}
									else if ((newRound.robots[i].orange >= (3 * arena.rules.victory.multiplier)) && (newRound.robots[i].blue >= (3 * arena.rules.victory.multiplier))) {
										arena.state.victors.push(newRound.robots[i].name);
									}
									else if ((newRound.robots[i].yellow >= (3 * arena.rules.victory.multiplier)) && (newRound.robots[i].purple >= (3 * arena.rules.victory.multiplier))) {
										arena.state.victors.push(newRound.robots[i].name);
									}
								}
							break;
						}
					}

				//remove duplicates
					arena.state.victors = arena.state.victors.filter(function (victor, position) {
						return arena.state.victors.indexOf(victor) === position;
					});

				//resolve ties
					if (arena.state.victors.length > 1) {
						switch (arena.rules.victory.tieBreaker) {
							case "tie":
								//do nothing
							break;

							case "random":
								arena.state.victors = arena.state.victors[Math.floor(Math.random() * arena.state.victors.length)];
							break;

							case "greedy":
								arena.state.victors.sort(function(a, b) { //order the tied victors based on total cubeCount, ascending
									var robot_a = newRound.find(function(robot) {return robot.name === a});
									var robot_b = newRound.find(function(robot) {return robot.name === b});

									return ((robot_a.cubes.red + robot_a.cubes.orange + robot_a.cubes.yellow + robot_a.cubes.green + robot_a.cubes.blue + robot_a.cubes.purple) > (robot_b.cubes.red + robot_b.cubes.orange + robot_b.cubes.yellow + robot_b.cubes.green + robot_b.cubes.blue + robot_b.cubes.purple));
								});

								arena.state.victors = arena.state.victors[0]; //whoever has the *most* cubes is the victor
							break;

							case "efficient":
								arena.state.victors.sort(function(a, b) { //order the tied victors based on total cubeCount, descending
									var robot_a = newRound.find(function(robot) {return robot.name === a});
									var robot_b = newRound.find(function(robot) {return robot.name === b});

									return ((robot_a.cubes.red + robot_a.cubes.orange + robot_a.cubes.yellow + robot_a.cubes.green + robot_a.cubes.blue + robot_a.cubes.purple) < (robot_b.cubes.red + robot_b.cubes.orange + robot_b.cubes.yellow + robot_b.cubes.green + robot_b.cubes.blue + robot_b.cubes.purple));
								});

								arena.state.victors = arena.state.victors[0]; //whoever has the *least* cubes is the victor
							break;
						}
					}

				//change state
					if (arena.state.victors.length > 0) {
						arena.state.end = new Date().getTime(); //add end time if victory
					}

			//phase 8: check for pause
				if ((arena.state.end === null) && ((arena.rounds.length - 1) % arena.rules.players.pausePeriod === 0)) { //pause if the period is complete, unless victory
					arena.state.pauseFrom = new Date().getTime() + ((arena.rounds.length - startLength) * 1000 * 10); //set the pause start for now + 10 seconds per new round evaluated
					arena.state.pauseTo = arena.state.pauseFrom + arena.rules.players.pauseDuration; //set pause end for pauseFrom + duration of the pause
				}
		}
			
		return arena;
	}

/* exports */
	module.exports = {
		create: create,
		join: join,
		selectRobot: selectRobot,
		leave: leave,
		launch: launch,
		adjustRobot: adjustRobot,
		read: read,
		update: update,
		destroy: destroy,
	};
