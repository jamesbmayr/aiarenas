/* my modules */
	const processes = require("../processes");
	const users = require("../users/logic");

/* signin(session, post, callback) */
	function signin(session, post, callback) {
		if ((typeof post.signin_username == "undefined") || (post.signin_username.length < 8) || (!processes.isNumLet(post.signin_username))) {
			callback({action: "signin", message: "enter your username of 8 or more letters and numbers"});
		}
		else if ((typeof post.signin_password == "undefined") || (post.signin_password.length < 8)) {
			callback({action: "signin", message: "enter your password of 8 or more characters"});
		}
		else {
			processes.retrieve("users", {name: post.signin_username}, function(data) {
				if ((data) && (typeof data[0] !== "undefined") && (typeof data[0].id !== "undefined")) {
					processes.retrieve("users", {name: post.signin_username, password: processes.hash(post.signin_password, data[0].salt)}, function(data) {
						if ((data) && (typeof data[0] !== "undefined") && (typeof data[0].id !== "undefined")) {
							var redirect = "/users/" + data[0].name;
							session.user = data[0].id;
							processes.store("sessions", {id: session.id}, session, function(data) {
								callback({redirect: redirect});
							});
						}
						else {
							callback({action: "signin", message: "username and password do not match"});
						}
					});
				}
				else {
					callback({action: "signin", message: "username and password do not match"});
				}
			});
		}
	}

/* signout(session) */
	function signout(session, callback) {
		session.user = null;
		processes.store("sessions", {id: session.id}, session, function(data) {
			callback({message: "signed out"});
		});
	}

/* signup(session, post, callback) */
	function signup(session, post, callback) {
		if ((typeof post.signup_username == "undefined") || (post.signup_username.length < 8) || (!processes.isNumLet(post.signup_username))) {
			callback({action: "signup", message: "enter a username of 8 or more letters and numbers"});
		}
		else if ((typeof post.signup_email == "undefined") || (post.signup_email.length == 0) || (!processes.isEmail(post.signup_email))) {
			callback({action: "signup", message: "enter a valid email address"});
		}
		else if ((typeof post.signup_password == "undefined") || (post.signup_password.length < 8)) {
			callback({action: "signup", message: "enter a password of 8 or more characters"});
		}
		else if ((typeof post.signup_confirm == "undefined") || (post.signup_confirm.length < 8) || (post.signup_confirm !== post.signup_password)) {
			callback({action: "signup", message: "passwords do not match"});
		}
		else if (processes.isReserved(post.signup_username)) {
			callback({action: "signup", message: "username is not available"});
		}
		else {
			processes.retrieve("users", {name: post.signup_username}, function(data) {
				if ((data) && (typeof data[0] !== "undefined") && (typeof data[0].id !== "undefined")) {
					callback({action: "signup", message: "username is not available"});
				}
				else {
					processes.retrieve("users", {email: post.signup_email}, function(data) {
						if ((data) && (typeof data[0] !== "undefined") && (typeof data[0].id !== "undefined")) {
							callback({action: "signup", message: "email is not available"});
						}
						else {
							var user = users.create(post.signup_username, post.signup_email, post.signup_password);
							processes.store("users", null, user, function(data) {
								var redirect = "/users/" + data.name;
								
								session.user = data.id;
								processes.store("sessions", {id: session.id}, session, function(data) {
									callback({redirect: redirect});
								});
							});
						}
					});
				}
			});
		}
	}

/* exports */
	module.exports = {
		signin: signin,
		signout: signout,
		signup: signup
	};