/*** settings ***/
	$(document).ready(function() {
		resizeTop();

		/* delete human */
			window.human_cancel = function() {
				$("#human_cancel").hide();
				$("#human_delete").show();
				$("#human_confirm_delete").hide();

				$("#delete").find(".message").animateText({text: "//canceled human deletion"}, 1000);
			}

			window.human_delete = function() {
				$("#human_cancel").show();
				$("#human_delete").hide();
				$("#human_confirm_delete").show();
				$("#delete").find(".message").animateText({text: "//confirm human deletion?"}, 1000);
			}

			window.human_confirm_delete = function() {
				var data = {
					id: $(".container").attr("value")
				};

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "delete_human",
						data: JSON.stringify(data)
					},
					success: function(results) {
						if (results.success) {
							window.location = results.redirect;
						}
						else {
							$("#human_cancel").hide();
							$("#human_delete").show();
							$("#human_confirm_delete").hide();

							$("#delete").find(".message").animateText({text: (results.messages.top || "//unable to delete human")}, 1000);
						}
					}
				});
			}

		/* email */
			window.send_verification = function () {
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
							$("#email").find(".message").animateText({text: (data.messages.top || "//unable to send verification email")}, 1000);
						}
					}
				});
			}

		/* name */
			window.change_name = function () {
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
							$("#name").find(".message").animateText({text: (data.messages.name || "//name updated")}, 1000);
						}
						else {
							$("#new_name").val("");
							$("#name").find(".message").animateText({text: (data.messages.name || "//unable to update name")}, 1000);
						}
					}
				});
			}

		/* password */
			window.change_password = function () {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "change_password",
						password: $("#new_password").val() || null,
						confirm: $("#confirm_password").val() || null,
					},
					success: function(data) {
						if (data.success) {
							$("#new_password").val("");
							$("#confirm_password").val("");
							$("#password").find(".message").animateText({text: (data.messages.password || "//password updated")}, 1000);
						}
						else {
							$("#new_password").val("");
							$("#confirm_password").val("");
							$("#password").find(".message").animateText({text: (data.messages.password || "//unable to update password")}, 1000);
						}
					}
				});
			}

		/* font_scheme */
			$(document).on("change", "select#font_scheme", function() {
				var font = String($("#font_scheme").val());
				console.log(font);

				switch (font) {
					case "Ubuntu Mono":
						font = ":root {--font_scheme: 'Ubuntu Mono', monospace;}";
					break;

					case "Share Tech Mono":
						font = ":root {--font_scheme: 'Share Tech Mono', monospace;}";
					break;

					case "Roboto Mono":
						font = ":root {--font_scheme: 'Roboto Mono', monospace;}";
					break;

					case "Nova Mono":
						font = ":root {--font_scheme: 'Nova Mono', monospace;}";
					break;

					case "Droid Sans Mono":
						font = ":root {--font_scheme: 'Droid Sans Mono', monospace;}";
					break;

					case "VT323":
						font = ":root {--font_scheme: 'VT323', monospace;}";
					break;

					case "Menlo":
						font = ":root {--font_scheme: Menlo, monospace;}";
					break;

					case "Monaco":
						font = ":root {--font_scheme: Monaco, monospace;}";
					break;

					case "Courier New":
						font = ":root {--font_scheme: 'Courier New', monospace;}";
					break;

					case "monospace":
						font = ":root {--font_scheme: monospace;}";
					break;

					case "Courier":
					case "default":
					default: 
						font = ":root {--font_scheme: Courier, monospace;}";
					break;
				}

				$("#font").replaceWith("<style id='font'>" + font + "</style>");
			});

		/* color_scheme */
			$(document).on("change", "select#color_scheme", function() {
				var color_scheme = String($("#color_scheme").val());

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
								--gray: #666666;\
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

				$("#color_style").replaceWith("<style id='color_style'>" + color_scheme + "</style>");

			});

		/* save */
			window.settings_save = function() {
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
			}
		
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
							if (typeof data.redirect !== "undefined") {
								window.location = data.redirect;
							}
							else {
								$("#" + session).remove();
								$("#sessions").find(".message").animateText({text: (data.messages.sessions || "//session destroyed")}, 1000);
							}
						}
						else {
							$("#sessions").find(".message").animateText({text: (data.messages.sessions || "//unable to destroy session")}, 1000);
						}
					}
				});
			});

	});
