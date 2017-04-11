/* my modules */
	const processes = require("../processes");
	const humans = require("../humans/logic");

/* signin(session, post, callback) */
	function signin(session, post, callback) {
		if ((typeof post.signin_name == "undefined") || (post.signin_name.length < 8) || (!processes.isNumLet(post.signin_name))) {
			callback({success: false, messages: {top: "//enter your name of 8 or more letters and numbers"}});
		}
		else if ((typeof post.signin_password == "undefined") || (post.signin_password.length < 8)) {
			callback({success: false, messages: {top: "//enter your password of 8 or more characters"}});
		}
		else {
			processes.retrieve("humans", {name: post.signin_name}, function(data) {
				if ((data) && (typeof data[0] !== "undefined") && (typeof data[0].id !== "undefined")) {
					processes.retrieve("humans", {name: post.signin_name, password: processes.hash(post.signin_password, data[0].salt)}, function(data) {
						if ((data) && (typeof data[0] !== "undefined") && (typeof data[0].id !== "undefined")) {
							var redirect = "../../../../humans/" + data[0].name;
							session.human = data[0].id;
							processes.store("sessions", {id: session.id}, session, function(data) {
								callback({success: true, redirect: redirect, messages: {top: "//signed in"}});
							});
						}
						else {
							callback({success: false, messages: {top: "//name and password do not match"}});
						}
					});
				}
				else {
					callback({success: false, messages: {top: "//name and password do not match"}});
				}
			});
		}
	}

/* signout(session) */
	function signout(session, callback) {
		session.human = null;
		processes.store("sessions", {id: session.id}, session, function(data) {
			callback({success: true, redirect: "../../../../", messages: {top: "//signed out"}});
		});
	}

/* signup(session, post, callback) */
	function signup(session, post, callback) {
		if ((typeof post.signup_name == "undefined") || (post.signup_name.length < 8) || (!processes.isNumLet(post.signup_name))) {
			callback({success: false, messages: {top: "//enter a name of 8 or more letters and numbers"}});
		}
		else if ((typeof post.signup_email == "undefined") || (post.signup_email.length == 0) || (!processes.isEmail(post.signup_email))) {
			callback({success: false, messages: {top: "//enter a valid email address"}});
		}
		else if ((typeof post.signup_password == "undefined") || (post.signup_password.length < 8)) {
			callback({success: false, messages: {top: "//enter a password of 8 or more characters"}});
		}
		else if ((typeof post.signup_confirm == "undefined") || (post.signup_confirm.length < 8) || (post.signup_confirm !== post.signup_password)) {
			callback({success: false, messages: {top: "//passwords do not match"}});
		}
		else if (processes.isReserved(post.signup_name)) {
			callback({success: false, messages: {top: "//name is not available"}});
		}
		else {
			processes.retrieve("humans", {name: post.signup_name}, function(data) {
				if ((data) && (typeof data[0] !== "undefined") && (typeof data[0].id !== "undefined")) {
					callback({success: false, messages: {top: "//name is not available"}});
				}
				else {
					processes.retrieve("humans", {email: post.signup_email}, function(data) {
						if ((data) && (typeof data[0] !== "undefined") && (typeof data[0].id !== "undefined")) {
							callback({success: false, messages: {top: "//email is not available"}});
						}
						else {
							var random = processes.random();
							processes.sendEmail(null, post.signup_email, "ai_arenas human verification", "<div>commence human verification process for <span class='bluetext'>" + post.signup_name + "</span>: <a class='greentext' href='http://aiarenas.com/verify?email=" + post.signup_email + "&verification=" + random + " '>verify</a>();</div>", function(data) {
								var human = humans.create(post.signup_name, post.signup_email, post.signup_password);
								human.verification = random;

								processes.store("humans", null, human, function(data) {
									var redirect = "../../../../humans/" + data.name;
									
									session.human = data.id;
									processes.store("sessions", {id: session.id}, session, function(data) {
										callback({success: true, redirect: redirect, messages: {top: "//signed up"}});
									});
								});
							});
						}
					});
				}
			});
		}
	}

