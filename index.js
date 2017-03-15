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
										processes.store("users", {id: session.user.id}, users.update(session.user, robot, "create_robot"), function(user) {
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
										processes.store("users", {id: session.user.id}, users.update(session.user, arena, "create_arena"), function(user) {
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
												
												if (user.id !== session.user.id) {
													response.writeHead(200, {"Content-Type": "text/json"});
													response.end(JSON.stringify({changed: false, message: 'invalid request', user: user}));
												}
												else {
													var before = JSON.stringify(user);
													user = users.update(user, post.value, post.field);
													if (before !== JSON.stringify(user)) {
														processes.store("users", {id: user.id}, user, function(user) {
															response.writeHead(200, {"Content-Type": "text/json"});
															response.end(JSON.stringify({changed: true, message: 'changed!', user: user}));
														});
													}
													else {
														response.writeHead(200, {"Content-Type": "text/json"});
														response.end(JSON.stringify({changed: false, message: 'data could not be changed', user: usr}));
													}
												}
											});
										break;
									}
								}
								else {
									processes.retrieve("users", {name: routes[2]}, then);
								}

								function then(user) {
									if (user.length > 0) {
										if (typeof user.id === "undefined") { user = user[0]; }

										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./users/index.html", session, user));
									}
									else {
										_302();
									}
								}
							}
							catch (error) {_404();}
						break;

						case (/^\/robots\/[0-9a-zA-Z]*\/?$/).test(request.url):
							try {
								if ((request.method == "POST") && (Object.keys(post).length > 0) && (typeof post.action !== "undefined")) {
									switch (post.action) {
										case "editrobot":
											//?
											// processes.retrieve("users", {name: routes[2], id: session.user}, function(data) {
												// processes.store("users", {name: routes[2], id: session.user}, users.update(data, post), then);	
											// });

											header["Content-Type"] = "text/html";
											response.writeHead(200, header);
											response.end("editrobot page");
										break;
										case "deleterobot":
											//?
											// processes.retrieve("users", {name: routes[2], id: session.user}, function(data) {
												// processes.store("robots", {id: routes[2], user: session.user}, null, then);
											// });

											header["Content-Type"] = "text/html";
											response.writeHead(200, header);
											response.end("deleterobot page");
										break;
									}
								}
								else {
									processes.retrieve("robots", {id: routes[2]}, then);
								}

								function then(robot) {
									if (robot.length > 0) {
										if (typeof robot.id === "undefined") { robot = robot[0]; }

										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./robots/index.html", session, robot));
									}
									else {
										_404();
									}
								}
							}
							catch (error) {_404();}
						break;

						case (/^\/arenas\/[0-9a-zA-Z]*\/?$/).test(request.url):
							try {
								if ((request.method == "POST") && (Object.keys(post).length > 0)) {
									store("arenas", {id: routes[2], user: session.user}, processes.updateArena(post), then);
								}
								else {
									retrieve("arenas", {id: routes[2]}, then);
								}

								function then(arena) {
									if (arena.length > 0) {
										if (typeof arena.id === "undefined") { arena = arena[0]; }

										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./robots/index.html", session, arena));
									}
									else {
										_404();
									}
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
