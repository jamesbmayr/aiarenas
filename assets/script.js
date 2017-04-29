$(document).ready(function() {

	/* animateText */
		jQuery.fn.extend({
			animateText: function(options, timespan) {
				var element = this;

				//stop other loops
					var existingLoop = $(element).attr("textloop") || "";
					if (existingLoop.length > 0) {
						clearInterval(window[existingLoop]);
					}

				//set empty options object
					if ((typeof options === "undefined") || (options === null)) {
						options = {};
					}
				
				//text
					if (typeof options.text !== "undefined") {
						var text = options.text;
					}
					else {
						var text = ($(element).text() || "");
					}

					$(element).text("");

				//chunk
					if ((typeof options.chunk !== "undefined") && (options.chunk > 0)) {
						var chunk = options.chunk;
					}
					else {
						var chunk = 1;
					}

				//interval / timespan
					if ((typeof timespan !== "undefined") && (timespan !== null)) {
						var interval = timespan / (text.length / chunk);
					}
					else if ((typeof options.interval !== "undefined") && (options.interval !== null)) {
						var interval = (options.interval / chunk);
					}
					else {
						var interval = 100;
					}

				//indicator
					if ((typeof options.indicator !== "undefined") && (options.indicator.length > 0)) {
						indicator = options.indicator;
					}
					else {
						indicator = "_";
					}

				//get random loop id
					var loop = "";
					var set = "0123456789abcdefghijklmnopqrstuvwxyz";
					for (var i = 0; i < 32; i++) {
						loop += set[Math.floor(Math.random() * set.length)];
					}
					$(element).attr("textloop",loop);

				if ((typeof options.direction !== "undefined") && (options.direction === "left")) {
					var index = text.length - chunk;
					window[loop] = setInterval(function() {
						if (index < 0) {
							clearInterval(window[loop]);
							if ((typeof options.colorText !== "undefined") && (options.colorText === true)) {
								$(element).html(window.colorText(text));
							}
							else {
								$(element).html(text);
							}

							if ((typeof options.resizeTop !== "undefined") && (options.resizeTop === true)) {
								resizeTop();
							}
						}
						else {
							//color char
								if ((typeof options.color !== "undefined") && (options.color.length > 0)) {
									var char = "<span style='color: " + options.color + "'>" + (indicator || (text[index] || "")) + "</span>";
								}
								else {
									var char = text[index] || "";
								}

							$(element).html(char + text.substring(index + 1, text.length));
							index -= chunk;
						}
					}, interval);
				}
				else {
					var index = 0;
					window[loop] = setInterval(function() {
						if (index > text.length) {
							clearInterval(window[loop]);
							if ((typeof options.colorText !== "undefined") && (options.colorText === true)) {
								$(element).html(window.colorText(text));
							}
							else {
								$(element).html(text);
							}

							if ((typeof options.resizeTop !== "undefined") && (options.resizeTop === true)) {
								resizeTop();
							}
						}
						else {
							//color char
								if ((typeof options.color !== "undefined") && (options.color.length > 0)) {
									var char = "<span style='color: " + options.color + "'>" + (indicator || (text[index] || "")) + "</span>";
								}
								else {
									var char = text[index] || "";
								}

							$(element).html(text.substring(0, index) + char);
							index += chunk;
						}
					}, interval);
				}
			}
		});

		$("#message_top").animateText({},1000);
		$(".message").animateText({},1000);

	/* colorText */		
		window.colorText = function(text) {
			if (text.length) {
				text = text.replace(/(\<br\>|\<\/br\>)/g,"\n");
				
				function grayizer(text) {
					text = " " + text;

					var position = 0;
					var startPosition = Number(text.indexOf("/*",position)); // find next comment start
					if (startPosition < 0) { startPosition = false; }
					var loop = 0;

					while ((startPosition > position) && (loop < 100)) { //loop through up to 100 times
						endPosition = text.indexOf("*/", startPosition + 2); //find the comment end
						if (endPosition < 0) {
							endPosition = text.length;
						}
						var before = text.slice(0, startPosition) || ""; //split into before...
						var between = text.slice(startPosition, Math.min(endPosition + 2, text.length)) || ""; //...between...
						var after = text.slice(endPosition + 2, text.length) || ""; //and after sections
						text = before + "<span graytext>" + between + "</span graytext>" + after; //recombine them with <span>
						position = endPosition + 32;

						if (position >= text.length) {
							break;
						}
						else {
							startPosition = text.indexOf("/*",position) || false; //find next comment start
							loop++;
						}
					}

					text = text.replace(/\/\/(.*?)(\n|\<br\>|$)/g,"<span graytext>//$1</span graytext>$2"); //regex for regular double-slash comments

					return text.substring(1);
				}

				function yellowizer (text) {
					text = " " + text;

					var position = 0;
					var dqPosition = Number(text.indexOf("\"",position)); // find next double quote
					if (dqPosition < 0) { dqPosition = false; }
					var sqPosition = Number(text.indexOf("\'",position)); // find next single quote
					if (sqPosition < 0) { sqPosition = false; }
					var loop = 0;

					while (((dqPosition > position) || (sqPosition > position)) && (loop < 100)) { //loop through up to 100 times
						if ((dqPosition > position) && (sqPosition > position)) { //determine which is closer
							if (dqPosition < sqPosition) { //double quote
								var type = "double";							
							}
							else if (sqPosition < dqPosition) { //single quote
								var type = "single";
							}
						}
						else if (dqPosition > position) { //double quote (same as above)
							var type = "double";	
						}
						else if (sqPosition > position) { //single quote (same as above)
							var type = "single";
						}
						else {
							var type = "none";
						}

						if (type === "double") {
							if ((text.indexOf("</span graytext>", dqPosition) < text.indexOf("<span graytext>", dqPosition)) || ((text.indexOf("<span graytext>", dqPosition) === -1) && (text.indexOf("</span graytext>", dqPosition) > 0))) { //if quote is within a graytext section
								type = "none";
								position = dqPosition + 1;
							}
						}
						else if (type === "single") {
							if ((text.indexOf("</span graytext>", sqPosition) < text.indexOf("<span graytext>", sqPosition)) || ((text.indexOf("<span graytext>", sqPosition) === -1) && (text.indexOf("</span graytext>", sqPosition) > 0))) { //if quote is within a graytext section
								type = "none";
								position = sqPosition + 1;
							}
						}

						if (type === "double") {
							var attempt = dqPosition;
							do {
								eqPosition = text.indexOf("\"", attempt + 1); //get the next end quote
								if (eqPosition < 0) {
									eqPosition = text.length; //default to the end of the text
								}

								var close = text.indexOf("</span graytext>", eqPosition);
								if (close < 0) {
									close = text.length;
								}

								var open = text.indexOf("<span graytext>", eqPosition);
								if (open < 0) {
									open = text.length;
								}

								attempt = eqPosition;
							}
							while ((close < open) && (attempt < text.length))

							var before = text.slice(0, dqPosition); //split into before...
							var between = text.slice(dqPosition, eqPosition + 1); //...between...
							var after = text.slice(eqPosition + 1, text.length); //...and after sections
							text = before + "<span yellowtext>" + between + "</span>" + after; //recombine them with <span>
							position = eqPosition + 25; //move up 25 characters (length of <span yellowtext></span>, plus 1)
						}
						else if (type === "single") {
							var attempt = sqPosition;
							do {
								eqPosition = text.indexOf("\'", attempt + 1); //get the next end quote
								if (eqPosition < 0) {
									eqPosition = text.length; //default to the end of the text
								}

								var close = text.indexOf("</span graytext>", eqPosition);
								if (close < 0) {
									close = text.length;
								}

								var open = text.indexOf("<span graytext>", eqPosition);
								if (open < 0) {
									open = text.length;
								}

								attempt = eqPosition;
							}
							while ((close < open) && (attempt < text.length))

							var before = text.slice(0, sqPosition); //split into before...
							var between = text.slice(sqPosition, eqPosition + 1); //...between...
							var after = text.slice(eqPosition + 1, text.length); //...and after sections
							text = before + "<span yellowtext>" + between + "</span>" + after; //recombine them with <span>
							position = eqPosition + 25; //move up 25 characters (length of <span yellowtext></span>, plus 1)
						}


						dqPosition = text.indexOf("\"",position) || false; //find next double quote
						sqPosition = text.indexOf("\'",position) || false; //find next single quote
						loop++;
					}

					return text.substring(1);
				}

				function rgbopizer(text) {
					/* math */ 		text = text.replace(/(^|\{|\[|\(|\.|\s|\d|\w|\n)(\%+|\-+|\-\-|\++|\+\+|\-\=|\+\=|\*+|\=+|\&\&|\|\||\\+|\!+)(\d|\w|\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
					/* < = > */ 	text = text.replace(/(^|\{|\[|\(|\.|\s|\n)(\<+|\>+|&amp;|&amp;&amp;|&lt;|&gt;|&lt;&lt;|&gt;&gt;|&lt;&lt;&lt;|&gt;&gt;&gt;|\=&lt;|\=&gt;|&lt;\=|&gt;\=|&lt;\=\=|\=\=&gt;)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
					/* logic */		text = text.replace(/(^|\{|\[|\(|\.|\s|\n)(else\ if|if|else|return|typeof|switch|case|break|default|new|for|while|\$|const|do|continue|try|catch|throw|finally|this|in|instanceof)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
					/* booleans */	text = text.replace(/(^|\{|\[|\(|\s|\n)(true|false|null)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2</span>$3");
					/* types */		text = text.replace(/(^|\{|\[|\(|\s|\n)(Math|Number|String|Object|function|var|eval|Date|Error|Array)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");

					/* misc */		text = text.replace(/(\.)(caller|callee|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|escape|eval|exec|length|log|parse|parseFloat|parseInt|pull|test|toArray)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
					/* arrays */	text = text.replace(/(\.)(concat|copyWithin|every|fill|filter|find|findIndex|forEach|indexOf|isArray|join|lastIndexOf|map|pop|push|reduce|reduceRight|reverse|shift|slice|some|sort|splice|toString|unshift|valueOf)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
					/* numbers */	text = text.replace(/(\.)(isFinite|isInteger|isNaN|isSafeInteger|toExponential|toFixed|toPrecision|toString|valueOf)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
					/* math */		text = text.replace(/(\.)(abs|acos|asin|atan|atan2|ceil|cos|exp|floor|log|max|min|pow|random|round|sin|sqrt|tan)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
					/* strings */	text = text.replace(/(\.)(charAt|charCodeAt|concat|endsWith|fromCharCode|includes|indexOf|lastIndexOf|localeCompare|match|repeat|replace|search|slice|split|startsWith|substr|substring|toLocaleLowerCase|toLocaleUpperCase|toLowerCase|toString|toUpperCase|trim|valueOf)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
					/* dates */		text = text.replace(/(\.)(getDate|getDay|getFullYear|getHours|getMilliseconds|getMinutes|getMonth|getSeconds|getTime|setDate|setFullYear|setHours|setMilliseconds|setMinutes|setMonth|setSeconds|setTime|getUTCDate|getUTCDay|getUTCFullYear|getUTCHours|getUTCMilliseconds|getUTCMinutes|getUTCMonth|getUTCSeconds)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
				
					/* numbers */	text = text.replace(/(^|-|\-|\{|\[|\(|\s|\,|[\-|\+|\!|\/|\*|\=]\<\/span\>|\n)(\d*\.)?(\d+)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2$3</span>$4");
					/* again */		text = text.replace(/(^|-|\-|\{|\[|\(|\s|\,|[\-|\+|\!|\/|\*|\=]\<\/span\>|\n)(\d*\.)?(\d+)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2$3</span>$4");
					
					/* functions */	text = text.replace(/([a-zA-Z0-9_]+)(\s?\<span\ redtext\>\=\<\/span\>\s?)(\<span\ bluetext\>function\<\/span\>\s?)\((\s?[a-zA-Z0-9_,\s]*?\s?)\)/g,"<span greentext>$1</span>$2$3(<span orangetext>$4</span>)");
					/* functions */	text = text.replace(/(\s?\<span\ bluetext\>function\<\/span\>\s?)([a-zA-Z0-9_]*\s?)\((\s?[a-zA-Z0-9_,\s]*?\s?)\)/g,"$1<span greentext>$2</span>(<span orangetext>$3</span>)");
					/* functions */ text = text.replace(/([a-zA-Z0-9_]+)(\s?\:\s?)(\<span\ bluetext\>function\<\/span\>\s?)/g,"<span greentext>$1</span>$2$3");

					return text;
				}
				
				text = rgbopizer(yellowizer(grayizer(text)));
				return text;

			}
			else {
				return "";
			}
		}

	/* robot animations */
		window.animateRobot = function(robot, action) {
			if ((robot !== null) && (robot.length > 0)) {
				switch(action) {
					case "power":
						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
						},0);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_legs").css("font-weight","bold");
						},100);

						setTimeout(function() {
							$("#" + robot).find(".avatar_legs").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
						},200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
						},300);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");
						},400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
						},500);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
						},600);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_eyes").css("font-weight","normal");
							$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
						},700);

						setTimeout(function() {
							$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
						},800);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
						},900);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_legs").css("font-weight","bold");
						},1000);

						setTimeout(function() {
							$("#" + robot).find(".avatar_legs").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
						},1100);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
						},1200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");
						},1300);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
						},1400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
						},1500);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_eyes").css("font-weight","normal");
							$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
						},1600);

						setTimeout(function() {
							$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
						},1700);
					break;

					case "sap":
						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").show();
							$("#" + robot).find(".avatar_left_shoulder_up").hide();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
						},0);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_legs").css("font-weight","bold");
						},200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_legs").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
						},400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
						},600);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");


							$("#" + robot).find(".avatar_left_shoulder_down").hide();
							$("#" + robot).find(".avatar_left_shoulder_up").show();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_right_shoulder_down").hide();
							$("#" + robot).find(".avatar_right_shoulder_up").show();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
						},800);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
						},1000);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
						},1200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_eyes").css("font-weight","normal");
							$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
						},1400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_antennae").css("font-weight","normal");

							$("#" + robot).find(".avatar_right_shoulder_down").show();
							$("#" + robot).find(".avatar_right_shoulder_up").hide();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
						},1600);
					break;

					case "burn":
						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").hide();
							$("#" + robot).find(".avatar_right_shoulder_up").show();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
						},0);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_legs").css("font-weight","bold");
						},200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_legs").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
						},400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
						},600);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");


							$("#" + robot).find(".avatar_left_shoulder_up").hide();
							$("#" + robot).find(".avatar_left_shoulder_down").show();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_right_shoulder_up").hide();
							$("#" + robot).find(".avatar_right_shoulder_down").show();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
						},800);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
						},1000);

						setTimeout(function() {
							$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
							$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
						},1200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_eyes").css("font-weight","normal");
							$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
						},1400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_antennae").css("font-weight","normal");

							$("#" + robot).find(".avatar_left_shoulder_down").hide();
							$("#" + robot).find(".avatar_left_shoulder_up").show();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");
						},1600);
					break;

					case "shock":
						setTimeout(function() {
							$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
						},0);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
							$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
						},100);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_eyes").css("font-weight","normal");

							$("#" + robot).find(".leftDot").hide();
						},200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
						},300);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");

							$("#" + robot).find(".leftDot").show();
						},400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
						},500);

						setTimeout(function() {
							$("#" + robot).find(".avatar_legs").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");

							$("#" + robot).find(".leftDot").hide();
						},600);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
							$("#" + robot).find(".avatar_legs").css("font-weight","normal");
						},700);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_antennae").css("font-weight","bold");

							$("#" + robot).find(".leftDot").show();
						},800);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
							$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
						},900);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
							$("#" + robot).find(".avatar_eyes").css("font-weight","normal");

							$("#" + robot).find(".leftDot").hide();
						},1000);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
							$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
						},1100);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
							$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");

							$("#" + robot).find(".leftDot").show();
						},1200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
						},1300);

						setTimeout(function() {
							$("#" + robot).find(".avatar_legs").css("font-weight","bold");
							$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");

							$("#" + robot).find(".leftDot").hide();
						},1400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
							$("#" + robot).find(".avatar_legs").css("font-weight","normal");
						},1500);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
							$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");

							$("#" + robot).find(".leftDot").show();
						},1600);

						setTimeout(function() {
							$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
						},1700);
					break;

					case "take":
						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").hide();
							$("#" + robot).find(".avatar_right_shoulder_up").show();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
						},0);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").hide();
						},200);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},400);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").hide();
						},600);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},800);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").hide();
						},1000);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},1200);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").hide();
						},1400);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
							$("#" + robot).find(".avatar_right_shoulder_down").show();
							$("#" + robot).find(".avatar_right_shoulder_up").hide();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
						},1600);
					break;

					case "halftake":
						setTimeout(function() {
							$("#" + robot).find(".leftDot").hide();
						},200);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},400);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").hide();
						},600);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},800);
					break;

					case "swaptake":
						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").hide();
							$("#" + robot).find(".avatar_right_shoulder_up").show();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".leftDot").hide();
						},200);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").show();
							$("#" + robot).find(".avatar_right_shoulder_up").hide();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_left_shoulder_up").hide();
							$("#" + robot).find(".avatar_left_shoulder_down").show();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".leftDot").hide();
						},600);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},800);

						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").hide();
							$("#" + robot).find(".avatar_right_shoulder_up").show();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_left_shoulder_up").show();
							$("#" + robot).find(".avatar_left_shoulder_down").hide();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".leftDot").hide();
						},1000);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},1200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").show();
							$("#" + robot).find(".avatar_right_shoulder_up").hide();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_left_shoulder_up").hide();
							$("#" + robot).find(".avatar_left_shoulder_down").show();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".leftDot").hide();
						},1400);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},1600);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_up").show();
							$("#" + robot).find(".avatar_left_shoulder_down").hide();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");
						},1800);
					break;

					case "fliptake":
						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").hide();
							$("#" + robot).find(".avatar_right_shoulder_up").show();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_left_shoulder_up").hide();
							$("#" + robot).find(".avatar_left_shoulder_down").show();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".leftDot").hide();
						},200);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},400);

						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").show();
							$("#" + robot).find(".avatar_right_shoulder_up").hide();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_left_shoulder_up").show();
							$("#" + robot).find(".avatar_left_shoulder_down").hide();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".leftDot").hide();
						},600);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},800);

						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").hide();
							$("#" + robot).find(".avatar_right_shoulder_up").show();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_left_shoulder_up").hide();
							$("#" + robot).find(".avatar_left_shoulder_down").show();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".leftDot").hide();
						},1000);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},1200);

						setTimeout(function() {
							$("#" + robot).find(".avatar_right_shoulder_down").show();
							$("#" + robot).find(".avatar_right_shoulder_up").hide();
							$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar_left_shoulder_up").show();
							$("#" + robot).find(".avatar_left_shoulder_down").hide();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".leftDot").hide();
						},1400);

						setTimeout(function() {
							$("#" + robot).find(".leftDot").show();
						},1600);
					break;

					case "sleep":
					default:
						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").show();
							$("#" + robot).find(".avatar_left_shoulder_up").hide();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

							$("#" + robot).find(".avatar").animate({
								opacity: 0.1
							},2000);
						},0);
						
						setTimeout(function() {
							$("#" + robot).find(".avatar").animate({
								opacity: 1
							},2000);
						},2000);

						setTimeout(function() {
							$("#" + robot).find(".avatar_left_shoulder_down").hide();
							$("#" + robot).find(".avatar_left_shoulder_up").show();
							$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
							$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");
						},3000)
					break;
				}
			}
		}

	/* navbar */
		window.navbar_open = function() {
			$("#navbar_open").animate({left: "+=256px"}, 500);
			$("#navbar_open").find(".glyphicon").animate({opacity: 0},500);
			setTimeout(function() {
				$("#navbar_open").hide();
			}, 500);
			
			$("#navbar_close").show().animate({left: "+=256px"}, 500);
			$("#navbar_close").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "+=256px"}, 500);
		}

		window.navbar_close = function() {
			$("#navbar_close").animate({left: "-=256px"}, 500);
			$("#navbar_close").find(".glyphicon").animate({opacity: 0},500);;
			setTimeout(function() {
				$("#navbar_close").hide();
			}, 500);

			$("#navbar_open").show().animate({left: "-=256px"}, 500);
			$("#navbar_open").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "-=256px"}, 500);
		}

		window.navbar_signout = function() {
			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "signout",
				},
				success: function(data) {
					if (data.success) {
						window.location = data.redirect;
					}
					else {
						$("#navbar_message").text(data.messages.navbar || "//unable to signout");
					}
				}
			});
		}

		window.navbar_create_robot = function() {
			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "create_robot",
				},
				success: function(data) {
					if (data.success) {
						window.location = data.redirect;
					}
					else {
						$("#navbar_message").text( data.messages.navbar || "//unable to create robot");
						$("#message_top").animateText({text: (data.messages.top || "//unable to create robot")},1000);
					}
				}
			});
		}

		window.navbar_create_arena = function() {
			var preset = $("#navbar_arena_create_presets").val();

			if (preset === "custom") {
				window.location = "../../../../arenas";
			}
			else {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "create_arena",
						data: JSON.stringify({preset: preset})
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#navbar_message").text(data.messages.navbar || "//unable to create arena");
						}
					}
				});
			}
		}

		window.navbar_random_arena = function() {
			var preset = $("#navbar_arena_random_presets").val();

			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "random_arena",
					data: JSON.stringify({preset: preset})
				},
				success: function(data) {
					if (data.success) {
						window.location = data.redirect;
					}
					else {
						$("#navbar_message").text(data.messages.navbar || "//unable to join arena");
					}
				} 
			})
		}

		window.navbar_join_arena = function() {
			var arena_id = $("#navbar_arena_id").val();

				if (arena_id.length === 4) {
					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "join_arena",
							data: JSON.stringify({arena_id: arena_id || null})
						},
						success: function(data) {
							if (data.success) {
								window.location = data.redirect;
							}
							else {
								$("#message_top").animateText({text: (data.messages.top || "//unable to join arena")}, 1000);
							}
						}
					});
				}
				else {
					$("#message_top").animateText({text: "//enter a 4-character arena_id"}, 1000);
				}
		}

	/* sectionToggle */
		$(document).on("click", ".section-toggle", function() {
			if ($(this).hasClass("section-toggle-down")) {
				$(this).next().next().animate({
					height: 0
				},1000);

				$(this).replaceWith('<span class="glyphicon glyphicon-chevron-up section-toggle section-toggle-up whitetext"></span>');
			}
			else if ($(this).hasClass("section-toggle-up")) {
				var section = $(this).next().next();
				var height = $(section).hide().css("height","auto").css("height");

				$(section).css("height",0).show().animate({
					height: height
				},1000);

				$(this).replaceWith('<span class="glyphicon glyphicon-chevron-down section-toggle section-toggle-down whitetext"></span>');

				setTimeout(function() {
					$(section).css("height","auto");
				},1010);
			}
		});

	/* resizeTop */
		window.resizeTop = function() {
			$(".content").css("margin-top",($(".top_outer").css("height").replace("px","") - 46));
		};
});