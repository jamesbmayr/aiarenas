/* node modules */
	const crypto = require("crypto");
	const fs = require("fs");
	const mongo = require("mongodb").MongoClient;
	if (typeof process.env.MLABS_URL !== "undefined") {
		var database = "mongodb://" + process.env.MLABS_USERNAME + ":" + process.env.MLABS_PASSWORD + "@" + process.env.MLABS_URL;
	}
	else {
		var database = "mongodb://localhost:27017/aiarena";
	}

/* render(file, data) */
	function render(file, session, data) {
		const html = {};
		html.original = fs.readFileSync(file).toString();
		html.array = html.original.split(/<%|%>/);
		
		for (html.count = 0; html.count < html.array.length; html.count++) {
			if (html.count % 2 === 1) {
				console.log("evaluating chunk " + html.count + "...");
				try {
					html.temp = eval(html.array[html.count]);
				}
				catch (error) {
					html.temp = "";
					console.log(error.name);
				}
				html.array[html.count] = html.temp;
			}
		}
		return html.array.join("");
	}

/* assets(query) */
	function assets(query) {
		var asset;

		switch (query) {
			case "logo":
				asset = "logo.png";
			break;

			case "bootstrap":
				asset = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css";
			break;

			case "jquery":
				asset = "https://code.jquery.com/jquery-1.7.2.min.js";
			break;

			case "Roboto":
				asset = "http://fonts.googleapis.com/css?family=Roboto:regular,bold;italic;bolditalic";
			break;

			case "Ubuntu":
				asset = "http://fonts.googleapis.com/css?family=Ubuntu:regular,bold;italic;bolditalic";
			break;
		}

		return asset;
	}

/* navbar(session) */
	function navbar(session) {
		var navbar = "<button id='navbar_open'><span class='glyphicon glyphicon-chevron-right'></span></button>\
			<button id='navbar_close' style='display: none'><span class='glyphicon glyphicon-chevron-left'></span></button>";
		
		if (session.user === null) {
			navbar += "<div id='navbar'>\
				<div class='navbar_item'>\
					<a id='logo_block' href='../../../../'><div id='logo_image' style='background-image:" + assets("logo") + "'><br>[logo]<br><br><br></div></a>\
				</div>\
				<div id='navbar_user'>\
					<div class='navbar_item'><span class='whitetext navbar_heading'>user</span></div>\
					<div class='navbar_item'><a class='navbar_button' href='../../../../signin'><span class='whitetext'>.</span><span class='greentext'>signin</span><span class='whitetext'>();</span></a></div>\
				</div>\
				<br>\
				<div id='navbar_info'>\
					<div class='navbar_item'><span class='whitetext navbar_heading'>ai_arena</span></div>\
					<div class='navbar_item'><a class='navbar_link' href='../../../../about'><span class='whitetext'>.</span><span class='bluetext'>about</span></a></div>\
					<div class='navbar_item'><a class='navbar_link' href='mailto:bugs@aiarena.com?subject=aiarena bugs'><span class='whitetext'>.</span><span class='bluetext'>bugs?</span></a></div>\
				</div>\
			</div>";
		}
		else {
			var robots = "";
			for (var i = 0; i < session.user.robots.length; i++) {
				robots += "<div class='navbar_item'><a class='navbar_link' href='../../../../robots/" + session.user.robots[i].id + "'><span class='whitetext'>.</span><span class='bluetext'>" + session.user.robots[i].name + "</span></a></div>";
			}

			var arenas = "";
			for (var i = 0; i < session.user.arenas.length; i++) {
				arenas += "<div class='navbar_item'><a class='navbar_link' href='../../../../arenas/" + session.user.arenas[i].id + "'><span class='whitetext'>.</span><span class='bluetext'>" + String(session.user.arenas[i].id).substring(0,3) + "</span></a></div>";
			}

			navbar += "<div id='navbar'>\
				<div class='navbar_item'><a id='logo_block' href='../../../../'><div id='logo_image'><br>[logo]<br><br><br></div></a></div>\
				<div id='navbar_user'>\
					<div class='navbar_item'><span class='whitetext navbar_heading'>" + session.user.name + "</span></div>\
					<div class='navbar_item'><a class='navbar_button' href='../../../../users/'" + session.user.name + "><span class='whitetext'>.</span><span class='bluetext'>profile</span></a></div>\
					<div class='navbar_item'><a class='navbar_button' href='../../../../settings'><span class='whitetext'>.</span><span class='bluetext'>settings</span></a></div>\
					<div class='navbar_item'><a class='navbar_button' href='../../../../signout'><span class='whitetext'>.</span><span class='greentext'>signout</span><span class='whitetext'>();</span></a></div>\
				</div>\
				<br>\
				<div id='navbar_robots'>\
					<div class='navbar_item'><span class='whitetext navbar_heading'>robots</span></div>\
					<div class='navbar_item'><a class='navbar_button' href='../../../../newrobot'><span class='whitetext'>.</span><span class='greentext'>new</span><span class='whitetext'>();</span></a></div>\
					" + robots + "\
				</div>\
				<br>\
				<div id='navbar_arenas'>\
					<div class='navbar_item'><span class='whitetext navbar_heading'>arenas</span></div>\
					<div class='navbar_item'><a class='navbar_button' href='../../../../newarena'><span class='whitetext'>.</span><span class='greentext'>new</span><span class='whitetext'>();</span></a></div>\
					<div class='navbar_item'><button id='join_arena' class='navbar_button'><span class='whitetext'>.</span><span class='greentext'>join</span></button><span class='whitetext'>(</span><input type='text' class='navbar_input orangetext' name='join_id' placeholder='arena id'></input><span class='whitetext'>);</span></div>\
					" + arenas + "\
				</div>\
				<br>\
				<div id='navbar_info'>\
					<div class='navbar_item'><span class='whitetext navbar_heading'>ai_arena</span></div>\
					<div class='navbar_item'><a class='navbar_link' href='../../../../about'><span class='whitetext'>.</span><span class='bluetext'>about</span></a></div>\
					<div class='navbar_item'><a class='navbar_link' href='mailto:bugs@aiarena.com?subject=aiarena bugs'><span class='whitetext'>.</span><span class='bluetext'>bugs?</span></a></div>\
				</div>\
			</div>";
		}

		return navbar;
	}

