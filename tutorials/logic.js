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
			switch (true) {
				case (/^\/$/).test(post.url): //home main
					var tour = [
						{
							action: "$('#navbar_close').hide(); $('#navbar_open').show().css('left','0px'); $('#navbar').css('left','-256px');",
							selector: "#navbar_open",
							message: "<br>Explore the website using the navigation panel."
						},
						{
					
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','256px'); $('#navbar').css('left','0px');",
							selector: "a[href='../../../../']",
							message: "Return to this home page at any time."
						},
						{
					
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','256px'); $('#navbar').css('left','0px');",
							selector: "a[href='../../../../about']",
							message: "Learn more about ai_arenas: gameplay, development, and how it works."
						},
						{
					
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','256px'); $('#navbar').css('left','0px');",
							selector: "a[href='../../../../tutorials']",
							message: "Learn how to code Javascript robots in tutorials."
						},
						{
					
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','256px'); $('#navbar').css('left','0px');",
							selector: "a[href='../../../../robots']",
							message: "Create and test your own robots in the coding workshop."
						},
						{
					
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','256px'); $('#navbar').css('left','0px');",
							selector: "#navbar_join_arena",
							message: "Enter an arena id to join one created by another human."
						},
						{
					
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','256px'); $('#navbar').css('left','0px');",
							selector: "#navbar_random_arena",
							message: "Join an arena against random opponent robots."
						},
						{
					
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','256px'); $('#navbar').css('left','0px');",
							selector: "#navbar_random_arena",
							message: "Join an arena against random opponent robots."
						}
					];
				break;

				case (/^\/humans\/[0-9a-zA-Z]*\/?$/).test(post.url): //humans individual
					var tour = [
						{
							action: "",
							selector: "#human_edit",
							message: "Edit your human profile."
						},
						{
							action: "",
							selector: "#settings",
							message: "Adjust aesthetic and security settings."
						},
						{
							action: "",
							selector: "#sites",
							message: "Add personal websites or link to social media profiles."
						},
						{
							action: "",
							selector: "#bio",
							message: "Add a short description for other humans."
						},
						{
							action: "",
							selector: "#human_create_robot",
							message: "Edit and create robots to compete in arenas."
						}
					];
				break;

				case (/^\/robots\/?$/).test(post.url): //robots main
					var tour = [
						{
							action: "",
							selector: "#load_robot",
							message: "Load (or upload) an existing robot or create a new one."
						},
						{
							action: "$('#load_robot').click();",
							selector: "button#load_robot",
							message: "Load a different robot at any time."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); }",
							selector: "#workshop_download",
							message: "Download this robot as a JSON file. When signed in, you can save robots online."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); }",
							selector: "#inputs",
							message: "Add inputs to give the robot data. Learn about inputs using the details dropdown."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); }",
							selector: "#code",
							message: "Code a Javascript function that outputs an action, like \"power\" or \"take\"."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); }",
							selector: "#eval_code",
							message: "Evaluate the robot code to watch the logic unfold and see the outcome."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#console').closest('details').attr('open','true');",
							selector: "#console",
							message: "Use console.log() in the code to log console messages when testing."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#robots').parent().show(); $('#robots').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: ".self",
							message: "Change the robot state - power, cubes, etc. - to see how it would act."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#robots').parent().show(); $('#robots').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#add_opponent",
							message: "Add opponent robots with adjustable states to see how your robot would act."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#cubes').parent().show(); $('#cubes').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#add_cube",
							message: "Add cubes to the arena to see what action your robot would take."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#rules').parent().show(); $('#rules').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#players_maximum",
							message: "Adjust the rules to see how the robot would perform in different arenas."
						}
					];
				break;

				case (/^\/robots\/[0-9a-zA-Z]*\/?$/).test(post.url): //robots individual
					var tour = [
						{
							action: "",
							selector: "#robot_edit",
							message: "Edit the information and code for your robots."
						},
						{
							action: "",
							selector: "span#bio",
							message: "Add a short description for yours robot."
						},
						{
							action: "",
							selector: "#avatar_mouth",
							message: "Customize the appearance of your robots by selecting its components and color."
						},
						{
							action: "",
							selector: "span#inputs",
							message: "Add inputs to give the robot data. Learn about inputs using the details dropdown."
						},
						{
							action: "",
							selector: "span#code",
							message: "Code a Javascript function that outputs an action, like \"power\" or \"take\"."
						}
					];
				break;

				case (/^\/arenas\/?$/).test(post.url): //arenas main
					var tour = [
						{
							action: "",
							selector: "#join_arena",
							message: "Enter an arena id to join a specific arena (created by another human)."
						},
						{
							action: "",
							selector: "#random_arena",
							message: "Join an arena against random opponent robots."
						},
						{
							action: "",
							selector: "#create_arena",
							message: "Create an arena for fellow humans using an arena preset."
						},
						{
							action: "$('#cubes').hide(); $('#robots').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#players').show(); $('#players').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#players_minimum",
							message: "Customize a new arena by changing the rules."
						},
						{
							action: "$('#cubes').hide(); $('#robots').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#players').show(); $('#players').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#players_pauseDuration",
							message: "Set how long the coding workshop lasts and how frequently it happens."
						},
						{
							action: "$('#players').hide(); $('#robots').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#cubes').show(); $('#cubes').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#cubes_colors",
							message: "Set which cube colors will appear in this arena."
						},
						{
							action: "$('#players').hide(); $('#robots').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#cubes').show(); $('#cubes').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#cubes_spawnMemory",
							message: "Adjust how often a color will appear; set the number of rounds to remember."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#robots').show(); $('#robots').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#robots_powerRate",
							message: "Set how much power a robot will get when powering."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#robots').show(); $('#robots').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#robots_actions",
							message: "Set which actions are legal outputs; all others will become \"sleep\"."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#robots').show(); $('#robots').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#robots_tieBreaker",
							message: "Set what happens to the cubes when 2 robots \"take\" with the same power."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#robots').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#victory').show(); $('#victory').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#victory_conditions",
							message: "Set how robots can win by adjusting the victory conditions."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#robots').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#victory').show(); $('#victory').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#victory_multiplier",
							message: "Set a multiplier to make a longer arena. Ex: With \"2\", \"6of1\" becomes \"12of1\"."
						}
					];
				break;

				case (/^\/arenas\/[0-9a-zA-Z]*\/?$/).test(post.url): //arenas individual
					if (data.state === "unstarted") {
						var tour = [
							{
								action: "",
								selector: "button#join_arena",
								message: "Join the arena to participate."
							},
							{
								action: "",
								selector: "button#select_robot",
								message: "Select or upload a robot to compete in this arena."
							},
							{
								action: "",
								selector: "div#players",
								message: "Other humans with robots in this arena will appear here."
							},
							{
								action: "$('#rules').show(); $('#rules').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
								selector: "div#rules",
								message: "See the rules set for this arena."
							}
						];
					}
					else if (data.state === "active") {
						var tour = [
							{
								action: "",
								selector: "#round",
								message: "See which round is displayed (and if the arena is currently paused)."
							},
							{
								action: "",
								selector: "div#robots",
								message: "All robots - power, cubes, etc. - can be seen here."
							},
							{
								action: "",
								selector: "div#cubes",
								message: "All cubes currently available in this arena are displayed here."
							},
							{
								action: "",
								selector: "div#workshop",
								message: "Edit your robot when the arena pauses; changes are saved only within the arena."
							}
						];
					}
					else if (data.state === "concluded") {
						var tour = [
							{
								action: "",
								selector: "#victors",
								message: "See which human(s) and robot(s) were victorious in this arena."
							},
							{
								action: "",
								selector: "#robots.megasection",
								message: "See the final state of each competing robot."
							}
						];
					}
				break;

				case (/^\/settings\/?$/).test(post.url): //settings main
					var tour = [
						{
							action: "",
							selector: "#font_scheme",
							message: "Select a monospace font for all text on ai_arenas."
						},
						{
							action: "",
							selector: "#color_scheme",
							message: "Select a color palette; note that some do not have all 10 distinct colors."
						},
						{
							action: "",
							selector: "#show_email",
							message: "Set whether your email address is shown or hidden on your human profile."
						},
						{
							action: "",
							selector: "#change_name",
							message: "Change your human name at any time."
						},
						{
							action: "",
							selector: "#send_verification",
							message: "Change your email address; you will receive a verification message."
						},
						{
							action: "",
							selector: "#change_password",
							message: "Change your password."
						},
						{
							action: "",
							selector: "#sessions",
							message: "See all devices where you are signed in (and sign out of anything suspicious)."
						}
					];
				break;

				case (/^\/tutorials\/?$/).test(post.url): //tutorials main
					var tour = [
						{
							action: "",
							selector: "a[href='../../../../tutorials/takeBot']",
							message: "Launch a tutorial to learn how to code Javascript robots."
						},
						{
							action: "",
							selector: "#exit",
							message: "Return to the home screen at any time."
						}
					];
				break;

				default:
					var tour = [];
			}

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
