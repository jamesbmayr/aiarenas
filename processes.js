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

/* render (file, data) */
	function render(file, data) {
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

/* random (length, set) */
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

/* hash (string, salt) */
	function hash(string, salt) {
		if ((typeof salt == "undefined") || (salt === null)) {
			salt = "";
		}
		return crypto.createHmac("sha512", salt).update(string).digest("hex");
	}

/* isEmail (string) */
	function isEmail(string) {
		return (/[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(string);
	}

/* isReserved (string) */
	function isReserved(string) {
		var reservations = ["home","welcome","admin","test","feedback","help",
			"signup","signin","signout","login","logout",
			"user","users","robot","robots","arena","arenas",
			"game","games","statistic","statistics",
			"create","new","delete","read","start","go","all"];

		return (reservations.indexOf(string.toLowerCase().replace(/ /g,"")) > -1);
	}

/* isNumLet (string) */
	function isNumLet(string) {
		return (/[a-z0-9A-Z]/).test(string);
	}

/* session (request, response, id, callback) */
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
						start: new Date().getTime(),
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

/* store (table, search, data, callback) */
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

/* retrieve (table, search, callback) */
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
		random: random,
		hash: hash,
		isEmail: isEmail,
		isReserved: isReserved,
		isNumLet: isNumLet,
		session: session,
		store: store,
		retrieve: retrieve
	};
