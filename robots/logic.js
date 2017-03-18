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
				head: {
					shape: "clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
					color: "#333333",
					eyes: "#ffffff"
				},
				body: {
					shape: "clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
					color: "#666666"
				},
				background: {
					color: "#112233"
				}
			},
			statistics: {
				wins: 0,
				losses: 0,
			},
			code: "action = \"charge\";"
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
						messages.name = " //that name is taken";
					}
					else if ((data.name.length < 8) || (!processes.isNumLet(data.name))) {
						data.name = robot.name;
						messages.name = " //name must be 8 or more numbers and letters";
					}
					else {
						// var code = robot[robot.name];
						// delete robot[robot.name];
						// robot[data.name] = code;
						
						robot.name = data.name;
						messages.name = " //name updated";
					}
				break;

				case "bio":
					if (data.bio === robot.information.bio) {
						//no change
					}
					else {
						robot.information.bio = data.bio;
						messages.bio = " //bio updated";
					}
				break;

				case "code":
					if (data.code === robot.code) {
						//no change
					}
					else {
						robot.code = data.code;
						messages.code = " //code updated";
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
