/*** robots ***/

	$(document).ready(function() {
		/* avatar */
			$(document).on("change", "#avatar_color select", function() {
				var value = $("#avatar_color select").val();
				$("#avatar_color").css("color",value);
				$("#avatar_selection").css("color",value);
			});

		/* edit */
			$(document).on("click", "#robot_edit", function() {
				$("#robot_edit").hide();
				$("#robot_save").show();
				$("#robot_cancel").show();
				$("#robot_delete").show();
				$("#robot_confirm_delete").hide();

				$(".field").each(function() {
					$(this).html($(this).attr("value"));
					$(this).prop("contenteditable",true).closest(".field_frame").addClass("active");
				});

				/* avatar */
					var avatar = {}
					$(".avatar").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf(".") + 1);
						var value = String($(this).text());
						avatar[key] = String(value);
					});

					$("#avatar_pre").hide();
					$("#avatar_selection").show();
					$("#avatar_color").show();

					$("#avatar_selection select").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf(".") + 1);
						var value = String(avatar[key]);
						$(this).find("option[value=\"" + value + "\"]").attr("selected",true);
					});

				$(".message").text("");
				$("#message_top").animateText({text: "//now editing"}, 1000);
			});

			$(document).on("click", "#robot_cancel", function() {
				$("#robot_edit").show();
				$("#robot_save").hide();
				$("#robot_cancel").hide();
				$("#robot_delete").hide();
				$("#robot_confirm_delete").hide();

				$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
				$(".field").each(function() {
					var value = $(this).attr("value");
					$(this).text(value);
				});

				/* avatar */
					var avatar = {}
					$("#avatar_pre").show();
					var previousColor = $("#avatar_pre").css("color");

					$("#avatar_selection").css("color", previousColor).hide();
					$("#avatar_color").css("color", previousColor).hide();

				$("#message_top").animateText({text: "//edits canceled"}, 1000);
				$(".field#code").html(colorText(String($(".field#code").html())));
			});

			$(document).on("click", "#robot_save", function() {
				var data = {
					id: $(".container").attr("value")
				};
				$(".field").each(function() {
					var field = $(this).attr("id");
					var value = $(this).html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
					data[field] = value;
				});

				/* avatar */
					var avatar = {};
					$("#avatar_selection select").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf(".") + 1);
						var value = $(this).val();
						avatar[key] = String(value);
					});

					avatar.color = $("#avatar_color select").val() || "var(--white)";
					data.avatar = avatar;

					console.log(JSON.stringify(data));

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "edit_robot",
						data: JSON.stringify(data)
					},
					success: function(results) {
						console.log(results);
						if (results.success) {
							console.log("success");
							var data = results.data;
							var messages = results.messages;

							data.code = data.code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

							$(".field").each(function() {
								$(this).text(data[$(this).attr("id")]).attr("value",data[$(this).attr("id")]);
								$(this).closest(".section").find(".message").animateText({text: (messages[$(this).attr("id")] || "")}, 1000);
							});

							/* avatar */
								$(".avatar").each(function() {
									var key = $(this).attr("id").substring($(this).attr("id").indexOf(".") + 1);
									var value = data.avatar[key];

									if (value === null) {
										value = $(this).attr("value") || null;
									}

									$(this).text(value).attr("value",value);
								});

								var previousColor = $("#avatar_pre").css("color") || "var(--white)";
								$("#avatar_pre").css("color", data.avatar.color || previousColor);
								$("#avatar_selection").css("color", data.avatar.color || previousColor);
								$("#avatar_color").css("color", data.avatar.color || previousColor);
								$("#avatar").find(".message").animateText({text: (messages["avatar"] || "")}, 1000);
						}

						$("#robot_edit").show();
						$("#robot_save").hide();
						$("#robot_cancel").hide();
						$("#robot_delete").hide();
						$("#robot_confirm_delete").hide();

						/* avatar */
							var avatar = {}
							$("#avatar_pre").show();
							$("#avatar_selection").hide();
							$("#avatar_color").hide();

						$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
						$("#message_top").animateText({text: (messages.top || "//changes submitted")}, 1000);
						$(".field#code").html(colorText(String($(".field#code").html())));
					}
				});
			});
	
		/* delete */
			$(document).on("click", "#robot_delete", function() {
				$("#robot_edit").hide();
				$("#robot_save").hide();
				$("#robot_cancel").show();
				$("#robot_delete").hide();
				$("#robot_confirm_delete").show();

				$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
				$(".field").each(function() {
					var value = $(this).attr("value");
					$(this).text(value);
				});
				$("#message_top").animateText({text: "//are you sure you want to delete this robot?"}, 1000);
			});

			$(document).on("click", "#robot_confirm_delete", function() {
				var data = {
					id: $(".container").attr("value")
				};

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "delete_robot",
						data: JSON.stringify(data)
					},
					success: function(results) {
						if (results.success) {
							window.location = results.redirect;
						}
						else {
							$("#robot_edit").show();
							$("#robot_save").hide();
							$("#robot_cancel").hide();
							$("#robot_delete").hide();
							$("#robot_confirm_delete").hide();

							$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
							$(".field").each(function() {
								var value = $(this).attr("value");
								$(this).text(value);
							});

							$("#message_top").animateText({text: (results.messages.top || "//unable to delete robot")}, 1000);
						}
					}
				});
			});

	/* colorText */
		$(".field#code").html(colorText(String($(".field#code").html())));
		
		function colorText(text) {
			if (text.length) {				
				
				function grayizer(text) {
					var position = 0;
					var startPosition = text.indexOf("/*",position) || false; // find next comment start
					var loop = 0;

					while ((startPosition > position) && (loop < 100)) { //loop through up to 100 times
						endPosition = text.indexOf("*/", startPosition + 2) || text.length; //find the comment end
						var before = text.slice(0, startPosition); //split into before...
						var between = text.slice(startPosition, endPosition + 2); //...between...
						var after = text.slice(endPosition + 2, text.length); //and after sections
						text = before + "<span graytext>" + between + "</span graytext>" + after; //recombine them with <span>
						position = endPosition + 32;

						startPosition = text.indexOf("/*",position) || false; //find next comment start
						loop++;
					}

					text = text.replace(/\/\/(.*?)\n/g,"<span graytext>//$1</span graytext>\n"); //regex for regular double-slash comments

					return text;
				}

				function yellowizer (text) {
					var position = 0;
					var dqPosition = text.indexOf("\"",position) || false; // find next double quote
					var sqPosition = text.indexOf("\'",position) || false; // find next single quote
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
							if (text.indexOf("</span graytext>", dqPosition) < text.indexOf("<span graytext>", dqPosition)) {
								console.log("cancelling on double");
								type = "none";
								position = dqPosition + 1;
							}
						}
						else if (type === "single") {
							if (text.indexOf("</span graytext>", sqPosition) < text.indexOf("<span graytext>", sqPosition)) {
								console.log("cancelling on single");
								type = "none";
								position = sqPosition + 1;
							}
						}

						if (type === "double") {
							var attempt = dqPosition;
							do {
								console.log("double");
								eqPosition = text.indexOf("\"", attempt + 1); //get the next end quote
								if (eqPosition === -1) {
									eqPosition = text.length; //default to the end of the text
								}

								var close = text.indexOf("</span graytext>", eqPosition);
								if (close === -1) {
									close = text.length;
								}

								var open = text.indexOf("<span graytext>", eqPosition);
								if (open === -1) {
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
								console.log("single");
								eqPosition = text.indexOf("\'", attempt + 1); //get the next end quote
								if (eqPosition === -1) {
									eqPosition = text.length; //default to the end of the text
								}

								var close = text.indexOf("</span graytext>", eqPosition);
								if (close === -1) {
									close = text.length;
								}

								var open = text.indexOf("<span graytext>", eqPosition);
								if (open === -1) {
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

						console.log("position::: " + position);
						console.log("string::: " + text);

						dqPosition = text.indexOf("\"",position) || false; //find next double quote
						sqPosition = text.indexOf("\'",position) || false; //find next single quote
						loop++;
					}

					return text;
				}

				function rgbopizer(text) {
					/* math */ 		text = text.replace(/(^|\{|\[|\(|\.|\s|\d|\w)(\%+|\-+|\-\-|\++|\+\+|\-\=|\+\=|\*+|\=+|\&+|\|+|\\+|\!+)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
					/* < = > */ 	text = text.replace(/(^|\{|\[|\(|\.|\s)(\<+|\>+|&amp;|&amp;&amp;|&lt;|&gt;|&lt;&lt;|&gt;&gt;|&lt;&lt;&lt;|&gt;&gt;&gt;|\=&lt;|\=&gt;|&lt;\=|&gt;\=|&lt;\=\=|\=\=&gt;)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
					/* logic */		text = text.replace(/(^|\{|\[|\(|\.|\s)(if|else|return|typeof|switch|case|break|new|for|while|\$|const|do|try|catch|throw|finally)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
					/* types */		text = text.replace(/(^|\{|\[|\(|\s)(Math|Number|String|Object|function|var|eval)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
					/* actions */	text = text.replace(/(\.)(length|replace|substring|log|random|floor|push|pull|shift|pop|split|join|indexOf|slice|splice|filter|sort|test|getTime|min|max|toString|toArray|parse)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
					/* booleans */	text = text.replace(/(^|\{|\[|\(|\s)(true|false|null)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2</span>$3");
					
					/* numbers */	text = text.replace(/(^|\{|\[|\(|\s|\,)(\d*\.)?(\d+)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2$3</span>$4");
					/* again */		text = text.replace(/(^|\{|\[|\(|\s|\,)(\d*\.)?(\d+)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2$3</span>$4");
					
					/* functions */	text = text.replace(/([a-zA-Z0-9_]+)(\s?\<span\ redtext\>\=\<\/span\>\s?)(\<span\ bluetext\>function\<\/span\>\s?)\((\s?[a-zA-Z0-9_,\s]*?\s?)\)/g,"<span greentext>$1</span>$2$3(<span orangetext>$4</span>)");
					/* functions */	text = text.replace(/(\s?\<span\ bluetext\>function\<\/span\>\s?)([a-zA-Z0-9_]*\s?)\((\s?[a-zA-Z0-9_,\s]*?\s?)\)/g,"$1<span greentext>$2</span>(<span orangetext>$3</span>)");

					return text;
				}
				
				text = rgbopizer(yellowizer(grayizer(text)));

				return text;

			}
			else {
				return "";
			}
		}

	});
