$(document).ready(function() {

	/* * settings * */
		/* delete user */
			$(document).on("click", "#user_cancel", function() {
				$("#user_cancel").hide();
				$("#user_delete").show();
				$("#user_confirm_delete").hide();

				$("#message_top").animateText({text: "//edits canceled"}, 1000);
			});

			$(document).on("click", "#user_delete", function() {
				$("#user_cancel").show();
				$("#user_delete").hide();
				$("#user_confirm_delete").show();
				$("#message_top").animateText({text: "//are you sure you want to delete your account?"}, 1000);
			});

			$(document).on("click", "#user_confirm_delete", function() {
				var data = {
					id: $(".container").attr("value")
				};

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "delete_user",
						data: JSON.stringify(data)
					},
					success: function(results) {
						if (results.success) {
							window.location = results.redirect;
						}
						else {
							$("#user_cancel").hide();
							$("#user_delete").show();
							$("#user_confirm_delete").hide();

							$("#message_top").animateText({text: (results.messages.top || "//unable to delete account")}, 1000);
						}
					}
				});
			});

		/* email */
			$(document).on("click", "#send_verification", function () {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "send_verification",
						email: $("#new_email").val() || null,
					},
					success: function(data) {
						if (data.success) {
							$("#email").find(".message").animateText({text: (data.messages.top || "//verification email sent")}, 1000);
						}
						else {
							$("#email_new").hide();
							$("#email_verify").show();
							$("#email").find(".message").animateText({text: (data.messages.top || "//unable to send verification email")}, 1000);
						}
					}
				});
			});

			$(document).on("click", "#verify_email", function () {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "verify_email",
						email: $("#new_email").val() || null,
						verification: $("#verify_key").val() || null,
					},
					success: function(data) {
						if (data.success) {
							$("#email").find(".message").animateText({text: (data.messages.top || "//email has been verified")}, 1000);
						}
						else {
							$("#email_new").show();
							$("#email_verify").hide();
							$("#email").find(".message").animateText({text: (data.messages.top || "//unable to verify")}, 1000);
						}
					}
				});
			});

		/* name */
			$(document).on("click", "#change_name", function () {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "change_name",
						name: $("#new_name").val() || null,
					},
					success: function(data) {
						if (data.success) {
							$("#current_name").text($("#new_name").val());
							$("#new_name").val("");
							$("#name").find(".message").animateText({text: (data.messages.name || "//name has been changed")}, 1000);
						}
						else {
							$("#new_name").val("");
							$("#name").find(".message").animateText({text: (data.messages.name || "//unable to change name")}, 1000);
						}
					}
				});
			});

		/* color_scheme */
			$(document).on("change", "select#color_scheme", function() {
				var color_scheme = String($("#color_scheme").val());
				console.log(color_scheme);

				switch (color_scheme) {
					case "black_and_white":
						$("#color_style").replaceWith("<style id='color_style'>\
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
							}\
						</style>");
					break;

					case "inverted":
						$("#color_style").replaceWith("<style id='color_style'>\
							:root {\
								--green: #F92672;\
								--blue: #FD971F;\
								--purple: #FFE792;\
								--red: #A6E22E;\
								--orange: #66D9EF;\
								--yellow: #AE81FF;\
								--black: #F8F8F2;\
								--gray: #75715E;\
								--white: #272822;\
								--transparent: rgba(000,000,000,0);\
							}\
						</style>");
					break;

					case "default":
					default:
						$("#color_style").replaceWith("<style id='color_style'>\
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
							}\
						</style>");
					break;
				}
			});

		/* save */
			$(document).on("click", "#settings_save", function() {
				var data = {};
				$("select").each(function() {
					var field = $(this).attr("id");
					var value = $(this).val();
					data[field] = value;
				});

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "edit_settings",
						data: JSON.stringify(data)
					},
					success: function(results) {
						if (results.success) {
							var data = results.data;
							var messages = results.messages;

							$("select").each(function() {
								var field = $(this).attr("id");
								$(this).find(".option").each(function() {
									if ($(this).attr("value") === data[field]) {
										$(this).prop("selected", "true");
									}
									else {
										$(this).prop("selected", "false");
									}
								});
								$("#" + field).closest(".section").find(".message").animateText({text: (messages[field] || "")}, 1000);
							});
						}

						$("#message_top").animateText({text: (messages.top || "//settings updated")}, 1000);
					}
				});
			});
		
		/* destroy session */
			$(document).on("click", ".session_destroy", function() {
				var session = $(this).closest(".session").attr("id");

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "destroy_session",
						session: session
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#sessions").find(".message").animateText({text: (data.messages.sessions || "//unable to destroy session")}, 1000);
						}
					}
				});
			});

});
