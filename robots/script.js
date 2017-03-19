$(document).ready(function() {

	/* navbar */
		$("#navbar_open").click(function() {
			$("#navbar_open").animate({left: "+=200px"}, 500);
			$("#navbar_open").find(".glyphicon").animate({opacity: 0},500);
			setTimeout(function() {
				$("#navbar_open").hide();
			}, 500);
			
			$("#navbar_close").show().animate({left: "+=200px"}, 500);
			$("#navbar_close").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "+=200px"}, 500);
		});

		$("#navbar_close").click(function() {
			$("#navbar_close").animate({left: "-=200px"}, 500);
			$("#navbar_close").find(".glyphicon").animate({opacity: 0},500);;
			setTimeout(function() {
				$("#navbar_close").hide();
			}, 500);

			$("#navbar_open").show().animate({left: "-=200px"}, 500);
			$("#navbar_open").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "-=200px"}, 500);
		});

		$("#navbar_signout").click(function() {
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
		});

		$("#navbar_create_robot").click(function() {
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
					}
				}
			});
		});

		$("#navbar_create_arena").click(function() {
			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "create_arena",
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
		});

		$("#navbar_join_arena").click(function() {
			var arena_id = $("#navbar_arena_id").val();

			if (arena_id.length === 4) {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "join_arena",
						arena_id: arena_id
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#navbar_message").text(data.messages.navbar || "//unable to join");
						}
					}
				});
			}
			else {
				$("#navbar_arena_id").css("border-color","var(--red)");
			}
		});

	/* sectionToggle */
		$(document).on("click", ".section-toggle", function() {
			if ($(this).hasClass("section-toggle-down")) {
				$(this).next().next().animate({
					height: 0
				},1000);

				$(this).replaceWith('<span class="glyphicon glyphicon-chevron-up section-toggle section-toggle-up whitetext"></span>');
			}
			else if ($(this).hasClass("section-toggle-up")) {
				var height = $(this).next().next().hide().css("height","auto").css("height");

				$(this).next().next().css("height",0).show().animate({
					height: height
				},1000);

				$(this).replaceWith('<span class="glyphicon glyphicon-chevron-down section-toggle section-toggle-down whitetext"></span>');
			}
		});

	/* robot */
		$(".field#code").html(colorText(String($(".field#code").html())));

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
			$(".message").text("");
			$("#message_top").text(" //now editing");
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
			$("#message_top").text(" //edits canceled");
			$(".field#code").html(colorText(String($(".field#code").html())));
		});

		$(document).on("click", "#robot_save", function() {
			var data = {
				id: $("#container").attr("value")
			};
			$(".field").each(function() {
				var field = $(this).attr("id");
				var value = $(this).html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
				data[field] = value;
			});

			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "edit_robot",
					data: JSON.stringify(data)
				},
				success: function(results) {
					if (results.success) {
						console.log("success");
						var data = results.data;
						var messages = results.messages;

						data.code = data.code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

						$(".field").each(function() {
							$(this).text(data[$(this).attr("id")]).attr("value",data[$(this).attr("id")]);
							$(this).closest(".section").find(".message").text(messages[$(this).attr("id")] || "");
						});
					}

					$("#robot_edit").show();
					$("#robot_save").hide();
					$("#robot_cancel").hide();
					$("#robot_delete").hide();
					$("#robot_confirm_delete").hide();

					$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
					$("#message_top").text(messages.top || " //edits submitted");
					$(".field#code").html(colorText(String($(".field#code").html())));
				}
			});
		});

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
			$("#message_top").text(" //are you sure you want to delete this robot?");
		});

		$(document).on("click", "#robot_confirm_delete", function() {
			var data = {
				id: $("#container").attr("value")
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

						$("#message_top").text(results.messages.top || " //unable to delete robot");
					}
				}
			});
		});

	/* colorText */
		function colorText(text) {
			if (text.length) {
				text = text.split("\"");
				for (var h = 0; h < text.length; h++) {
					if (h % 2 === 1) {
						text[h] = "<span yellowtext>\"" + text[h] + "\"</span>";
					}
					else {
						subtext = text[h].split("\'");
						for (var i = 0; i < subtext.length; i++) {
							if (i % 2 === 1) {
								subtext[i] = "<span yellowtext>\'" + subtext[i] + "\'</span>";
							}
							else {
								// subsubtext = text[i].split("\"");
								// for (var j = 0; j < subsubtext.length; j++) {
								// 	if (j % 2 === 1) {
								// 		subsubtext[j] = "<span yellowtext>\"" + subsubtext[j] + "\"</span>";
								// 	}
								// }
								// subtext[i] = subsubtext.join("");
							}
						}
						text[h] = subtext.join("");
					}
				}
				text = text.join("");
				text = text.replace(/(^|\{|\[|\(|\.|\s|\d|\w)(\%+|\-+|\-\-|\++|\+\+|\-\=|\+\=|\*+|\=+|\&+|\|+|\\+|\!+)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
				text = text.replace(/(^|\{|\[|\(|\.|\s)(\<+|\>+|&lt;|&gt;|&lt;&lt;|&gt;&gt;|&lt;&lt;&lt;|&gt;&gt;&gt;|\=&lt;|\=&gt;|&lt;\=|&gt;\=|&lt;\=\=|\=\=&gt;)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
				text = text.replace(/(^|\{|\[|\(|\.|\s)(if|else|return|typeof|switch|case|break|new|for|while|\$|const)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span redtext>$2</span>$3");
				text = text.replace(/(^|\{|\[|\(|\s)(Math|Number|String|Object|function|var|eval)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
				text = text.replace(/(\.)(length|replace|substring|log|random|floor|push|pull|shift|pop|split|join|indexOf|slice|splice|filter|sort|test|getTime|min|max|toString|toArray|parse)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span bluetext>$2</span>$3");
				text = text.replace(/(^|\{|\[|\(|\s)(true|false|null)(\s|\.|\,|\)|\(|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2</span>$3");
				
				text = text.replace(/(^|\{|\[|\(|\s|\,)(\d*\.)?(\d+)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2$3</span>$4");
				text = text.replace(/(^|\{|\[|\(|\s|\,)(\d*\.)?(\d+)(\s|\.|\,|\)|\]|\}|\;|\:|$)/g,"$1<span purpletext>$2$3</span>$4");
				
				text = text.replace(/([a-zA-Z0-9_]*)(\s?\<span\ redtext\>\=\<\/span\>\s?)(\<span\ bluetext\>function\<\/span\>)\((\s?[a-zA-Z0-9_,\s]*?\s?)\)/g,"<span greentext>$1</span>$2$3(<span orangetext>$4</span>)");
				text = text.replace(/(\s?\<span\ bluetext\>function\<\/span\>\s?)([a-zA-Z0-9_]*\s?)\((\s?[a-zA-Z0-9_,\s]*?\s?)\)/g,"$1<span greentext>$2</span>(<span orangetext>$3</span>)");
				
				text = text.replace(/\/\/(.*?)\n/g,"<span graytext>//$1</span>\n");
				text = text.split(/\/\*|\*\//);
				for (var i = 0; i < text.length; i++) {
					if (i % 2 === 1) {
						text[i] = "<span graytext>/*" + text[i] + "*/</span>";
					}
				}
				text = text.join("");

				return text;

			}
			else {
				return "";
			}
		}	

});