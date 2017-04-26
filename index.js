/* node modules */
	const http = require("http");
	const fs = require("fs");
	const qs = require("querystring");

/* my modules */
	const processes = require("./processes");
	const home = require("./home/logic");
	const humans = require("./humans/logic");
	const robots = require("./robots/logic");
	const arenas = require("./arenas/logic");
	const settings = require("./settings/logic");
	const tutorials = require("./tutorials/logic");

/* server */
	const port = 3000;
	const server = http.createServer(requestHandler);

	server.listen(process.env.PORT || 3000, function (error) {
		if (error) {
			console.log("error on the server: " + error);
		}
		else {
			console.log("listening on port: " + port);
		}
	});

/* requestHandler */
	function requestHandler(request, response) {
		/* build post body */
			var routes, get, cookie, post = "";
			request.on("data", function (data) {
				post += data;
			});

		/* get routes, post, get, cookies --> session --> routing */
			request.on("end", function() {
				post = qs.parse(post) || {};
				get = qs.parse(request.url.split("?")[1]) || {};
					request.url = request.url.split("?")[0];
					routes = String(request.url).split("/");
				try {cookie = qs.parse(request.headers.cookie.replace(/; /g, "&")) || null;} catch(error) {cookie = {};}
				console.log("\n" + new Date().getTime() + ": [" + request.method + "] to " + request.url + "\n  GET: " + JSON.stringify(get) + "\n  POST: " + JSON.stringify(post) + "\n  COOKIE: " + JSON.stringify(cookie));

				if ((/[.](ico|png|jpg|jpeg|css|js)$/).test(request.url)) {
					routing(null);
				}
				else {
					processes.session(request, response, cookie.session || null, function(session) {
						if (typeof session.id === "undefined") { session = session[0]; }
						if (typeof session.human === "undefined") { session.human = null; }

						if (session.human !== null) {
							processes.retrieve("humans", {id: session.human}, function(human) {
								if (typeof human.id === "undefined") { human = human[0]; }

								if (human) {
									session.human = human;
									routing(session);
								}
								else {
									routing(session);
								}
							});
						}
						else {
							routing(session);
						}
					});
				}
			});

		/* routing */
			function routing(session) {
				if ((request.method === "GET") && (session === null)) { //assets
					switch (true) {
						/* logo */
							case (/\/favicon[.]ico$/).test(request.url):
							case (/\/icon[.]png$/).test(request.url):
							case (/\/logo[.]png$/).test(request.url):
							case (/\/ascii_logo[.]png$/).test(request.url):
								try {
									response.writeHead(200, {"Content-Type": "image/png"});
									response.end(fs.readFileSync("./assets/images/logo.png"), "binary");
								}
								catch (error) {console.log(error); _404();}
							break;

						/* stylesheets */
							case (/\/stylesheet[.]css$/).test(request.url):
								try {
									response.writeHead(200, {"Content-Type": "text/css"});
									response.end(fs.readFileSync("./assets/stylesheet.css") + (fs.readFileSync("./" + routes[1] + "/stylesheet.css") || ""));
								}
								catch (error) {_404();}
							break;

						/* scripts */
							case (/\/script[.]js$/).test(request.url):
								try {
									response.writeHead(200, {"Content-Type": "text/javascript"});
									response.end(fs.readFileSync("./assets/script.js") + (fs.readFileSync("./" + routes[1] + "/script.js") || ""));
								}
								catch (error) {_404();}
							break;

						/* all others */
							default:
								_404();
							break;
					}
				}
				else if (request.method === "GET") { //views
					response.writeHead(200, {
						"Set-Cookie": String("session=" + session.id + "; expires=" + (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)).toUTCString()) + "; path=/; domain=localhost"),
						"Content-Type": "text/html; charset=utf-8"
					});

					switch (true) {
						/* redirects */
							case (/^\/logout\/?$/).test(request.url):
								try {
									_302("../../../../signout");
								}
								catch (error) {_404();}
							break;

							case (/^\/login\/?$/).test(request.url):
								try {
									_302("../../../../signout");
								}
								catch (error) {_404();}
							break;

							case (/^\/create\/?$/).test(request.url):
							case (/^\/join\/?$/).test(request.url):
							case (/\/newhuman\/?$/).test(request.url):
							case (/\/buildhuman\/?$/).test(request.url):
							case (/\/createhuman\/?$/).test(request.url):
								try {
									_302("../../../../signout");
								}
								catch (error) {_404();}
							break;

							case (/\/newrobot\/?$/).test(request.url):
							case (/\/buildrobot\/?$/).test(request.url):
							case (/\/createrobot\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										_302("../../../../humans");
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/\/newarena\/?$/).test(request.url):
							case (/\/buildarena\/?$/).test(request.url):
							case (/\/createarena\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										_302("../../../../arenas");
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/\/preferences\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										_302("../../../../settings");
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

						/* home */
							case (/^\/$/).test(request.url):
								try {
									if (session.human !== null) {
										data = {messages: {top: "//human identified as " + session.human.name}};
									}
									else {
										data = {};
									}

									response.end(processes.render("./home/main.html", session, data));
								}
								catch (error) {_404();}
							break;

							case (/^\/signin\/?$/).test(request.url):
								try {
									if (session.human === null) {
										response.end(processes.render("./home/main.html", session, {action: "signin", messages: {top: "//authenticate human"}}));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/signout\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										response.end(processes.render("./home/main.html", session, {action: "signout", messages: {top: "//leave ai_arenas?"}}));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/signup\/?$/).test(request.url):
								try {
									if (session.human === null) {
										response.end(processes.render("./home/main.html", session, {action: "signup", messages: {top: "//join ai_arenas"}}));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/verify/).test(request.url):
								try {
									response.end(processes.render("./home/main.html", session, {action: "verify", messages: {top: "//verify email"}, email: (get.email || null), verification: (get.verification || null) }));
								}
								catch (error) {_404();}
							break;

							case (/^\/reset/).test(request.url):
								try {
									response.end(processes.render("./home/main.html", session, {action: "reset", messages: {top: "//reset password"}, email: (get.email || null), verification: (get.verification || null) }));
								}
								catch (error) {_404();}
							break;

							case (/^\/about\/?$/).test(request.url):
								try {
									response.end(processes.render("./home/individual.html", session));
								}
								catch (error) {_404();}
							break;

						/* settings */
							case (/^\/settings\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										processes.retrieve("sessions", {human: session.human.id}, function(data) {
											session.human.sessions = data;
											response.end(processes.render("./settings/main.html", session, session.human));
										});
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

						/* humans */
							case (/^\/humans\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										_302("../../../../humans/" + session.human.name);
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/humans\/[0-9a-zA-Z]*\/?$/).test(request.url):
								try {
									processes.retrieve("humans", {name: routes[2]}, function (human) {
										if (typeof human.id === "undefined") { human = human[0]; }

										if (human) {
											response.end(processes.render("./humans/individual.html", session, human));
										}
										else {
											_302();
										}
									});
								}
								catch (error) {_404();}
							break;

						/* robots */
							case (/^\/robots\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										response.end(processes.render("./robots/main.html", session, null));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/robots\/[0-9a-zA-Z]*\/?$/).test(request.url):
								try {
									processes.retrieve("robots", {id: routes[2]}, function (robot) {
										if (typeof robot.id === "undefined") { robot = robot[0]; }

										if (robot) {
											response.end(processes.render("./robots/individual.html", session, robot));
										}
										else {
											_302();
										}
									});
								}
								catch (error) {_404();}
							break;

						/* arenas */
							case (/^\/arenas\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										response.end(processes.render("./arenas/main.html", session, null));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/arenas\/[0-9a-zA-Z]*\/?$/).test(request.url):
								try {
									processes.retrieve("arenas", {$where: "this.id.substring(0,4) === '" + routes[2] + "'"}, function (arena) {
										if (typeof arena.id === "undefined") { arena = arena[0]; }

										if (arena) {
											response.end(processes.render("./arenas/individual.html", session, arena));
										}
										else {
											_302();
										}
									});
								}
								catch (error) {_404();}
							break;

						/* tutorials */
							case (/^\/tutorials\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										response.end(processes.render("./tutorials/main.html", session, null));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/tutorials\/[0-9a-zA-Z]*\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										var tutorial = fs.readFileSync("./assets/tutorials/functions.json","utf8") || null;
										if (tutorial !== null) {
											response.end(processes.render("./tutorials/individual.html", session, JSON.parse(tutorial)));
										}
										else {
											_302("../../../../tutorials");
										}
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

						/* all others */
							default:
								_404();
							break;
					}
				}
				else if ((request.method === "POST") && (post.action !== "undefined")) { //ajax
					response.writeHead(200, {"Content-Type": "text/json"});

					switch (post.action) {
						/* home */
							case "signup":
								try {
									if (session.human === null) {
										home.signup(session, post, function(data) {
											response.end(JSON.stringify(data));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;
							
							case "signin":
								try {
									if (session.human === null) {
										home.signin(session, post, function(data) {
											response.end(JSON.stringify(data));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;
							
							case "signout":
								try {
									if (session.human !== null) {
										home.signout(session, function(data) {
											response.end(JSON.stringify(data));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "verify_email":
								try {
									home.verify(session, post, function(data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to verify email"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "send_reset":
								try {
									home.sendReset(session, post, function(data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to send reset email"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "verify_reset":
								try {
									home.verifyReset(session, post, function(data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to verify reset email"}}));
									});
								}
								catch (error) {_403();}
							break;

						/* settings */
							case "destroy_session":
								try {
									if (session.human !== null) {
										settings.destroy(session, post, function (data) {
											response.end(JSON.stringify(data || {success: false, messages: {sessions: "//unable to delete session"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "send_verification":
								try {
									if (session.human !== null) {
										settings.sendVerification(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to send email"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "change_name":
								try {
									if (session.human !== null) {
										settings.updateName(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {name: "//unable to update name"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "change_password":
								try {
									if (session.human !== null) {
										settings.updatePassword(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {password: "//unable to update password"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "edit_settings":
								try {
									if (session.human !== null) {
										settings.update(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to update settings"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

						/* humans */
							case "edit_human":
								try {
									if (session.human !== null) {
										humans.update(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to update human"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "delete_human":
								try {
									if (session.human !== null) {
										humans.destroy(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to delete human"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

						/* robots */
							case "create_robot":
								try {
									if (session.human !== null) {												
										robots.create(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to create robot"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "edit_robot":
								try {
									if (session.human !== null) {
										robots.update(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to update robot"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "delete_robot":
								try {
									if (session.human !== null) {
										robots.destroy(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to delete robot"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "load_robot":
								try {
									if (session.human !== null) {
										robots.load(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to retrieve robot"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

						/* arenas */
							case "create_arena":
								try {
									if (session.human !== null) {
										arenas.create(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to create arena"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "delete_arena":
								try {
									if (session.human !== null) {
										arenas.destroy(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to delete arena"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "join_arena":
								try {
									if (session.human !== null) {
										arenas.joinin(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to join arena", navbar: "//unable to join arena"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "random_arena":
								try {
									if (session.human !== null) {
										arenas.random(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to join random arena", navbar: "//unable to join random arena"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "leave_arena":
								try {
									if (session.human !== null) {
										arenas.leave(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to leave arena"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "select_robot":
								try {
									if (session.human !== null) {
										arenas.selectRobot(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to select robot"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "launch_arena":
								try {
									if (session.human !== null) {
										arenas.launch(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to launch arena"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "adjust_robot":
								try {
									if (session.human !== null) {
										arenas.adjustRobot(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to save changes"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "read_arena":
								try {
									if (session.human !== null) {
										arenas.read(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to read arena"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

						/* tutorials */
							case "complete_tutorial":
								try {
									if (session.human !== null) {
										console.log("first here");
										tutorials.complete(session, post, function(data) {
											console.log("later here");
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to update tutorial completion"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;


						/* all others */
							default:
								_403();
							break;
					}
				}
				else { //all others
					_403();
				}

			/* special */
				function _302(data) { //redirects
					response.writeHead(302, {Location: data || "../../../../"});
					response.end();
				}

				function _403(data) { //invalid post request
					response.writeHead(403, {"Content-Type": "text/json"});
					response.end(JSON.stringify({success: false, messages: {navbar: (data || "//invalid request"), top: (data || "//invalid request")}}));
				}

				function _404(data) { //invalid get request
					response.writeHead(404, {"Content-Type": "text/html"});
					response.end(data || processes.render("./assets/asciiBots/errorBot.shtml"));
				}
			}
	}
