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

	/* user */
		$(document).on("click", "#user_edit", function() {
			$("#user_edit").hide();
			$("#user_save").show();
			$("#user_cancel").show();

			$(".field").prop("contenteditable",true).closest(".field_frame").addClass("active");
			$(".message").text("");
			$("#message_top").text(" //now editing");
		});

		$(document).on("click", "#user_cancel", function() {
			$("#user_edit").show();
			$("#user_save").hide();
			$("#user_cancel").hide();

			$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
			$(".field").each(function() {
				var value = $(this).attr("value");
				$(this).text(value);
			});
			$("#message_top").text(" //edits canceled");
		});

		$(document).on("click", "#user_save", function() {
			var data = {};
			$(".field").each(function() {
				var field = $(this).attr("id");
				var value = $(this).html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"");;
				data[field] = value;
			});

			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "edit_user",
					data: JSON.stringify(data)
				},
				success: function(results) {
					if (results.success) {
						var data = results.data;
						var messages = results.messages;

						$(".field").each(function() {
							$(this).text(data[$(this).attr("id")]).attr("value",data[$(this).attr("id")]);
							$(this).closest(".section").find(".message").text(messages[$(this).attr("id")] || "");
						});
					}

					$("#user_edit").show();
					$("#user_save").hide();
					$("#user_cancel").hide();
					$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
					$("#message_top").text(messages.top || " //edits submitted");
				}
			});
		});

		$("#user_create_robot").click(function() {
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
						$("#message_top").text( data.messages.top || " //unable to create robot");
					}
				}
			});
		});
});