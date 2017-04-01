/* my modules */
	const processes = require("../processes");

/* update(session, post, callback) */
	function update(session, post, callback) {
		var data = JSON.parse(post.data) || {};
		var before = JSON.stringify(session.user);

		var fields = Object.keys(data);
		var messages = {top: "//changes submitted"};
		
		for (var i = 0; i < fields.length; i++) {
			switch (fields[i]) {
				case "color_scheme":
					if (session.user.settings.color_scheme === data.color_scheme) {
						//no change
					}
					else if (!(processes.assets("color_schemes").indexOf(data.color_scheme) > -1)) {
						//not a valid color scheme
						messages.color_scheme = "//not a valid color scheme";
					}
					else {
						session.user.settings.color_scheme = data.color_scheme;
						messages.color_scheme = "//color scheme updated";
					}
				break;

				case "show_email":
					if (session.user.settings.show_email === data.show_email) {
						//no change
					}
					else if ((data.show_email !== "true") && (data.show_email !== "false")) {
						messages.show_email = "//not a valid setting";
					}
					else {
						session.user.settings.show_email = data.show_email;
						messages.show_email = "//email visibility setting updated";
					}
				break;

				case "email_notifications":
					if (session.user.settings.email_notifications === data.email_notifications) {
						//no change
					}
					else if ((data.email_notifications !== "true") && (data.email_notifications !== "false")) {
						messages.email_notifications = "//not a valid setting";
					}
					else {
						session.user.settings.email_notifications = data.email_notifications;
						messages.email_notifications = "//email notifications setting updated";
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
			callback({success: true, data: data, messages: {top: "//no changes"}});
		}
	}

/* updateName(session, post, callback) */
	function updateName(session, post, callback) {
		if ((typeof post.name === "undefined") || (post.name.length < 8) || (!processes.isNumLet(post.name))) {
			callback({success: false, messages: {name: "//enter a username of 8 or more letters and numbers"}});
		}
		else if (processes.isReserved(post.name)) {
			callback({success: false, messages: {name: "//name is not available"}});
		}
		else {
			processes.retrieve("users", {name: post.name}, function(user) {
				if (typeof user.id === "undefined") { user = user[0]; }

				if ((typeof user !== "undefined") && (user.id !== null)) {
					callback({success: false, messages: {name: "//name is taken"}});
				}
				else {
					var robots = [];
					for (var i = 0; i < session.user.robots.length; i++) {
						robots.push(session.user.robots[i].id);
					}

					processes.store("robots", {id: {$in: robots}}, {$set: {"user.name": post.name}}, function(robot) {
						if (typeof robot.id === "undefined") { robot = robot[0]; }
						processes.store("users", {id: session.user.id}, {$set: {name: post.name, "avatar.ascii": (processes.ascii_character(post.name[0]) || "")}}, function(user) {
							callback({success: true, messages: {name: "//name changed"}});
						});
					});
				}
			});
		}
	}

/* updatePassword(session, post, callback) */
	function updatePassword(session, post, callback) {
		if ((typeof post.password === "undefined") || (post.password.length < 8)) {
			callback({success: false, messages: {password: "//enter a password of 8 or more characters"}});
		}
		else if ((typeof post.confirm == "undefined") || (post.confirm.length < 8) || (post.confirm !== post.password)) {
			callback({success: false, messages: {password: "//passwords do not match"}});
		}
		else {
			var salt = processes.random();
			var password = processes.hash(post.password, salt);
			processes.store("users", {id: session.user.id}, {$set: {password: password, salt: salt}}, function(user) {
				callback({success: true, messages: {password: "//password changed"}});
			});
		}
	}

/* sendVerification(session, post, callback) */
	function sendVerification(session, post, callback) {
		if ((typeof post.email === "undefined") || (!processes.isEmail(post.email))) {
			callback({success: false, messages: {top: "//please enter a valid email"}});
		}
		else {
			processes.retrieve("users", {email: post.email}, function(user) {
				if (typeof user.id === "undefined") {user = user[0];}

				if ((typeof user !== "undefined") && (user.id !== null)) {
					callback({success: false, messages: {top: "//email is taken"}});
				}
				else {
					var random = processes.random();

					processes.store("users", {id: session.user.id}, {$set: {verification: random, new_email: post.email}}, function(user) {
						if (typeof user.id === "undefined") {user = user[0];}

						if (user.id !== null) {
							processes.sendEmail(null, (post.email || null), "ai_arenas human verification", "<div>commence human verification process for <span class='bluetext'>" + user.name + "</span>: <a class='greentext' href='http://aiarenas.com/verify?email=" + post.email + "&verification=" + random + " '>verify</a>();</div>", function(data) {
								callback(data);
							});
						}
						else {
							callback({success: false, messages: {top: "//unable to send email"}});;
						}
					});
				}
			});
		}
	}

/* destroy(session, post, callback) */
	function destroy(session, post, callback) {
		if ((typeof post.session !== "undefined") && (post.session.length === 32)) {
			processes.retrieve("sessions", {$and: [{id: post.session}, {user: session.user.id}]}, function(data) {
				if (typeof data.id === "undefined") {data = data[0];}

				if ((data.user === session.user.id) && (data.id !== session.id)) {
					processes.store("sessions", {id: data.id}, null, function(result) {
						callback({success: true, messages: {sessions: "//session deleted"}});
					});
				}
				else if ((data.user === session.user.id) && (data.id === session.id)) {
					processes.store("sessions", {id: data.id}, null, function(result) {
						callback({success: true, messages: {sessions: "//session deleted; user signed out"}, redirect: "../../../../signin"});
					});
				}
				else {
					callback({success: false, messages: {sessions: "//unable to delete session"}});
				}
			});
		}
		else {
			callback({success: false, messages: {sessions: "//unable to delete session"}});
		}
	}

/* exports */
	module.exports = {
		update: update,
		updateName: updateName,
		updatePassword: updatePassword,
		sendVerification: sendVerification,
		destroy: destroy,
	};
