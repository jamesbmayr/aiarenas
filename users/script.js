$(document).ready(function() {

	/* navbar */
		$("#navbar_open").click(function() {
			$("#navbar_open").animate({left: "+=200px"}, 500);
			$("#navbar_open").find(".glyphicon").animate({opacity: 0},500);
			setTimeout(function() {
				$("#navbar_open").hide();
			}, 500);
			
			$("#navbar_close").show().animate({left: "+=200px"}, 500);
			$("#navbar_close").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "+=200px"}, 500);
		});

		$("#navbar_close").click(function() {
			$("#navbar_close").animate({left: "-=200px"}, 500);
			$("#navbar_close").find(".glyphicon").animate({opacity: 0},500);;
			setTimeout(function() {
				$("#navbar_close").hide();
			}, 500);

			$("#navbar_open").show().animate({left: "-=200px"}, 500);
			$("#navbar_open").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "-=200px"}, 500);
		});

	/* edit_button */
		// $(document).on("click", ".edit_button", function() {
		// 	var button = $(this);

		// 	$(button).closest(".section").find(".field").prop("contenteditable",true);

		// 	$(button).closest(".section").find(".message").remove();
		// 	$(button).replaceWith("<button class='save_button'><span class='graytext'>//save</span></button><button class='cancel_button'><span class='graytext'>//cancel</span></button>");
		// });

		// $(document).on("click", ".cancel_button", function() {
		// 	var button = $(this);

		// 	$(button).closest(".section").find(".field").prop("contenteditable",false).text($(button).closest(".section").find(".field").attr("value"));

		// 	$(button).closest(".section").find(".message").remove();
		// 	$(button).closest(".section").find(".save_button").remove();
		// 	$(button).replaceWith("<button class='edit_button'><span class='graytext'>//edit</span></button>");
			
		// });

		// $(document).on("click", ".save_button", function() {
		// 	var button = $(this);
		// 	var field = $(button).closest(".section").find(".field");
		// 	var new_text = $(field).text();
		// 	var old_text = $(field).attr("value");

		// 	$.ajax({
		// 		type: "POST",
		// 		url: window.location.pathname,
		// 		data: {
		// 			action: "edit_user",
		// 			field: $(field).attr("id"),
		// 			value: new_text,
		// 		},
		// 		success: function(data) {
		// 			if (data.changed === true) {
		// 				$(field).prop("contenteditable",false).text(new_text);
		// 			}
		// 			else {
		// 				$(field).prop("contenteditable",false).text(old_text);
		// 			}

		// 			$(button).closest(".section").find(".message").remove();
		// 			$(button).closest(".section").find(".cancel_button").remove();
		// 			$(button).replaceWith("<button class='edit_button'><span class='graytext'>//edit</span></button>" + "<span class='graytext message'> //" + data.message + "</span>");
		// 		}
		// 	});
		// });

		$(document).on("click", ".edit_button", function() {
			$(".edit_button").hide();
			$(".save_button").show();
			$(".cancel_button").show();

			$(".field").prop("contenteditable",true);
			$(".message").text("");
		});

		$(document).on("click", ".cancel_button", function() {
			$(".edit_button").show();
			$(".save_button").hide();
			$(".cancel_button").hide();

			$(".field").prop("contenteditable",false);
			$(".field").each(function() {
				var value = $(this).attr("value");
				$(this).text(value);
			});
		});

		$(document).on("click", ".save_button", function() {
			var data = {};
			$(".field").each(function() {
				var field = $(this).attr("id");
				var value = $(this).text();
				data[field] = value;
			});

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
							$(this).text(data[$(this).attr("id")]);
							$(this).closest(".section").find(".message").text(messages[$(this).attr("id")] || "");
						});
					}

					$(".edit_button").show();
					$(".save_button").hide();
					$(".cancel_button").hide();
					$(".field").prop("contenteditable",false);
				}
			});

		});
});