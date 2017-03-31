/* node modules */
	const http = require("http");
	const fs = require("fs");
	const qs = require("querystring");

/* my modules */
	const processes = require("./processes");
	const home = require("./home/logic");
	const users = require("./users/logic");
	const robots = require("./robots/logic");
	const arenas = require("./arenas/logic");
	const settings = require("./settings/logic");

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
						if (typeof session.user === "undefined") { session.user = null; }

						if (session.user !== null) {
							processes.retrieve("users", {id: session.user}, function(user) {
								if (typeof user.id === "undefined") { user = user[0]; }

								if (user) {
									session.user = user;
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
									response.end(fs.readFileSync("./assets/logo.png"), "binary");
								}
								catch (error) {console.log(error); _404();}
							break;

						/* stylesheets */
							case (/\/stylesheet[.]css$/).test(request.url):
								if (routes[1] === "stylesheet.css") { request.url = "home/stylesheet.css"; }
								try {
									response.writeHead(200, {"Content-Type": "text/css"});
									response.end(fs.readFileSync("./assets/stylesheet.css") + (fs.readFileSync("./" + request.url) || ""));
								}
								catch (error) {_404();}
							break;

						/* scripts */
							case (/\/script[.]js$/).test(request.url):
								if (routes[1] === "script.js") { request.url = "home/script.js"; }
								try {
									response.writeHead(200, {"Content-Type": "text/javascript"});
									response.end(fs.readFileSync("./assets/script.js") + (fs.readFileSync("./" + request.url) || ""));
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
							case (/\/newuser\/?$/).test(request.url):
							case (/\/builduser\/?$/).test(request.url):
							case (/\/createuser\/?$/).test(request.url):
								try {
									_302("../../../../signout");
								}
								catch (error) {_404();}
							break;

							case (/\/newrobot\/?$/).test(request.url):
							case (/\/buildrobot\/?$/).test(request.url):
							case (/\/createrobot\/?$/).test(request.url):
								try {
									if (session.user !== null) {
										_302("../../../../users");
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
									if (session.user !== null) {
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
									if (session.user !== null) {
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
									if (session.user !== null) {
										data = {messages: {top: "//human identified as " + session.user.name}};
									}
									else {
										data = {};
									}

									response.end(processes.render("./home/index.html", session, data));
								}
								catch (error) {_404();}
							break;

							case (/^\/signin\/?$/).test(request.url):
								try {
									if (session.user === null) {
										response.end(processes.render("./home/index.html", session, {action: "signin", messages: {top: "//authenticate human"}}));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/signout\/?$/).test(request.url):
								try {
									if (session.user !== null) {
										response.end(processes.render("./home/index.html", session, {action: "signout", messages: {top: "//leave ai_arenas?"}}));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/signup\/?$/).test(request.url):
								try {
									if (session.user === null) {
										response.end(processes.render("./home/index.html", session, {action: "signup", messages: {top: "//join ai_arenas"}}));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/verify/).test(request.url):
								try {
									if (session.user !== null) {
										response.end(processes.render("./home/index.html", session, {action: "verify", messages: {top: "//verify email"}, email: (get.email || null), verification: (get.verification || null) }));
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

						/* settings */
							case (/^\/settings\/?$/).test(request.url):
								try {
									if (session.user !== null) {
										processes.retrieve("sessions", {user: session.user.id}, function(data) {
											session.user.sessions = data;
											response.end(processes.render("./settings/index.html", session, session.user));
										});
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

						/* users */
							case (/^\/users\/?$/).test(request.url):
								try {
									if (session.user !== null) {
										_302("../../../../users/" + session.user.name);
									}
									else {
										_302();
									}
								}
								catch (error) {_404();}
							break;

							case (/^\/users\/[0-9a-zA-Z]*\/?$/).test(request.url):
								try {
									processes.retrieve("users", {name: routes[2]}, function (user) {
										if (typeof user.id === "undefined") { user = user[0]; }

										if (user) {
											response.end(processes.render("./users/index.html", session, user));
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
									if (session.user !== null) {
										_302("../../../../users/" + session.user.name);
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
											response.end(processes.render("./robots/index.html", session, robot));
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
									response.end(processes.render("./arenas/index.html", session, null));
								}
								catch (error) {_404();}
							break;

							case (/^\/arenas\/[0-9a-zA-Z]*\/?$/).test(request.url):
								try {
									processes.retrieve("arenas", {$where: "this.id.substring(0,4) === '" + routes[2] + "'"}, function (arena) {
										if (typeof arena.id === "undefined") { arena = arena[0]; }

										if (arena) {
											response.end(processes.render("./arenas/index.html", session, arena));
										}
										else {
											_302();
										}
									});
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
									if (session.user === null) {
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
									if (session.user === null) {
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
									if (session.user !== null) {
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
									if (session.user !== null) {
										home.verify(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to verify email"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

						/* settings */
							case "destroy_session":
								try {
									if (session.user !== null) {
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
									if (session.user !== null) {
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
									if (session.user !== null) {
										settings.updateName(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {name: "//unable to change name"}}));
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
									if (session.user !== null) {
										settings.updatePassword(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {password: "//unable to change password"}}));
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
									if (session.user !== null) {
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

						/* users */
							case "edit_user":
								try {
									if (session.user !== null) {
										users.update(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to update user"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "delete_user":
								try {
									if (session.user !== null) {
										users.destroy(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to delete user"}}));
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
									if (session.user !== null) {												
										robots.create(session, function(data) {
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
									if (session.user !== null) {
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
									if (session.user !== null) {
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

						/* arenas */
							case "create_arena":
								try {
									if (session.user !== null) {
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
									if (session.user !== null) {
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
									if (session.user !== null) {
										arenas.join(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to join arena", navbar: "//unable to join arena"}}));
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
									if (session.user !== null) {
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

							case "read_arena":
								try {
									//
								}
								catch (error) {_403();}
							break;

							/*case "edit_arena":
								try {
									if (session.user !== null) {
										arenas.update(session, post, function(data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to update arena"}}));
										});

										processes.retrieve("arenas", {$and: [{$where: "this.id.substring(0,3) === " + routes[2]}, {"users[0]": session.user.id}]}, function(arena) {
											if (typeof arena.id === "undefined") { arena = arena[0]; }
											
											if ((typeof arena === "undefined") || (typeof arena.users === "undefined") || (arena.users[0].id !== session.user.id)) {
												_403("//not authorized");
											}
											else {
												var before = JSON.stringify(arena);
												var arena = arenas.update(arena);
												
												if (before !== JSON.stringify(arena)) {
													processes.store("arenas", {id: arena.id}, arena, function(arena) {
														response.end(JSON.stringify(arena));
													});
												}
												else {
													response.end(JSON.stringify(arena));
												}
											}
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;*/

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
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.end(data || "//404: File not found.");
				}
			}
	}
