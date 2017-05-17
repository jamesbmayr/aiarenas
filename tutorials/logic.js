/* my modules */
	const processes = require("../processes");

/* complete(session, post, callback) */
	function complete(session, post, callback) {
		var data = JSON.parse(post.data);

		if ((typeof data.tutorial !== "undefined") && (data.tutorial !== null)) {
			if (session.human.tutorials.indexOf(data.tutorial) > -1) {
				callback({success: true, messages: {top: "//tutorial already completed"}});
			}
			else {
				processes.store("humans", {id: session.human.id}, {$push: {tutorials: data.tutorial}}, function(human) {
					if (typeof human.id === "undefined") { human = human[0]; }

					if ((typeof human === "undefined") || (human === null)) {
						callback({success: false, messages: {top: "//invalid human"}});
					}
					else {
						callback({success: true, messages: {top: "//tutorial completion saved"}});
					}
				});
			}
		}
		else {
			callback({success: false, messages: {top: "//invalid tutorial"}});
		}
	}

/* tour(session, post, callback) */
	function tour(session, post, callback) {
		var data = JSON.parse(post.data);

		if (data.stop) {
			if (session.human !== null) {
				processes.store("humans", {id: session.human.id}, {$set: {"settings.show_help": "false"}}, function(human) {
					callback({success: true, messages: {top: "//help deactivated"}});
				});
			}
			else {
				processes.store("sessions", {id: session.id}, {$set: {"show_help":"false"}}, function(session) {
					callback({success: true, messages: {top: "//help deactivated"}});
				});
			}
		}
		else {
			var tour = processes.tour(post.url || "") || [];

			if (session.human !== null) {
				if ((data.selector !== null) && (data.selector.length > 0)) {
					processes.store("humans", {id: session.human.id}, {$push: {tour: data.selector}, $set: {"settings.show_help": "true"}}, function(human) {
						if (typeof human.id === "undefined") { human = human[0]; }

						tour = tour.filter(function(x) {
							return human.tour.indexOf(x.selector) === -1;
						});

						callback({success: true, tour: tour});
					});
				}
				else {
					processes.store("humans", {id: session.human.id}, {$set: {"settings.show_help": "true"}}, function(human) {
						if (typeof human.id === "undefined") { human = human[0]; }

						tour = tour.filter(function(x) {
							return human.tour.indexOf(x.selector) === -1;
						});

						callback({success: true, tour: tour});
					});
				}
			}
			else {
				if ((data.selector !== null) && (data.selector.length > 0)) {
					processes.store("sessions", {id: session.id}, {$push: {tour: data.selector}, $set: {"show_help": "true"}}, function(session) {
						if (typeof session.id === "undefined") { session = session[0]; }

						tour = tour.filter(function(x) {
							return session.tour.indexOf(x.selector) === -1;
						});

						callback({success: true, tour: tour});
					});
				}
				else {
					processes.store("sessions", {id: session.id}, {$set: {"show_help": "true"}}, function(session) {
						if (typeof session.id === "undefined") { session = session[0]; }

						tour = tour.filter(function(x) {
							return session.tour.indexOf(x.selector) === -1;
						});

						callback({success: true, tour: tour});
					});
				}
			}
		}
	}

/* exports */
	module.exports = {
		complete: complete,
		tour: tour
	}
