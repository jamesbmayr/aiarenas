/*** tutorials ***/
	$(document).ready(function() {
		resizeTop();
		$(".field#code").html(colorText(String($(".field#code").html())));

		/* individual */
			window.next_step = function() {
				var step = Number($("#step").attr("value")) || 0;

				if ((step + 1) < window.tutorial.steps.length) {
					step++;
					$("#step").attr("value",step).text(step);
					$("#instructions").animateText({text: window.tutorial.steps[step].messages.instructions || ""},1000);
					$("#inputs").animateText({text: window.tutorial.steps[step].start.inputs || ""},1000);
					$("#code").delay(1000).html(colorText(window.tutorial.steps[step].start.code || ""));
					$("#output").delay(2000).animateText({text: window.tutorial.steps[step].start.output || ""},1000);
				}
				else {
					$("#step").attr("value","complete").text("complete");
					$("#instructions").animateText({text: "this tutorial has been completed;"},1000);
					
					$("#step").closest(".section").hide();
					$("#next_step").hide();

					$("#inputs").closest(".section").hide();
					$("#code").closest(".section").hide();
					$("#output").closest(".section").hide();
					
					resizeTop();

					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "complete_tutorial",
							data: JSON.stringify({tutorial: (window.tutorial.name || null)})
						},
						success: function(data) {
							if (data.success) {
								$("#message_top").animateText({text: (data.messages.top || "//tutorial completed")},1000);
							}
							else {
								$("#message_top").animateText({text: (data.messages.top || "//unable to store tutorial completion")},1000);
							}
						}
					});
				}
			}

			window.eval_code = function() {
				console.log("eval coding");

				var inputs = String($("#inputs").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
				var code = String($("#code").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));

				console.log("code: " + code);

				try {
					var output = eval("function code(" + inputs + "){\n" + code + "\n}\ncode();");
					console.log(output);
					$("#output").animateText({text: output || ""},1000);
				}
				catch (error) {
					console.log(error);
					$("#code").closest(".section").find(".message").animateText({text: ("//" + (String(error) || "error"))},1000);
				}
			}
		
	});
