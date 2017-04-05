/* my modules */
	const processes = require("../processes");

/* create(session, callback) */
	function create(session, callback) {
		var id = processes.random();

		var robot = {
			id: id,
			name: id.substring(0,4) + "_bot",
			human: {
				id: session.human.id,
				name: session.human.name
			},
			created: new Date().getTime(),
			information: {
				show_code: true,
				bio: null,
				music: {}
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
				torso_1: "/HHH\\",
				torso_2: "IHHHI",
				torso_3: "IHHHI",
				legs: ".Y. .Y.",
				left_foot: "{_}",
				right_foot: "{_}"
			},
			statistics: {
				wins: 0,
				losses: 0,
			},
			inputs: "",
			code: "action = \"sleep\";\nreturn action;"
		}

		processes.store("robots", null, robot, function(robot) {
			processes.store("humans", {id: session.human.id}, {$push: {robots: {id: robot.id, name: robot.name}}}, function(human) {
				callback({success: true, redirect: "../../../../robots/" + robot.id, messages: {top: "//robot created"}});
			});
		});
	}

/* update(session, post, callback) */
	function update(session, post, callback) {
		var data = JSON.parse(post.data);
		
		processes.retrieve("robots", {$and: [{id: data.id || null}, {"human.id": session.human.id}]}, function(robot) {
			if (typeof robot.id === "undefined") { robot = robot[0]; }
			
			if ((typeof robot === "undefined") || (typeof robot.human === "undefined") || (robot.human.id !== session.human.id)) {
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
								messages.name = "//that name is taken";
							}
							else if ((data.name.length < 8) || (!processes.isNumLet(data.name))) {
								data.name = robot.name;
								messages.name = "//name must be 8 or more numbers and letters";
							}
							else {
								// var code = robot[robot.name];
								// delete robot[robot.name];
								// robot[data.name] = code;
								
								robot.name = data.name;
								messages.name = "//name updated";
							}
						break;

						case "show_code":
							if (data.show_code === robot.show_code) {
								//no change
							}
							else if ((data.show_code !== "true") && (data.show_code !== "false")) {
								data.show_code = robot.show_code
								messages.show_code = "//not a valid option";
							}
							else {
								robot.show_code = data.show_code;
								messages.show_code = "//code visibility updated";
							}
						break;

						case "bio":
							if (data.bio === robot.information.bio) {
								//no change
							}
							else {
								robot.information.bio = data.bio;
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
								robot.code = data.code.replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/(&lt;)/g, "<").replace(/(&gt;)/g, ">").replace(/&amp;/g, "&");
								messages.code = "//code updated";
							}
						break;

						case "avatar":
							var avatar_keys = Object.keys(data.avatar);
							var avatar = {};

							for (var i = 0; i < avatar_keys.length; i++) {
								if (data.avatar[avatar_keys[i]] === robot.avatar[avatar_keys[i]]) {
									//no change
								}
								else if (!(processes.ascii_robot(avatar_keys[i]).indexOf(data.avatar[avatar_keys[i]]) > -1)) {
									//no change
								}
								else {
									robot.avatar[avatar_keys[i]] = data.avatar[avatar_keys[i]].replace(/(&lt;)/g, "<").replace(/(&gt;)/g, ">").replace(/&amp;/g, "&");
									messages.avatar = "//avatar updated";
								}
							}
						break;
					}
				}
				
				if (before !== JSON.stringify(robot)) {
					processes.store("robots", {id: robot.id}, robot, function(robot) {
						if (typeof robot.id === "undefined") { robot = robot[0]; }

						if (before.name !== robot.name) {
							processes.store("humans", {id: session.human.id}, {$pull: {robots: {id: robot.id}}}, function(human) {
								processes.store("humans", {id: session.human.id}, {$push: {robots: {id: robot.id, name: robot.name}}}, function(human) {
									callback({success: true, messages: messages, data: data, robot: robot});
								});
							});
						}
						else {
							callback({success: true, messages: messages, data: data, robot: robot});
						}
					});
				}
				else {
					callback({success: true, data: data, messages: {top: "//no changes"}});
				}
			}
		});
	}

/* destroy(session, post, callback) */
	function destroy(session, post, callback) {
		var data = JSON.parse(post.data);
		processes.retrieve("robots", {$and: [{id: data.id || null}, {"human.id": session.human.id}]}, function(robot) {
			if (typeof robot.id === "undefined") { robot = robot[0]; }
			
			if ((typeof robot === "undefined") || (typeof robot.human === "undefined") || (robot.human.id !== session.human.id)) {
				callback({success: false, messages: {top: "//not authorized"}});
			}
			else {
				processes.store("humans", {id: robot.human.id || null}, {$pull: {robots: {id: robot.id}}}, function(human) {
					processes.store("robots", {id: robot.id}, null, function(results) {
						callback({success: true, redirect: "../../../../humans/" + session.human.name, messages: {top: "//robot deleted"}});
					});
				});
			}
		});
	}

/* exports */
	module.exports = {
		create: create,
		update: update,
		destroy: destroy,
	};
