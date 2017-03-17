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
				/* setCookie */
					if (session !== null) {
						var header = {};
						header["Set-Cookie"] = String("session=" + session.id + "; expires=" + (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)).toUTCString()) + "; path=/; domain=localhost");
					}
					else {
						var header = {}
					}

				if ((request.method === "POST") && (post.action !== "undefined")) {
					switch (post.action) {
						/* sessions */
							case "signup":
								home.signup(session, post, function(data) {
									if ((typeof data.redirect !== "undefined") && (data.redirect !== null)) {
										_302(data.redirect);
									}
									else {
										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./home/index.html", session, data));
									}
								});
							break;
							
							case "signin":
								home.signin(session, post, function(data) {
									if ((typeof data.redirect !== "undefined") && (data.redirect !== null)) {
										_302(data.redirect);
									}
									else {
										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./home/index.html", session, data));
									}
								});
							break;
							
							case "signout":
								if (session.user !== null) {
									home.signout(session, function(data) {
										response.writeHead(200, {"Content-Type": "text/json"});
										response.end(JSON.stringify({success: true, redirect: "../../../../"}));
									});
								}
								else {
									_403("not authorized");
								}
							break;

						/* users */
							case "edit_user":
								if (session.user !== null) {
									processes.retrieve("users", {name: routes[2], id: session.user.id}, function(user) {
										if (typeof user.id === "undefined") { user = user[0]; }
										
										if ((typeof user.id === "undefined") || (user.id !== session.user.id)) {
											_403("not authorized");
										}
										else {
											var before = JSON.stringify(user);
											var update = users.update(user, JSON.parse(post.data));
											
											if (before !== JSON.stringify(update.user)) {
												processes.store("users", {id: update.user.id}, update.user, function(user) {
													if (typeof user.id === "undefined") { user = user[0]; }
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
								}
								else {
									_403("not authorized");
								}
							break;

							case "delete_user":
								if (session.user !== null) {
									processes.retrieve("users", {name: routes[2], id: session.user.id}, function(user) {
										if (typeof user.id === "undefined") { user = user[0]; }
										
										if ((typeof user.id === "undefined") || (user.id !== session.user.id)) {
											_403("not authorized");
										}
										else {
											var robots = [];
											for (var i = 0; i < user.robots.length; i++) {
												robots.push(user.robots[i].id);
											}

											processes.store("robots", {id: {$in: robots}}, null, function(robot) {
												if (typeof robot.id === "undefined") { robot = robot[0]; }
												processes.store("users", {id: session.user.id}, null, function(user) {
													if (typeof user.id === "undefined") { user = user[0]; }
													processes.store("sessions", {user: session.user.id}, {$set: {user: null}}, function(session) {
														if (typeof session.id === "undefined") { session = session[0]; }
														response.writeHead(200, {"Content-Type": "text/json"});
														response.end(JSON.stringify({success: true, redirect: "../../../../"}));
													});
												});
											});
										}
									});
								}
								else {
									_403("not authorized");
								}
							break;

						/* robots */
							case "create_robot":
								if (session.user !== null) {												
									processes.store("robots", null, robots.create(session.user), function(robot) {
										if (typeof robot.id === "undefined") { robot = robot[0]; }
										processes.store("users", {id: session.user.id}, {$push: {robots: {id: robot.id, name: robot.name}}}, function(user) {
											if (typeof user.id === "undefined") { user = user[0]; }
											response.writeHead(200, {"Content-Type": "text/json"});
											response.end(JSON.stringify({success: true, redirect: "../../../../robots/" + robot.id}));
										});
									});
								}
								else {
									_403("not authorized");
								}
							break;

							case "edit_robot":
								if (session.user !== null) {
									processes.retrieve("robots", {id: routes[2], "user.id": session.user.id}, function(robot) {
										if (typeof robot.id === "undefined") { robot = robot[0]; }
										
										if ((typeof robot.user === "undefined") || (robot.user.id !== session.user.id)) {
											_403("not authorized");
										}
										else {
											var before = JSON.stringify(robot);
											var update = robots.update(robot, JSON.parse(post.data));
											
											if (before !== JSON.stringify(update.robot)) {
												processes.store("robots", {id: robot.id}, robot, function(robot) {
													if (typeof robot.id === "undefined") { robot = robot[0]; }
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
								}
								else {
									_403("not authorized");
								}
							break;

							case "delete_robot":
								if (session.user !== null) {
										processes.retrieve("robot", {id: routes[2], "user.id": session.user.id}, function(robot) {
										if (typeof robot.id === "undefined") { robot = robot[0]; }
										
										if ((typeof robot.user === "undefined") || (robot.user.id !== session.user.id)) {
											_403("not authorized");
										}
										else {
											proceses.store("users", {id: robot.user.id}, {$pull: {robots: robot.id}}, function(user) {
												if (typeof user.id === "undefined") { user = user[0]; }
												processes.store("robots", {id: robot.id}, null, function(results) {
													if (typeof robot.id === "undefined") { robot = robot[0]; }
													response.writeHead(200, {"Content-Type": "text/json"});
													response.end(JSON.stringify({success: true, redirect: "../../../../"}));
												});
											});
										}
									});
								}
								else {
									_403("not authorized");
								}
							break;

						/* arenas */
							case "create_arena":
								if (session.user === null) {
									_403("not authorized");
								}
								else {
									var arena = arenas.create(session.user, post.parameters || null);
									processes.store("arenas", null, arena, function(arena) {
										if (typeof arena.id === "undefined") { arena = arena[0]; }
										processes.store("users", {id: session.user.id}, {$push: {arenas: arena.id}}, function(user) {
											if (typeof user.id === "undefined") { user = user[0]; }
											response.writeHead(403, {"Content-Type": "text/json"});
											response.end(JSON.stringify({success: true, redirect: "../../../../arenas/" + arena.id.substring(0,3)}));
										});
									});
								}
							break;

							case "edit_arena":
								if (session.user !== null) {
									processes.retrieve("arenas", {$where: "this.id.substring(0,3) === " + routes[2], "users[0]": session.user.id}, function(arena) {
										if (typeof arena.id === "undefined") { arena = arena[0]; }
										
										if ((typeof arena.users === "undefined") || (arena.users[0].id !== session.user.id)) {
											_403("not authorized");
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
								}
								else {
									_403("not authorized");
								}
							break;

							case "delete_arena":
								if (session.user !== null) {
									processes.retrieve("arenas", {id: routes[2]}, function(arena) {
										if (typeof arena.id === "undefined") { arena = arena[0]; }
										
										if ((typeof arena.users === "undefined") || (arena.users[0].id !== session.user.id)) {
											_403("not authorized");
										}
										else {
											proceses.store("users", {id: {$in: arena.users}}, {$pull: {arenas: arena.id}}, function(user) {
												if (typeof user.id === "undefined") { user = user[0]; }
												processes.store("arenas", {id: arena.id}, null, function(results) {
													if (typeof arena.id === "undefined") { arena = arena[0]; }
													response.writeHead(200, {"Content-Type": "text/json"});
													response.end(JSON.stringify({success: true, redirect: "../../../../"}));
												});
											});
										}
									});
								}
								else {
									_403("not authorized");
								}
							break;

							case "join_arena":
								if (session.user !== null) {
									if ((typeof post.arena_id === "undefined") || (post.arena_id.length !== 4)) {
										_403("invalid arena id");
									}
									else {
										processes.retrieve("arenas", {$where: "this.id.substring(0,3) === " + post.arena_id}, function(arena) {
											if (typeof arena.id === "undefined") { arena = arena[0]; }

											if (typeof arena !== "undefined") {
												var results = arenas.join(arena, session.user);

												if (results.success) {
													processes.store("arenas", {id: results.arena.id}, {$push: {users: user.id}}, function(arena) {
														if (typeof arena.id === "undefined") { arena = arena[0]; }
														processes.store("users", {id: session.user.id}, {$push: {arenas: arena.id}}, function(user) {
															if (typeof user.id === "undefined") { user = user[0]; }
															response.writeHead(200, {"Content-Type": "text/json"});
															response.end(JSON.stringify(results));
														});
													});
												}
												else {
													response.writeHead(200, {"Content-Type": "text/json"});
													response.end(JSON.stringify(results));
												}
											}
											else {
												response.writeHead(200, {"Content-Type": "text/json"});
												response.end(JSON.stringify({success: false, messages: {navbar: "//invalid arena id"}}));
											}
										});
									}
								}
								else {
									_403("not authorized");
								}
							break;

							case "leave_arena":
								if (session.user !== null) {
									if ((typeof post.arena_id === "undefined") || (post.arena_id.length !== 4)) {
										_403("invalid arena id");
									}
									else {
										processes.store("arenas", {$where: "this.id.substring(0,3) === " + post.arena_id}, {$pull: {users: session.user.id}}, function(arena) {
											if (typeof arena.id === "undefined") { arena = arena[0]; }
											processes.store("users", {id: session.user.id}, {$pull: {arenas: arena.id}}, function(user) {
												if (typeof user.id === "undefined") { user = user[0]; }
												_302();
											});
										});
									}
								}
								else {
									_403("not authorized");
								}
							break;

							case "read_arena":
							//
							break;

						/* all others */
							default:
								_403();
							break;
					}
				}
				else if (request.method === "GET") {
					switch (true) {
						/* assets */
							case (/\/favicon[.]ico$/).test(request.url):
							case (/\/icon[.]png$/).test(request.url):
							case (/\/logo[.]png$/).test(request.url):
								try {
									response.writeHead(200, {"Content-Type": "image/png"});
									response.end(fs.readFileSync("../../../../assets/logo.png"));
								}
								catch (error) {_404();}
							break;

							case (/\/stylesheet[.]css$/).test(request.url):
								if (routes[1] === "stylesheet.css") { request.url = "home/stylesheet.css"; }
								try {
									response.writeHead(200, {"Content-Type": "text/css"});
									response.end(fs.readFileSync("./" + request.url));
								}
								catch (error) {_404();}
							break;

							case (/\/script[.]js$/).test(request.url):
								if (routes[1] === "script.js") { request.url = "home/script.js"; }
								try {
									response.writeHead(200, {"Content-Type": "text/javascript"});
									response.end(fs.readFileSync("./" + request.url));
								}
								catch (error) {_404();}
							break;

						/* redirects */
							case (/^\/signout\/?$/).test(request.url):
							case (/^\/logout\/?$/).test(request.url):
							case (/^\/signin\/?$/).test(request.url):
							case (/^\/login\/?$/).test(request.url):
							case (/^\/signup\/?$/).test(request.url):
							case (/^\/create\/?$/).test(request.url):
							case (/^\/join\/?$/).test(request.url):
							case (/\/newuser\/?$/).test(request.url):
							case (/\/builduser\/?$/).test(request.url):
							case (/\/createuser\/?$/).test(request.url):
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

						/* home */
							case (/^\/$/).test(request.url):
								try {
									if (session.user !== null) {
										data = {messages: {top: "//human identified as " + session.user.name}};
									}
									else {
										data = {};
									}

									header["Content-Type"] = "text/html";
									response.writeHead(200, header);
									response.end(processes.render("./home/index.html", session, data));
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
											header["Content-Type"] = "text/html";
											response.writeHead(200, header);
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
											header["Content-Type"] = "text/html";
											response.writeHead(200, header);
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
									header["Content-Type"] = "text/html";
									response.writeHead(200, header);
									response.end(processes.render("./arenas/index.html", session, null));
								}
								catch (error) {_404();}
							break;

							case (/^\/arenas\/[0-9a-zA-Z]*\/?$/).test(request.url):
								try {
									processes.retrieve("arenas", {id: routes[2]}, function (arena) {
										if (typeof arena.id === "undefined") { arena = arena[0]; }

										if (arena) {
											header["Content-Type"] = "text/html";
											response.writeHead(200, header);
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
				else {
					_403();
				}

			/* special */
				function _302(data) {
					response.writeHead(302, {Location: data || "../../../../"});
					response.end();
				}

				function _403(data) {
					response.writeHead(403, {"Content-Type": "text/json"});
					response.end({success: false, messages: {navbar: data || "//invalid request", top: data || "//invalid request"}});
				}

				function _404(data) {
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.end(data || "404: File not found.");
				}

			}
	}
