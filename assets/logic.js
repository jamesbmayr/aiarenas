/*** node modules ***/
	const crypto = require("crypto");
	const fs = require("fs");
	const vm = require("vm");
	const http = require("http");
	const mongo = require("mongodb").MongoClient;
	const database = "mongodb://" + environment("database_username") + ":" + environment("database_password") + environment("database_url");
	const nodemailer = require("nodemailer").createTransport({
		service: "gmail",
		auth: {
			user: environment("email_username"),
			pass: environment("email_password")
		}
	});

/*** environment(index) ***/
	function environment(index) {	
		if (typeof process.env.DOMAIN !== "undefined") {
			switch (index) {
				case "domain":
					return process.env.DOMAIN;
				break;
				case "email_username":
					return process.env.EMAIL_USERNAME;
				break;
				case "email_password":
					return process.env.EMAIL_PASSWORD;
				break;
				case "database_username":
					return process.env.DB_USERNAME;
				break;
				case "database_password":
					return process.env.DB_PASSWORD;
				break;
				case "database_url":
					return "@" + process.env.DB_URL;
				break;
			}
		}
		else {
			switch (index) {
				case "domain":
					return "localhost";
				break;
				case "email_username":
					return "";
				break;
				case "email_password":
					return "";
				break;
				case "database_username":
					return "localhost";
				break;
				case "database_password":
					return "";
				break;
				case "database_url":
					return "27017/aiarenas";
				break;
			}
		}
	}

