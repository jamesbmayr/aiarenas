/* my modules */
	const processes = require("../processes");

/* create(name, email, password) */
	function create(name, email, password) {
		var salt = processes.random();
		var user = {
			id: processes.random(),
			name: name,
			email: null,
			new_email: email,
			verified: false,
			verification: null,
			password: processes.hash(password, salt),
			salt: salt,
			created: new Date().getTime(),
			settings: {
				color_scheme: "default",
				show_email: true,
				email_notifications: true,
			},
			notifications: {},
			information: {
				bio: "...",
			},
			avatar: {
				color: "var(--white)",
				ascii: processes.ascii_character(name[0])
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

/* update(session, post, callback) */
	function update(session, post, callback) {
		var data = JSON.parse(post.data);
		var before = JSON.stringify(session.user)

		var fields = Object.keys(data);
		var messages = {top: "//changes submitted"};
		
		for (var i = 0; i < fields.length; i++) {
			switch (fields[i]) {
				case "bio":
					if (data.bio === session.user.information.bio) {
						//no change
					}
					else {
						session.user.information.bio = data.bio;
						messages.bio = "//bio updated";
					}
				break;

				case "avatar":
					if (data.avatar.color === session.user.avatar.color) {
						//no change
					}
					else if (!(processes.ascii_robot("color").indexOf(data.avatar.color) > -1)) {
						//no change
					}
					else {
						session.user.avatar.color = data.avatar.color;
						messages.avatar = "//color updated";
					}
				break;
			}
		}

		if (before !== JSON.stringify(session.user)) {
			processes.store("users", {id: session.user.id}, session.user, function(user) {
				if (typeof user.id === "undefined") { user = user[0]; }
				callback({success: true, messages: messages, data: data, user: user});
			});
		}
		else {
			callback({success: true, messages: {top: "//no changes"}});
		}
	}

/* destroy(session, post, callback) */
	function destroy(session, post, callback) {
		var data = JSON.parse(post.data);

		if ((session.user !== null) && (typeof data.id !== null) && (data.id === session.user.id)) {
			processes.retrieve("users", {id: session.user.id}, function(user) {
				if (typeof user.id === "undefined") { user = user[0]; }
				
				if ((typeof user === "undefined") || (typeof user.id === "undefined") || (user.id !== session.user.id)) {
					callback({success: false, messages: {top: "//unable to delete user"}});
				}
				else {
					var robots = [];
					for (var i = 0; i < user.robots.length; i++) {
						robots.push(user.robots[i].id);
					}

					processes.store("robots", {id: {$in: robots}}, null, function(robot) {
						processes.store("users", {id: session.user.id}, null, function(user) {
							processes.store("sessions", {user: session.user.id}, {$set: {user: null}}, function(session) {
								callback({success: true, redirect: "../../../../"});
							});
						});
					});
				}
			});
		}
		else {
			callback({success: false, messages: {top: "//unable to delete user"}});
		}
	}

/* exports */
	module.exports = {
		create: create,
		update: update,
		destroy: destroy,
	};
