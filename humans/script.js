/*** humans ***/
	$(document).ready(function() {
		resizeTop();

		/* avatar */
			$(document).on("change", "#avatar_color select", function() {
				var value = $("#avatar_color select").val();
				$("#avatar_color").css("color",value);
				$("#avatar_pre").css("color",value);
			});

		/* edit */
			$(document).on("click", "#human_edit", function() {
				$("#human_edit").hide();
				$("#human_save").show();
				$("#human_cancel").show();
				
				/* avatar */
					$("#avatar_color").show();					

				$(".field").prop("contenteditable",true).closest(".field_frame").addClass("active");
				$(".message").text("");
				$("#message_top").animateText({text: "//now editing"}, 1000);

				/* sites */
					$("#sites").text($("#sites").attr("value"));

				resizeTop();
			});

			$(document).on("click", "#human_cancel", function() {
				$("#human_edit").show();
				$("#human_save").hide();
				$("#human_cancel").hide();

				/* avatar */
					$("#avatar_color").hide();
					$("#avatar_pre").css("color", ($("#avatar_pre").attr("value") || "var(--white)"));

				$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
				$(".field").each(function() {
					var value = $(this).attr("value");
					$(this).text(value);
				});
				$("#message_top").animateText({text: "//edits canceled"}, 1000);

				/* sites */
					var string = "";
					var sites = $("#sites").attr("value").split(", ");
					for (var i = 0; i < sites.length; i++) {
						string += "<a class='bluetext' href='" + sites[i] + "' target='_blank'>" + sites[i] + "</a>, ";
					}
					$("#sites").html(string.substring(0, string.length - 2) || "");

				resizeTop();
			});

			$(document).on("click", "#human_save", function() {
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
						action: "edit_human",
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

						$("#human_edit").show();
						$("#human_save").hide();
						$("#human_cancel").hide();

							/* avatar  */
								$("#avatar_color").hide();
								$("#avatar_pre").css("color", (data.avatar.color || "var(--white)"));
								$("#avatar").find(".message").animateText({text: (messages["avatar"] || "")}, 1000);

								var previousColor = $("#avatar_pre").attr("value") || "var(--white)";
								$("#avatar_pre").css("color", data.avatar.color || previousColor);
								$("#avatar_color").css("color", data.avatar.color || previousColor);

						$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
						$("#message_top").animateText({text: (messages.top || "//edits submitted")}, 1000);

							/* sites */
								if (typeof data.sites !== "undefined") {
									var string = "";
									for (var i = 0; i < data.sites.length; i++) {
										string += "<a class='bluetext' href='" + data.sites[i] + "' target='_blank'>" + data.sites[i] + "</a>, ";
									}
									$("#sites").html(string.substring(0, string.length - 2) || "");
									$("#sites").attr("value", data.sites.join(", "));
								}

						resizeTop();
					}
				});
			});
		
		/* robots */
			$("#human_create_robot").click(function() {
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
