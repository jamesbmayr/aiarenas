/* my modules */
	const processes = require("../processes");
	const vm = require("vm");

/* create(session, post, callback) */
	function create(session, post, callback) {
		var parameters = JSON.parse(post.data) || null;

		if ((((session.user.statistics.wins * 5) + session.user.statistics.losses) < 15) && ((parameters.robots.actions.indexOf("sap") > -1) || (parameters.robots.actions.indexOf("halftake") > -1) || (parameters.robots.actions.indexOf("fliptake") > -1))) {
			callback({success: false, messages: {navbar: "//unable to create; arena contains advanced actions", top: "//unable to create; arena contains advanced actions"}});
		}
		else if ((((session.user.statistics.wins * 5) + session.user.statistics.losses) < 30) && ((parameters.robots.actions.indexOf("shock") > -1) || (parameters.robots.actions.indexOf("burn") > -1) || (parameters.robots.actions.indexOf("swaptake") > -1))) {
			callback({success: false, messages: {navbar: "//unable to create; arena contains expert actions", top: "//unable to create; arena contains expert actions"}});
		}
		else {

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
						minimum: Number(parameters.players.minimum) || 2,
						maximum: Number(parameters.players.maximum) || 8,
						pauseDuration: parameters.players.pauseDuration || "05:00",
						pausePeriod: Number(parameters.players.pausePeriod) || 10,
					},
					cubes: {
						colors: parameters.cubes.colors || ["red", "orange", "yellow", "green", "blue", "purple"],
						startCount: Number(parameters.cubes.startCount) || 1,
						maximum: Number(parameters.cubes.maximum) || 255,
						spawnRate: Number(parameters.cubes.spawnRate) || 1,
						spawnMemory: Number(parameters.cubes.spawnMemory) || 3,
						dissolveRate: Number(parameters.cubes.dissolveRate) || 0,
						dissolveIndex: parameters.cubes.dissolveIndex || "Math.floor(Math.random() * cubes.length)",
					},
					robots: {
						startPower: Number(parameters.robots.startPower) || 0,
						maxPower: Number(parameters.robots.maxPower) || 255,
						powerRate: Number(parameters.robots.powerRate) || 1,
						tieBreaker: parameters.robots.tieBreaker || "cascade",
						actions: parameters.robots.actions || ["power", "take", "sleep"],
					},
					victory: {
						conditions: parameters.victory.conditions || ["6_of_1", "2_of_3", "1_of_6"],
						tieBreaker: parameters.victory.tieBreaker || "efficient",
						multiplier: Number(parameters.victory.multiplier) || 1,
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
	}

/* destroy(session, post, callback) */
	function destroy(session, post, callback) {
		var data = JSON.parse(post.data);

		processes.retrieve("arenas", {id: data.arena_id}, function(arena) {
			if (typeof arena.id === "undefined") { arena = arena[0]; }
			
			if ((typeof arena === "undefined") || (typeof arena.users === "undefined")) {
				callback({success: false, messages: {top: "//unable to retrieve arena"}});
			}
			else if (arena.users[0] !== session.user.id) {
				callback({success: false, messages: {top: "//not authorized"}});
			}
			else {
				processes.store("users", {id: {$in: arena.users}}, {$pull: {arenas: arena.id}}, function(user) {
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

/* random(session, post, callback) */
	function random(session, post, callback) {
		//???
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

				if ((typeof arena !== "undefined") && (typeof arena.id !== "undefined") && (arena.id !== null)) {
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

				if ((typeof arena === "undefined") || (typeof arena.id === "undefined") || (arena.id == null)) {
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
						processes.store("users", {id: session.user.id}, {$pull: {arenas: data.arena_id}}, function(user) {
							processes.store("arenas", {id: data.arena_id}, {$pull: {users: session.user.id}}, function(arena) {
								callback({success: true, messages: {top: "//successfully left arena"}, redirect: "../../../../arenas/"});
							});
						});
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

					if (Object.keys(arena.entrants).length !== arena.users.length) {
						callback({success: false, messages: {top: "//some users have not selected robots yet"}});
					}
					else if (Object.keys(arena.entrants).length > arena.rules.players.maximum) {
						callback({success: false, messages: {top: "//robot count exceeds maximum set"}});
					}
					else if (Object.keys(arena.entrants).length < arena.rules.players.minimum) {
						callback({success: false, messages: {top: "//robot count does not meet minimum set"}});
					}
					else {
						arena.state.start = (new Date().getTime()) + (1000 * 5); //start the game (in 5 seconds)!
						var arena = update(arena); //update the arena for the first batch of rounds
						arena.state.locked = false; //unlock it for the future
									
						processes.store("arenas", {id: arena.id}, arena, function(data) { //store it
							callback({success: true, arena: arena, messages: {top: "//this arena is in play"}}); //send back the updated arena
						});
					}
				}
				else {
					callback({success: false, messages: {top: "//unable to retrieve arena"}});
				}
			});
		}
	}

/* adjustRobot(session, post, callback) */
	function adjustRobot(session, post, callback) {
		var data = JSON.parse(post.data);
		
		processes.retrieve("arenas", {id: data.arena_id}, function(arena) {
			if (typeof arena.id === "undefined") { arena = arena[0]; }
			
			if ((typeof arena === "undefined") || (arena === null) || (!(arena.users.indexOf(session.user.id) > -1))) {
				callback({success: false, messages: {top: "//unable to retrieve arena"}});
			}
			else if (!(Object.keys(arena.entrants).indexOf(data.robot_id) > -1)) {
				callback({success: false, messages: {top: "//unable to find robot in arena"}});
			}
			else {
				var robot = arena.entrants[data.robot_id];
				var before = JSON.stringify(robot);

				var fields = Object.keys(data);
				var messages = {top: "//changes submitted"};
				
				for (var i = 0; i < fields.length; i++) {
					switch (fields[i]) {
						case "inputs":
							if (data.inputs === robot.inputs) {
								//no change
							}
							else {
								robot.inputs = String(data.inputs.replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/(&lt;)/g, "<").replace(/(&gt;)/g, ">").replace(/&amp;/g, "&"));
								messages.code = "//code updated";
							}
						break;

						case "code":
							if (data.code === robot.code) {
								//no change
							}
							else {
								robot.code = data.code.replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/(&lt;)/g, "<").replace(/(&gt;)/g, ">").replace(/&amp;/g, "&");
								messages.code = "//code updated";
							}
						break;
					}
				}
				
				if (before !== JSON.stringify(robot)) {
					var update = {};
					update["entrants." + robot_id] = robot;
					
					processes.store("arenas", {id: arena.id}, {$set: set}, function(robot) {
						callback({success: true, messages: messages, arena: arena});
					});
				}
				else {
					callback({success: true, arena: arena, messages: {top: "//no changes"}});
				}
			}
		});
	}

/* read(session, post, callback) */
	function read(session, post, callback) {
		var data = JSON.parse(post.data);
		var arena_id = data.arena_id; //arena we're asking for
		var timeNow = new Date().getTime(); //millisecond we're at
		console.log("timeNow: " + timeNow);

		console.log(1);

		if ((typeof arena_id !== "undefined") && (arena_id !== null)) {
			processes.retrieve("arenas",{id: arena_id}, function(arena) {
				if (typeof arena.id === "undefined") { arena = arena[0]; }

				console.log(2);

				if ((typeof arena !== "undefined") && (typeof arena.id !== "undefined") && (arena.id !== null)) {
					if (arena.state.start === null) { //if the game has not started...
						callback({success: true, arena: arena, messages: {top: "//this arena has not started"}});
					}
					else if ((timeNow >= arena.state.pauseFrom) && (timeNow < arena.state.pauseTo)) { //if the game is paused...
						callback({success: true, arena: arena, messages: {top: "//this arena is paused"}});
					}
					else if (arena.state.end !== null) { //if the game is over...
						callback({success: true, arena: arena, messages: {top: "//this arena has concluded"}});
					}
					else { //if the game is in play...
						console.log(3);
						if (timeNow <= arena.rounds[arena.rounds.length - 1].start) { //asking for a round that * does * exist already
							callback({success: true, arena: arena, messages: {top: "//this arena is in play"}});
						}
						else { //asking for a round that hasn't been evaluated yet
							console.log(4);
							processes.retrieve("arenas",{$and: [{id: arena_id}, {"state.locked":false}]}, function(locked_arena) {
								if (typeof locked_arena.id === "undefined") { locked_arena = locked_arena[0]; }
								
								if ((typeof locked_arena === "undefined") || (locked_arena.id === null)) { //unable to update because somebody beat us to it... gonna have to wait
									console.log(5);
									callback({success: false, arena: arena, messages: {top: "//unable to retrieve or update arena"}});
								}
								else { //evaluate it yourself
									processes.store("arenas", {id: locked_arena.id}, {$set:{"state.locked": true}}, function(data) { //lock it so we can update it without someone else also updating it
										console.log(7);
										var updated_arena = update(locked_arena); //update the arena
										updated_arena.state.locked = false; //unlock it

										processes.retrieve("arenas",{$and: [{id: arena_id}, {"state.locked":true}]}, function(locked_arena) { //it should still be locked in the database
											if (typeof locked_arena.id === "undefined") { locked_arena = locked_arena[0]; }

											if ((typeof locked_arena === "undefined") || (locked_arena.id === null)) { //somebody already evaluated and put it back
												callback({success: false, arena: arena, messages: {top: "//unable to retrieve or update arena"}});
											}
											else {
												processes.store("arenas", {id: arena.id}, updated_arena, function(data) { //store it
													if (updated_arena.state.end === null) { //if the arena has not concluded...
														console.log(8);
														callback({success: true, arena: arena, messages: {top: "//this arena is in play"}}); //send back the updated arena
													}
													else { //if it has concluded...
														console.log(9);
														if (updated_arena.state.victors.length > 0) { //update stats for those robots
															var robot_ids = Object.keys(updated_arena.entrants);
															var robot_victors = updated_arena.state.victors;
															var robot_losers = robot_ids.filter(function(robot_id) { return (!(robot_victors.indexOf(robot_id) > -1))});
															
															var user_victors = [];
															var user_losers = [];
															
															for (var i = 0; i < robot_ids.length; i++) {
																if (robot_victors.indexOf(robot_ids[i]) > -1) {
																	user_victors.push(updated_arena.entrants[robot_ids[i]].user.id);
																}
																else {
																	user_losers.push(updated_arena.entrants[robot_ids[i]].user.id);	
																}
															}

															processes.store("users", {id: {$in: user_victors}}, {$inc: {"statistics.wins": 1}}, function(data) { //users +1 win
																processes.store("users", {id: {$in: user_losers}}, {$inc: {"statistics.losses": 1}}, function(data) { //users +1 loss
																	processes.store("robots", {id: {$in: robot_victors}}, {$inc: {"statistics.wins": 1}}, function(data) { //robots +1 win
																		processes.store("robots", {id: {$in: robot_losers}}, {$inc: {"statistics.losses": 1}}, function(data) { //robots +1 loss
																			callback({success: true, arena: arena, messages: {top: "//this arena has concluded"}});
																		});
																	});
																});
															});
														}
													}
												});
											}
										});
										
									});
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
		if ((arena.state.pauseFrom !== null) || (arena.state.pauseTo !== null)) { //if it's paused
			console.log("it was paused");
			var unpauseStart = arena.state.pauseTo; //get the timestamp for the pause end
			arena.state.pauseFrom = null; //unpause
			arena.state.pauseTo = null;
		}
		else {
			console.log("it wasn't paused");
			var unpauseStart = 0;
		}

		var startLength = arena.rounds.length; //get the round # where we're starting
		console.log("starting at round " + startLength);

		while ((arena.rounds.length < (startLength + 10)) && (arena.state.pauseFrom === null) && (arena.state.pauseTo === null) && (arena.state.end === null) && (arena.state.start !== null)) { //until pause or 10 rounds or victory
			//phase 0: create newRound
				if (arena.rounds.length === 0) { //first round
					console.log("phase 0: first round");
					//create newRound object
						var newRound = {
							start: arena.state.start,
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
					console.log("phase 0");
					var newRound = JSON.parse(JSON.stringify(arena.rounds[arena.rounds.length - 1])); //copy the current round data into a newRound
					console.log("newRound: " + JSON.stringify(newRound));

					if (unpauseStart > 0) { //if it was paused
						newRound.start = unpauseStart; //set the new round to start immediately after the pause
					}
					else {
						newRound.start = newRound.start + (1000 * 10); //otherwise, the round starts 10 seconds after the last one
					}
				}

			//phase 1: running the user scripts
				if (arena.rounds.length > 0) { //don't do this for the first round
					console.log("phase 1");
					var robot_actions = [];

					for (var i = 0; i < newRound.robots.length; i++) {
						//get robot data
							var robot = newRound.robots[i];
								var name = robot.name //this is actually the id - we won't use the robot's string name except for display
								var inputs = arena.entrants[name].inputs.replace(/\s/g,"").split(",") || [];
								var code = String(arena.entrants[name].code) || "";

							console.log("running script for " + name);
						
						//build the sandbox
							var sandbox = {}; //clear existing sandbox
							for (var j = 0; j < inputs.length; j++) { //only add the variables specified by the user's code
								console.log("input: " + inputs[j]);
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

									case "action":
										sandbox.action = arena.rounds[arena.rounds.length - 1].robots.find(function(robot) {return robot.name === name}).action;
									break;

									case "winner":
										sandbox.winner = arena.rounds[arena.rounds.length - 1].winner;
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
								console.log("trying at " + new Date().getTime() + " : sandbox:\n " + JSON.stringify(sandbox));
								vm.runInNewContext(
									"function " + name + "() {" + (code || "") + "}; var " + random + " = " + name + "();",
									sandbox,
									{timeout: 1000}
								); //try to run the code --> function 12345678() { return "something"; } var abcdefgh = 12345678();
								console.log("completed at " + new Date().getTime());
								console.log("action is " + sandbox[random]);
								robot_actions[i] = sandbox[random] || "sleep"; //extract that randomly named variable's contents or default to sleep
							}
							catch (error) {
								console.log("error at " + new Date().getTime() + " : \n" + error);
								robot_actions[i] = "sleep"; //if the code breaks, default to sleep
							}

						//prevent illegal actions
							if (!(arena.rules.robots.actions.indexOf(robot_actions[i]) > -1)) {
								console.log("illegal action");
								robot_actions[i] = "sleep"; //robots who perform actions outside the scope of this arena will instead sleep
							}
					}

					for (var i = 0; i < robot_actions.length; i++) { //then put all those actions in their respective robots for the newRound
						newRound.robots[i].action = robot_actions[i];
						console.log(newRound.robots[i].name + ":" + robot_actions[i]);
					}
				}

			//phase 2: robot actions: shock, power, sap, burn, sleep
				if (arena.rounds.length > 0) { //don't do this for the first round
					console.log("phase 2");
					//shock
						for (var i = 0; i < newRound.robots.length; i++) {
							if (newRound.robots[i].action === "shock") { //for all robots shocking...
								var shocker = newRound.robots[i];
								var cubeCount = (shocker.cubes.red + shocker.cubes.orange + shocker.cubes.yellow + shocker.cubes.green + shocker.cubes.blue + shocker.cubes.purple); //add up the shocker's cubes

								for (var j = 0; j < newRound.robots.length; j++) { //loop through all robots to find potential shockees
									var opponent = newRound.robots[j]; //we can call them "opponents" because we know that the "if" will filter out the shocker anyway
									if ((opponent.action !== "shock") && ((opponent.cubes.red + opponent.cubes.orange + opponent.cubes.yellow + opponent.cubes.green + opponent.cubes.blue + opponent.cubes.purple) > cubeCount)) {
										newRound.robots[j].action = "sleep"; //sleep all robots who aren't themselves shocking and have more cubes than the shocker
									}
								}
							}
						}

					//power
						var powerRate = arena.rules.robots.powerRate; //get the rate of powering
					
						for (var i = 0; i < newRound.robots.length; i++) {
							if (newRound.robots[i].action === "power") { //for all robots powering...
								console.log("powering now: " + newRound.robots[i].name);
								newRound.robots[i].power += powerRate; //... add to their newRound's power

								if (newRound.robots[i].power > arena.rules.robots.maxPower) { //don't let anyone go over the maxPower
									newRound.robots[i].power = arena.rules.robots.maxPower;
								}
							}
						}

					//sap
						var powerRate = arena.rules.robots.powerRate; //get the rate of powering

						for (var i = 0; i < newRound.robots.length; i++) {
							if (newRound.robots[i].action === "sap") { //for all robots sapping...
								var sapper = newRound.robots[i];

								for (var j = 0; j < newRound.robots.length; j++) {
									var opponent = newRound.robots[j]; //we can call them "opponents" because we know that the "if" will filter out the sapper anyway
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

						for (var i = 0; i < newRound.robots.length; i++) {
							if (newRound.robots[i].action === "burn") { //for all robots burning...
								var burner = newRound.robots[i];
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
										newRound.robots[i].action = "sleep";
									}

									if (newRound.robots[i].power > arena.rules.robots.maxPower) { //don't let anyone go over the maxPower
										newRound.robots[i].power = arena.rules.robots.maxPower;
									}
								}
								else {
									newRound.robots[i].action = "sleep"; //if the robot has no cubes to burn, just sleep
								}
							}
						}
				}

			//phase 3: robot actions: take, halftake, swaptake, fliptake
				if (arena.rounds.length > 0) { //don't do this for the first round
					console.log("phase 3");
					var takers = []; //empty array of robots attempting to take

					//get a list of all takers
						for (var i = 0; i < newRound.robots.length; i++) {
							if (["take","halftake","swaptake","fliptake"].indexOf(newRound.robots[i].action) > -1) { //all robots with one of those actions
								console.log("taking now: " + newRound.robots[i].name);
								if (!(newRound.robots[i].power > 0)) { //no power?
									newRound.robots[i].action = "sleep"; //sleep!
								}
								else {
									takers.push(newRound.robots[i]); //focus on that robot's current status
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
											if (takers[i].power === winner.power) { //if anyone ties with the current winner...
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
							console.log("winner: " + winner.name);
							newRound.winner = winner.name; //log the winner's id in the current round

							if (winner.action === "swaptake") { //for swaptakers, build a swapBack pile
								var swapBack = [];
							}		
							
							var cubes = newRound.cubes; //get all the cubes from this round
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

							newRound.robots.find(function(robot) {return robot.name === winner.name}).cubes = winner.cubes; //the winner gets the cubes in the new round
							newRound.cubes = cubes || []; //remaining cubes go to the new round
						}
						
					//remove power from all takers
						for (var i = 0; i < newRound.robots.length; i++) {
							if (newRound.robots[i].action === "take") {
								newRound.robots[i].power = 0; //set the robot's power to 0 for newRound
							}
							else if (newRound.robots[i].action === "fliptake") {
								newRound.robots[i].power = 0; //set the robot's power to 0 for newRound
							}
							else if (newRound.robots[i].action === "halftake") {
								newRound.robots[i].power = Math.floor(newRound.robots[i].power / 2); //set the robot's power to 50%, rounded down
							}
							else if (newRound.robots[i].action === "swaptake") {
								newRound.robots[i].power = Math.floor(newRound.robots[i].power / 2); //set the robot's power to 50%, rounded down
							}
						}
				}

			//phase 4: robot actions: sleep
				if (arena.rounds.length > 0) { //don't do this for the first round
					console.log("phase 4");
					//sleep
						for (var i = 0; i < newRound.robots.length; i++) {
							if (newRound.robots[i].action === "sleep") { //for all robots sleeping...
								//do nothing
								console.log("sleeping now: " + newRound.robots[i].name);
							}
						}
				}

			//phase 5: spawn & dissolve cubes
				//dissolve
					if (arena.rounds.length > 0) { //don't do this for the first round
						console.log("phase 5: dissolving cubes from " + newRound.cubes);
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

							newRound.cubes = newRound.cubes.splice(dissolveIndex,1); //remove one cube from the dissolveIndex position
							i++;
							console.log(" to " + newRound.cubes);
						}
					}

				//spawn
					console.log("phase 5: spawning cubes from " + newRound.cubes);
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
						console.log(" to " + newRound.cubes);
					}

			//phase 6: merge newRound
				console.log("phase 6");
				arena.rounds.push(newRound); //merge the newRound into the existing rounds array

			//phase 7: check for victory
				if (arena.rounds.length > 0) { //don't do this for the first round
					//loop through all conditions
						console.log("phase 7");
						for (var c = 0; c < arena.rules.victory.conditions.length; c++) { //loop through for all conditions
							console.log("checking for victory: " + arena.rules.victory.conditions[c]);
							switch(arena.rules.victory.conditions[c]) {
								case "6of1": //6 cubes of 1 color
									var victors = [];

									for (var i = 0; i < newRound.robots.length; i++) {
										for (j = 0; j < arena.rules.cubes.colors.length; j++) {
											if (newRound.robots[i].cubes[arena.rules.cubes.colors[j]] >= (6 * arena.rules.victory.multiplier)) {
												victors.push(newRound.robots[i].name);
											}
										}
									}

									arena.state.victors = victors;
								break;

								case "2of3": //2 of all primary or all secondary cubes
									var victors = [];

									for (var i = 0; i < newRound.robots.length; i++) {
										if ((newRound.robots[i].red >= (2 * arena.rules.victory.multiplier)) && (newRound.robots[i].yellow >= (2 * arena.rules.victory.multiplier)) && (newRound.robots[i].blue >= (2 * arena.rules.victory.multiplier))) {
											victors.push(newRound.robots[i].name);
										}
										else if ((newRound.robots[i].orange >= (2 * arena.rules.victory.multiplier)) && (newRound.robots[i].green >= (2 * arena.rules.victory.multiplier)) && (newRound.robots[i].purple >= (2 * arena.rules.victory.multiplier))) {
											victors.push(newRound.robots[i].name);
										}
									}

									arena.state.victors = victors;
								break;

								case "1of6": //one of each color
									var victors = [];

									for (var i = 0; i < newRound.robots.length; i++) {
										var victory = true;

										for (j = 0; j < arena.rules.cubes.colors.length; j++) {
											if (newRound.robots[i].cubes[arena.rules.cubes.colors[j]] < (1 * arena.rules.victory.multiplier)) {
												victory = false;
											}
										}

										if (victory) {
											victors.push(newRound.robots[i].name);
										}

									}

									arena.state.victors = victors;
								break;

								case "3of2": //3 of each of 2 complementary colors
									var victors = [];

									for (var i = 0; i < newRound.robots.length; i++) {
										if ((newRound.robots[i].red >= (3 * arena.rules.victory.multiplier)) && (newRound.robots[i].green >= (3 * arena.rules.victory.multiplier))) {
											victors.push(newRound.robots[i].name);
										}
										else if ((newRound.robots[i].orange >= (3 * arena.rules.victory.multiplier)) && (newRound.robots[i].blue >= (3 * arena.rules.victory.multiplier))) {
											victors.push(newRound.robots[i].name);
										}
										else if ((newRound.robots[i].yellow >= (3 * arena.rules.victory.multiplier)) && (newRound.robots[i].purple >= (3 * arena.rules.victory.multiplier))) {
											victors.push(newRound.robots[i].name);
										}
									}

									arena.state.victors = victors;
								break;
							}
						}

					//remove duplicates
						arena.state.victors = arena.state.victors.filter(function (victor, position) {
							return arena.state.victors.indexOf(victor) === position;
						});

					//resolve ties
						if (arena.state.victors.length > 1) {
							console.log("resolving ties: " + arena.rules.victory.tieBreaker);
							switch (arena.rules.victory.tieBreaker) {
								case "tie":
									//do nothing
								break;

								case "random":
									arena.state.victors = [arena.state.victors[Math.floor(Math.random() * arena.state.victors.length)]];
								break;

								case "greedy":
									arena.state.victors.sort(function(a, b) { //order the tied victors based on total cubeCount, ascending
										var robot_a = newRound.robots.find(function(robot) {return robot.name === a});
										var robot_b = newRound.robots.find(function(robot) {return robot.name === b});

										return ((robot_a.cubes.red + robot_a.cubes.orange + robot_a.cubes.yellow + robot_a.cubes.green + robot_a.cubes.blue + robot_a.cubes.purple) > (robot_b.cubes.red + robot_b.cubes.orange + robot_b.cubes.yellow + robot_b.cubes.green + robot_b.cubes.blue + robot_b.cubes.purple));
									});

									arena.state.victors = [arena.state.victors[0]]; //whoever has the *most* cubes is the victor
								break;

								case "efficient":
									arena.state.victors.sort(function(a, b) { //order the tied victors based on total cubeCount, descending
										var robot_a = newRound.robots.find(function(robot) {return robot.name === a});
										var robot_b = newRound.robots.find(function(robot) {return robot.name === b});

										return ((robot_a.cubes.red + robot_a.cubes.orange + robot_a.cubes.yellow + robot_a.cubes.green + robot_a.cubes.blue + robot_a.cubes.purple) < (robot_b.cubes.red + robot_b.cubes.orange + robot_b.cubes.yellow + robot_b.cubes.green + robot_b.cubes.blue + robot_b.cubes.purple));
									});

									arena.state.victors = [arena.state.victors[0]]; //whoever has the *least* cubes is the victor
								break;
							}
						}

					//change state
						if (arena.state.victors.length > 0) {
							console.log("victors: " + arena.state.victors);
							arena.state.end = arena.rounds[arena.rounds.length - 1].start + (1000 * 10); //add end time if victory (10 seconds after the last round starts)
						}
						else {
							console.log("no victors");
						}
				}

			//phase 8: check for pause
				if ((arena.state.end === null) && (arena.rounds.length > 1) && ((arena.rounds.length - 2) % arena.rules.players.pausePeriod === 0)) { //pause if the period is complete (not counting round 0), unless victory
					console.log("phase 8");
					arena.state.pauseFrom = (arena.rounds[arena.rounds.length - 1].start) + (1000 * 10); //set the pause start for 10 seconds after the last newRound
					arena.state.pauseTo = arena.state.pauseFrom + (Number(arena.rules.players.pauseDuration.replace(":00","")) * 60 * 1000); //set pause end for pauseFrom + duration of the pause

					console.log("pausing at " + (new Date().getTime()) + " after round " + (arena.rounds.length - 1) + " from " + arena.state.pauseFrom + " to " + arena.state.pauseTo);
				}
		}
		
		return arena;
	}

/* exports */
	module.exports = {
		create: create,
		join: join,
		random: random,
		selectRobot: selectRobot,
		leave: leave,
		launch: launch,
		adjustRobot: adjustRobot,
		read: read,
		update: update,
		destroy: destroy,
	};
