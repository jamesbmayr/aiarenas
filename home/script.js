/*** home ***/
	
	$(document).ready(function() {
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

	});
