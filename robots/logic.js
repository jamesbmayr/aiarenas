/* my modules */
	const processes = require("../processes");

/* create(session, callback) */
	function create(session, callback) {
		var id = processes.random();

		var robot = {
			id: id,
			name: id.substring(0,4) + "_bot",
			user: {
				id: session.user.id,
				name: session.user.name
			},
			created: new Date().getTime(),
			information: {
				bio: null,
				animation: {},
				sounds: {
					cube: null,
					charge: null,
					take: null,
					victory: null,
					defeat: null
				},
				music: {},
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
			code: "action = \"charge\";\nreturn action;"
		}

		processes.store("robots", null, robot, function(robot) {
			processes.store("users", {id: session.user.id}, {$push: {robots: {id: robot.id, name: robot.name}}}, function(user) {
				callback({success: true, redirect: "../../../../robots/" + robot.id, messages: {top: "//robot created"}});
			});
		});
	}

/* update(session, post, callback) */
	function update(session, post, callback) {
		var data = JSON.parse(post.data);
		
		processes.retrieve("robots", {$and: [{id: data.id || null}, {"user.id": session.user.id}]}, function(robot) {
			if (typeof robot.id === "undefined") { robot = robot[0]; }
			
			if ((typeof robot === "undefined") || (typeof robot.user === "undefined") || (robot.user.id !== session.user.id)) {
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

						case "bio":
							if (data.bio === robot.information.bio) {
								//no change
							}
							else {
								robot.information.bio = data.bio;
								messages.bio = "//bio updated";
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
									robot.avatar[avatar_keys[i]] = data.avatar[avatar_keys[i]].replace(/(<([^>]+)>)/ig,"").replace(/(&lt;)/g, "<").replace(/(&gt;)/g, ">").replace(/&amp;/g, "&");
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
							processes.store("users", {id: session.user.id}, {$pull: {robots: {id: robot.id}}}, function(user) {
								processes.store("users", {id: session.user.id}, {$push: {robots: {id: robot.id, name: robot.name}}}, function(user) {
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
					callback({success: true, messages: {top: "//no changes"}});
				}
			}
		});
	}

/* destroy(session, post, callback) */
	function destroy(session, post, callback) {
		var data = JSON.parse(post.data);
		processes.retrieve("robots", {$and: [{id: data.id || null}, {"user.id": session.user.id}]}, function(robot) {
			if (typeof robot.id === "undefined") { robot = robot[0]; }
			
			if ((typeof robot === "undefined") || (typeof robot.user === "undefined") || (robot.user.id !== session.user.id)) {
				callback({success: false, messages: {top: "//not authorized"}});
			}
			else {
				processes.store("users", {id: robot.user.id || null}, {$pull: {robots: {id: robot.id}}}, function(user) {
					processes.store("robots", {id: robot.id}, null, function(results) {
						callback({success: true, redirect: "../../../../users/" + session.user.name, messages: {top: "//robot deleted"}});
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