/*** files ***/
	/* render(file, data) */
		function render(file, session, data) {
			const html = {};
			html.original = fs.readFileSync(file).toString();
			html.array = html.original.split(/<%|%>/);
			
			for (html.count = 0; html.count < html.array.length; html.count++) {
				if (html.count % 2 === 1) {
					try {
						html.temp = eval(html.array[html.count]);
					}
					catch (error) {
						html.temp = "";
						console.log("<% " + ((html.count + 1) / 2) + " %>\n" + error);
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
					asset = "https://fonts.googleapis.com/css?family=Droid+Sans+Mono|Nova+Mono|Roboto+Mono|Share+Tech+Mono|Ubuntu+Mono|VT323|Anonymous+Pro|Oxygen+Mono|Cutive+Mono|Fira+Mono|Inconsolata";
				break;
				
				case "color_schemes":
					asset = ["android","black_and_white","chroma","desaturated","dreamhatcher","electric","inverted","ios","metro","nasa","old_school","pastels","sublime","underblue","whitepaper","windows"];
				break;

				case "fonts":
					asset = ["Anonymous Pro","Courier","Courier New","Cutive Mono","Droid Sans Mono","Fira Mono","Inconsolata","Menlo","Monaco","monospace","Nova Mono","Oxygen Mono","Roboto Mono","Share Tech Mono","Ubuntu Mono","VT323"];
				break;

				case "aibots":
					asset = ["copy_Bot","collectorBot","focusBot","primaryBot","primesBot","randomBot","scrapsBot","take_Bot"];
				break;

				case "meta":
					asset = '<meta charset="UTF-8"/>\
						<meta name="description" content="AI Arenas is an online game where humans build Javascript robots that fight for cubes in challenging, fast-paced, competitive code battles."/>\
						<meta name="keywords" content="javascript,code,robots,game,arena,compete"/>\
						<meta name="author" content="James Mayr"/>\
						<meta property="og:title" content="AI Arenas: a competitive game for Javascript robots"/>\
						<meta property="og:url" content="https://jamesmayr.com/aiarenas"/>\
						<meta property="og:description" content="AI Arenas is an online game where humans build Javascript robots that fight for cubes in challenging, fast-paced, competitive code battles."/>\
						<meta property="og:image" content="https://jamesmayr.com/aiarenas/banner.png"/>';
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

			if (recipients.length === 0) {
				callback({success: false, messages: {top: "//no email specified"}});
			}
			else {
				nodemailer.sendMail({
					from: sender || ' "ai_arenas Bot" <aiarenasbot@gmail.com>',
					to: recipients || "",
					subject: subject || "ai_arenas correspondence",
					text: message || "hello world",
					html: ("<div style='background-color: #272822; padding: 16px; font-size: 16px; font-family: Courier, monospace; color: white; text-align: center'>\
						" + (message || "hello world") + "<br><br><br>\
<pre style='text-align: center; color: white; font-family: Courier, monospace; font-size: 16px; position: relative; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); line-height: 1.25;'>\
  __  _[@]_  __ \n\
 |\\/| |@ @| |\\/|\n\
  TT  \\ - /  TT \n\
   \\==EMAIL==/  \n\
      EMAIL     \n\
      EMAIL     \n\
      || ||     \n\
     [v] [v]    \n\
<a style='font-size: 32px; color: #66D9EF; font-weight: bold; text-decoration: none' href='https://" + environment("domain") + "'>ai_arenas.com</a>\
</pre>\
						</div>\
					")}, function(error, info) {

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
			var reservations = ["home","welcome","admin","test","feedback","help","preferences","settings","data","database",
				"signup","signin","signout","login","logout","verify","validate","verification","validation","verified","validated",
				"user","users","robot","robots","arena","arenas","human","humans","tutorial","tutorials",
				"game","games","statistic","statistics","guest","example","exampleBot",
				"create","new","delete","read","start","go","all"];

			return (reservations.indexOf(string.toLowerCase().replace(/ /g,"")) > -1);
		}

	/* isNumLet(string) */
		function isNumLet(string) {
			return (/^[a-z0-9A-Z_]+$/).test(string);
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

				case "Cutive Mono":
					font = ":root { --font_scheme: 'Cutive Mono', monospace; }";
				break;

				case "Fira Mono":
					font = ":root { --font_scheme: 'Fira Mono', monospace; }";
				break;

				case "Anonymous Pro":
					font = ":root { --font_scheme: 'Anonymous Pro', monospace; }";
				break;

				case "Inconsolata":
					font = ":root { --font_scheme: Inconsolata, monospace; }";
				break;

				case "Oxygen Mono":
					font = ":root { --font_scheme: 'Oxygen Mono', monospace; }";
				break;

				case "Courier":
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
							--code: #222222;\
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
							--yellow: #8B67CC;\
							--black: #F8F8F2;\
							--gray: #75715E;\
							--white: #272822;\
							--transparent: rgba(000,000,000,0);\
							--code: #888888;\
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
							--code: #112211;\
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
							--code: #222222;\
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
							--gray: #70727B;\
							--black: #3C414F;\
							--transparent: rgba(000,000,000,0);\
							--code: #222233;\
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
							--code: #112244;\
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
							--gray: #666666;\
							--black: #222222;\
							--transparent: rgba(000,000,000,0);\
							--code: #111111;\
						}";
				break;

				case "metro":
					color_scheme = "\
						:root {\
							--red: #ee352e;\
							--orange: #ff6319;\
							--yellow: #fccc0a;\
							--green: #00933c;\
							--blue: #0039a6;\
							--purple: #b933ad;\
							--white: #eeeeee;\
							--gray: #808183;\
							--black: #111111;\
							--transparent: rgba(000,000,000,0);\
							--code: #333333;\
						}";
				break;

				case "nasa":
					color_scheme = "\
						:root {\
							--red: rgb(255, 51, 53);\
							--orange: rgb(255, 51, 53);\
							--yellow: rgb(121, 121, 124);\
							--green: rgb(21, 71, 190);\
							--blue: rgb(21, 71, 190);\
							--purple: rgb(255, 51, 53);\
							--white: rgb(255, 255, 255);\
							--gray: rgb(121, 121, 124);\
							--black: rgb(0,0,0);\
							--transparent: rgba(000,000,000,0);\
							--code: rgb(60,60,62);\
						}";
				break;

				case "ios":
					color_scheme = "\
						:root {\
							--red: rgb(255, 59, 48);\
							--orange: rgb(255, 149, 0);\
							--yellow: rgb(255, 204, 0);\
							--green: rgb(76, 217, 100);\
							--blue: rgb(0, 122, 255);\
							--purple: rgb(88, 86, 214);\
							--white: rgb(255, 255, 255);\
							--gray: rgb(77, 77, 77);\
							--black: rgb(20, 20, 20);\
							--transparent: rgba(000,000,000,0);\
							--code: rgb(25, 30, 35);\
						}";
				break;

				case "android":
					color_scheme = "\
						:root {\
							--red: #f44336;\
							--orange: #ff5722;\
							--yellow: #ffeb3b;\
							--green: #4caf50;\
							--blue: #2196f3;\
							--purple: #673ab7;\
							--white: #ffffff;\
							--gray: #4d4d4d;\
							--black: #111111;\
							--transparent: rgba(000,000,000,0);\
							--code: #232e33;\
						}";
				break;

				case "windows":
					color_scheme = "\
						:root {\
							--red: #C50F1F;\
							--orange: #CA5010;\
							--yellow: #EAA300;\
							--green: #13A10E;\
							--blue: #0063B1;\
							--purple: #5A4EBC;\
							--white: #E6E6E6;\
							--gray: #767676;\
							--black: #2B2B2B;\
							--transparent: rgba(000,000,000,0);\
							--code: #1F1F1F;\
						}";
				break;

				case "pastels":
					color_scheme = "\
						:root {\
							--red: #ed7777;\
							--orange: #eab46b;\
							--yellow: #e5e99d;\
							--green: #bcef8a;\
							--blue: #94c0ff;\
							--purple: #b48dc9;\
							--white: #f6f4f1;\
							--gray: #778899;\
							--black: #23282d;\
							--transparent: rgba(000,000,000,0);\
							--code: #171b1e;\
						}";
				break;

				case "whitepaper":
					color_scheme = "\
						:root {\
							--red: #222222;\
							--orange: #222222;\
							--yellow: #888888;\
							--green: #222222;\
							--blue: #222222;\
							--purple: #222222;\
							--white: #222222;\
							--gray: #aaaaaa;\
							--black: #f3f3f3;\
							--transparent: rgba(000,000,000,0);\
							--code: #555555;\
						}";
				break;

				case "desaturated":
					color_scheme = "\
						:root {\
							--red: #c88691;\
							--orange: #e49969;\
							--yellow: #c9c27f;\
							--green: #74a18e;\
							--blue: #618fd5;\
							--purple: #ad85ba;\
							--white: #d6d6d6;\
							--gray: #949494;\
							--black: #444444;\
							--transparent: rgba(000,000,000,0);\
							--code: #222222;\
						}";
				break;

				case "sublime":
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
							--code: #111111;\
						}";
				break;
			}

			return "<style id='color_style'>" + color_scheme + "</style>";

		}

	/* tour(url) */
		function tour(url) {
			switch (true) {
				case (/^\/$/).test(url): //home main
					var tour = [
						{
							action: "$('#navbar_close').hide(); $('#navbar_open').show().css('left','0px'); $('#navbar').css('left','calc(var(--font_size) * -256px)');",
							selector: "#navbar_open",
							message: "<br>Explore the website using the navigation panel."
						},
						{
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','calc(var(--font_size) * 256px)'); $('#navbar').css('left','0px');",
							selector: "a[href='../../../../']:not(#navbar_logo)",
							message: "Return to this home page at any time."
						},
						{
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','calc(var(--font_size) * 256px)'); $('#navbar').css('left','0px');",
							selector: "a[href='../../../../about']",
							message: "Learn more about ai_arenas: gameplay, development, and how it works."
						},
						{
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','calc(var(--font_size) * 256px)'); $('#navbar').css('left','0px');",
							selector: "a[href='../../../../tutorials']",
							message: "Learn how to code Javascript robots in tutorials."
						},
						{
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','calc(var(--font_size) * 256px)'); $('#navbar').css('left','0px');",
							selector: "a[href='../../../../robots']",
							message: "Create and test your own robots in the coding workshop."
						},
						{
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','calc(var(--font_size) * 256px)'); $('#navbar').css('left','0px');",
							selector: "#navbar_join_arena",
							message: "Enter an arena id to join one created by another human."
						},
						{
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','calc(var(--font_size) * 256px)'); $('#navbar').css('left','0px');",
							selector: "#navbar_random_arena",
							message: "Find an arena with random opponent robots."
						},
						{
							action: "$('#navbar_open').hide(); $('#navbar_close').show().css('left','calc(var(--font_size) * 256px)'); $('#navbar').css('left','0px');",
							selector: "#navbar_favorites",
							message: "See favorite humans and robots here."
						},
						{
							action: "$('#navbar_close').hide(); $('#navbar_open').show().css('left','0px');",
							selector: "#navbar_create_arena",
							message: "Create a custom arena for human acquaintances."
						},
						{
							action: "$('#navbar_close').hide(); $('#navbar_open').show().css('left','0px'); $('#navbar').css('left','calc(var(--font_size) * -256px)');",
							selector: "#statistics .bracketer_top span",
							message: "See statistics calculated from random arenas (not custom or private ones)."
						},
						{
							action: "$('#navbar_close').hide(); $('#navbar_open').show().css('left','0px'); $('#navbar').css('left','calc(var(--font_size) * -256px)'); $('#humans').parent().show(); $('#humans').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#human_wins .statistic",
							message: "See the humans and robots with the most wins."
						},
						{
							action: "$('#navbar_close').hide(); $('#navbar_open').show().css('left','0px'); $('#navbar').css('left','calc(var(--font_size) * -256px)'); $('#humans').parent().show(); $('#humans').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#robot_ratios .statistic",
							message: "See the humans and robots with the best win/loss ratios."
						}
					];
				break;

				case (/^\/humans\/[0-9a-zA-Z]*\/?$/).test(url): //humans individual
					var tour = [
						{
							action: "",
							selector: "#human_edit",
							message: "Edit your human profile."
						},
						{
							action: "",
							selector: "#settings",
							message: "Adjust aesthetic and security settings."
						},
						{
							action: "",
							selector: "#sites",
							message: "Add personal websites or link to social media profiles."
						},
						{
							action: "",
							selector: "#bio",
							message: "Add a short description for other humans."
						},
						{
							action: "",
							selector: "#human_create_robot",
							message: "Edit and create robots to compete in arenas."
						}
					];
				break;

				case (/^\/robots\/?$/).test(url): //robots main
					var tour = [
						{
							action: "",
							selector: "#load_robot",
							message: "Load (or upload) an existing robot or create a new one."
						},
						{
							action: "$('#load_robot').click();",
							selector: "button#load_robot",
							message: "Load a different robot at any time."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); }",
							selector: "#workshop_download",
							message: "Download this robot as a JSON file. When signed in, you can save robots online."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); }",
							selector: "#inputs",
							message: "Add inputs to give the robot data. Learn about inputs using the details dropdown."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); }",
							selector: "#code",
							message: "Code a Javascript function that outputs an action, like \"power\" or \"take\"."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); }",
							selector: "#eval_code",
							message: "Evaluate the robot code to watch the logic unfold and see the outcome."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#robots').parent().show(); $('#robots').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: ".self",
							message: "Change the robot state - power, cubes, etc. - to see how it would act."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#robots').parent().show(); $('#robots').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#add_opponent",
							message: "Add opponent robots with adjustable states to see how your robot would act."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#cubes').parent().show(); $('#cubes').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#add_cube",
							message: "Add cubes to the arena to see what action your robot would take."
						},
						{
							action: "if ($('.container').attr('value') === '') { $('#load_robot').click(); } $('#rules').parent().show(); $('#rules').parent().prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#players_maximum",
							message: "Adjust the rules to see how the robot would perform in different arenas."
						}
					];
				break;

				case (/^\/robots\/[0-9a-zA-Z]*\/?$/).test(url): //robots individual
					var tour = [
						{
							action: "",
							selector: "#robot_edit",
							message: "Edit the information and code for your robots."
						},
						{
							action: "",
							selector: "span#bio",
							message: "Add a short description for your robots."
						},
						{
							action: "",
							selector: "#avatar_mouth",
							message: "Customize the appearance of your robots by selecting the components and color."
						},
						{
							action: "",
							selector: "span#inputs",
							message: "Add inputs to give the robot data. Learn about inputs using the details dropdown."
						},
						{
							action: "",
							selector: "span#code",
							message: "Code a Javascript function that outputs an action, like \"power\" or \"take\"."
						}
					];
				break;

				case (/^\/arenas\/?$/).test(url): //arenas main
					var tour = [
						{
							action: "",
							selector: "#join_arena",
							message: "Enter an arena id to join a specific arena (created by another human)."
						},
						{
							action: "",
							selector: "#random_arena",
							message: "Find an arena with random opponent robots."
						},
						{
							action: "",
							selector: "#create_arena",
							message: "Create an arena for fellow humans using an arena preset."
						},
						{
							action: "$('#cubes').hide(); $('#robots').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#players').show(); $('#players').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#players_minimum",
							message: "Customize a new arena by changing the rules."
						},
						{
							action: "$('#cubes').hide(); $('#robots').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#players').show(); $('#players').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#players_workshopDuration",
							message: "Set how long the coding workshop lasts and how frequently it happens."
						},
						{
							action: "$('#players').hide(); $('#robots').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#cubes').show(); $('#cubes').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#cubes_colors",
							message: "Set which cube colors will appear in this arena."
						},
						{
							action: "$('#players').hide(); $('#robots').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#cubes').show(); $('#cubes').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#cubes_spawnMemory",
							message: "Adjust how often a color will appear; set the number of rounds to remember."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#robots').show(); $('#robots').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#robots_powerRate",
							message: "Set how much power a robot will get when powering."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#robots').show(); $('#robots').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#robots_actions",
							message: "Set which actions are legal outputs; all others will become \"sleep\"."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#victory').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#robots').show(); $('#robots').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#robots_tieBreaker",
							message: "Set what happens to the cubes when 2 robots \"take\" with the same power."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#robots').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#victory').show(); $('#victory').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#victory_conditions",
							message: "Set how robots can win by adjusting the victory conditions."
						},
						{
							action: "$('#players').hide(); $('#cubes').hide(); $('#robots').hide(); $('.section-toggle-down').removeClass('section-toggle-down').addClass('section-toggle-up').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up'); $('#victory').show(); $('#victory').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#victory_multiplier",
							message: "Set a multiplier to make a longer arena. Ex: With \"2\", \"6of1\" becomes \"12of1\"."
						}
					];
				break;

				case (/^\/arenas\/[0-9a-zA-Z]*\/?$/).test(url): //arenas individual
					var tour = [
						{
							action: "",
							selector: "button#join_arena",
							message: "Join the arena to participate."
						},
						{
							action: "",
							selector: "button#select_robot",
							message: "Select or upload a robot to compete in this arena."
						},
						{
							action: "",
							selector: "#victors",
							message: "See which human(s) and robot(s) were victorious in this arena."
						},
						{
							action: "",
							selector: ".player",
							message: "Other humans with robots in this arena will appear here."
						},
						{
							action: "",
							selector: "div#workshop",
							message: "Edit your robot when the workshop activates; changes are only set for this arena."
						},
						{
							action: "",
							selector: "div.self",
							message: "All robots - power, cubes, etc. - can be seen here."
						},
						{
							action: "",
							selector: ".cube_outer",
							message: "All cubes currently available in this arena are displayed here."
						},
						{
							action: "$('#rules').show(); $('#rules').prev().prev().removeClass('section-toggle-up').addClass('section-toggle-down').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');",
							selector: "#rules_cubes",
							message: "See the rules set for this arena."
						}
					];
				break;

				case (/^\/settings\/?$/).test(url): //settings main
					var tour = [
						{
							action: "",
							selector: "#font_scheme",
							message: "Select a monospace font for all text on ai_arenas."
						},
						{
							action: "",
							selector: "#color_scheme",
							message: "Select a color palette; note that some do not have all 10 distinct colors."
						},
						{
							action: "",
							selector: "#show_email",
							message: "Set whether your email address is shown or hidden on your human profile."
						},
						{
							action: "",
							selector: "#change_name",
							message: "Change your human name at any time."
						},
						{
							action: "",
							selector: "#send_verification",
							message: "Change your email address; you will receive a verification message."
						},
						{
							action: "",
							selector: "#change_password",
							message: "Change your password."
						},
						{
							action: "",
							selector: "#sessions",
							message: "See all devices where you are signed in (and sign out of anything suspicious)."
						}
					];
				break;

				case (/^\/tutorials\/?$/).test(url): //tutorials main
					var tour = [
						{
							action: "",
							selector: "a[href='../../../../tutorials/takeBot']",
							message: "Launch a tutorial to learn how to code Javascript robots."
						},
						{
							action: "",
							selector: "#exit",
							message: "Return to the home screen at any time."
						}
					];
				break;

				default:
					var tour = [];
			}

			return tour;
		}

	/* navbar(session) */
		function navbar(session, url) {
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
\n\
please enable JavaScript to continue\
</pre></div></noscript>";

			/*if (typeof session.activity[session.activity.length - 1]["ip-address"] !== "undefined") {
				navbar += "<script>\
					$(document).ready(function() {\
						$.getJSON('//freegeoip.net/json/?callback=?', function(data) {\
							$.ajax({\
								type: 'POST',\
								url: window.location.pathname,\
								data: {\
									action: 'locate',\
									data: JSON.stringify(data)\
								}\
							});\
						});\
					});\
				</script>";
			}*/

			if (session.human === null) {
				//tour
					var tourStops = tour(url).filter(function(x) {
						return session.tour.indexOf(x.selector) === -1;
					});

					if ((session.show_help === "true") && (tourStops.length > 0)) {
						navbar += "<script>$(document).ready(function() {window.continueTour();});</script>";
					}

				//splash screen
					if (session.created > new Date().getTime() - 1000) {
						navbar += '<div id="splash_screen">\
<pre id="splashBot" class="avatar_pre ' + ["red","orange","yellow","green","blue","purple"][Math.floor(Math.random() * 6)] + 'text" monospace>\
<span class="transparenttext leftDot">•</span><span class="transparenttext">•••••</span><span class="avatar avatar_antennae" value=" _H_ "> _H_ </span><span class="transparenttext">•••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand" value="(--)">(--)</span><span class="transparenttext">•</span><span class="avatar avatar_eyes" value="/o o\\">/o o\\</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand transparenttext" value="(--)">(--)</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist" value=" () "> () </span><span class="transparenttext">•</span><span class="avatar avatar_mouth" value="\\ - /">\\ - /</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist transparenttext" value=" () "> () </span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••</span><span class="avatar avatar_left_shoulder_up">\\</span><span class="avatar avatar_left_shoulder_down" style="display: none">/</span><span class="avatar avatar_left_arm" value="--">--</span><span class="avatar avatar_torso_1" value="HELLO">HELLO</span><span class="avatar avatar_right_arm" value="--">--</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_right_shoulder_down">\\</span><span class="transparenttext">••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist transparenttext" value=" () "> () </span><span class="transparenttext">•</span><span class="avatar avatar_torso_2" value="HELLO">HELLO</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist" value=" () "> () </span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand transparenttext" value="(--)">(--)</span><span class="transparenttext">•</span><span class="avatar avatar_torso_3" value="HELLO">HELLO</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand" value="(--)">(--)</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_leg" value=" []"> []</span><span class="transparenttext">•</span><span class="avatar avatar_right_leg" value="[] ">[] </span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="/_]">/_]</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="[_\\">[_\\</span><span class="transparenttext">••••</span>\n\
\n <span class="whitetext message">initializing...</span>\
</pre>\
							<script>$(document).ready(function() { window.splashScreen(); });</script>\
						</div>';
					}

				if (url !== "/") {
					navbar += "<form method='post' action='javascript:;' onsubmit='window.navbar_open();'><button id='navbar_open'><span class='glyphicon glyphicon-chevron-right'></span></button></form>\
					<form method='post' action='javascript:;' onsubmit='window.navbar_close();'><button id='navbar_close' style='display: none'><span class='glyphicon glyphicon-chevron-left'></span></button></form>";
					
					navbar += "<div id='navbar'>\
						<a id='navbar_logo' href='../../../../'>\
							<div class='super_header'>ai</div>\
							<div class='header'>arenas</div>\
						</a>\
						<br>\
						<div id='navbar_info'>\
							<div class='navbar_item'><span class='whitetext navbar_heading'>ai_arenas</span></div>\
							<div class='navbar_item'><a class='navbar_link' href='../../../../'><span class='whitetext'>.</span><span class='bluetext'>home</span></a></div>\
							<div class='navbar_item'><a class='navbar_link' href='../../../../about'><span class='whitetext'>.</span><span class='bluetext'>about</span></a></div>\
							<div class='navbar_item'><a class='navbar_link' href='../../../../tutorials'><span class='whitetext'>.</span><span class='bluetext'>tutorials</span></a></div>\
						</div>\
						<br>\
						<div id='navbar_humans'>\
							<div class='navbar_item'><span class='whitetext navbar_heading'>humans</span></div>\
							<div class='navbar_item'><a class='navbar_button' href='../../../../signin'><span class='whitetext'>.</span><span class='greentext'>signin</span><span class='whitetext'>()</span></a></div>\
							<div class='navbar_item'><a class='navbar_button' href='../../../../signup'><span class='whitetext'>.</span><span class='greentext'>signup</span><span class='whitetext'>()</span></a></div>\
						</div>\
						<br>\
						<div id='navbar_robots'>\
							<div class='navbar_item'><span class='whitetext navbar_heading'>robots</span></div>\
							<div class='navbar_item'><a class='navbar_button' href='../../../../robots'><span class='whitetext'>.</span><span class='greentext'>workshop</span><span class='whitetext'>()</span></a></div>\
						</div>\
						<br>\
						<div id='navbar_arenas'>\
							<div class='navbar_item'><span class='whitetext navbar_heading'>arenas</span></div>\
							<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_join_arena();'><button class='navbar_button' id='navbar_join_arena'><span class='whitetext'>.</span><span class='greentext'>join</span></button><span class='whitetext'>(</span><input type='text' class='navbar_input orangetext' name='navbar_arena_id' id='navbar_arena_id' placeholder='arena id'></input><span class='whitetext'>)</span></form></div>\
							<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_random_arena();'><button class='navbar_button' id='navbar_random_arena'><span class='whitetext'>.</span><span class='greentext'>find</span></button><span class='whitetext'>(</span><span class='select_outer orangetext'><select id='navbar_arena_random_presets' class='orangetext'><option value='default'>default</option></select></span><span class='whitetext'>)</span></form></div>\
						</div>\
					</div>";
				}
			}
			else {
				//tour
					var tourStops = tour(url).filter(function(x) {
						return session.human.tour.indexOf(x.selector) === -1;
					});

					if ((session.human.settings.show_help === "true") && (tourStops.length > 0)) {
						navbar += "<script>$(document).ready(function() {window.continueTour();});</script>";
					}

				//robot list
					var robots = "";
					for (var i = 0; i < session.human.robots.length; i++) {
						robots += "<div class='navbar_item'><a class='navbar_link' href='../../../../robots/" + session.human.robots[i].id + "'><span class='whitetext'>.</span><span class='bluetext'>" + session.human.robots[i].name + "</span></a></div>";
					}

				//arena list
					var arenas = "";
					for (var i = 0; i < session.human.arenas.length; i++) {
						arenas += "<div class='navbar_item'><a class='navbar_link' href='../../../../arenas/" + session.human.arenas[i] + "'><span class='whitetext'>.</span><span class='bluetext'>" + String(session.human.arenas[i]) + "</span></a></div>";
					}

				//preset select
					var options = "";
					if ((session.human.email !== null) && (((session.human.statistics.wins * 5) + session.human.statistics.losses) >= 50)) {
						var presets = ["default", "simple", "deathmatch", "advanced", "intense", "scarcity", "random"];
					}
					else if ((session.human.email !== null) && (((session.human.statistics.wins * 5) + session.human.statistics.losses) >= 25)) {
						var presets = ["default", "simple", "deathmatch", "advanced"]
					}
					else {
						var presets = ["default"];
					}
					for (var i = 0; i < presets.length; i++) {
						options += "<option value='" + presets[i] + "'>" + presets[i] + "</option>";
					}

				//favorite_humans list
					var favorite_humans = "";
					var keys = Object.keys(session.human.favorites.humans);
					for (var i = 0; i < keys.length; i++) {
						favorite_humans += "<div class='navbar_item'><a class='navbar_link' href='../../../../humans/" + session.human.favorites.humans[keys[i]] + "'><span class='whitetext'>.</span><span class='bluetext'>" + session.human.favorites.humans[keys[i]] + "</span></a></div>";
					}

				//favorite_robots list
					var favorite_robots = "";
					var keys = Object.keys(session.human.favorites.robots);
					for (var i = 0; i < keys.length; i++) {
						favorite_robots += "<div class='navbar_item'><a class='navbar_link' href='../../../../robots/" + keys[i] + "'><span class='whitetext'>.</span><span class='bluetext'>" + session.human.favorites.robots[keys[i]] + "</span></a></div>";
					}

				navbar += "<form method='post' action='javascript:;' onsubmit='window.navbar_open();'><button id='navbar_open'><span class='glyphicon glyphicon-chevron-right'></span></button></form>\
				<form method='post' action='javascript:;' onsubmit='window.navbar_close();'><button id='navbar_close' style='display: none'><span class='glyphicon glyphicon-chevron-left'></span></button></form>";

				navbar += "<div id='navbar'>\
					<a id='navbar_logo' href='../../../../'>\
						<div class='super_header'>ai</div>\
						<div class='header'>arenas</div>\
					</a>\
					<br>\
					<div id='navbar_info'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>ai_arenas</span></div>\
						<div class='navbar_item'><a class='navbar_link' href='../../../../'><span class='whitetext'>.</span><span class='bluetext'>home</span></a></div>\
						<div class='navbar_item'><a class='navbar_link' href='../../../../about'><span class='whitetext'>.</span><span class='bluetext'>about</span></a></div>\
						<div class='navbar_item'><a class='navbar_link' href='../../../../tutorials'><span class='whitetext'>.</span><span class='bluetext'>tutorials</span></a></div>\
					</div>\
					<br>\
					<div id='navbar_humans'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>humans</span></div>\
						<div class='navbar_item'><a class='navbar_button human_name' href='../../../../humans/'" + session.human.name + "><span class='whitetext'>.</span><span class='bluetext'>" + session.human.name + "</span></a></div>\
						<div class='navbar_item'><a class='navbar_button' href='../../../../settings'><span class='whitetext'>.</span><span class='greentext'>settings</span><span class='whitetext'>()</span></a></div>\
						<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_signout();'><button class='navbar_button' id='navbar_signout'><span class='whitetext'>.</span><span class='greentext'>signout</span><span class='whitetext'>()</span></button></form></div>\
					</div>\
					<br>\
					<div id='navbar_robots'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>robots</span></div>\
						<div class='navbar_item'><a class='navbar_button' href='../../../../robots'><span class='whitetext'>.</span><span class='greentext'>workshop</span><span class='whitetext'>()</span></a></div>\
						<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_create_robot();'><button class='navbar_button' id='navbar_create_robot'><span class='whitetext'>.</span><span class='greentext'>create</span></button><span class='whitetext'>(<span class='select_outer orangetext'><select id='navbar_robot_create_selection' class='orangetext'><option value='new'>new</option><option value='upload'>upload</option></select></span>)</span></form></div>\
						<input type='file' name='navbar_file_chooser' id='navbar_file_chooser'/>\
						<div class='robot_list'>" + robots + "</div>\
					</div>\
					<br>\
					<div id='navbar_arenas'>\
						<div class='navbar_item'><span class='whitetext navbar_heading'>arenas</span></div>\
						<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_join_arena();'><button class='navbar_button' id='navbar_join_arena'><span class='whitetext'>.</span><span class='greentext'>join</span></button><span class='whitetext'>(</span><input type='text' class='navbar_input orangetext' name='navbar_arena_id' id='navbar_arena_id' placeholder='arena id'></input><span class='whitetext'>)</span></form></div>\
						<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_random_arena();'><button class='navbar_button' id='navbar_random_arena'><span class='whitetext'>.</span><span class='greentext'>find</span></button><span class='whitetext'>(</span><span class='select_outer orangetext'><select id='navbar_arena_random_presets' class='orangetext'>" + options + "</select></span><span class='whitetext'>)</span></form></div>\
						<div class='navbar_item'><form method='post' action='javascript:;' onsubmit='window.navbar_create_arena();'><button class='navbar_button' id='navbar_create_arena'><span class='whitetext'>.</span><span class='greentext'>create</span></button><span class='whitetext'>(</span><span class='select_outer orangetext'><select id='navbar_arena_create_presets' class='orangetext'><option value='custom'>custom</option>" + options + "</select></span><span class='whitetext'>)</span></form></div>\
						<div class='arena_list'>" + arenas + "</div>\
					</div>\
					<br>\
					<div id='navbar_favorites'\
						<div class='navbar_item'><span class='whitetext navbar_heading'>favorites</span></div>\
						<div class='favorite_humans_list'>" + favorite_humans + "</div>\
						<div class='favorite_robots_list'>" + favorite_robots + "</div>\
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
					options = [" _I_ "," _A_ "," _M_ "," _|_ ","|||||", " iii ", "][ ]["," .:. ","A___A","_____","/\\ /\\","_[+]_"," !!! "," /?\\ ","_[@]_"," _*_ "];
				break;

				case "eyes":
					options = ["|o o|","|x x|","/A A\\","|\\|/|","()-()","[]_[]","|: :|","[> <]","(---)","=^.^=","(V V)","|@ @|","/o o\\","(^ ^)","|v v|","{• •}"];
				break;

				case "mouth":
					options = ["| = |","\\ - /"," \\-/ "," \\W/ ","{ + }","[ . ]"," ::: "," |_| ","\\_T_/"," ||| ","|[-]|","\\ 0 /","\\ = /","((o))","/ - \\","vvvvv"];
				break;

				case "hand":
				case "left_hand":
				case "right_hand":
					options = ["{••}","[--]","|==|","(**)","<||>"," :: "," OO ","#--#","H++H","$--$","[++]"," HH ","O--O"," <> "," ## "," ][ "];
				break;

				case "wrist":
				case "left_wrist":
				case "right_wrist":
					options = [" II ","[[]]"," || "," ][ ","||||"," :: ","•::•"," oo "," <> "," () "," ** ",":**:"," >< "," -- ","-||-"," HH "];
				break;

				case "arm":
				case "left_arm":
				case "right_arm":
					options = ["--","==","::","••","||","II","HH","OO","><","88","~~","++","][","vv","XX","}{"];
				break;

				case "torso":
				case "torso_1":
				case "torso_2":
				case "torso_3":
					options = ["[[-]]","/HHH\\","IHHHI","MMMMM","/|||\\","-/|\\-","|||||","\\|||/","OOOOO","O-O-O",":::::"," ||| ","\\___/","V-V-V"," (O) ","(\\-/)"];
				break;

				case "left_leg":
				case "right_leg":
					options = [".Y."," - ","\\|/","/|\\","|||","-|-"," | ",":::"," : ","OOO"," O ","[-]","]|["," + ","}8{","(8)"];
				break;

				case "foot":
				case "left_foot":
				case "right_foot":
					options = ["{_}","_I_","AVA","(O)","OOO","_|_","MMM","]^[","|||","[_]","\\+/","VVV","\\_/","^^^","[!]","MWM","[x]","[v]","[!]","/|\\"];
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

	/* statistics(callback) */ 
		function statistics(callback) {
			retrieve("humans", {"statistics.wins": {$gte: 1}, "statistics.losses": {$gte: 0}}, {$projection: {id: 1, name: 1, statistics: 1}, $sort: {"statistics.wins": -1}, $limit: 10, $multi: true}, function (humans_wins) { //use .find()
				retrieve("robots", {"statistics.wins": {$gte: 1}, "statistics.losses": {$gte: 0}}, {$projection: {id: 1, name: 1, statistics: 1}, $sort: {"statistics.wins": -1}, $limit: 10, $multi: true}, function (robots_wins) { //use .find()
					retrieve("humans", {"statistics.wins": {$gte: 1}, "statistics.losses": {$gte: 0}}, {$project: {ratio: {$divide: ["$statistics.wins", {$cond: [{$gte:["$statistics.losses", 1]}, "$statistics.losses", 1]}]}, id: 1, name: 1, statistics: 1}, $sort: {"ratio": -1}, $limit: 10, $multi: true}, function (humans_ratio) { //use .aggregate()
						retrieve("robots", {"statistics.wins": {$gte: 1}, "statistics.losses": {$gte: 0}}, {$project: {ratio: {$divide: ["$statistics.wins", {$cond: [{$gte:["$statistics.losses", 1]}, "$statistics.losses", 1]}]}, id: 1, name: 1, statistics: 1}, $sort: {"ratio": -1}, $limit: 10, $multi: true}, function (robots_ratio) { //use .aggregate()
							callback({
								humans: {
									wins: humans_wins,
									ratio: humans_ratio
								},
								robots: {
									wins: robots_wins,
									ratio: robots_ratio
								}
							});
						});
					});
				});
			});
		}

/*** database ***/
	/* session(request, response, id, callback) */
		function session(session_id, data, callback) {
			//log activity
				var newActivity = {
					time: new Date().getTime(),
					url: data.url
				}
				if ((typeof data.post.action !== "undefined") && (data.post.action !== null)) {
					newActivity.post = data.post.action;
				}

			//new session
				if (!session_id) {
					var newSession = {
						id: random(),
						created: new Date().getTime(),
						updated: new Date().getTime(),
						human: null,
						info: {
							"ip-address": data.headers["ip-address"],
							"user-agent": data.headers["user-agent"],
							"accept-language": data.headers["accept-language"],
							name: null,
							org: null,
							isp: null,
							city: null,
							state: null,
							country: null
						},
						tour: [],
						tutorials: [],
						activity: [
							newActivity,
							{
								time: new Date().getTime(),
								"ip-address": data.headers["ip-address"],
								"user-agent": data.headers["user-agent"],
								"accept-language": data.headers["accept-language"]
							}
						]
					}

					//known bots
						if (data.headers["user-agent"].indexOf("Googlebot") !== -1) {
							newSession.info.name = "Googlebot";
						}
						else if (data.headers["user-agent"].indexOf("Google Domains") !== -1) {
							newSession.info.name = "Google Domains";
						}
						else if (data.headers["user-agent"].indexOf("Google Favicon") !== -1) {
							newSession.info.name = "Google Favicon";
						}
						else if (data.headers["user-agent"].indexOf("https://developers.google.com/+/web/snippet/") !== -1) {
							newSession.info.name = "Google+ Snippet";
						}
						else if (data.headers["user-agent"].indexOf("IDBot") !== -1) {
							newSession.info.name = "IDBot";
						}
						else if (data.headers["user-agent"].indexOf("Baiduspider") !== -1) {
							newSession.info.name = "Baiduspider";
						}
						else if (data.headers["user-agent"].indexOf("facebook") !== -1) {
							newSession.info.name = "Facebook";
						}

					store("sessions", null, newSession, {}, function (results) {
						ipLocate(newSession.id,data.headers["ip-address"]);
						callback(newSession);
					});
				}

			//existing session
				else {
					store("sessions", {id: session_id}, {$push: {activity: newActivity}, $set: {updated: new Date().getTime()}}, {}, function (oldSession) {
						if (!oldSession) {
							session(false, data, callback); //try again
						}
						else if (oldSession.info["ip-address"] !== data.headers["ip-address"]) { //new location
							var newActivity = {
								time: new Date().getTime(),
								"ip-address": data.headers["ip-address"],
								"user-agent": data.headers["user-agent"],
								"accept-language": data.headers["accept-language"]
							}
							store("sessions", {id: session_id}, {$push: {activity: newActivity}, $set: {"info.ip-address": data.headers["ip-address"], "info.user-agent": data.headers["user-agent"], "info.accept-language": data.headers["accept-language"], updated: new Date().getTime()}}, {}, function (oldSession) {
								ipLocate(oldSession.id,data.headers["ip-address"]);
								callback(oldSession);
							});
						}
						else {
							callback(oldSession);
						}
					});
				}
		}

	/* locate(session, post, callback) */
		function locate(session, post, callback) {
			var data = JSON.parse(post.data);
			var locateActivity = {
				time: new Date().getTime(),
				city: data.city || null,
				state: data.region_name || null,
				country: data.country_name || null
			}

			store("sessions", {id: session.id}, {$push: {activity: locateActivity}, $set: {updated: new Date().getTime()}}, {}, function (data) {
				callback(data);
			});
		}

	/* ipLocate(session) */
		function ipLocate(session_id, ip_address) {
			if ((ip_address) && (ip_address.length >= 7)) {
				try {
					var req = http.request({
						method: "POST",
						host: "www.ip-api.com",
						path: "/json/" + (ip_address || null),
					}, function (res) {
						var data = "";
						res.on("data", function (chunk) {
							data += chunk;
						});
						res.on("end", function() {
							data = JSON.parse(data);
							console.log("data: ");
							console.log(data);
							var locateActivity = {
								time: new Date().getTime(),
								org: data.org || null,
								isp: data.isp || null,
								city: data.city || null,
								state: data.regionName || null,
								country: data.country || null,
							}

							store("sessions", {id: session_id}, {$push: {activity: locateActivity}, $set: {"info.org": data.org, "info.isp": data.isp, "info.city": data.city, "info.state": data.regionName, "info.country": data.country, updated: new Date().getTime()}}, {}, function (data) {
								console.log("done");
							});
						});
					});
					
					req.write("");
					req.end();
				}
				catch (error) {
					console.log("ip error: " + error);
				}
			}
		}

	/* apicall(session, post, callback) */
		function apicall(session, data, callback) {
			if (typeof data !== "object") {
				var data = JSON.parse(data);
			}
			var authname = String(data.authname) || null;
			var authpass = String(data.authpass) || null;
			var collection = String(data.collection) || null;
			
			//query
				if ((typeof data.query !== "undefined") && (data.query !== null)) {
					try {
						var sandbox = {};
						var random = "r" + Math.random().toString(16).substring(2);
						
						vm.runInNewContext(
							"function evaluate() { return eval(" + String(data.query) + "); }; var " + random + " = evaluate();",
							sandbox,
							{timeout: 1000}
						);
						var query = sandbox[random] || {};
					}
					catch (error) {
						var query = {};
					}

					if (typeof query !== "object") {
						query = {};
					}
				}
				else {
					var query = {};
				}
			
			//sort
				if ((typeof data.sort !== "undefined") && (data.sort !== null)) {
					try {
						var sort = JSON.parse(data.sort) || {created: -1};
					}
					catch (error) {
						var sort = {created: -1};
					}
				}
				else {
					var sort = {created: -1};
				}

			if ((!isNumLet(authname)) || (authname.length < 8) || (authname.length > 32)) {
				callback({success: false, message: "invalid username"});
			}
			else if ((authpass.length < 8) || (authpass.length > 32)) {
				callback({success: false, message: "invalid password"});
			}
			else if (["humans","robots","arenas"].indexOf(collection) === -1) {
				callback({success: false, message: "invalid collection"});
			}
			else {
				retrieve("humans", {name: authname}, {}, function (human) {
					if (!human) {
						callback({success: false, message: "human not found"});
					}
					else if (human.status.lockTo > new Date().getTime()) {
						callback({success: false, messages: "account temporarily locked due to suspicious activity; try again later"});
					}
					else {
						retrieve("humans", {name: authname, password: hash(authpass, human.salt)}, {}, function (human) {
							if (!human) {
								callback({success: false, message: "name and password do not match"});
							}
							else {
								switch (collection) {
									case "humans":
										var projection = {
											id: 1,
											name: 1,
											created: 1,
											information: 1,
											statistics: 1,
											robots: 1
										}
									break;
									case "robots":
										var projection = {
											id: 1,
											name: 1,
											created: 1,
											human: 1,
											information: 1,
											avatar: 1,
											statistics: 1,
											inputs: 1,
											code: 1
										}
									break;
									case "arenas":
										var projection = {
											id: 1,
											created: 1,
											humans: 1,
											entrants: 1,
											state: 1,
											rules: 1,
											rounds: 1
										}
									break;
								}

								retrieve(collection, query, {$multi: true, $sort: sort, $limit: 100, $projection: projection}, function (data) {
									callback({success: true, data: data});
								});
							}
						});
					}
				});
			}
		}

	/* retrieve(collection, query, options, callback) */
		function retrieve(collection, query, options, callback) {
			if (arguments.length !== 4) {
				console.log("retrieve error: " + JSON.stringify(arguments));
			}

			//options
				var projection = options["$projection"] || {};
				var sample = options["$sample"] || false;
				var project = options["$project"] || false;
				var multi = options["$multi"] || false;
				var sort = options["$sort"] || {created: -1};
				var limit = options["$limit"] || 100;

			mongo.connect(database, { useNewUrlParser: true }, function(error, client) {
				var db = client.db("aiarenas")
				if (error) {
					console.log(error);
					callback(null);
				}

			//aggregate with $match and $sample
				else if (sample) {
					console.log("aggregate: " + collection + ": " + JSON.stringify([{$match: query}, {$sample: sample}]));
					db.collection(collection).aggregate([{$match: query}, {$sample: sample}]).sort(sort).limit(limit).maxTimeMS(1000).toArray(function (error, resultArray) {
						if (error) {
							console.log(error);
							callback(null);
						}
						else {
							if (resultArray.length === 0) {
								resultArray = null;
							}
							callback(resultArray);
						}
						client.close();
					});
				}

			//aggregate with $match and $project
				else if (project) {
					console.log("aggregate: " + collection + ": " + JSON.stringify([{$match: query}, {$project: project}]));
					db.collection(collection).aggregate([{$match: query}, {$project: project}, {$sort: sort}, {$limit: limit}]).maxTimeMS(1000).toArray(function (error, resultArray) {
						if (error) {
							console.log(error);
							callback(null);
						}
						else {
							if (resultArray.length === 0) {
								resultArray = null;
							}
							callback(resultArray);
						}
						client.close();
					});
				}

			//findOne
				else if (!multi) {
					console.log("findOne: " + collection + ": " + JSON.stringify(query));
					db.collection(collection).findOne(query, projection, function (error, result) {
						if (error) {
							console.log(error);
							callback(null);
						}
						else {
							callback(result);
						}
						client.close();
					});
				}

			//find
				else if (multi) {
					console.log("find: " + collection + ": " + JSON.stringify(query));
					db.collection(collection).find(query, projection).sort(sort).limit(limit).maxTimeMS(1000).toArray(function (error, resultArray) {
						if (error) {
							console.log(error);
							callback(null);
						}
						else {
							if (resultArray.length === 0) {
								resultArray = null;
							}
							callback(resultArray);
						}
						client.close();
					});
				}
			});
		}

	/* store(collection, filter, data, options, callback) */
		function store(collection, filter, data, options, callback) {
			if (arguments.length !== 5) {
				console.log("store error: " + JSON.stringify(arguments));
			}

			//options
				var projection = options["$projection"] || {};
				var upsert = options["$upsert"] || false;
				var multi = options["$multi"] || false;
				var sort = options["$sort"] || {created: -1};
				var limit = options["$limit"] || 100;

				mongo.connect(database, { useNewUrlParser: true }, function(error, client) {
					var db = client.db("aiarenas")
					if (error) {
						console.log(error);
						callback(null);
					}

				//insert
					else if ((filter === null) && (data !== null)) {
						console.log("insert: " + collection + ":\n" + JSON.stringify(data));
						db.collection(collection).insert(data, function (error, result) {
							if (error) {
								console.log(error);
								callback(false);
							}
							else {
								callback(result.nInserted);
							}
							client.close();
						});
					}

				//findOneAndUpdate
					else if ((filter !== null) && (data !== null) && (!multi)) {
						console.log("findOneAndUpdate: " + collection + ": " + JSON.stringify(filter) + ":\n" + JSON.stringify(data));
						db.collection(collection).findOneAndUpdate(filter, data, {returnOriginal: false, upsert: upsert, sort: sort, projection: projection}, function (error, result) {
							if (error) {
								console.log(error);
								callback(null);
							}
							else {
								callback(result.value);
							}
							client.close();
						});
					}

				//update, then find
					else if ((filter !== null) && (data !== null) && (multi)) {
						console.log("update: " + collection + ": " + JSON.stringify(filter) + ":\n" + JSON.stringify(data));
						db.collection(collection).update(filter, data, {upsert: upsert, multi: true}, function (error, result) {
							if (error) {
								console.log(error);
								callback(null);
							}
							else {
								db.collection(collection).find(filter, projection).sort(sort).limit(limit).maxTimeMS(1000).toArray(function (error, resultArray) {
									if (error) {
										console.log(error);
										callback(null);
									}
									else {
										if (resultArray.length === 0) {
											resultArray = null;
										}
										callback(resultArray);
									}
									client.close();
								});
							}
						});
					}

				//remove
					else if ((filter !== null) && (data === null)) {
						if (multi) { multi = true; }

						console.log("remove: " + collection + ": " + JSON.stringify(filter));
						db.collection(collection).remove(filter, !multi, function (error, result) {
							if (error) {
								console.log(error);
								callback(false);
							}
							else {
								callback(result.nRemoved);
							}
							client.close();
						});
					}
			});
		}

/*** exports ***/
	module.exports = {
		environment: environment,
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
		fonts: fonts,
		tour: tour,
		locate: locate,
		ipLocation: ipLocate,
		apicall: apicall,
		statistics: statistics
	};