/* verify(session, post, callback) */
	function verify(session, post, callback) {
		if ((typeof post.verification === "undefined") || (post.verification.length !== 32)) {
			callback({success: false, messages: {top: "//enter a 32-character verification key"}});
		}
		else if ((typeof post.email === "undefined") || (!isEmail(post.email))) {
			callback({success: false, messages: {top: "//enter a valid email address"}});
		}
		else {
			processes.retrieve("humans", {email: post.email}, function(human) {
				if (typeof human.id === "undefined") {human = human[0];}

				if ((typeof human !== "undefined") && (human.id !== null)) {
					callback({success: false, messages: {top: "//email is not available"}});
				}
				else {
					processes.retrieve("humans", {$and: [{verification: post.verification}, {new_email: post.email}]}, function(human) {
						if (typeof human.id === "undefined") {human = human[0];}

						if ((typeof human !== "undefined") && (human.id !== null)) {
							processes.store("humans", {id: human.id}, {$set: {verified: true, verification: null, email: post.email, new_email: null}}, function(human) {
								callback({success: true, messages: {top: "//email verified"}});
							});
						}
						else {
							callback({success: false, messages: {top: "//unable to verify email"}});
						}
					});
				}
			});
		}
	}

/* sendReset(session, post, callback) */
	function sendReset(session, post, callback) {
		if ((typeof post.reset_email === "undefined") || (!(post.reset_email.length > 0)) || (!processes.isEmail(post.reset_email))) {
			callback({success: false, messages: {top: "//enter a valid email address"}});
		}
		else {
			processes.retrieve("humans", {$or: [{email: post.reset_email}, {new_email: post.reset_email}]}, function(human) {
				if (typeof human.id === "undefined") { human = human[0]; }

				if (typeof human === "undefined") {
					callback({success: false, messages: {top: "//email not in database"}});
				}
				else {
					var random = processes.random();

					processes.store("humans", {id: human.id}, {$set: {verification: random}}, function (results) {
						processes.sendEmail(null, (post.reset_email || null), "ai_arenas human re-verification", "<div>commence human re-verification process for <span class='bluetext'>" + human.name + "</span>: <a class='greentext' href='http://aiarenas.com/reset?email=" + post.reset_email + "&verification=" + random + " '>reset_password</a>();</div>", function(data) {
							callback({success: true, messages: {top: "//reset email has been sent"}});
						});
					});
				}
			});
		}
	}

/* verifyReset(session, post, callback) */
	function verifyReset(session, post, callback) {
		if ((typeof post.reset_verification === "undefined") || (post.reset_verification.length !== 32)) {
			callback({success: false, messages: {top: "//enter a 32-character verification key"}});
		}
		else if ((typeof post.reset_email === "undefined") || (!processes.isEmail(post.reset_email))) {
			callback({success: false, messages: {top: "//enter a valid email address"}});
		}
		else if ((typeof post.reset_password == "undefined") || (post.reset_password.length < 8)) {
			callback({success: false, messages: {top: "//enter a password of 8 or more characters"}});
		}
		else if ((typeof post.reset_confirm == "undefined") || (post.reset_confirm.length < 8) || (post.reset_confirm !== post.reset_password)) {
			callback({success: false, messages: {top: "//passwords do not match"}});
		}
		else {
			processes.retrieve("humans", {$and: [{$or:[{email: post.reset_email}, {new_email: post.reset_email}]}, {verification: post.reset_verification}]}, function(human) {
				if (typeof human.id === "undefined") { human = human[0]; }

				if (typeof human === "undefined") {
					callback({success: false, messages: {top: "//unable to verify email"}});
				}
				else {
					var salt = processes.random();
					var password = processes.hash(post.reset_password, salt);
					processes.store("humans", {id: human.id}, {$set: {password: password, salt: salt, verified: true, verification: null, email: post.reset_email, new_email: null}}, function(data) {
						callback({success: true, messages: {top: "//email verified; password reset"}, redirect: "../../../../signin"});
					});
				}
			});
		}
	}

/* exports */
	module.exports = {
		signin: signin,
		signout: signout,
		signup: signup,
		verify: verify,
		sendReset: sendReset,
		verifyReset: verifyReset
	};