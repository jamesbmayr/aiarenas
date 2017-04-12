/* my modules */
	const processes = require("../processes");

/* complete(session, post, callback) */
	function complete(session, post, callback) {
		console.log("here");
		var data = JSON.parse(post.data);
		console.log(data.tutorial);

		if ((typeof data.tutorial !== "undefined") && (data.tutorial !== null)) {
			console.log("and here");
			processes.store("humans", {id: session.human.id}, {$push: {tutorials: data.tutorial}}, function(human) {
				if (typeof human.id === "undefined") { human = human[0]; }

				console.log("aaaand here");
				if ((typeof human === "undefined") || (human === null)) {
					callback({success: false, messages: {top: "//not a valid human"}});
				}
				else {
					callback({success: true, messages: {top: "//tutorial completion saved"}});
				}
			});
		}
		else {
			callback({success: false, messages: {top: "//not a valid tutorial"}});
		}
	}

/* exports */
	module.exports = {
		complete: complete
	};
