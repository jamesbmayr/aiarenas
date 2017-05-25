$(document).ready(function() {

	/* test browser */
		window.isIE = function() {
			if ( (/(MSIE|Trident\/|Edge\/)/i).test(navigator.userAgent) ) {
				return true;
			}
			else {
				return false;
			}
		}

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
							$(element).attr("textloop","");
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
					/* math(old) */	//text = text.replace(/(^|\{|\[|\(|\.|\s|\d|\w|\n)(\%|\-|\-\-|\+|\+\+|\*|\*\*|\-\=|\+\=|\*\=|\/\=|\%\=|\!|\!\=|\!\=\=|\=|\=\=|\=\=\=|\&\&|\|\||\\+)(\d|\w|\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
					/* math */		text = text.replace(/(\%|\-|\-\-|\+|\+\+|\*|\*\*|\-\=|\+\=|\*\=|\/\=|\%\=|\!|\!\=|\!\=\=|\=|\=\=|\=\=\=|\<\=|\<\=\=|\>\=|\>\=\=|\&\&|\|\||\\+)/g,"<span redtext>$1</span>");
					/* < = > */ 	text = text.replace(/(^|\{|\[|\(|\.|\s|\n)(&lt;&lt;&lt;|&gt;&gt;&gt;|&lt;\=\=|\=\=&gt;|&lt;&lt;|&gt;&gt;|\=&lt;|\=&gt;|&lt;\=|&gt;\=|\<+|\>+|&lt;|&gt;|&amp;&amp;|&amp;)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
					/* logic */		text = text.replace(/(^|\{|\[|\(|\.|\s|\n)(else\ if|if|else|return|typeof|switch|case|break|default|new|for in|for of|for|while|\$|const|do|continue|try|catch|throw|finally|this|in|instanceof)(\s|\.|\,|\(|\)|\[|\]|\{|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
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

	/* animateRobot */
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
			$("#navbar_close").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			$("#navbar_open").find(".glyphicon").animate({opacity: 0},500);
			setTimeout(function() {
				$("#navbar_open").hide();
			}, 500);
			
			var multiplier = $(":root").css("--font_size") || 1;
			if (multiplier > 1) {
				$("#navbar_open").animate({left: "512px"}, 500);
				$("#navbar_close").show().animate({left: "512px"}, 500);
				$("#navbar").animate({left: "0px"}, 500);
			}
			else {
				$("#navbar_open").animate({left: "256px"}, 500);
				$("#navbar_close").show().animate({left: "256px"}, 500);
				$("#navbar").animate({left: "0px"}, 500);
			}
		}

		window.navbar_close = function() {
			$("#navbar_open").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			$("#navbar_close").find(".glyphicon").animate({opacity: 0},500);;
			setTimeout(function() {
				$("#navbar_close").hide();
			}, 500);

			var multiplier = $(":root").css("--font_size") || 1;
			if (multiplier > 1) {
				$("#navbar_open").show().animate({left: "-=512px"}, 500);
				$("#navbar_close").animate({left: "-=512px"}, 500);
				$("#navbar").animate({left: "-512px"}, 500);
			}
			else {
				$("#navbar_open").show().animate({left: "0px"}, 500);
				$("#navbar_close").animate({left: "0px"}, 500);
				$("#navbar").animate({left: "-256px"}, 500);
			}
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
						$("#message_top").animateText({text: (data.messages.top || "//unable to signout")}, 1000);
					}
				}
			});
		}

		window.navbar_create_robot = function() {
			var preset = $("#navbar_robot_create_selection").val();

			if (preset === "new") {
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
							$("#message_top").animateText({text: (data.messages.top || "//unable to create robot")},1000);
						}
					}
				});
			}
			else if (preset === "upload") {
				$("#navbar_file_chooser").click();
			}
		}

		$(document).on("change","#navbar_file_chooser",function(event) {
			if (($("#navbar_file_chooser").val() !== null) && ($("#navbar_file_chooser").val().length > 0)) {
				var reader = new FileReader();
				reader.readAsText(event.target.files[0]);
				reader.onload = function(event) {
					var data = JSON.parse(event.target.result);

					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "upload_robot",
							data: JSON.stringify(data)
						},
						success: function(data) {
							if (data.success) {
								window.location = data.redirect;
							}
							else {
								$("#message_top").animateText({text: (data.messages.top || "unable to upload robot")},1000);
							}
						}
					});
				}
			}
		});

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
							$("#message_top").animateText({text: (data.messages.top || "//unable to create arena")}, 1000);
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
						$("#message_top").animateText({text: (data.messages.top || "//unable to join arena")}, 1000);
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
				var section = $(this).next().next();
				$(section).animate({
					height: 0,
				},1000);

				setTimeout(function() {
					$(section).hide();
				},1000);

				if ($(this).parent().hasClass("top_inner")) {
					var multiplier = $(":root").css("--font_size") || 1;
					$(".content").animate({
						"margin-top": (((Number(multiplier) + 1) / 2) * 64)
					},1000);
				}

				$(this).replaceWith('<span class="glyphicon glyphicon-chevron-up section-toggle section-toggle-up whitetext"></span>');
			}
			else if ($(this).hasClass("section-toggle-up")) {
				var section = $(this).next().next();
				var height = $(section).hide().css("height","auto").css("height");

				$(section).css("height",0).show().animate({
					height: height
				},1000);

				setTimeout(function() {
					$(section).css("height","auto");
				},1010);

				if ($(this).parent().hasClass("top_inner")) {
					var multiplier = $(":root").css("--font_size") || 1;
					$(".content").animate({
						"margin-top": (Number(height.replace("px","")) + (((Number(multiplier) + 1) / 2) * 64))
					},1000);
				}

				$(this).replaceWith('<span class="glyphicon glyphicon-chevron-down section-toggle section-toggle-down whitetext"></span>');
			}
		});

		$(document).on("click",".bracketer_top details", function(event) {
			event.stopPropagation();
		});

		$(document).on("click",".field_frame.active", function(event) {
			event.stopPropagation();
		});

		$(document).on("click", ".bracketer_top", function(event) {
			if ($(this).prev().hasClass("section-toggle-down")) {
				var section = $(this).next();
				$(section).animate({
					height: 0,
				},1000);

				setTimeout(function() {
					$(section).hide();
				},1000);

				if ($(this).parent().hasClass("top_inner")) {
					var multiplier = $(":root").css("--font_size") || 1;
					$(".content").animate({
						"margin-top": (((Number(multiplier) + 1) / 2) * 64)
					},1000);
				}

				$(this).prev().replaceWith('<span class="glyphicon glyphicon-chevron-up section-toggle section-toggle-up whitetext"></span>');
			}
			else if ($(this).prev().hasClass("section-toggle-up")) {
				var section = $(this).next();
				var height = $(section).hide().css("height","auto").css("height");

				$(section).css("height",0).show().animate({
					height: height
				},1000);

				setTimeout(function() {
					$(section).css("height","auto");
				},1010);

				if ($(this).parent().hasClass("top_inner")) {
					var multiplier = $(":root").css("--font_size") || 1;
					$(".content").animate({
						"margin-top": (Number(height.replace("px","")) + (((Number(multiplier) + 1) / 2) * 64))
					},1000);
				}

				$(this).prev().replaceWith('<span class="glyphicon glyphicon-chevron-down section-toggle section-toggle-down whitetext"></span>');

			}
		});

	/* resizeTop */
		window.resizeTop = function() {
			var multiplier = $(":root").css("--font_size") || 1;

			$(".content").css("margin-top",Number(String($(".top_inner").css("height")).replace("px","")));
		}

	/* tour */
		window.splashScreen = function() {
			setTimeout(function() {
				$("#splash_screen").find(".message").animateText({text: "initializing..."},1000);
				window.animateRobot("splashBot","power");
			},1000);
			
			setTimeout(function() {
				$("#splash_screen").find(".message").animateText({text: "initializing..."},1000);
				window.animateRobot("splashBot","sap");
			},2000);
			
			setTimeout(function() {
				$("#splash_screen").animate({
					opacity: 0
				},2000);
				window.animateRobot("splashBot","shock");
			},3000);
			
			setTimeout(function() {
				$("#splash_screen").remove();
			},5000);
		}

		window.continueTour = function() {
			$("body").addClass("touring");
			$("#navbar").addClass("touring");

			if ($(".overlay_outer").toArray().length === 0) {
				$("body").append("<div class='overlay_outer'>\
					<div class='overlay_circle'>\
						<div class='overlay_inner'>\
							<div class='overlay_message'></div>\
							<form action='javascript:;' onSubmit='window.continueTour();' id='tour_form'>\
								<button class='whitetext' id='continueTour' name='continueTour' value=''><span class='greentext'>next</span>()</button>\
							</form>\
							<span class='redtext'>||</span>\
							<form action='javascript:;' onSubmit='window.stopTour();' id='stop_form'>\
								<button class='whitetext' id='stopTour' name='stopTour' value=''><span class='greentext'>close</span>()</button>\
							</form>\
						</div>\
					</div>\
				</div>");

				$("#startTour").closest("form").remove();
				$("#message_top").animateText({text: "//help activated"},1000);
			}

			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "tour",
					data: JSON.stringify({selector: ($("#continueTour").val() || "")})
				},
				success: function(data) {
					if (data.success) {
						var tour = data.tour;
						do {
							if (tour.length > 0) {
								var next = tour[0];

								tour.shift();
								eval(next.action);
								$("#continueTour").val(next.selector);
							}
							else {
								next = null;
							}
						}
						while ((next !== null) && (($(next.selector).toArray().length === 0) || ($(next.selector).css("display") === "none") || ($(next.selector).css("height") === "0px") || ($(next.selector).css("width") === "0px")))
						
						if (next !== null) {
							var element = $(next.selector);
								var x = $(element).position().top + ($(element).css("height").replace("px","") / 2);
								var y = $(element).position().left + ($(element).css("width").replace("px","") / 2);
							var multiplier = $(":root").css("--font_size") || 1;
							$(".overlay_outer").css("top",x - (multiplier * 50)).css("left",y - (multiplier * 50));
							$(".overlay_message").animateText({text: next.message},1000);

							$("html, body, #navbar").animate({
								scrollTop: ($(".overlay_outer").offset().top - 200)
							}, 0);
							
						}
						else {
							//no tour steps remain on this page
							$(".overlay_outer").remove();
							$("body").removeClass("touring");
							$("#navbar").removeClass("touring");
						}
					}
					else {
						//success: false response
						console.log("tour malfunction");
						$(".overlay_outer").remove();
						$("body").removeClass("touring");
						$("#navbar").removeClass("touring");
					}
				}
			});
		}

		window.stopTour = function() {
			$(".overlay_outer").remove();
			$("body").removeClass("touring");
			$("#navbar").removeClass("touring");

			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "tour",
					data: JSON.stringify({stop: true})
				},
				success: function(data) {
					if (data.success) {
						$("#message_top").animateText({text: data.messages.top || "//help deactivated"},1000);
					}
					else {
						$("#message_top").animateText({text: data.messages.top || "//help deactivated"},1000);
					}
				}
			});
		}

	/* eval_code */
		window.consoleLog = function(line, log) {
			window.logs.push(line + ":: " + log);
		}

		window.lineLog = function(log) {
			window.lines.push(log);
		}

		window.eval_code = function() {
			if ((typeof window.evaluating === "undefined") || (window.evaluating === null)) {
				window.evaluating = false;
			}

			if (!window.evaluating) {
				//page
					switch (true) {
						case (/^\/tutorials/).test(window.location.pathname):
							var page = "tutorials";
						break;
						case (/^\/robots/).test(window.location.pathname):
							var page = "robots";
						break;
						case (/^\/arenas/).test(window.location.pathname):
							var page = "arenas";
						break;
						default:
							return;
						break;
					}

				//reset
					window.evaluating = true;
					window.logs = [];
					window.lines = [];
					
					switch (page) {
						case "tutorials":
							$("#console").empty();
							$("#next_step").prop("disabled",true);
							$(".top_inner").find(".indented").hide();
							$(".top_inner").find(".section-toggle").removeClass("section-toggle-down").addClass("section-toggle-up").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
							resizeTop();
						break;
						case "robots":
							$("#console").empty();
							$("#load_robot").prop("disabled",true);
							$("#workshop_save").prop("disabled",true);
							$("#workshop_download").prop("disabled",true);
							$(".top_inner").find(".indented").hide();
							$(".top_inner").find(".section-toggle").removeClass("section-toggle-down").addClass("section-toggle-up").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
							$("#message_top").animateText({text: "//evaluating..."}, 1000);
							resizeTop();
						break;
						case "arenas":
							$("#console").empty();
							$("#output").empty();
						break;
					}
				
				//get code and inputs
					switch (page) {
						case "tutorials":
						case "robots":
							window.code = $("#code").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
							window.code = window.code.split("\n");

							window.inputs = $("#inputs").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s/g,"");
							window.inputs = window.inputs.split(",");
						break;
						case "arenas":
							var id = $("#workshop_select").val();
							if ((id !== null) && (id.length > 0)) {
								window.code = window.arena.entrants[id].code;
								window.code = window.code.split("\n");
								window.inputs = window.arena.entrants[id].inputs.replace(/\s/g,"");
								window.inputs = window.inputs.split(",");
								console.log(window.code);
								console.log(window.inputs);
							}
						break;
					}

				//get arena rules, cubes, robots
					switch (page) {
						case "tutorials":
						case "robots":
							//rules
								var rules = {
									players: {},
									cubes: {},
									robots: {},
									victory: {}
								};

								$("#rules select").each(function() {
									var id = String($(this).attr("id")).split("_");
									rules[id[0]][id[1]] = $(this).val();
								});

								$("#rules input").each(function() {
									var id = String($(this).attr("id")).split("_");
									if (typeof rules[id[0]][id[1]] === "undefined") {
										rules[id[0]][id[1]] = [];
									}
									if ($(this).prop("checked")) {
										rules[id[0]][id[1]].push($(this).val());
									}
								});

							//get arena cubes
								var sandbox_cubes = [];
								var array = $(".cube_outer").toArray();
								for (var i = 0; i < array.length; i++) {
									var cube_color = $(array[i]).text();
									if (cube_color.indexOf(".") > -1) {
										cube_color = cube_color.substring(0, cube_color.indexOf("."));
									}
									sandbox_cubes.push(cube_color);
								}

							//get arena robots
								var sandbox_robots = [
									{
										name: $(".self").attr("id"),
										power: Number($(".self").find(".power").val()),
										cubes: {
											red: Number($(".self").find(".cubes_red").val()),
											orange: Number($(".self").find(".cubes_orange").val()),
											yellow: Number($(".self").find(".cubes_yellow").val()),
											green: Number($(".self").find(".cubes_green").val()),
											blue: Number($(".self").find(".cubes_blue").val()),
											purple: Number($(".self").find(".cubes_purple").val()),
										},
										action: $(".self").find(".action").val(),
									}
								];
								var array = $(".opponent").toArray();
								for (var i = 0; i < array.length; i++) {
									var opponent = {
										name: $(array[i]).attr("id"),
										power: Number($(array[i]).find(".power").val()),
										cubes: {
											red: Number($(array[i]).find(".cubes_red").val()),
											orange: Number($(array[i]).find(".cubes_orange").val()),
											yellow: Number($(array[i]).find(".cubes_yellow").val()),
											green: Number($(array[i]).find(".cubes_green").val()),
											blue: Number($(array[i]).find(".cubes_blue").val()),
											purple: Number($(array[i]).find(".cubes_purple").val()),
										},
										action: $(array[i]).find(".action").val(),
									}
									sandbox_robots.push(opponent);
								}

							//build arena sandbox
								var sandbox = {
									rules: rules,
									rounds: [
										{
											start: new Date().getTime(),
											cubes: sandbox_cubes,
											robots: sandbox_robots,
											winner: null
										}
									]
								}
						break;
						case "arenas":
							var sandbox = {
								rules: window.arena.rules,
								rounds: window.arena.rounds.filter(function(x) {
									return (x.start + 10000 <= new Date().getTime());
								})
							}
						break;
					}

				//create sandbox from arena data
					for (var j = 0; j < window.inputs.length; j++) {
						switch(inputs[j]) {
							case "arena": //all other inputs can be derived from this one
								var arena = { //for arena, only include rules and rounds data (no id, created, humans, state, or entrants)
									rules: sandbox.rules,
									rounds: sandbox.rounds
								};
							break;

							case "name":
								var name = sandbox.rounds[0].robots[0].name; //can be derived in robot-code as `arguments.callee.name` - it'll still actually be the robot's id
							break;

							case "rules":
								var rules = sandbox.rules;
							break;

							case "rounds":
								var rounds = sandbox.rounds;
							break;

							case "roundCount":
								var roundCount = sandbox.rounds.length - 1;
							break;

							case "currentRound":
								var currentRound = sandbox.rounds[sandbox.rounds.length - 1];
							break;

							case "lastRound":
								var lastRound = sandbox.rounds[sandbox.rounds.length - 2];
							break;

							case "firstRound":
								var firstRound = sandbox.rounds[0];
							break;

							case "robots":
								var robots = sandbox.rounds[sandbox.rounds.length - 1].robots;
							break;

							case "robotCount":
								var robotCount = sandbox.rounds[sandbox.rounds.length - 1].robots.length;
							break;

							case "allCubes":
								var allCubes = sandbox.rounds[sandbox.rounds.length - 1].cubes;
							break;

							case "newCubes":
								var newCubes = sandbox.rounds[sandbox.rounds.length - 1].cubes.slice(-sandbox.rules.cubes.spawnRate);
							break;

							case "self":
								var self = sandbox.rounds[sandbox.rounds.length - 1].robots.find(function(robot) {return robot.name === sandbox.rounds[0].robots[0].name});
							break;

							case "power":
								var power = sandbox.rounds[sandbox.rounds.length - 1].robots.find(function(robot) {return robot.name === sandbox.rounds[0].robots[0].name}).power;
							break;

							case "cubes":
								var cubes = sandbox.rounds[sandbox.rounds.length - 1].robots.find(function(robot) {return robot.name === sandbox.rounds[0].robots[0].name}).cubes;
							break;

							case "action":
								var action = sandbox.rounds[sandbox.rounds.length - 1].robots.find(function(robot) {return robot.name === sandbox.rounds[0].robots[0].name}).action;
							break;

							case "winner":
								var winner = sandbox.rounds[sandbox.rounds.length - 1].winner;
							break;

							case "opponents":
								var opponents = sandbox.rounds[sandbox.rounds.length - 1].robots.filter(function(robot) {return robot.name !== sandbox.rounds[0].robots[0].name});
							break;

							case "colors":
								var colors = sandbox.rules.cubes.colors;
							break;

							case "actions":
								var actions = sandbox.rules.robots.actions;
							break;

							case "conditions":
								var conditions = sandbox.rules.victory.conditions;
							break;
						}
					}

				//clean up code and add path following logs
					for (var line = 0; line < window.code.length; line++) {
						if (window.code[line].replace(/[\n\s\t\}\;\)\,\]]/g,"").length === 0) {
							//no executable code - just space / close brackets
						}
						else if (window.code[line].replace(/[\s]*?\/\/.*?$/g,"").length === 0) {
							//no executable code - just //comments
						}
						else if (window.code[line].replace(/[\s]*?\/\*[^\*\/]*?\*\/[\s]*?$/g,"").length === 0) {
							//no executable code - just /* comments */
						}
						else if ((/^[\s]*[a-zA-Z0-9_\"\']*\:[\s]*[a-zA-Z0-9_\"\']\,?[\s]*$/g).test(window.code[line])) {
							//object
						}
						else if ((/^[\s]*catch/g).test(window.code[line])) {
							//catch block
							window.code[line] = window.code[line].replace(/catch[\s]*\(([a-zA-Z0-9_\"\'])\)[\s]*\{/g, "catch ($1) { \nwindow.lineLog(" + line + ");\n").replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
						}
						else if ((/^[\s]*finally/g).test(window.code[line])) {
							//finally block
							window.code[line] = window.code[line].replace(/finally[\s]*\{/g, "finally { \nwindow.lineLog(" + line + ");\n").replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
						}
						else if ((/^[\s]*else/).test(window.code[line])) {
							//else or else if
							window.code[line] = ("else if (window.lineLog(" + line + ")) {}\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
						}
						else if ((/^[\s]*(case|default)/).test(window.code[line])) {
							// case or default
							window.code[line] = ("case (window.lineLog(" + line + ")):\nbreak;\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
						}
						else {
							//normal code
							window.code[line] = ("window.lineLog(" + line + ");\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
						}
					}

				//execute code
					try {
						window.output = eval("function " + sandbox.rounds[0].robots[0].name + "(" + window.inputs.join(", ") + ") {" + window.code.join("\n") + "} \n " + sandbox.rounds[0].robots[0].name + "(" + window.inputs.join(", ") + ");");
					}
					catch (error) {
						window.output = "";
						$("#console").html("//" + error + "<br>");
					}

					if (window.output === undefined) {
						window.output = "";
					}

				//display code, logs, output, errors
					window.code = window.code.join("\n").replace(/else\ if\ \(window\.lineLog\([\d]*\)\)\ \{\}\n/g,"").replace(/case\ \(window\.lineLog\([\d]*\)\):\nbreak\;\n/g,"").replace(/window\.lineLog\([\d]*\);\n/g,"").replace(/window\.consoleLog\([\d]*\,/g,"console.log("); 
					window.code = window.code.split("\n");

					$("#code").prop("contenteditable",false);
					$("#code").closest(".field_frame").removeClass("active");

					$("#inputs").prop("contenteditable",false);
					$("#inputs").closest(".field_frame").removeClass("active");

					switch (page) {
						case "tutorials":
						case "robots":
							var interval = 1000;
						break;
						case "arenas":
							var interval = 5000 / Math.max(window.lines.length,5);
						break;
					}

					window.evalLoop = setInterval(function() {
						if (window.lines.length > 0) {
							console.log(window.code[window.lines[0]]);
							$("#code").html(window.colorText(window.code.slice(0,window.lines[0]).join("\n").replace(/\n/g,"<br>")) + (window.lines[0] > 0 ? "<br>" : "") + "<div class='live_line'>" + window.colorText(window.code[window.lines[0]]) + "</div>");
							
							var log = window.logs.find(function(l) { return Number(l.substring(0,l.indexOf("::"))) === window.lines[0];});
							if ((typeof log !== "undefined") && (log !== null)) {
								$("#console").html($("#console").html() + "//" + log + "<br>");
								window.logs.splice(window.logs.indexOf(log),1);
							}
							
							window.lines.shift();
						}
						else {
							$("#code").html(window.colorText(window.code.join("\n")));
							$("#output").text(window.output);

							window.logs = [];
							window.lines = [];
							clearInterval(window.evalLoop);

							switch (page) {
								case "tutorials":
									var step = Number($("#step").attr("value")) || 0;
									if ((window.code.join("\n").replace(/\/\/[^\n]*?(\n|$)/g,"").replace(/\/\*[^\*\/]*?(\*\/|$)/g,"").replace(/[\n\s\t\;]/g,"") == window.tutorial.steps[step].end.code.replace(/\/\/[^\n]*?(\n|$)/g,"").replace(/\/\*[^\*\/]*?(\*\/|$)/g,"").replace(/[\n\s\t\;]/g,"")) && (String(window.output).replace(/[\n\s\t\;]/g,"") == window.tutorial.steps[step].end.output.replace(/[\n\s\t\;]/g,"")) && ($("#inputs").text().replace(/[\n\s\t\;]/g,"") == window.tutorial.steps[step].end.inputs.replace(/[\n\s\t\;]/g,""))) {
										$("#instructions").animateText({text: window.tutorial.steps[step].messages.success || "", interval: 50, colorText: true, resizeTop: true});
									}
									else {
										$("#instructions").animateText({text: window.tutorial.steps[step].messages.error || "", interval: 50, colorText: true, resizeTop: true});
									}

									window.animateRobot($(".self").attr("id"), window.output);

									$(".top_inner").find(".indented").show();
									$(".top_inner").find(".section-toggle").removeClass("section-toggle-up").addClass("section-toggle-down").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
									resizeTop();

									setTimeout(function() {
										window.evaluating = false;
										$("#inputs").animateText({text: window.inputs.join(", ") || ""},1000);
										$("#inputs").prop("contenteditable",true).closest(".field_frame").addClass("active");
										$("#code").animateText({text: window.code.join("\n") || ""},1000);
										$("#code").prop("contenteditable",true).closest(".field_frame").addClass("active");
										
										$("#next_step").prop("disabled",false);
									},3000);
								break;
								case "robots":
									window.animateRobot($(".self").attr("id"), window.output);

									$(".top_inner").find(".indented").show();
									$(".top_inner").find(".section-toggle").removeClass("section-toggle-up").addClass("section-toggle-down").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
									$("#message_top").animateText({text: "//eval complete"}, 1000);
									resizeTop();

									setTimeout(function() {
										window.evaluating = false;
										$("#inputs").animateText({text: window.inputs.join(", ") || ""},1000);
										$("#inputs").prop("contenteditable",true).closest(".field_frame").addClass("active");
										$("#code").animateText({text: window.code.join("\n") || ""},1000);
										$("#code").prop("contenteditable",true).closest(".field_frame").addClass("active");
										
										$("#load_robot").prop("disabled",false);
										$("#workshop_save").prop("disabled",false);
										$("#workshop_download").prop("disabled",false);
									},3000);
								break;
								case "arenas":
									window.evaluating = false;
								break;
							}
						}
					},interval);
			}
		}

});