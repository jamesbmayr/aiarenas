/* node modules */
	const http = require("http");
	const path = require("path");
	const fs = require("fs");
	const qs = require("querystring");

/* my modules */
	const processes = require("./processes");
	const home = require("./home/logic");
	const users = require("./users/logic");
	const robots = require("./robots/logic");
	const arenas = require("./arenas/logic");

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
								if (user.length > 0) {
									if (typeof user.id === "undefined") { user = user[0]; }
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
				/* setCookie */
					if (session !== null) {
						var header = {};
						header["Set-Cookie"] = String("session=" + session.id + "; expires=" + (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)).toUTCString()) + "; path=/; domain=localhost");
					}
					else {
						var header = {}
					}

				switch (true) {
					/* assets */
						case (/\/favicon[.]ico$/).test(request.url):
							_404();
						break;

						case (/\/icon[.]png$/).test(request.url):
							try {
								header["Content-Type"] = "image/png";
								response.writeHead(200, header);
								response.end(fs.readFileSync(__dirname + "/assets/icon.png"));
							}
							catch (error) {_404();}
						break;

						case (/\/stylesheet[.]css$/).test(request.url):
							if (routes[1] === "stylesheet.css") { request.url = "home/stylesheet.css"; }
							try {
								header["Content-Type"] = "text/css";
								response.writeHead(200, header);
								response.end(fs.readFileSync("./" + request.url));
							}
							catch (error) {_404();}
						break;

						case (/\/script[.]js$/).test(request.url):
							if (routes[1] === "script.js") { request.url = "home/script.js"; }
							try {
								header["Content-Type"] = "text/javascript";
								response.writeHead(200, header);
								response.end(fs.readFileSync("./" + request.url));
							}
							catch (error) {_404();}
						break;

					/* functions */
						case (/^\/signout\/?$/).test(request.url):
						case (/^\/logout\/?$/).test(request.url):
							try {
								home.signout(session, function(session) {
									_302();
								});
							}
							catch (error) {_404();}
						break;

						case (/^\/signup\/?$/).test(request.url):
						case (/^\/signin\/?$/).test(request.url):
						case (/^\/login\/?$/).test(request.url):
						case (/^\/create\/?$/).test(request.url):
						case (/^\/join\/?$/).test(request.url):
							try {
								_302();
							}
							catch (error) {_404();}
						break;

						case (/\/newrobot\/?$/).test(request.url):
						case (/\/buildrobot\/?$/).test(request.url):
						case (/\/createrobot\/?$/).test(request.url):
							try {
								if (session.user !== null) {												
									processes.store("robots", null, robots.create(session.user), function(robot) {
										processes.store("users", {id: session.user.id}, {$push: {robots: robot.id}}, function(user) {
											_302("../../robots/" + robot.id);
										});
									});
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
									processes.store("arenas", null, arenas.create(session.user), function(arena) {
										processes.store("users", {id: session.user.id}, {$push: {arenas: arena.id}}, function(user) {
											_302("../../arenas/" + arena.id);
										});
									});
								}
								else {
									_302();
								}
							}
							catch (error) {_404();}
						break;

					/* pages */
						case (/^\/$/).test(request.url):
							try {
								if ((request.method == "POST") && (Object.keys(post).length > 0) && (typeof post.action !== "undefined")) {
									switch (post.action) {
										case "signup":
											home.signup(session, post, then);
										break;
										case "signin":
											home.signin(session, post, then);
										break;
										case "signout":
											home.signout(session, then);
										break;
									}
								}
								else {
									if (session.user !== null) {
										then({message: "human identified as " + session.user.name});
									}
									else {
										then({});
									}
								}

								function then(data) {
									if ((typeof data.redirect !== "undefined") && (data.redirect !== null)) {
										_302(data.redirect);
									}
									else {
										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./home/index.html", session, data));
									}
								}
							}
							catch (error) {_404();}
						break;

						case (/^\/users\/?$/).test(request.url):
							if (session.user !== null) {
								_302("/users/" + session.user.name);
							}
							else {
								_302();
							}
						break;

						case (/^\/users\/[0-9a-zA-Z]*\/?$/).test(request.url):
							try {
								if ((request.method == "POST") && (Object.keys(post).length > 0) && (typeof post.action !== "undefined")) {
									switch (post.action) {
										case "edit_user":
											processes.retrieve("users", {name: routes[2], id: session.user.id}, function(user) {
												if (typeof user.id === "undefined") { user = user[0]; }
												
												if ((typeof user.id === "undefined") || (user.id !== session.user.id)) {
													response.writeHead(403, {"Content-Type": "text/json"});
													response.end(JSON.stringify({success: false}));
												}
												else {
													var before = JSON.stringify(user);
													var update = users.update(user, JSON.parse(post.data));
													
													if (before !== JSON.stringify(update.user)) {
														processes.store("users", {id: update.user.id}, update.user, function(user) {
															response.writeHead(200, {"Content-Type": "text/json"});
															response.end(JSON.stringify(update));
														});
													}
													else {
														response.writeHead(200, {"Content-Type": "text/json"});
														response.end(JSON.stringify(update));
													}
												}
											});
										break;

										case "delete_user":
											processes.retrieve("users", {name: routes[2], id: session.user.id}, function(user) {
												if (typeof user.id === "undefined") { user = user[0]; }
												
												if ((typeof user.id === "undefined") || (user.id !== session.user.id)) {
													response.writeHead(403, {"Content-Type": "text/json"});
													response.end(JSON.stringify({success: false}));
												}
												else {
													var robots = [];
													for (var i = 0; i < user.robots.length; i++) {
														robots.push(user.robots[i].id);
													}

													processes.store("robots", {id: {$in: robots}}, null, function(results) {
														processes.store("users", {id: session.user.id}, null, function(user) {
															processes.store("sessions", {user: session.user.id}, {$set: {user: null}}, function(session) {
																_302();
															});
														});
													});
												}
											});
										break;
									}
								}
								else {
									processes.retrieve("users", {name: routes[2]}, function (user) {
										if (user.length > 0) {
											if (typeof user.id === "undefined") { user = user[0]; }

											header["Content-Type"] = "text/html";
											response.writeHead(200, header);
											response.end(processes.render("./users/index.html", session, user));
										}
										else {
											_302();
										}
									});
								}
							}
							catch (error) {_404();}
						break;

						case (/^\/robots\/[0-9a-zA-Z]*\/?$/).test(request.url):
							try {
								if ((request.method == "POST") && (Object.keys(post).length > 0) && (typeof post.action !== "undefined")) {
									switch (post.action) {
										case "edit_robot":
											processes.retrieve("robots", {id: routes[2], "user.id": session.user.id}, function(robot) {
												if (typeof robot.id === "undefined") { robot = robot[0]; }
												
												if ((typeof robot.user === "undefined") || (robot.user.id !== session.user.id)) {
													response.writeHead(403, {"Content-Type": "text/json"});
													response.end(JSON.stringify({success: false}));
												}
												else {
													var before = JSON.stringify(robot);
													var update = robots.update(robot, JSON.parse(post.data));
													
													if (before !== JSON.stringify(update.robot)) {
														processes.store("robots", {id: robot.id}, robot, function(robot) {
															response.writeHead(200, {"Content-Type": "text/json"});
															response.end(JSON.stringify(update));
														});
													}
													else {
														response.writeHead(200, {"Content-Type": "text/json"});
														response.end(JSON.stringify(update));
													}
												}
											});
										break;

										case "delete_robot":
											processes.retrieve("robot", {id: routes[2], "user.id": session.user.id}, function(robot) {
												if (typeof robot.id === "undefined") { robot = robot[0]; }
												
												if ((typeof robot.user === "undefined") || (robot.user.id !== session.user.id)) {
													response.writeHead(403, {"Content-Type": "text/json"});
													response.end(JSON.stringify({success: false}));
												}
												else {
													proceses.store("users", {id: robot.user.id}, {$pull: {robots: robot.id}}, function(user) {
														processes.store("robots", {id: robot.id}, null, function(results) {
															_302();
														});
													});
												}
											});
										break;
									}
								}
								else {
									processes.retrieve("robots", {id: routes[2]}, function (robot) {
										if (robot.length > 0) {
											if (typeof robot.id === "undefined") { robot = robot[0]; }

											header["Content-Type"] = "text/html";
											response.writeHead(200, header);
											response.end(processes.render("./robots/index.html", session, robot));
										}
										else {
											_302();
										}
									});
								}
							}
							catch (error) {_404();}
						break;

						case (/^\/arenas\/[0-9a-zA-Z]*\/?$/).test(request.url):
							try {
								if ((request.method == "POST") && (Object.keys(post).length > 0) && (typeof post.action !== "undefined")) {
									switch (post.action) {
										case "edit_arena":
											processes.retrieve("arenas", {id: routes[2], "users[0]": session.user.id}, function(arena) {
												if (typeof arena.id === "undefined") { arena = arena[0]; }
												
												if ((typeof arena.users === "undefined") || (arena.users[0].id !== session.user.id)) {
													response.writeHead(403, {"Content-Type": "text/json"});
													response.end(JSON.stringify({success: false}));
												}
												else {
													var before = JSON.stringify(arena);
													var arena = arenas.update(arena);
													
													if (before !== JSON.stringify(arena)) {
														processes.store("arenas", {id: arena.id}, arena, function(arena) {
															response.writeHead(200, {"Content-Type": "text/json"});
															response.end(JSON.stringify(arena));
														});
													}
													else {
														response.writeHead(200, {"Content-Type": "text/json"});
														response.end(JSON.stringify(arena));
													}
												}
											});
										break;

										case "delete_arena":
											processes.retrieve("arenas", {id: routes[2]}, function(arena) {
												if (typeof arena.id === "undefined") { arena = arena[0]; }
												
												if ((typeof arena.users === "undefined") || (arena.users[0].id !== session.user.id)) {
													response.writeHead(403, {"Content-Type": "text/json"});
													response.end(JSON.stringify({success: false}));
												}
												else {
													proceses.store("users", {id: {$in: arena.users}}, {$pull: {arenas: arena.id}}, function(user) {
														processes.store("arenas", {id: arena.id}, null, function(results) {
															_302();
														});
													});
												}
											});
										break;

										case "join_arena":
										//
										break;

										case "leave_arena":
										//
										break;

										case "read_arena":
										//
										break;
									}
								}
								else {
									processes.retrieve("arenas", {id: routes[2]}, function (arena) {
										if (arena.length > 0) {
											if (typeof arena.id === "undefined") { arena = arena[0]; }

											header["Content-Type"] = "text/html";
											response.writeHead(200, header);
											response.end(processes.render("./arenas/index.html", session, arena));
										}
										else {
											_302();
										}
									});
								}
							}
							catch (error) {_404();}
						break;

					/* all others */
						default:
							_404();
						break;
				}

			/* special */
				function _404(data) {
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.end(data || "404: File not found.");
				}

				function _302(data) {
					response.writeHead(302, {Location: data || "../../../../"});
					response.end();
				}
			}
	}
