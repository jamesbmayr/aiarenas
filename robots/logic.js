/* my modules */
	const processes = require("../processes");

/* create(user) */
	function create(user) {
		var id = processes.random();

		var robot = {
			id: id,
			name: id.substring(0,4) + "_bot",
			user: {
				id: user.id,
				name: user.name
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

		return robot;
	}

/* update(robot, data) */
	function update(robot, data) {
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

		return {
			robot: robot,
			success: true,
			data: data,
			messages: messages
		};
	}

/* exports */
	module.exports = {
		create: create,
		update: update,
	};
