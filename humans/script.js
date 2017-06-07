/*** humans ***/
	$(document).ready(function() {
		resizeTop();

		/* edit */
			window.human_edit = function() {
				$("#human_edit").hide();
				$("#human_save").show();
				$("#human_cancel").show();

				$(".field").prop("contenteditable",true).closest(".field_frame").addClass("active");
				$(".message").text("");
				$("#message_top").animateText({text: "//editing human"}, 1000);

				/* sites */
					$("#sites").text($("#sites").attr("value"));

				resizeTop();
			}

			window.human_cancel = function() {
				$("#human_edit").show();
				$("#human_save").hide();
				$("#human_cancel").hide();

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
						string += "<a class='bluetext' href='" + sites[i] + "' target='_blank' rel='nofollow'>" + sites[i] + "</a>, ";
					}
					$("#sites").html(string.substring(0, string.length - 2) || "");

				resizeTop();
			}
			
			window.human_save = function() {
				var data = {};
				$(".field").each(function() {
					var field = $(this).attr("id");
					var value = $(this).text().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"");
					data[field] = value;
				});

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

						$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
						$("#message_top").animateText({text: (results.messages.top || "//edits submitted")}, 1000);

							/* sites */
								if (typeof data.sites !== "undefined") {
									if (typeof data.sites !== "object") {
										data.sites = data.sites.split(",");
									}
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
			}
		
		/* robots */
			window.create_robot = function() {
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
			}

		/* favorites */
			window.add_favorite = function() {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "add_favorite",
						data: JSON.stringify({
							favorite_type: "humans",
							favorite_id: ($(".container").attr("value") ||  null)
						})
					},
					success: function(data) {
						if (data.success) {
							$("#message_top").animateText({text: data.messages.top || "//favorite added"}, 1000);
							$("#add_favorite_form").hide();
							$("#remove_favorite_form").show();
							$(".favorite_humans_list").append("<div class='navbar_item'><a class='navbar_link' href='../../../../humans/" + data.favorite.name + "'><span class='whitetext'>.</span><span class='bluetext'>" + data.favorite.name + "</span></a></div>");
						}
						else {
							$("#message_top").animateText({text: data.messages.top || "//unable to add favorite"}, 1000);
						}
					}
				});
			}

			window.remove_favorite = function () {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "remove_favorite",
						data: JSON.stringify({
							favorite_type: "humans",
							favorite_id: ($(".container").attr("value") ||  null)
						})
					},
					success: function(data) {
						if (data.success) {
							$("#message_top").animateText({text: data.messages.top || "//favorite removed"}, 1000);
							$("#add_favorite_form").show();
							$("#remove_favorite_form").hide();
							$(".favorite_humans_list").find("a[href='../../../../humans/" + data.favorite.name + "']").remove();
						}
						else {
							$("#message_top").animateText({text: data.messages.top || "//unable to remove favorite"}, 1000);
						}
					}
				});
			}

	});
