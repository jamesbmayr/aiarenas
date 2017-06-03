/* my modules */
	const processes = require("../assets/logic");

/* update(session, post, callback) */
	function update(session, post, callback) {
		var data = JSON.parse(post.data) || {};
		var before = JSON.stringify(session.human);

		var fields = Object.keys(data);
		var messages = {top: "//changes submitted"};
		
		for (var i = 0; i < fields.length; i++) {
			switch (fields[i]) {
				case "font_scheme":
					if (session.human.settings.font_scheme === data.font_scheme) {
						//no change
					}
					else if (!(processes.assets("fonts").indexOf(data.font_scheme) > -1)) {
						//not a valid color scheme
						messages.font_scheme = "//invalid font";
					}
					else {
						session.human.settings.font_scheme = data.font_scheme;
						messages.font_scheme = "//font updated";
					}
				break;

				case "color_scheme":
					if (session.human.settings.color_scheme === data.color_scheme) {
						//no change
					}
					else if (!(processes.assets("color_schemes").indexOf(data.color_scheme) > -1)) {
						//not a valid color scheme
						messages.color_scheme = "//invalid color scheme";
					}
					else {
						session.human.settings.color_scheme = data.color_scheme;
						messages.color_scheme = "//color scheme updated";
					}
				break;

				case "show_email":
					if (session.human.settings.show_email === data.show_email) {
						//no change
					}
					else if ((data.show_email !== "true") && (data.show_email !== "false")) {
						messages.show_email = "//invalid option";
					}
					else {
						session.human.settings.show_email = data.show_email;
						messages.show_email = "//email visibility updated";
					}
				break;

				case "show_help":
					if (session.human.settings.show_help === data.show_help) {
						//no change
					}
					else if ((data.show_help !== "true") && (data.show_help !== "false")) {
						messages.show_help = "//invalid option";
					}
					else {
						session.human.settings.show_help = data.show_help;
						messages.show_help = "//help activation updated";
					}
				break;
			}
		}

		if (before !== JSON.stringify(session.human)) {
			processes.store("humans", {id: session.human.id}, {$set: {settings: session.human.settings}}, {}, function (human) {
				callback({success: true, messages: messages, data: data, human: human});
			});
		}
		else {
			callback({success: true, data: data, messages: {top: "//no changes"}});
		}
	}

/* updateName(session, post, callback) */
	function updateName(session, post, callback) {
		if ((typeof post.name === "undefined") || (post.name.length < 8) || (post.name.length > 32) || (!processes.isNumLet(post.name))) {
			callback({success: false, messages: {name: "//enter human name of 8 to 32 letters and numbers"}});
		}
		else if (processes.isReserved(post.name)) {
			callback({success: false, messages: {name: "//name unavailable"}});
		}
		else {
			processes.retrieve("humans", {name: post.name}, {}, function (human) {
				if (human) {
					callback({success: false, messages: {name: "//name unavailable"}});
				}
				else if ((typeof post.current_password === "undefined") || (post.current_password.length < 8)) {
					callback({success: false, messages: {name: "//enter your current password"}});
				}
				else {
					processes.retrieve("humans",{id: session.human.id, password: processes.hash(post.current_password, session.human.salt)}, {}, function (human) {
						if (!human) {
							callback({success: false, messages: {name: "//invalid password"}});
						}
						else {
							var robots = [];
							for (var i = 0; i < session.human.robots.length; i++) {
								robots.push(session.human.robots[i].id);
							}

							processes.store("robots", {id: {$in: robots}}, {$set: {"human.name": post.name}}, {$multi: true}, function (robots) {
								processes.store("humans", {id: session.human.id}, {$set: {name: post.name}}, {}, function (human) {
									callback({success: true, messages: {name: "//name updated"}});
								});
							});
						}
					});
				}
			});
		}
	}

/* updatePassword(session, post, callback) */
	function updatePassword(session, post, callback) {
		if ((typeof post.password === "undefined") || (post.password.length < 8)) {
			callback({success: false, messages: {password: "//enter password of 8 or more characters"}});
		}
		else if ((typeof post.confirm == "undefined") || (post.confirm.length < 8) || (post.confirm !== post.password)) {
			callback({success: false, messages: {password: "//passwords do not match"}});
		}
		else if ((typeof post.current_password === "undefined") || (post.current_password.length < 8)) {
			callback({success: false, messages: {password: "//enter your current password"}});
		}
		else {
			processes.retrieve("humans",{id: session.human.id, password: processes.hash(post.current_password, session.human.salt)}, {}, function (human) {
				if (!human) {
					callback({success: false, messages: {password: "//invalid password"}});
				}
				else {
					var salt = processes.random();
					var password = processes.hash(post.password, salt);
					processes.store("humans", {id: session.human.id}, {$set: {password: password, salt: salt}}, {}, function (human) {
						callback({success: true, messages: {password: "//password updated"}});
					});
				}
			});
		}
	}

/* sendVerification(session, post, callback) */
	function sendVerification(session, post, callback) {
		if ((typeof post.email === "undefined") || (!processes.isEmail(post.email))) {
			callback({success: false, messages: {email: "//enter valid email address"}});
		}
		else {
			processes.retrieve("humans", {email: post.email}, {}, function (human) {
				if (human) {
					callback({success: false, messages: {email: "//email unavailable"}});
				}
				else if ((typeof post.current_password === "undefined") || (post.current_password.length < 8)) {
					callback({success: false, messages: {email: "//enter your current password"}});
				}
				else {
					console.log(0);
					processes.retrieve("humans",{id: session.human.id, password: processes.hash(post.current_password, session.human.salt)}, {}, function (human) {
						console.log(1);
						if (!human) {
							callback({success: false, messages: {email: "//invalid password"}});
						}
						else {
							console.log(2);
							var random = processes.random();

							processes.store("humans", {id: session.human.id}, {$set: {"status.verification": random, "status.new_email": post.email}}, {}, function (human) {
								processes.sendEmail(null, (post.email || null), "ai_arenas human verification", "<div class='whitetext'>commence human verification process for <span class='bluetext'>" + session.human.name + "</span>: <a class='greentext' href='https://www.aiarenas.com/verify?email=" + post.email + "&verification=" + random + " '>verify</a>()</div>", function(data) {
									callback(data);
								});
							});
						}
					});
				}
			});
		}
	}

/* destroy(session, post, callback) */
	function destroy(session, post, callback) {
		if ((!post.session) || (post.session.length !== 32)) {
			callback({success: false, messages: {sessions: "//invalid post"}});
		}
		else {
			processes.retrieve("sessions", {$and: [{id: post.session}, {human: session.human.id}]}, {}, function (data) {
				if (data.human !== session.human.id) {
					callback({success: false, messages: {sessions: "//unable to delete session"}});
				}
				else if (data.id !== session.id) {
					processes.store("sessions", {id: data.id}, {$set: {human: null}}, {}, function (result) {
						callback({success: true, messages: {sessions: "//session deleted"}});
					});
				}
				else if (data.id === session.id) {
					processes.store("sessions", {id: data.id}, {$set: {human: null}}, {}, function (result) {
						callback({success: true, messages: {sessions: "//session deleted; human signed out"}, redirect: "../../../../signin"});
					});
				}
			});
		}
	}

/* exports */
	module.exports = {
		update: update,
		updateName: updateName,
		updatePassword: updatePassword,
		sendVerification: sendVerification,
		destroy: destroy
	}
