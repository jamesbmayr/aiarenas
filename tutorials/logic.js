/* my modules */
	const processes = require("../assets/logic");

/* complete(session, post, callback) */
	function complete(session, post, callback) {
		var data = JSON.parse(post.data);

		if (!data.tutorial) {
			callback({success: false, messages: {top: "//invalid tutorial"}});
		}
		else if ((session.human !== null) && (session.human.tutorials.indexOf(data.tutorial) > -1)) {
			callback({success: false, messages: {top: "//tutorial already completed"}});
		}
		else if (session.tutorials.indexOf(data.tutorial) > -1) {
			callback({success: false, messages: {top: "//tutorial already completed"}});
		}
		else if (session.human !== null) {
			processes.store("humans", {id: session.human.id}, {$push: {tutorials: data.tutorial}}, {}, function (human) {
				if (!human) {
					callback({success: false, messages: {top: "//invalid human"}});
				}
				else {
					callback({success: true, messages: {top: "//tutorial completion saved"}});
				}
			});
		}
		else {
			processes.store("sessions", {id: session.id}, {$push: {tutorials: data.tutorial}}, {}, function (session) {
				callback({success: true, messages: {top: "//tutorial completion saved"}});
			});
		}
	}

/* tour(session, post, callback) */
	function tour(session, post, callback) {
		var data = JSON.parse(post.data);

		if (data.stop) {
			if (session.human !== null) {
				processes.store("humans", {id: session.human.id}, {$set: {"settings.show_help": "false"}}, {}, function (human) {
					callback({success: true, messages: {top: "//help deactivated"}});
				});
			}
			else {
				processes.store("sessions", {id: session.id}, {$set: {"show_help":"false"}}, {}, function (session) {
					callback({success: true, messages: {top: "//help deactivated"}});
				});
			}
		}
		else {
			var tour = processes.tour(post.url || "") || [];

			if (session.human !== null) {
				if ((data.selector !== null) && (data.selector.length > 0)) {
					processes.store("humans", {id: session.human.id}, {$push: {tour: data.selector}, $set: {"settings.show_help": "true"}}, {}, function (human) {
						tour = tour.filter(function(x) {
							return ((human.tour.indexOf(x.selector) === -1) && (x.selector !== data.selector));
						});

						callback({success: true, tour: tour});
					});
				}
				else {
					processes.store("humans", {id: session.human.id}, {$set: {"settings.show_help": "true"}}, {}, function (human) {
						tour = tour.filter(function(x) {
							return ((human.tour.indexOf(x.selector) === -1) && (x.selector !== data.selector));
						});

						callback({success: true, tour: tour});
					});
				}
			}
			else {
				if ((data.selector !== null) && (data.selector.length > 0)) {
					processes.store("sessions", {id: session.id}, {$push: {tour: data.selector}, $set: {"show_help": "true"}}, {}, function (session) {
						tour = tour.filter(function(x) {
							return ((session.tour.indexOf(x.selector) === -1) && (x.selector !== data.selector));
						});

						callback({success: true, tour: tour});
					});
				}
				else {
					processes.store("sessions", {id: session.id}, {$set: {"show_help": "true"}}, {}, function (session) {
						tour = tour.filter(function(x) {
							return ((session.tour.indexOf(x.selector) === -1) && (x.selector !== data.selector));
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