/* random(length, set) */
	function random(length, set) {
		if ((typeof set === "undefined") || (set === null)) {
			set = "0123456789abcdefghijklmnopqrstuvwxyz";
		}
		if ((typeof length === "undefined") || (length === null)) {
			length = 32;
		}

		var output = "";
		for (var i = 0; i < length; i++) {
			output += (set[Math.floor(Math.random() * set.length)]);
		}

		return output;
	}

/* hash(string, salt) */
	function hash(string, salt) {
		if ((typeof salt == "undefined") || (salt === null)) {
			salt = "";
		}
		return crypto.createHmac("sha512", salt).update(string).digest("hex");
	}

/* isEmail(string) */
	function isEmail(string) {
		return (/[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(string);
	}

/* isReserved(string) */
	function isReserved(string) {
		var reservations = ["home","welcome","admin","test","feedback","help","preferences","settings",
			"signup","signin","signout","login","logout",
			"user","users","robot","robots","arena","arenas",
			"game","games","statistic","statistics",
			"create","new","delete","read","start","go","all"];

		return (reservations.indexOf(string.toLowerCase().replace(/ /g,"")) > -1);
	}

/* isNumLet(string) */
	function isNumLet(string) {
		return (/[a-z0-9A-Z]/).test(string);
	}

/* session(request, response, id, callback) */
	function session(request, response, id, callback) {
		if ((typeof id === "undefined") || (id === null)) {
			id = random();

			retrieve("sessions", {id: id}, function(result) {
				if (result.length > 0) {
					session(request, response, null, callback);
				}
				else {
					var newSession = {
						id: id,
						"user-agent": request.headers["user-agent"],
						"accept-language": request.headers["accept-language"],
						created: new Date().getTime(),
						end: null,
						user: null
					}
					store("sessions", null, newSession, callback);
				}
			});
		}
		else {
			retrieve("sessions", {id: id}, function(result) {
				if (!(result.length > 0)) {
					session(request, response, null, callback);
				}
				else {
					callback(result);
				}
			});
		}
	}

/* store(table, search, data, callback) */
	function store(table, search, data, callback) {
		mongo.connect(database, function(error, db) {
			if (error) {
				console.log(error);
			}			
			else {			
				if ((search === null) && (data !== null)) { //create
					console.log("create in " + table + ":\n" + JSON.stringify(data));
					db.collection(table).insert(data, function (error, result) {
						if (error) {
							console.log(error);
						}
						else {
							callback(result.ops[0]);
						}
					});
				}
				else if ((search !== null) && (data !== null)) { //update
					console.log("update in " + table + " at " + JSON.stringify(search) + ":\n " + JSON.stringify(data));
					db.collection(table).update(search, data, function (error, result) {
						if (error) {
							console.log(error);
						}
						else {
							//callback(data);
							retrieve(table, search, callback);
						}
					});
				}
				else if ((search !== null) && (data === null)) { //delete
					console.log("delete in " + table + " at " + JSON.stringify(search));
					db.collection(table).remove(search, function (error, result) {
						if (error) {
							console.log(error);
						}
						else {
							//callback(result);
							retrieve(table, search, callback);
						}
					});
				}
			}
			db.close();
		});
	}

/* retrieve(table, search, callback) */
	function retrieve(table, search, callback) {
		mongo.connect(database, function(error, db) {
			if (error) {
				console.log(error);
			}
			else {	
				console.log("read in " + table + " at " + JSON.stringify(search));
				db.collection(table).find(search).toArray(function (error, result) {
					if (error) {
						console.log(error);
					}
					else {
						callback(result);
					}
				});
			}
			db.close();
		});
	}

/* exports */
	module.exports = {
		render: render,
		assets: assets,
		navbar: navbar,
		random: random,
		hash: hash,
		isEmail: isEmail,
		isReserved: isReserved,
		isNumLet: isNumLet,
		session: session,
		store: store,
		retrieve: retrieve,
	};
