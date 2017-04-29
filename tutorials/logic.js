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

/* exports */
	module.exports = {
		complete: complete
	};
