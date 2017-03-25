$(document).ready(function() {

	/* animateText */
		jQuery.fn.extend({
			animateText: function(options, timespan) {
				var element = this;
				if ((typeof options === "undefined") || (options === null)) {
					options = {};
				}
				
				//text
					if (typeof options.text !== "undefined") {
						var text = options.text;
					}
					else {
						var text = ($(element).text() || "");
					}

					$(element).text("");

				//chunk
					if ((typeof options.chunk !== "undefined") && (options.chunk > 0)) {
						var chunk = options.chunk;
					}
					else {
						var chunk = 1;
					}

				//interval / timespan
					if ((typeof timespan !== "undefined") && (timespan !== null)) {
						var interval = timespan / (text.length / chunk);
					}
					else if ((typeof options.interval !== "undefined") && (options.interval !== null)) {
						var interval = (options.interval / chunk);
					}
					else {
						var interval = 100;
					}

				//indicator
					if ((typeof options.indicator !== "undefined") && (options.indicator.length > 0)) {
						indicator = options.indicator;
					}
					else {
						indicator = "_";
					}

				if ((typeof options.direction !== "undefined") && (options.direction === "left")) {
					var index = text.length - chunk;
					var loop = setInterval(function() {
						if (index < 0) {
							clearInterval(loop);
							$(element).html(text);
						}
						else {
							//color char
								if ((typeof options.color !== "undefined") && (options.color.length > 0)) {
									var char = "<span style='color: " + options.color + "'>" + (indicator || (text[index] || "")) + "</span>";
								}
								else {
									var char = text[index] || "";
								}

							$(element).html(char + text.substring(index + 1, text.length));
							index -= chunk;
						}
					}, interval);
				}
				else {
					var index = 0;
					var loop = setInterval(function() {
						if (index > text.length) {
							clearInterval(loop);
							$(element).html(text);
						}
						else {
							//color char
								if ((typeof options.color !== "undefined") && (options.color.length > 0)) {
									var char = "<span style='color: " + options.color + "'>" + (indicator || (text[index] || "")) + "</span>";
								}
								else {
									var char = text[index] || "";
								}

							$(element).html(text.substring(0, index) + char);
							index += chunk;
						}
					}, interval);
				}
			}
		});

		$("#message_top").animateText({},1000);

	/* navbar */
		$("#navbar_open").click(function() {
			$("#navbar_open").animate({left: "+=256px"}, 500);
			$("#navbar_open").find(".glyphicon").animate({opacity: 0},500);
			setTimeout(function() {
				$("#navbar_open").hide();
			}, 500);
			
			$("#navbar_close").show().animate({left: "+=256px"}, 500);
			$("#navbar_close").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "+=256px"}, 500);
		});

		$("#navbar_close").click(function() {
			$("#navbar_close").animate({left: "-=256px"}, 500);
			$("#navbar_close").find(".glyphicon").animate({opacity: 0},500);;
			setTimeout(function() {
				$("#navbar_close").hide();
			}, 500);

			$("#navbar_open").show().animate({left: "-=256px"}, 500);
			$("#navbar_open").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "-=256px"}, 500);
		});

		$("#navbar_signout").click(function() {
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
						$("#navbar_message").text(data.messages.navbar || "//unable to signout");
					}
				}
			});
		});

		$("#navbar_create_robot").click(function() {
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
						$("#navbar_message").text( data.messages.navbar || "//unable to create robot");
					}
				}
			});
		});

		$("#navbar_create_arena").click(function() {
			$.ajax({
				type: "POST",
				url: window.location.pathname,
				data: {
					action: "create_arena",
				},
				success: function(data) {
					if (data.success) {
						window.location = data.redirect;
					}
					else {
						$("#navbar_message").text(data.messages.navbar || "//unable to create arena");
					}
				}
			});
		});

		$("#navbar_join_arena").click(function() {
			var arena_id = $("#navbar_arena_id").val();

			if (arena_id.length === 4) {
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "join_arena",
						arena_id: arena_id
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#navbar_message").text(data.messages.navbar || "//unable to join");
						}
					}
				});
			}
			else {
				$("#navbar_arena_id").css("border-color","var(--red)");
			}
		});

	/* sectionToggle */
		$(document).on("click", ".section-toggle", function() {
			if ($(this).hasClass("section-toggle-down")) {
				$(this).next().next().animate({
					height: 0
				},1000);

				$(this).replaceWith('<span class="glyphicon glyphicon-chevron-up section-toggle section-toggle-up whitetext"></span>');
			}
			else if ($(this).hasClass("section-toggle-up")) {
				var section = $(this).next().next();
				var height = $(section).hide().css("height","auto").css("height");

				$(section).css("height",0).show().animate({
					height: height
				},1000);

				$(this).replaceWith('<span class="glyphicon glyphicon-chevron-down section-toggle section-toggle-down whitetext"></span>');

				setTimeout(function() {
					$(section).css("height","auto");
				},1010);
			}
		});

});