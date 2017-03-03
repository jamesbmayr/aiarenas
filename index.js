/* modules */
	const http = require("http");
	const path = require("path");
	const fs = require("fs");
	const qs = require("querystring");
	const processes = require("./processes");

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
			var routes, post, get, cookie;
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
				console.log("[" + request.method + "] to " + request.url + "\n  GET: " + JSON.stringify(get) + "\n  POST: " + JSON.stringify(post) + "\n  COOKIE: " + JSON.stringify(cookie));

				if ((/[.](ico|png|jpg|jpeg|css|js)$/).test(request.url)) {
					routing(null);
				}
				else {
					processes.session(request, response, cookie.session || null, routing);
				}
			});

		/* routing */
			function routing(session) {
				/* setCookie */
					if (session !== null) {
						if (typeof session.id === "undefined") { session = session[0]; }
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
							try {
								header["Content-Type"] = "text/css";
								response.writeHead(200, header);
								response.end(fs.readFileSync(request.url));
							}
							catch (error) {_404();}
						break;

						case (/\/script[.]js$/).test(request.url):
							try {
								header["Content-Type"] = "text/javascript";
								response.writeHead(200, header);
								response.end(fs.readFileSync(request.url));
							}
							catch (error) {_404();}
						break;

					/* pages */
						case (/^\/$/).test(request.url):
							try {
								if ((request.method == "post") && (Object.keys(post).length > 0)) {
									if ((typeof post.action !== "undefined") && (post.action == "signup")) {
										var user = processes.createUser(post);
										retrieve("users", {name: user.name}, function(data) {
											if (data) {
												data = {message: "username taken"};
												then(data);
											}
											else {
												store("users", null, user, function(data) {
													store("sessions", {id: session.id}, processes.updateSession(session.id, data), then);		
												});
											}
										}
											
									}
									else if ((typeof post.action !== "undefined") && (post.action == "signin")) {
										store("sessions", {id: session.id}, processes.updateSession(session.id, post), then);
									}
									else if ((typeof post.action !== "undefined") && (post.action == "signout")) {
										store("sessions", {id: session.id}, processes.updateSession(session.id, post), then);
									}
								}
								else {
									then(null);
								}

								function then(data) {
									header["Content-Type"] = "text/html";
									response.writeHead(200, header);
									response.end(processes.render("./home/index.html", data));
								}
							}
							catch (error) {_404();}
						break;

						case (/^\/user\/[0-9a-zA-Z]*\/?$/).test(request.url):
							try {
								if ((request.method == "post") && (Object.keys(post).length > 0)) {
									store("users", {name: routes[2], id: session.user}, processes.updateUser(post), then);
								}
								else {
									retrieve("users", {name: routes[2]}, then);
								}

								function then(data) {
									if (results.length > 0) {
										if (typeof data.id === "undefined") { data = data[0]; }

										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./user/index.html", processes.readUser(data)));
									}
									else {
										_404();
									}
								}
							}
							catch (error) {_404();}
						break;

						case (/^\/robot\/[0-9a-zA-Z]*\/?$/).test(request.url):
							try {
								if ((request.method == "post") && (Object.keys(post).length > 0)) {
									store("robots", {id: routes[2], user: session.user}, processes.updateRobot(post), then);
								}
								else {
									retrieve("robots", {id: routes[2]}, then);
								}

								function then(results) {
									if (results.length > 0) {
										if (typeof data.id === "undefined") { data = data[0]; }

										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./robot/index.html", processes.readRobot(data)));
									}
									else {
										_404();
									}
								}
							}
							catch (error) {_404();}
						break;

						case (/^\/arena\/[0-9a-zA-Z]*\/?$/).test(request.url):
							try {
								if ((request.method == "post") && (Object.keys(post).length > 0)) {
									store("arenas", {id: routes[2], user: session.user}, processes.updateArena(post), then);
								}
								else {
									retrieve("arenas", {id: routes[2]}, then);
								}

								function then(results) {
									if (results.length > 0) {
										if (typeof data.id === "undefined") { data = data[0]; }

										header["Content-Type"] = "text/html";
										response.writeHead(200, header);
										response.end(processes.render("./arena/index.html", processes.readArena(data)));
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
				function _404() {
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.end("404: File not found.");
				}

				function _302() {
					response.writeHead(302, {Location: "../../../../"});
					response.end();
				}
			}
	}
