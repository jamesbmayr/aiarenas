/* my modules */
	const processes = require("../processes");

/* createUser (username, email, password) */
	function createUser(username, email, password) {
		var salt = processes.random();
		var user = {
			id: processes.random(),
			username: username,
			email: email,
			password: processes.hash(password, salt),
			salt: salt,
			start: new Date().getTime(),
			preferences: {},
			statistics: {},
			notifications: {},
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
	