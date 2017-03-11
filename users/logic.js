/* my modules */
	const processes = require("../processes");

/* createUser (name, email, password) */
	function createUser(name, email, password) {
		var salt = processes.random();
		var user = {
			id: processes.random(),
			name: name,
			email: email,
			password: processes.hash(password, salt),
			salt: salt,
			created: new Date().getTime(),
			preferences: {},
			notifications: {},
			information: {
				picture: null,
				bio: null,
			},
			statistics: {},
		}

		return user;
	}

/* readUser (user) */
	function readUser(user) {

	}

/* updateUser (user, data) */
	function updateUser(user, data) {

		return user;
	}

/* deleteUser (user, actor) */
	function deleteUser(user, actor) {

		return false;
		return true;
	}

/* exports */
	module.exports = {
		create: createUser,
		read: readUser,
		update: updateUser,
		delete: deleteUser
	};
