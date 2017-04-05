/*** robots ***/
	$(document).ready(function() {
		resizeTop();
		$(".field#code").html(colorText(String($(".field#code").html())));

		/* avatar */
			$(document).on("change", "#avatar_color select", function() {
				var value = $("#avatar_color select").val();
				$("#avatar_color").css("color",value);
				$("#avatar_selection").css("color",value);
			});

		/* edit */
			$(document).on("click", "#robot_edit", function() {
				$("#robot_edit").hide();
				$("#robot_save").show();
				$("#robot_cancel").show();
				$("#robot_delete").show();
				$("#robot_confirm_delete").hide();

				$(".field").each(function() {
					$(this).html($(this).attr("value"));
					$(this).prop("contenteditable",true).closest(".field_frame").addClass("active");
				});

				$("#robot_settings").show();

				/* avatar */
					var avatar = {}
					$(".avatar").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf("_") + 1);
						var value = String($(this).text());
						avatar[key] = String(value);
					});

					$("#avatar_pre").hide();
					$("#avatar_selection").show();
					$("#avatar_color").show();

					$("#avatar_selection select").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf("_") + 1);
						var value = String(avatar[key]).replace(/\\/g,"\\\\");
						console.log("finding " + value);
						$(this).find("option[value=\"" + value + "\"]").attr("selected",true);
					});

				$(".message").text("");
				$("#message_top").animateText({text: "//now editing"}, 1000);
				resizeTop();
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

				$("#robot_settings").hide();

				/* avatar */
					var avatar = {}
					$("#avatar_pre").show();
					var previousColor = $("#avatar_pre").css("color");

					$("#avatar_selection").css("color", previousColor).hide();
					$("#avatar_color").css("color", previousColor).hide();

				$("#message_top").animateText({text: "//edits canceled"}, 1000);
				$(".field#code").html(colorText(String($(".field#code").html())));
				resizeTop();
			});

			$(document).on("click", "#robot_save", function() {
				var data = {
					id: $(".container").attr("value")
				};

				$(".field").each(function() {
					var field = $(this).attr("id");
					var value = $(this).html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
					data[field] = value;
				});

				data.show_code = $("#show_code").val();

				/* avatar */
					var avatar = {};
					$("#avatar_selection select").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf("_") + 1);
						var value = $(this).val();
						avatar[key] = String(value);
					});

					avatar.color = $("#avatar_color select").val() || "var(--white)";
					data.avatar = avatar;

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "edit_robot",
						data: JSON.stringify(data)
					},
					success: function(results) {
						if (results.success) {
							var data = results.data;
							var messages = results.messages;

							data.code = data.code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

							$(".field").each(function() {
								$(this).text(data[$(this).attr("id")]).attr("value",data[$(this).attr("id")]);
								$(this).closest(".section").find(".message").animateText({text: (messages[$(this).attr("id")] || "")}, 1000);
							});

							/* avatar */
								$(".avatar").each(function() {
									var key = $(this).attr("id").substring($(this).attr("id").indexOf("_") + 1);
									var value = data.avatar[key];

									if (value === null) {
										value = $(this).attr("value") || null;
									}

									$(this).text(value).attr("value",value);
								});

								var previousColor = $("#avatar_pre").css("color") || "var(--white)";
								$("#avatar_pre").css("color", data.avatar.color || previousColor);
								$("#avatar_selection").css("color", data.avatar.color || previousColor);
								$("#avatar_color").css("color", data.avatar.color || previousColor);
								$("#avatar").find(".message").animateText({text: (messages["avatar"] || "")}, 1000);
						}

						$("#robot_edit").show();
						$("#robot_save").hide();
						$("#robot_cancel").hide();
						$("#robot_delete").hide();
						$("#robot_confirm_delete").hide();

						$("#robot_settings").hide();

						/* avatar */
							var avatar = {}
							$("#avatar_pre").show();
							$("#avatar_selection").hide();
							$("#avatar_color").hide();

						$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
						$("#message_top").animateText({text: (messages.top || "//changes submitted")}, 1000);
						$(".field#code").html(colorText(String($(".field#code").html())));

						resizeTop();
					}
				});
			});
	
		/* delete */
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
				$("#message_top").animateText({text: "//are you sure you want to delete this robot?"}, 1000);

				resizeTop();
			});

			$(document).on("click", "#robot_confirm_delete", function() {
				var data = {
					id: $(".container").attr("value")
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

							$("#message_top").animateText({text: (results.messages.top || "//unable to delete robot")}, 1000);
						}

						resizeTop();
					}
				});
			});

	});
