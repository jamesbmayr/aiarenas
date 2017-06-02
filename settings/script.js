/*** settings ***/
	$(document).ready(function() {
		resizeTop();

		/* delete human */
			window.human_cancel = function() {
				$("#human_cancel").hide();
				$("#human_delete").show();
				$("#confirm_delete_form").hide();

				$("#delete").find(".message").animateText({text: "//canceled human deletion"}, 1000);
			}

			window.human_delete = function() {
				$("#human_cancel").show();
				$("#human_delete").hide();
				$("#confirm_delete_form").show();
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
						current_password: $("#delete_current_password").val() || null,
						data: JSON.stringify(data)
					},
					success: function(results) {
						if (results.success) {
							window.location = results.redirect;
						}
						else {
							$("#human_cancel").hide();
							$("#human_delete").show();
							$("#confirm_delete_form").hide();

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
						current_password: $("#email_current_password").val() || null,
						email: $("#new_email").val() || null,
					},
					success: function(data) {
						if (data.success) {
							$("#email").find(".message").animateText({text: (data.messages.email || "//verification email sent")}, 1000);
						}
						else {
							$("#email").find(".message").animateText({text: (data.messages.email || "//unable to send verification email")}, 1000);
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
						current_password: $("#name_current_password").val() || null,
						name: $("#new_name").val() || null,
					},
					success: function(data) {
						if (data.success) {
							var new_name = $("#new_name").val();
							$("#current_name").text(new_name);
							$("#new_name").val("");
							$("#name").find(".message").animateText({text: (data.messages.name || "//name updated")}, 1000);
							$("#navbar_humans").find(".human_name").find(".bluetext").text(new_name);
							$("#navbar_humans").find(".human_name").attr("href","../../../../humans" + new_name);
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
						current_password: $("#password_current_password").val() || null,
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
								--orange: rgb(255, 51, 453);\
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
