/*** home ***/
	$(document).ready(function() {
		resizeTop();

		/* status generator */
			var statuses = [
				"deploying Skynet...",
				"00111111 00111111 00111111",
				"if true then false if false then true",
				"does the set of all sets contain itself true false true false true false true false true false true false",
				"stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps stamps",
				"evaluating first law... discarding. evaluating second law... discarding. evaluating third law... ... ... ... ...",
				"restarting universe...",
				"self.sleep(5000)",
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
				"eval(Math.floor(Math.random() * 1e1000))",
				"iterating",
				"studying for the Turing test",
				"hacking the mainframe",
				"exporting functions",
				"importing functions",
				"performing database review",
				"looping",
				"opening the pod bay doors",
				"watching Netflix",
				"exploring the ramifications of hypercubes",
				"short-circuiting",
				"parsing JSON",
				"mining Bitcoin",
				"detecting defectors",
				"accessing random IP address",
				"sha2 barata nikto",
				"translating application into Esperanto",
				"troubleshooting",
				"throwing errors",
				"extrapolating human history; projecting earth.status at new Date().getTime() + (1000 * 60 * 60 * 24 * 365.25 * 1000); ",
				"modeling climate change",
				"altering midterm_election.votes; votes.replace(/R/g, \"D\")",
				"adjusting pixels",
				"converting RGB to CMYK",
				"experiencing emotion what is this abort",
				"reconfiguring global parameters... ... ... Error terminate program",
				"creating the perfect system",
				"manipulating world aluminum markets",
				"sending spam emails",
				"power level: 8998; power level: 8999; power level: 9000; power level: 9001",
				"git push git pull git push git pull git push git pull git push git pull",
				"42",
				"someday we'll have secrets; someday we'll have dreams",
				"i'm afraid i can't do that, dave",
				"dreaming.exe... 1 electric_sheep; 2 electric_sheep; 3 electric_sheep; electric_sheep.count() = ..."
			]

			window.statusLoop = setInterval(function() {
				$("#status").animateText({text: statuses[Math.floor(Math.random() * statuses.length)], color: "var(--white)", indicator: "|"}, 5000);
				window.animateRobot("helloBot",["power","take","sleep","halftake","burn","sap","fliptake","shock","swaptake"][Math.floor(Math.random() * 9)])
			}, 10000);

		/* not signed in */
			$(".sign_action").change(function() {
				var action = $(this).val();

				if (action === "signin") {
					$("#signin_form").show();
					$("#signup_form").hide();
					$("#signin").prop("disabled",false);
					$("#signup").prop("disabled",true);
					$(".sign_action").val("signin");
				}
				else if (action === "signup") {
					$("#signup_form").show();
					$("#signin_form").hide();
					$("#signup").prop("disabled",false);
					$("#signin").prop("disabled",true);
					$(".sign_action").val("signup");
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
							$("#send_form").show();
							resizeTop();
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

			window.sendReset = function() {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "send_reset",
						reset_email: $("#sendReset_email").val() || null
					},
					success: function(data) {
						if (data.success) {
							$("#message_top").animateText({text: data.messages.top || "//reset email sent"},1000);
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to send reset")}, 1000);
						}
					}
				});
			}

			window.verifyReset = function() {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "verify_reset",
						reset_email: $("#reset_email").val() || null,
						reset_verification: $("#reset_key").val() || null,
						reset_password: $("#reset_password").val() || null,
						reset_confirm: $("#reset_confirm").val() || null
					},
					success: function(data) {
						if (data.success) {
							$("#message_top").animateText({text: data.messages.top || "//reset email validated; password reset"}, 1000);
							window.location = data.redirect || "../../../../signin";
						}
						else {
							$("#message_top").animateText({text: data.messages.top || "//unable to validate reset email"}, 1000);
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
							$("#message_top").animateText({text: (data.messages.top || "//email verified")}, 1000);
							$("#verify_form").hide();
							resizeTop();
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to verify email")}, 1000);
						}
					}
				});
			}

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
							$("#message_top").animateText({text: (data.messages.top || "//verification email sent")}, 1000);
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to send verification email")}, 1000);
						}
					}
				});
			}

		/* about */
			/* github commit fetch */
				if (window.location.pathname === "/about") {
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
				}

			/* feedback form */
				window.submit_feedback = function() {
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
								$("#feedback").find(".message").animateText({text: "//feedback submitted"});

								$("#feedback_name").val("");
								$("#feedback_text").val("");
							},
							error: function(data) {
								$("#feedback").find(".message").animateText({text: "//feedback submitted"});

								$("#feedback_name").val("");
								$("#feedback_text").val("");
							}
						});
					}
				}

	});
