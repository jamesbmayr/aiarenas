/* my modules */
	const processes = require("../processes");

/* create(session, post, callback) */
	function create(session, post, callback) {
		var id = processes.random();

		var robot = {
			id: id,
			name: id.substring(0,4) + "_bot",
			human: {
				id: null,
				name: null,
			},
			created: new Date().getTime(),
			information: {
				bio: "...",
			},
			avatar: {
				color: "var(--white)",
				antennae: " _I_ ",
				eyes: "|o o|",
				mouth: "| = |",
				left_arm: "--",
				right_arm: "--",
				left_wrist: " II ",
				right_wrist: " II ",
				left_hand: "{••}",
				right_hand: "{••}",
				torso_1: "[[-]]",
				torso_2: "[[-]]",
				torso_3: "[[-]]",
				left_leg: ".Y.",
				right_leg: ".Y.",
				left_foot: "{_}",
				right_foot: "{_}"
			},
			statistics: {
				wins: 0,
				losses: 0,
			},
			inputs: "",
			code: "action = \"sleep\"\nreturn action"
		}

		if ((session.human !== null) && (session.human.robots.length >= 16)) {
			callback({success: false, messages: {top: "//robot count exceeds limit of 16 per human"}});
		}
		else if (session.human !== null) {
			robot.human.id = session.human.id;
			robot.human.name = session.human.name;

			processes.store("robots", null, robot, {}, function (results) {
				processes.store("humans", {id: session.human.id}, {$push: {robots: {id: robot.id, name: robot.name}}}, {}, function (human) {
					callback({success: true, redirect: "../../../../robots/" + robot.id, messages: {top: "//robot created"}, data: robot});
				});
			});
		}
		else {
			callback({success: true, messages: {top: "//robot created"}, data: robot});
		}
	}

/* update(session, post, callback) */
	function update(session, post, callback) {
		var data = JSON.parse(post.data);
		
		processes.retrieve("robots", {$and: [{id: data.id || null}, {"human.id": session.human.id}]}, {}, function (robot) {		
			if (!robot) {
				callback({success: false, messages: {top: "//robot not found"}});
			}
			else if (robot.human.id !== session.human.id) {
				callback({success: false, messages: {top: "//not authorized"}});
			}
			else {
				var before = JSON.stringify(robot);
				var fields = Object.keys(data);
				var messages = {top: "//changes submitted"};
				
				for (var i = 0; i < fields.length; i++) {
					switch (fields[i]) {
						case "name":
							if (data.name === robot.name) {
								//no change
							}
							else if (processes.isReserved(data.name)) {
								data.name = robot.name;
								messages.name = "//name unavailable";
							}
							else if ((data.name.length < 8) || (data.name.length > 32) || (!processes.isNumLet(data.name))) {
								data.name = robot.name;
								messages.name = "//enter robot name of 8 to 32 numbers and letters";
							}
							else {								
								robot.name = data.name;
								messages.name = "//name updated";
							}
						break;

						case "bio":
							if (data.bio === robot.information.bio) {
								//no change
							}
							else if (data.bio.replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").length > 1000) {
								messages.bio = "//bio cannot exceed 1000 characters";
							}
							else {
								robot.information.bio = data.bio.replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"");
								messages.bio = "//bio updated";
							}
						break;

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
								robot.code = data.code.replace(/<\\? ?br ?\\?>/g,"\n").replace(/(&lt;)/g, "<").replace(/(&gt;)/g, ">").replace(/&amp;/g, "&");
								messages.code = "//code updated";
							}
						break;

						case "avatar":
							var avatar_keys = Object.keys(data.avatar) || [];
							var avatar = {};

							for (var j = 0; j < avatar_keys.length; j++) {
								if (data.avatar[avatar_keys[j]] === robot.avatar[avatar_keys[j]]) {
									//no change
								}
								else if (!(processes.ascii_robot(avatar_keys[j]).indexOf(data.avatar[avatar_keys[j]]) > -1)) {
									//no change
								}
								else {
									robot.avatar[avatar_keys[j]] = data.avatar[avatar_keys[j]].replace(/(&lt;)/g, "<").replace(/(&gt;)/g, ">").replace(/&amp;/g, "&");
									messages.avatar = "//avatar updated";
								}
							}
						break;
					}
				}
				
				if (before === JSON.stringify(robot)) {
					callback({success: false, data: data, messages: {top: "//no changes"}});
				}
				else {
					processes.store("robots", {id: robot.id}, robot, {}, function (robot) {
						if (JSON.parse(before).name !== robot.name) {
							processes.store("humans", {id: session.human.id}, {$pull: {robots: {id: robot.id}}}, {}, function (human) {
								processes.store("humans", {id: session.human.id}, {$push: {robots: {id: robot.id, name: robot.name}}}, {}, function (human) {
									callback({success: true, messages: messages, data: data, robot: robot});
								});
							});
						}
						else {
							callback({success: true, messages: messages, data: data, robot: robot});
						}
					});
				}
			}
		});
	}

