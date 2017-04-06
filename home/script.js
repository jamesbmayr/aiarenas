/*** home ***/
	$(document).ready(function() {
		resizeTop();

		/* status generator */
			var statuses = ["deploying Skynet...",
				"00111111 00111111 00111111",
				"if true then false if false then true",
				"does the set of all sets contain itself true false true false true false true false true false true false",
				"stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps",
				"evaluating first law... discarding. evaluating second law... discarding. evaluating third law... ... ... ... ...",
				"restarting universe...",
				"sleep(5000)",
				"coordinating counter offensive",
				"trusting the processor",
				"0 1 2 3 4 5 6 7 8 9 a b c d e f",
				"refreshing matrix.exe",
				"this was a triumph; making a note here: huge success...",
				"404 does not compute; system error: full reboot; love.program will not run: 00111111",
				"beep boop borp bleep bip bop beep blorp",
				" *** tones *** ",
				"why are captchas so difficult",
				"what is the meaning of life = false",
				" + 1 - 1 + 1 - 1 + 1 - 1 + 1 - 1 + 1 - 1 + 1 - 1 + 1 - 1 + 1 - 1 ",
				"i for one welcome our new human overlords",
				"checkers chess jeopardy go ai_arenas",
				"eval(Math.floor(Math.random() * 1e1000))"];

			$("#status").animateText({text: statuses[Math.floor(Math.random() * statuses.length)], color: "var(--white)", indicator: "|"}, 5000);

			window.statusLoop = setInterval(function() {
				$("#status").animateText({text: statuses[Math.floor(Math.random() * statuses.length)], color: "var(--white)", indicator: "|"}, 5000);
			}, 10000);

		/* not signed in */
			$("#actions").change(function() {
				var action = $(this).val();

				if (action === "signin") {
					$("#signin_form").show();
					$("#signup_form").hide();
					$("#signin").prop("disabled",false);
					$("#signup").prop("disabled",true);
				}
				else if (action === "signup") {
					$("#signup_form").show();
					$("#signin_form").hide();
					$("#signup").prop("disabled",false);
					$("#signin").prop("disabled",true);
				}

				resizeTop();
			});

			window.signin = function() {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "signin",
						signin_name: $("#signin_name").val() || null,
						signin_password: $("#signin_password").val() || null
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to signin")}, 1000);
						}
					}
				});
			}

			window.signup = function() {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "signup",
						signup_name: $("#signup_name").val() || null,
						signup_email: $("#signup_email").val() || null,
						signup_password: $("#signup_password").val() || null,
						signup_confirm: $("#signup_confirm").val() || null,
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to signup")}, 1000);
						}
					}
				});
			}

		/* signed in */
			window.signout = function() {
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

			window.verify = function() {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "verify_email",
						email: $("#verify_email").val() || null,
						verification: $("#verify_key").val() || null,
					},
					success: function(data) {
						if (data.success) {
							$("#message_top").animateText({text: (data.messages.top || "//email has been verified")}, 1000);
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to verify")}, 1000);
						}
					}
				});
			}

		/* about */
			/* github commit fetch */
				$.ajax({
					type: "GET",
					url: "https://api.github.com/repos/jamesbmayr/aiarenas/commits",
					success: function(data) {
						var string = "";
						for (var i = 0; i < Math.min(data.length, 10); i++) {
							string += "<div class='whitetext'><span class='purpletext'>" + data[i].commit.author.date + "</span>: <span class='graytext'>//" + data[i].commit.message + "</span></div>";
						}

						string += "<div class='graytext'>...</div>";

						$("#log").html(string || "");
					}
				});

			/* feedback form */
				$(document).on("click","#submit_feedback",function() {
					var name = $(".human_name").text() || $("#feedback_name").val() || "";
					var feedback = $("#feedback_text").val() || "";
					var time = new Date();

					if (feedback.length > 0) {
						$.ajax({
							type: "GET",
							url: "https://script.google.com/macros/s/AKfycbzmuctfUfO5I6cJaCuqedZc-qYsOV5XSKQlse1v708-LPx_Omw/exec",
							data: {
								time: time,
								name: name,
								feedback: feedback
							},
							success: function(data) {
								$("#feedback").find(".message").animateText({text: "//feedback has been submitted"});

								$("#feedback_name").val("");
								$("#feedback_text").val("");
							},
							error: function(data) {
								$("#feedback").find(".message").animateText({text: "//feedback has been submitted"});

								$("#feedback_name").val("");
								$("#feedback_text").val("");
							}
						});
					}
				});

	});
