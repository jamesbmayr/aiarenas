/*** node modules ***/
	const crypto = require("crypto");
	const fs = require("fs");
	const mongo = require("mongodb").MongoClient;
	if (typeof process.env.MLABS_URL !== "undefined") {
		var database = "mongodb://" + process.env.MLABS_USERNAME + ":" + process.env.MLABS_PASSWORD + "@" + process.env.MLABS_URL;
	}
	else {
		var database = "mongodb://localhost:27017/aiarenas";
	}
	const nodemailer = require("nodemailer").createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL || "",
			pass: process.env.EMAIL_PASSWORD || ""
		}
	});

/*** files ***/
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
						console.log(error);
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

				case "ascii_logo":
					asset = "  aaaa      i   \n      a         \n  aaaaa    ii   \n a    a     i   \n  aaaa a  iiiii \n----------------\n[[[  arenas  ]]]\n----------------";
				break;

				case "bootstrap":
					asset = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css";
				break;

				case "jquery":
					asset = "https://code.jquery.com/jquery-1.7.2.min.js";
				break;

				case "google_fonts":
					asset = "https://fonts.googleapis.com/css?family=Droid+Sans+Mono|Nova+Mono|Roboto+Mono|Share+Tech+Mono|Ubuntu+Mono|VT323";
				break;
				
				case "color_schemes":
					asset = ["default", "inverted", "chroma", "old_school", "black_and_white", "electric", "underblue", "dreamhatcher"];
				break;

				case "fonts":
					asset = ["Droid Sans Mono","Nova Mono","Roboto Mono","Share Tech Mono","VT323","Ubuntu Mono","Monaco","Menlo","Courier","Courier New","monospace"];
				break;

				default:
					asset = null;
				break;
			}

			return asset;
		}

	/* sendEmail(sender, recipients, subject, message, callback) */
		function sendEmail(sender, recipients, subject, message, callback) {
			var message = message
				.replace(/class='redtext'/gi, "style='color: #F92672;'")
				.replace(/class='orangetext'/gi, "style='color: #FD971F;'")
				.replace(/class='yellowtext'/gi, "style='color: #FFE792;'")
				.replace(/class='greentext'/gi, "style='color: #A6E22E;'")
				.replace(/class='bluetext'/gi, "style='color: #66D9EF;'")
				.replace(/class='purpletext'/gi, "style='color: #AE81FF;'")
				.replace(/class='whitetext'/gi, "style='color: #F8F8F2;'")
				.replace(/class='graytext'/gi, "style='color: #75715E;'")
				.replace(/class='blacktext'/gi, "style='color: #272822;'")
				.replace(/class='transparenttext'/gi, "style='color: rgba(000,000,000,0);'")

			if (recipients.length > 0) {
				nodemailer.sendMail({
					from: sender || ' "adminBot" <adminBot@ai_arenas.com>',
					to: recipients || "",
					subject: subject || "ai_arenas correspondence",
					text: message || "hello world",
					html: ("<div style='background-color: #272822; padding: 16px; font-size: 32px; font-family: Courier, monospace; color: #F8F8F2;'><a style='font-size: 64px; color: 66D9EF; font-weight: bold; text-decoration: none' href='aiarenas.com'>ai_arenas</a>" + (message || "hello world") + "</div>"),
					}, function(error, info) {

					if (error) {
						console.log("unable to send email to " + (recipients || null) + ": " + error);
						callback({success: false, messages: {top: "//email not sent"}});
					}
					else {
						console.log("email sent to " + (recipients || null) + ": subject: " + (subject || null) + "; message: " + (message || null));
						callback({success: true, messages: {top: "//email sent"}});
					}
				});
			}
			else {
				callback({success: false, messages: {top: "//no email specified"}});
			}
		}