/* destroy(session, post, callback) */
	function destroy(session, post, callback) {
		var data = JSON.parse(post.data);
		processes.retrieve("robots", {$and: [{id: data.id || null}, {"human.id": session.human.id}]}, {}, function (robot) {		
			if (!robot) {
				callback({success: false, messages: {top: "//robot not found"}});
			}
			else if (robot.human.id !== session.human.id) {
				callback({success: false, messages: {top: "//not authorized"}});
			}
			else {
				processes.store("humans", {id: robot.human.id}, {$pull: {robots: {id: robot.id}}}, {}, function (human) {
					processes.store("robots", {id: robot.id}, null, {}, function (results) {
						callback({success: true, redirect: "../../../../robots", messages: {top: "//robot deleted"}});
					});
				});
			}
		});
	}

/* load(session, post, callback) */
	function load(session, post, callback) {
		var data = JSON.parse(post.data);
		processes.retrieve("robots", {id: data.robot_id}, {}, function (robot) {
			if (!robot) {
				callback({success: false, messages: {top: "//robot not found"}});
			}
			else if (robot.human.id !== session.human.id) {
				callback({success: false, messages: {top: "//not authorized"}});
			}
			else {
				callback({success: true, messages: {top: "//robot retrieved successfully"}, data: robot});
			}
		})
	}

/* upload(session, post, callback) */
	function upload(session, post, callback) {
		var robot = JSON.parse(post.data);
			robot.id = processes.random();
			robot.statistics.wins = 0;
			robot.statistics.losses = 0;
		
		for (component in robot.avatar) {
			var list = processes.ascii_robot(component);
			if (list.indexOf(robot.avatar[component]) == -1) {
				robot.avatar[component] = list[0];
			}
		}

		if (processes.isReserved(robot.name)) {
			robot.name = robot.id.substring(0,4) + "_bot";
		}
		else if ((robot.name.length < 8) || (!processes.isNumLet(robot.name))) {
			robot.name = robot.id.substring(0,4) + "_bot";
		}

		if ((session.human !== null) && (session.human.robots.length >= 16)) {
			callback({success: false, messages: {top: "//robot count exceeds limit of 16 per human"}});
		}
		else if (session.human !== null) {
			robot.human.id = session.human.id;
			robot.human.name = session.human.name;

			processes.store("robots", null, robot, {}, function (results) {
				processes.store("humans", {id: session.human.id}, {$push: {robots: {id: robot.id, name: robot.name}}}, {}, function (human) {
					callback({success: true, redirect: "../../../../robots/" + robot.id, messages: {top: "//robot created from upload"}, data: robot});
				});
			});
		}
		else {
			robot.human.id = null;
			robot.human.name = null;
			callback({success: true, messages: {top: "//robot created from upload"}, data: robot});
		}
	}

/* exports */
	module.exports = {
		create: create,
		update: update,
		destroy: destroy,
		load: load,
		upload: upload
	}
