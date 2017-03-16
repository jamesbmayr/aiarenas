/* my modules */
	const processes = require("../processes");

/* create(name, email, password) */
	function create(name, email, password) {
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

/* update(user, data) */
	function update(user, data) {
		var fields = Object.keys(data);
		var messages = {top: "changes submitted"};
		
		for (var i = 0; i < fields.length; i++) {
			switch (fields[i]) {
				case "name":
					if (data.name === user.name) {
						//no change
					}
					else if (processes.isReserved(data.name)) {
						data.name = user.name;
						messages.name = " //that name is taken";
					}
					else if ((data.name.length < 8) || (!processes.isNumLet(data.name))) {
						data.name = user.name;
						messages.name = " //name must be 8 or more numbers and letters";
					}
					else {
						user.name = data.name;
						messages.name = " //name updated";
					}
				break;

				case "email":
					if (data.email === user.email) {
						//no change
					}
					else if (!processes.isEmail(data.email)) {
						data.email = user.email;
						messages.email = " //not a valid email address";
					}
					else {
						user.email = data.email;
						messages.email = " //email updated";
					}
				break;

				case "bio":
					if (data.bio === user.information.bio) {
						//no change
					}
					else {
						user.information.bio = data.bio;
						messages.bio = " //bio updated";
					}
				break;
			}
		}

		return {
			user: user,
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
