/*** users ***/
	$(document).ready(function() {
		resizeTop();

		/* avatar */
			$(document).on("change", "#avatar_color select", function() {
				var value = $("#avatar_color select").val();
				$("#avatar_color").css("color",value);
				$("#avatar_pre").css("color",value);
			});

		/* edit */
			$(document).on("click", "#user_edit", function() {
				$("#user_edit").hide();
				$("#user_save").show();
				$("#user_cancel").show();
				
				/* avatar */
					$("#avatar_color").show();

				$(".field").prop("contenteditable",true).closest(".field_frame").addClass("active");
				$(".message").text("");
				$("#message_top").animateText({text: "//now editing"}, 1000);

				resizeTop();
			});

			$(document).on("click", "#user_cancel", function() {
				$("#user_edit").show();
				$("#user_save").hide();
				$("#user_cancel").hide();

				/* avatar */
					$("#avatar_color").hide();
					$("#avatar_pre").css("color", ($("#avatar_pre").attr("value") || "var(--white)"));

				$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
				$(".field").each(function() {
					var value = $(this).attr("value");
					$(this).text(value);
				});
				$("#message_top").animateText({text: "//edits canceled"}, 1000);

				resizeTop();
			});

			$(document).on("click", "#user_save", function() {
				var data = {};
				$(".field").each(function() {
					var field = $(this).attr("id");
					var value = $(this).html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"");
					data[field] = value;
				});

				/* avatar */
					data.avatar = {
						color: ($("#avatar_color select").val() || "var(--white)")
					}

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
								$(this).closest(".section").find(".message").animateText({text: (messages[$(this).attr("id")] || "")}, 1000);
							});
						}

						$("#user_edit").show();
						$("#user_save").hide();
						$("#user_cancel").hide();

							/* avatar  */
								$("#avatar_color").hide();
								$("#avatar_pre").css("color", (data.avatar.color || "var(--white)"));
								$("#avatar").find(".message").animateText({text: (messages["avatar"] || "")}, 1000);

								var previousColor = $("#avatar_pre").attr("value") || "var(--white)";
								$("#avatar_pre").css("color", data.avatar.color || previousColor);
								$("#avatar_color").css("color", data.avatar.color || previousColor);

						$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
						$("#message_top").animateText({text: (messages.top || "//edits submitted")}, 1000);

						resizeTop();
					}
				});
			});
		
		/* robots */
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
							$("#message_top").animateText({text: (data.messages.top || "//unable to create robot")}, 1000);
						}
					}
				});
			});
	});
