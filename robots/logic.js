/* my modules */
	const processes = require("../processes");

/* createRobot (user) */
	function createRobot(user, name) {
		var id = processes.random();

		var robot = {
			id: id,
			name: (name || (id + "Bot")),
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
			statistics: {},
			code: function(arena) {
				//
			}
		}

		return robot;
	}

/* readRobot (robot) */
	function readRobot(robot) {

	}

/* updateRobot (user, data) */
	function updateRobot(robot, data) {

		return robot;
	}

/* deleteRobot (robot, actor) */
	function deleteRobot(robot, actor) {

		return false;
		return true;
	}

/* exports */
	module.exports = {
		create: createRobot,
		read: readRobot,
		update: updateRobot,
		delete: deleteRobot
	};