/*** generators ***/
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

			if ((/[a-zA-Z]/).test(set)) {
				while (!(/[a-zA-Z]/).test(output[0])) {
					output = (set[Math.floor(Math.random() * set.length)]) + output.substring(1);
				}
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

/*** checks ***/
	/* isEmail(string) */
		function isEmail(string) {
			return (/[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).test(string);
		}

	/* isReserved(string) */
		function isReserved(string) {
			var reservations = ["home","welcome","admin","test","feedback","help","preferences","settings",
				"signup","signin","signout","login","logout",
				"user","users","robot","robots","arena","arenas","human","humans",
				"game","games","statistic","statistics",
				"create","new","delete","read","start","go","all"];

			return (reservations.indexOf(string.toLowerCase().replace(/ /g,"")) > -1);
		}

	/* isNumLet(string) */
		function isNumLet(string) {
			return (/[a-z0-9A-Z]/).test(string);
		}

/*** page content ***/
	/* fonts(session) */
		function fonts(session) {
			if (session.human !== null) {
				var font = session.human.settings.font_scheme || "default";
			}
			else {
				var font = "default";
			}

			switch (font) {
				case "Ubuntu Mono":
					font = ":root { --font_scheme: 'Ubuntu Mono', monospace; }";
				break;

				case "Share Tech Mono":
					font = ":root { --font_scheme: 'Share Tech Mono', monospace; }";
				break;

				case "Roboto Mono":
					font = ":root { --font_scheme: 'Roboto Mono', monospace; }";
				break;

				case "Nova Mono":
					font = ":root { --font_scheme: 'Nova Mono', monospace; }";
				break;

				case "Droid Sans Mono":
					font = ":root { --font_scheme: 'Droid Sans Mono', monospace; }";
				break;

				case "VT323":
					font = ":root { --font_scheme: 'VT323', monospace; }";
				break;

				case "Menlo":
					font = ":root { --font_scheme: Menlo, monospace; }";
				break;

				case "Monaco":
					font = ":root { --font_scheme: Monaco, monospace; }";
				break;

				case "Courier New":
					font = ":root { --font_scheme: 'Courier New', monospace; }";
				break;

				case "monospace":
					font = ":root { --font_scheme: monospace; }";
				break;

				case "Courier":
				case "default":
				default: 
					font = ":root { --font_scheme: Courier, monospace; }";
				break;
			}

			return "<style id='font'>" + font + "</style>";

		}
	
	/* colors(session) */
		function colors(session) {
			if (session.human !== null) {
				var color_scheme = session.human.settings.color_scheme || "default";
			}
			else {
				var color_scheme = "default";
			}

			switch (color_scheme) {
				case "black_and_white":
					color_scheme = "\
						:root {\
							--red: #ffffff;\
							--orange: #ffffff;\
							--yellow: #aaaaaa;\
							--green: #ffffff;\
							--blue: #ffffff;\
							--purple: #ffffff;\
							--white: #ffffff;\
							--gray: #666666;\
							--black: #000000;\
							--transparent: rgba(000,000,000,0);\
						}";
				break;

				case "inverted":
					color_scheme = "\
						:root {\
							--green: #F92672;\
							--blue: #FD971F;\
							--purple: #ffcb13;\
							--red: #A6E22E;\
							--orange: #66D9EF;\
							--yellow: #AE81FF;\
							--black: #F8F8F2;\
							--gray: #75715E;\
							--white: #272822;\
							--transparent: rgba(000,000,000,0);\
						}";
				break;

				case "electric":
					color_scheme = "\
						:root {\
							--red: #ff0000;\
							--orange: #FFA500;\
							--yellow: #ffff00;\
							--green: #00ff00;\
							--blue: #0088ff;\
							--purple: #ff00ff;\
							--white: #ffffff;\
							--gray: #777777;\
							--black: #000000;\
							--transparent: rgba(000,000,000,0);\
						}";
				break;

				case "chroma":
					color_scheme = "\
						:root {\
							--red: #EC3D53;\
							--orange: #FF7200;\
							--yellow: #FFE000;\
							--green: #33BC06;\
							--blue: #0AAFF3;\
							--purple: #A551FF;\
							--white: #EAEFFE;\
							--gray: #90929B;\
							--black: #3C414F;\
							--transparent: rgba(000,000,000,0);\
						}";
				break;

				case "old_school":
					color_scheme = "\
						:root {\
							--red: #00ff00;\
							--orange: #00ff00;\
							--yellow: #00ff00;\
							--green: #00ff00;\
							--blue: #00ff00;\
							--purple: #00ff00;\
							--white: #00ff00;\
							--gray: #00ff00;\
							--black: #000000;\
							--transparent: rgba(000,000,000,0);\
						}";
				break;

				case "underblue":
					color_scheme = "\
						:root {\
							--red: #1F6EF6;\
							--orange: #1F6EF6;\
							--yellow: #436DB5;\
							--green: #1F6EF6;\
							--blue: #1F6EF6;\
							--purple: #1F6EF6;\
							--white: #DFEBFF;\
							--gray: #436DB5;\
							--black: #1C283D;\
							--transparent: rgba(000,000,000,0);\
						}";
				break;

				case "dreamhatcher":
					color_scheme = "\
						:root {\
							--red: #e06666;\
							--orange: #f6b26b;\
							--yellow: #ffd966;\
							--green: #93c47d;\
							--blue: #6d9eeb;\
							--purple: #8e7cc3;\
							--white: #f3f3f3;\
							--gray: #b7b7b7;\
							--black: #222222;\
							--transparent: rgba(000,000,000,0);\
						}";
				break;

				case "default":
				default:
					color_scheme = "\
						:root {\
							--red: #F92672;\
							--orange: #FD971F;\
							--yellow: #FFE792;\
							--green: #A6E22E;\
							--blue: #66D9EF;\
							--purple: #AE81FF;\
							--white: #F8F8F2;\
							--gray: #75715E;\
							--black: #272822;\
							--transparent: rgba(000,000,000,0);\
						}";
				break;
			}

			return "<style id='color_style'>" + color_scheme + "</style>";

		}

	/* navbar(session) */
		function navbar(session) {
			var navbar = "<noscript><style>\
					.container { display: none; }\
					#navbar { display: none; }\
					#navbar_open { display: none; }\
					#navbar_close { display: none; }\
				</style><div><pre>\
       _?_      \n\
 [xx] [O o]     \n\
  --  [  _]     \n\
   \\--JavaS--\\  \n\
      cript  -- \n\
      IsOff [xx]\n\
      -   -     \n\
     [x] [x]    \n\
					</pre></div></noscript>";

			navbar += "<form method='post' action='javascript:;' onsubmit='window.navbar_open();'><button id='navbar_open'><span class='glyphicon glyphicon-chevron-right'></span></button></form>\
				<form method='post' action='javascript:;' onsubmit='window.navbar_close();'><button id='navbar_close' style='display: none'><span class='glyphicon glyphicon-chevron-left'></span></button></form>";
			
			if (session.human === null) {
				navbar += "<div id='navbar'>\
					<div class='navbar_item'>\
						<a id='logo_block' href='../../../../'>\
							<pre>" + assets("ascii_logo") + "</pre>\
						</a>\
					</div>\
					<br>\
					<div class='navbar_item'>\
						<span class='graytext' id='navbar_message'></span>\
					</div>\
					<div id='navbar_human'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>human</span></div>\
						<div class='navbar_item'><a class='navbar_button' href='../../../../signin'><span class='whitetext'>.</span><span class='greentext'>signin</span><span class='whitetext'>();</span></a></div>\
						<div class='navbar_item'><a class='navbar_button' href='../../../../signup'><span class='whitetext'>.</span><span class='greentext'>signup</span><span class='whitetext'>();</span></a></div>\
					</div>\
					<br>\
					<div id='navbar_info'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>ai_arenas</span></div>\
						<div class='navbar_item'><a class='navbar_link' href='../../../../about'><span class='whitetext'>.</span><span class='bluetext'>about</span></a></div>\
						<div class='navbar_item'><a class='navbar_link' href='../../../../tutorials'><span class='whitetext'>.</span><span class='bluetext'>tutorials</span></a></div>\
						<div class='navbar_item'><a class='navbar_link' href='mailto:bugs@aiarenas.com?subject=ai_arenas bugs'><span class='whitetext'>.</span><span class='bluetext'>bugs?</span></a></div>\
					</div>\
				</div>";
			}
			else {
				var robots = "";
				for (var i = 0; i < session.human.robots.length; i++) {
					robots += "<div class='navbar_item'><a class='navbar_link' href='../../../../robots/" + session.human.robots[i].id + "'><span class='whitetext'>.</span><span class='bluetext'>" + session.human.robots[i].name + "</span></a></div>";
				}

				var arenas = "";
				for (var i = 0; i < session.human.arenas.length; i++) {
					arenas += "<div class='navbar_item'><a class='navbar_link' href='../../../../arenas/" + session.human.arenas[i].substring(0,4) + "'><span class='whitetext'>.</span><span class='bluetext'>" + String(session.human.arenas[i]).substring(0,4) + "</span></a></div>";
				}

				navbar += "<div id='navbar'>\
					<div class='navbar_item'>\
						<a id='logo_block' href='../../../../'>\
							<pre>" + assets("ascii_logo") + "</pre>\
						</a>\
					</div>\
					<br>\
					<div class='navbar_item'>\
						<span class='graytext' id='navbar_message'></span>\
					</div>\
					<div id='navbar_human'>\
						<div class='navbar_item'><span class='whitetext navbar_heading human_name'>" + session.human.name + "</span></div>\
						<div class='navbar_item'><a class='navbar_button' href='../../../../humans/'" + session.human.name + "><span class='whitetext'>.</span><span class='bluetext'>profile</span></a></div>\
						<div class='navbar_item'><a class='navbar_button' href='../../../../settings'><span class='whitetext'>.</span><span class='bluetext'>settings</span></a></div>\
						<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_signout();'><button class='navbar_button' id='navbar_signout'><span class='whitetext'>.</span><span class='greentext'>signout</span><span class='whitetext'>();</span></button></form></div>\
					</div>\
					<br>\
					<div id='navbar_robots'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>robots</span></div>\
						<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_create_robot();'><button class='navbar_button' id='navbar_create_robot'><span class='whitetext'>.</span><span class='greentext'>create</span><span class='whitetext'>();</span></button></form></div>\
						" + robots + "\
					</div>\
					<br>\
					<div id='navbar_arenas'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>arenas</span></div>\
						<div class='navbar_item'><a class='navbar_button' href='../../../../arenas/'><span class='whitetext'>.</span><span class='greentext'>create</span><span class='whitetext'>();</span></a></div>\
						<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_join_arena();'><button class='navbar_button' id='navbar_join_arena'><span class='whitetext'>.</span><span class='greentext'>join</span></button><span class='whitetext'>(</span><input type='text' class='navbar_input orangetext' name='navbar_arena_id' id='navbar_arena_id' placeholder='arena id'></input><span class='whitetext'>);</span></form></div>\
						" + arenas + "\
					</div>\
					<br>\
					<div id='navbar_info'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>ai_arenas</span></div>\
						<div class='navbar_item'><a class='navbar_link' href='../../../../about'><span class='whitetext'>.</span><span class='bluetext'>about</span></a></div>\
						<div class='navbar_item'><a class='navbar_link' href='../../../../tutorials'><span class='whitetext'>.</span><span class='bluetext'>tutorials</span></a></div>\
						<div class='navbar_item'><a class='navbar_link' href='mailto:bugBot@aiarenas.com?subject=ai_arenas bugs'><span class='whitetext'>.</span><span class='bluetext'>bugs?</span></a></div>\
					</div>\
				</div>";
			}

			return navbar;
		}

	/* ascii_robot(section) */
		function ascii_robot(section) {
			var options = [];

			switch(section) {
				case "color":
					options = ["var(--white)", "var(--red)", "var(--orange)", "var(--yellow)", "var(--green)", "var(--blue)", "var(--purple)", "var(--gray)"];
				break;

				case "antennae":
					options = [" _|_ "," _∆_ "," _M_ "," _I_ ","|||||", " iii ", "][ ]["," .:. ","∆___∆","_____"];
				break;

				case "eyes":
					options = ["|o o|","|x x|","/∆ ∆\\","|\\|/|","()-()","[]_[]","|: :|","[> <]","(---)","=^.^="];
				break;

				case "mouth":
					options = ["| = |","\\ - /"," \\-/ "," \\W/ ","{ + }","[ . ]"," ::: "," |_| ","\\_T_/"," ||| "];
				break;

				case "hand":
				case "left_hand":
				case "right_hand":
					options = ["{••}","[--]","|==|","(**)","<||>"," :: "," OO ","#--#","H++H","$--$"];
				break;

				case "wrist":
				case "left_wrist":
				case "right_wrist":
					options = [" II ","[[]]"," || "," ][ ","||||"," :: ","•::•"," oo "," <> "," () "];
				break;

				case "arm":
				case "left_arm":
				case "right_arm":
					options = ["--","==","::","••","||","II","HH","OO","><","88"];
				break;

				case "torso":
				case "torso_1":
				case "torso_2":
				case "torso_3":
					options = ["/HHH\\","IHHHI","[[-]]","MMMMM","/|||\\","-/|\\-","|||||","\\|||/","OOOOO","O-O-O",":::::"," ||| "," WWW ","V-V-V"," (O) "];
				break;

				case "legs":
					options = ["//---\\\\","/// \\\\\\",".Y. .Y."," /---\\ "," || || "," |---| ","::: :::"," : - : "," OO OO ","[-] [-]"];
				break;

				case "foot":
				case "left_foot":
				case "right_foot":
					options = ["{_}","_∆_","AVA","(O)","OOO","_|_","MMM","]^[","|||","[_]","\\+/","VVV","\\_/","^^^"];
				break;
			}

			return options;
		}

	/* ascii_character(character) */
		function ascii_character(character) {
			switch (character.toLowerCase()) {
				case "a":
					character = "    aaaaaa      \n   a​     ​ a     \n          ​ a    \n    aaaaaa​ a    \n   a​      aa    \n  a​       ​ a    \n   a​     ​ aa    \n    aaaaa​a aaa  ";
				break;

				case "b":
					character = "  bbb​           \n    b​           \n    b​ ​bbbbbb    \n    bb​     ​ b   \n    b​       ​ b  \n    b​       ​ b  \n    b​      ​ b   \n  bb​ bbbbbb​b    ";
				break;

				case "c":
					character = "     cccccc     \n   cc​      cc   \n  c​ ​         c  \n  c​             \n  c​             \n  c​ ​         c  \n   cc​      cc   \n     cccccc     ";
				break;

				case "d":
					character = "          ddd   \n           ​ d   \n    ddddddd​ ​​​​​d   \n   d​      ​ dd   \n  d​        ​ d   \n  d​        ​ d   \n   d​       dd   \n    ddddddd dd  ";
				break;

				case "e":
					character = "     eeeeee     \n   ee​      ee   \n  e​ ​       ​  e  \n  eeeeeeeeeee   \n  e​             \n  e​          e  \n   ee​       ee  \n     eeeeeee    ";
				break;

				case "f":
					character = "       fffff​f​   \n      f​     ​ ​f  \n      f​         \n  fffffffffff   \n      f​         \n      f​         \n      f​         \n   ffffffff     ";
				break;

				case "g":
					character = "    ggggggg​ gg  \n   g​      ​ gg   \n  g​        ​ g   \n  g​        ​ g   \n   g​      ​ gg   \n    ggggggg​ g   \n           ​ g   \n   ​ gggggggg    ";
				break;

				case "h":
					character = "  hh            \n   h            \n   h            \n   h hhhhhh​     \n   hh      hh   \n   h        h   \n   h        h   \n  hhh      hhh  ";
				break;

				case "i":
					character = "       ii       \n                \n    iiiii       \n       ii       \n       ii       \n       ii       \n       ii       \n  iiiiiiiiiiii  ";
				break;

				case "j":
					character = "          jj    \n                \n        jjjjjj  \n          jj    \n          jj    \n  jj      jj    \n   jj     jj    \n    jjjjjjj     ";
				break;

				case "k":
					character = "  kk            \n   k    kkk     \n   k   k        \n   k kkk        \n   kk​  ​ kk      \n   k​     ​ k     \n   k       k​    \n  kk      kkkk  ";
				break;	

				case "l":
					character = "   llll         \n     ​ll        ​ ​\n     ll        ​ ​\n     ll        ​ ​\n     ll        ​ ​\n     ll        ​ ​\n     ll        ​ ​\n  llllllllllll  ​";
				break;

				case "m":
					character = "  m mm​   ​ mm    \n   m​  m  m ​ m   \n   m   mm   m   \n   m   mm   m   \n   m   mm   m   \n   m   ​     m   \n   m   ​     m   \n  mm​m​      ​m​mm  ";
				break;

				case "n":
					character = "  nn nnnnn    ​  \n​   nn     nn   ​ \n​   n        n  ​ \n​   n        n  ​ \n​   n        n  ​ \n​   n   ​     n   \n​   n        n  ​ \n​  nnn      nnn  ​​";
				break;

				case "o":
					character = "     oooooo     \n​   oo      oo   \n​  oo        oo  \n​  o          o  \n​  o          o  \n​  oo        oo  \n​   oo      oo   \n​     oooooo     ​";
				break;

				case "p":
					character = "  pp ppppppp   ​ \n​   pp       p   ​\n​   p         p  ​\n​   pp       p   ​\n​   p ppppppp    ​\n​   p            ​\n​   p            ​\n​  ppp           ​​";
				break;

				case "q":
					character = "    qqqqqqq qq  \n​   q       qq   \n​  q         q   \n​   q       qq   \n​    qqqqqqq q   \n​            q   \n​            q   \n​           qqq  ​​";
				break;

				case "r":
					character = "  rr  rrrrrr    ​\n​   r r      rr  ​\n​   rr        r  ​\n​   r            ​\n​   r           ​ \n​   r           ​ \n​   r            ​\n​  rrrrr         ​​";
				break;

				case "s":
					character = "     sssssss    ​\n​   ss       ss  ​\n​  s          s  ​\n​   sssss        ​\n​        sssss   \n​  s          s  ​\n​  ss       ss   ​\n​    sssssss     ​​";
				break;

				case "t":
					character = "      t         ​\n​      t        ​ \n​  tttttttttttt  ​\n​      t         ​\n​      t         ​\n​      t         ​\n​      tt    tt  ​\n​       tttttt   ​";
				break;

				case "u":
					character = "  uu       uu   \n   u        u   \n   u        u   \n   u        u   \n   u        u   \n   u        u   \n   uu     uuu   \n    uuuuuuu uu  ​";
				break;

				case "v":
					character = "  vv        vv  \n​  vv        vv  \n​  vv        vv  \n​   vv      vv   \n​    vv    vv    \n​     vv  vv     \n​      vvvv      \n​       vv       ​​";
				break;

				case "w":
					character = "  www      www  ​\n​   w        w   ​\n​   w        w   ​\n​   w        w   ​\n​   w   ww   w   ​\n​    w w  w w    ​\n​    w w  w w    ​\n​     ww  ww     ​";
				break;

				case "x":
					character = "  xxxx    xxxx  \n  ​ ​xx      x​x​ ​  \n  ​ ​ xx    x​x  ​  ​\n  ​ ​  ​ ​xxx​x ​​    ​ ​\n​  ​ ​  ​ ​xxx​x​  ​​  ​  \n  ​ ​ xx    xx​    \n  ​ xx​      xx​   \n  xxxx    xxxx  ";
				break;

				case "y":
					character = "  yyyy    yyyy  \n​   yy      yy   \n​    yy    yy    \n​     yy  yy     \n​      yyyy      \n​       yy       \n​  yy  yy        \n​   yyyy         ​";
				break;

				case "z":
					character = "  zzzzzzzzzzzz  \n​  z         z   \n​          zz    \n​        zz      \n​      zz        \n​    zz          \n​   z         z  \n​  zzzzzzzzzzzz  ​";
				break;

				case "0":
					character = "     000000     \n​   00      00   \n​  00        00  \n​  0          0  \n​  0          0  \n​  00        00  \n​   00      00   \n​     000000     ​";
				break;

				case "1":
					character = "     1111       \n​    11 11       \n​   11  11       \n​       11       \n​       11       \n​       11       \n​       11       \n​  111111111111  ​";
				break;

				case "2":
					character = "     2222222    ​\n​   22       2   \n​   2       22   \n​         22     \n​       22       \n​     22         \n​   22        2  \n​  222222222222  ​";
				break;

				case "3":
					character = "    33333333    \n​  33        3   \n​           333  \n​        33333   \n​           333  \n​  3         33  \n​  33       33   \n​    33333333    ​​";
				break;

				case "4":
					character = "       4444     \n​      4  44     \n​     4   44     \n​    4    44     \n​   4     44     \n​  444444444444  \n​         44     \n​       444444  ​ ​";
				break;

				case "5":
					character = "  555555555555  \n​  5          5  \n​  5             \n​  5  555555     \n​   55      55   \n​             5  \n​  55        5   \n​    55555555    ​​";
				break;

				case "6":
					character = "    66666666    \n​  66        66  \n​  6             \n​  6 66666666    \n​  66        66  \n​  6          6  \n​  66        66  \n​    66666666    ​";
				break;

				case "7":
					character = "  777777777777  \n​  7         77  \n​           77   \n​         77     \n​       77       \n​      77        \n​     77         \n​    77          ​";
				break;

				case "8":
					character = "     888888     \n​    8      8    \n​   8        8   \n​    88888888    \n​   8        8   \n​  8          8  \n​   8        8   \n​    88888888    ";
				break;

				case "9":
					character = "    99999999    \n   9        9   \n  9          9  \n   9        99  \n    99999999 9  \n             9  \n            9   \n    99999999    ";
				break;
			}

			return character;
		}

/*** database ***/
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
							human: null
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
					db.collection(table).find(search).sort({created: -1}).toArray(function (error, result) {
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

/*** exports ***/
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
		ascii_robot: ascii_robot,
		ascii_character: ascii_character,
		sendEmail: sendEmail,
		colors: colors,
	};
