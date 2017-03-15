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
		$(document).on("click", ".edit_button", function() {
			var button = $(this);

			$(button).closest(".section").find(".field").prop("contenteditable",true);

			$(button).closest(".section").find(".message").remove();
			$(button).replaceWith("<button class='save_button'><span class='graytext'>//save</span></button><button class='cancel_button'><span class='graytext'>//cancel</span></button>");
		});

		$(document).on("click", ".cancel_button", function() {
			var button = $(this);

			$(button).closest(".section").find(".field").prop("contenteditable",false).text($(button).closest(".section").find(".field").attr("value"));

			$(button).closest(".section").find(".message").remove();
			$(button).closest(".section").find(".save_button").remove();
			$(button).replaceWith("<button class='edit_button'><span class='graytext'>//edit</span></button>");
			
		});

		$(document).on("click", ".save_button", function() {
			var button = $(this);
			var field = $(button).closest(".section").find(".field");
			var new_text = $(field).text();
			var old_text = $(field).attr("value");

			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "edit_user",
					field: $(field).attr("id"),
					value: new_text,
				},
				success: function(data) {
					if (data.changed === true) {
						$(field).prop("contenteditable",false).text(new_text);
					}
					else {
						$(field).prop("contenteditable",false).text(old_text);
					}

					$(button).closest(".section").find(".message").remove();
					$(button).closest(".section").find(".cancel_button").remove();
					$(button).replaceWith("<button class='edit_button'><span class='graytext'>//edit</span></button>" + "<span class='graytext message'> //" + data.message + "</span>");
				}
			});
		});
});