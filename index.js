/* node modules */
	const http = require("http");
	const fs = require("fs");
	const qs = require("querystring");

/* my modules */
	const processes = require("./assets/logic");
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
				try { cookie = qs.parse(request.headers.cookie.replace(/; /g, "&")) || null; } catch(error) { cookie = {}; }
				request.headers["ip-address"] = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || request.connection.socket.remoteAddress;
				console.log("\n" + new Date().toLocaleString() + ": " + (cookie.session || "new") + " @ " + request.headers["ip-address"] + "\n[" + request.method + "] " + request.url + "\n" + (request.method === "GET" ? JSON.stringify(get) : JSON.stringify(post).replace(/(password|confirm)\"\:\"([^\"]+)\"/gi,"$1\"\:\"••••••••\"")));
				
				/* routing for ping */
					if ((/^\/ping\/?$/).test(request.url)) {
						routing(null);
					}
					
				/* routing for images, stylesheets, and scripts */
					else if ((/[.](ico|png|jpg|jpeg|gif|svg|pdf|txt|css|js)$/).test(request.url)) {
						routing(null);
					}

				/* get session */
					else {
						processes.session((cookie.session || false), {url: request.url, post: post, headers: request.headers}, function (session) {

							/* human --> routing */
								if ((session.human !== undefined) && (session.human !== null)) {
									processes.retrieve("humans", {id: session.human}, {}, function (human) {
										session.human = human || null;
										routing(session);
									});
								}
								else {
									session.human = null;
									routing(session);
								}
						});
					}
			});

		/* routing */
			function routing(session) {
				if ((request.method === "GET") && (session === null)) { //assets
					switch (true) {
						/* ping */
							case (/^\/ping\/?$/).test(request.url):
								try {
									response.writeHead(200, {
										"Content-Type": "text/json"
									})
									response.end( JSON.stringify({success: true, timestamp: new Date().getTime()}) )
								}
								catch (error) {_403(error)}
							break

						/* logo */
							case (/\/favicon[.]ico$/).test(request.url):
							case (/\/icon[.]png$/).test(request.url):
							case (/\/logo[.]png$/).test(request.url):
							case (/\/ascii_logo[.]png$/).test(request.url):
								try {
									response.writeHead(200, {"Content-Type": "image/png"});
									response.end(fs.readFileSync("./assets/images/logo.png"), "binary");
								}
								catch (error) {_404();}
							break;

						/* banner */
							case (/\/banner[.]png$/).test(request.url):
								try {
									response.writeHead(200, {"Content-Type": "image/png"});
									response.end(fs.readFileSync("./assets/images/banner.png"), "binary");
								}
								catch (error) {_404();}
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
						"Set-Cookie": String("session=" + session.id + "; expires=" + (new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)).toUTCString()) + "; path=/; domain=" + processes.environment("domain")),
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

							case (/\/workshop\/?$/).test(request.url):
							case (/\/newrobot\/?$/).test(request.url):
							case (/\/buildrobot\/?$/).test(request.url):
							case (/\/createrobot\/?$/).test(request.url):
								try {
									if (session.human !== null) {
										_302("../../../../robots");
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

						/* data */
							case (/^\/api/).test(request.url):
								try {
									processes.apicall(session, get, function (data) {
										response.end("<pre monospace>" + JSON.stringify(data,2,2) + "</pre>");
									});
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
									processes.statistics(function (statistics) {
										data.statistics = statistics || {};
										response.end(processes.render("./home/main.html", session, data));
									});
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

							case (/^\/verify\/?$/).test(request.url):
								try {
									response.end(processes.render("./home/main.html", session, {action: "verify", messages: {top: "//verify email"}, email: (get.email || null), verification: (get.verification || null) }));
								}
								catch (error) {_404();}
							break;

							case (/^\/reset\/?$/).test(request.url):
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
										processes.retrieve("sessions", {human: session.human.id}, {$multi: true}, function(data) {
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

							case (/^\/humans\/[0-9a-zA-Z_]*\/?$/).test(request.url):
								try {
									processes.retrieve("humans", {name: routes[2]}, {}, function (human) {
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
									response.end(processes.render("./robots/main.html", session, null));
								}
								catch (error) {_404();}
							break;

							case (/^\/robots\/[0-9a-zA-Z_]*\/?$/).test(request.url):
								try {
									processes.retrieve("robots", {id: routes[2]}, {}, function (robot) {
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

							case (/^\/arenas\/[0-9a-zA-Z_]*\/?$/).test(request.url):
								try {
									processes.retrieve("arenas", {id: routes[2].toLowerCase()}, {$multi: true}, function (arenas) {
										if (arenas) {
											response.end(processes.render("./arenas/individual.html", session, arenas[0]));
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
									response.end(processes.render("./tutorials/main.html", session, null));
								}
								catch (error) {_404();}
							break;

							case (/^\/tutorials\/[0-9a-zA-Z_]*\/?$/).test(request.url):
								try {
									var tutorial = fs.readFileSync("./assets/tutorials/" + (routes[2] || "errorBot") + ".json","utf8") || "{}";

									try {
										tutorial = JSON.parse(tutorial);
										response.end(processes.render("./tutorials/individual.html", session, tutorial));
									}
									catch (error) {
										var breakpoint = Number(error.message.substring((Number(error.message.indexOf("at position")) + 12), error.message.length).trim());
										//console.log("breakpoint: " + tutorial.substring(breakpoint - 20, breakpoint + 20));
										_404(processes.render("./assets/asciiBots/buildBot.html"));
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
										home.signup(session, post, function (data) {
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
										home.signin(session, post, function (data) {
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
										home.signout(session, function (data) {
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
									home.verify(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to verify email"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "send_reset":
								try {
									home.sendReset(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to send reset email"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "verify_reset":
								try {
									home.verifyReset(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to verify reset email"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "tour":
								try {
									post.url = request.url;
									tutorials.tour(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to continue tour"}}));
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
										settings.sendVerification(session, post, function (data) {
											response.end(JSON.stringify(data || {success: false, messages: {email: "//unable to send email"}}));
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
										settings.updateName(session, post, function (data) {
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
										settings.updatePassword(session, post, function (data) {
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
										settings.update(session, post, function (data) {
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
										humans.update(session, post, function (data) {
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
										humans.destroy(session, post, function (data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to delete human"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "add_favorite": 
							case "remove_favorite":
								try {
									if (session.human !== null) {
										humans.favorite(session, post, function (data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to update favorite"}}));
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
									robots.create(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to create robot"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "edit_robot":
								try {
									if (session.human !== null) {
										robots.update(session, post, function (data) {
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
										robots.destroy(session, post, function (data) {
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
										robots.load(session, post, function (data) {
											response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to retrieve robot"}}));
										});
									}
									else {
										_403("//not authorized");
									}
								}
								catch (error) {_403();}
							break;

							case "upload_robot":
								try {
									robots.upload(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to upload robot"}}));
									});
								}
								catch (error) {_403();}
							break;

						/* arenas */
							case "create_arena":
								try {
									if (session.human !== null) {
										arenas.create(session, post, function (data) {
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
										arenas.destroy(session, post, function (data) {
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
									arenas.joinin(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to join arena"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "random_arena":
								try {
									arenas.random(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to join random arena"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "leave_arena":
								try {
									arenas.leave(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to leave arena"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "select_robot":
								try {
									arenas.selectRobot(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to select robot"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "add_aibot":
								try {
									arenas.addaiBot(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to add aiBot"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "launch_arena":
								try {
									if (session.human !== null) {
										arenas.launch(session, post, function (data) {
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
									arenas.adjustRobot(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to save changes"}}));
									});
								}
								catch (error) {_403();}
							break;

							case "read_arena":
								try {
									arenas.read(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to read arena"}}));
									});
								}
								catch (error) {_403();}
							break;

						/* tutorials */
							case "complete_tutorial":
								try {
									tutorials.complete(session, post, function (data) {
										response.end(JSON.stringify(data || {success: false, messages: {top: "//unable to update tutorial completion"}}));
									});
								}
								catch (error) {_403();}
							break;

						/* data */
							case "locate":
								try {
									processes.locate(session, post, function (data) {
										response.end("{}");
									});
								}
								catch (error) {_403();}
							break;

							case "apicall":
								try {
									processes.apicall(session, post, function (data) {
										response.end(JSON.stringify(data));
									});
								}
								catch (error) {_403();}
							break;

						/* all others */
							default:
								if ((/^\/api/).test(request.url)) {
									try {
										processes.apicall(session, post, function (data) {
											response.end(JSON.stringify(data));
										});
									}
									catch (error) {_403();}
								}
								else {
									_403();
								}
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
					response.end(JSON.stringify({success: false, messages: {top: (data || "//invalid request")}}));
				}

				function _404(data) { //invalid get request
					response.writeHead(404, {"Content-Type": "text/html"});
					response.end(data || processes.render("./assets/asciiBots/errorBot.html"));
				}
			}
	}
