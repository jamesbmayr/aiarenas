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

	/* robot */
		$(document).on("click", "#robot_edit", function() {
			$("#robot_edit").hide();
			$("#robot_save").show();
			$("#robot_cancel").show();
			$("#robot_delete").show();
			$("#robot_confirm_delete").hide();

			$(".field").prop("contenteditable",true).closest(".field_frame").addClass("active");
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
		});

		$(document).on("click", "#robot_save", function() {
			var data = {
				id: $("#container").attr("value")
			};
			$(".field").each(function() {
				var field = $(this).attr("id");
				var value = $(this).html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"");
				console.log(value);
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

		
});