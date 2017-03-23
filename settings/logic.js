/* my modules */
	const processes = require("../processes");

/* update(user, settings) */
	function update(user, settings) {
		var fields = Object.keys(settings);
		var messages = {top: " //changes submitted"};
		
		for (var i = 0; i < fields.length; i++) {
			switch (fields[i]) {
				case "color_scheme":
					if (user.settings.color_scheme === settings.color_scheme) {
						//no change
					}
					else if (!(processes.color_schemes.indexOf(settings.color_scheme) > -1)) {
						//not a valid color scheme
						messages.color_scheme = " //not a valid color scheme";
					}
					else {
						user.settings.color_scheme = settings.color_scheme;
						messages.color_scheme = " //color scheme updated";
					}
				break;

				case "show_email":
					if (user.settings.show_email === settings.show_email) {
						//no change
					}
					else if ((settings.show_email !== true) && (settings.show_email !== false)) {
						messages.show_email = " //not a valid setting";
					}
					else {
						user.settings.show_email = settings.show_email;
						messages.show_email = " //email visibility preferences";
					}
				break;

				case "email_notifications":
					if (user.settings.email_notifications === settings.email_notifications) {
						//no change
					}
					else if ((settings.email_notifications !== true) && (settings.email_notifications !== false)) {
						messages.email_notifications = " //not a valid setting";
					}
					else {
						user.settings.email_notifications = settings.email_notifications.;
					}
				break;

			}
		}

		return {
			user: user,
			success: true,
			data: settings,
			messages: messages
		};
	}

/* exports */
	module.exports = {
		update: update,
	};
