/* my modules */
	const processes = require("../processes");

/* createUser(name, email, password) */
	function createUser(name, email, password) {
		var salt = processes.random();
		var user = {
			id: processes.random(),
			name: name,
			email: email,
			password: processes.hash(password, salt),
			salt: salt,
			created: new Date().getTime(),
			settings: {},
			notifications: {},
			information: {
				picture: null,
				bio: null,
			},
			statistics: {
				wins: 0,
				losses: 0,
			},
			robots: [],
			arenas: [],
		}

		return user;
	}

/* updateUser (user, data) */
	function updateUser(user, data, action) {
		if ((typeof action === "undefined") || (action === null)) {
			return user;
		}
		else if (action == "create_robot") {
			user.robots.push({id: data.id, name: data.name});
			return user;
		}
		else if (action == "delete_robot") {
			user.robots.splice(users.robots.indexOf({id: data.id, name: data.name}),1);
			return user;
		}
		else if ((action == "create_arena") || (action == "join_arena")) {
			user.arenas.push({id: data.id});
			return user;
		}
		else if ((action == "delete_arena") || (action == "leave_arena")) {
			user.arenas.splice(users.arenas.indexOf({id: data.id}),1);
			return user;
		}
		else {
			switch (action) {
				case "name":
					if (!processes.isReserved(data)) {
						user.name = name;
					}
				break;

				case "email":
					if (processes.isEmail(data)) {
						user.email = data;
					}
				break;

				case "bio":
					user.information.bio = data;
				break;
			}

			return user;
		}
	}

/* deleteUser (user, actor) */
	function deleteUser(user, actor) {

		return false;
		return true;
	}

/* exports */
	module.exports = {
		create: createUser,
		update: updateUser,
		delete: deleteUser
	};
