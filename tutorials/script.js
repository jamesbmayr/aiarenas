/*** tutorials ***/
	$(document).ready(function() {
		resizeTop();
		$(".field#code").html(colorText(String($(".field#code").html())));			

		/* load */
			if ((typeof window.tutorial !== "undefined") && (window.tutorial !== null)) {
				for (var command = 0; command < window.tutorial.steps[0].commands.length; command++) {
					eval(window.tutorial.steps[0].commands[command]);
				}
			}

		/* cube_color */
			$(document).on("change", "#cube_color", function() {
				var value = $("#cube_color").val();
				$("#cube_color").css("color","var(--" + value + ")");
				$("#cube_color").closest(".select_outer").css("color","var(--" + value + ")");
			});

		/* next_step */
			window.next_step = function() {
				$("#eval_code").prop("disabled",true);

				var step = Number($("#step").attr("value")) || 0;

				if ((step + 1) < window.tutorial.steps.length) {
					step++;
					$("#step").attr("value",step).text(step);
					$("#instructions").animateText({text: window.tutorial.steps[step].messages.instructions || "", interval: 25, colorText: true, resizeTop: true});

					for (var command = 0; command < window.tutorial.steps[step].commands.length; command++) {
						eval(window.tutorial.steps[step].commands[command]);
					}
					
					$("#inputs").attr("value", window.tutorial.steps[step].start.inputs).animateText({text: window.tutorial.steps[step].start.inputs || ""},1000);
					$("#inputs").prop("contenteditable",true).closest(".field_frame").addClass("active");
					
					$("#code").attr("value", window.tutorial.steps[step].start.inputs).animateText({text: window.tutorial.steps[step].start.code || ""},2000);
					$("#code").prop("contenteditable",true).closest(".field_frame").addClass("active");
					
					$("#output").animateText({text: window.tutorial.steps[step].start.output || ""},1000);

					setTimeout(function() {
						$("#eval_code").prop("disabled",false);
					},3000);
				}
				else {
					$("#instructions").animateText({text: "Success. Tutorial completed."},1000);
					
					$("#step").hide();
					$("#next_step").closest("form").hide();
					$("#exit").show();

					$("#workshop").hide();
					$("#arena").hide();
					
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
								$("#message_top").animateText({text: (data.messages.top || "//unable to update tutorial completion")},1000);
							}
						}
					});
				}
			}

		/* arena */
			window.add_opponent = function() {
				var opponentCount = $(".opponent").toArray().length || 0;

				$("#opponents").append('<div class="section opponent" id="opponentBot_' + opponentCount + '">\
					<form class="avatar_name" action="javascript:;" onsubmit="window.remove_opponent(this);"> <span class="bluetext">bot_' + opponentCount + '</span><span class="whitetext">.</span><button class="whitetext" name="action" value="remove_opponent"><span class="greentext">remove</span>()</button></form>\
					<div class="stats">\
						<span class="whitetext">power: </span><input type="number" min="0" max="255" class="purpletext power" value="0"><br>\
						<div class="whitetext">\
							cubes.<span class="redtext">red</span>:<input type="number" min="0" max="255" class="cubes_red" value="0"><br>\
							cubes.<span class="orangetext">orange</span>:<input type="number" min="0" max="255" class="cubes_orange" value="0"><br>\
							cubes.<span class="yellowtext">yellow</span>:<input type="number" min="0" max="255" class="cubes_yellow" value="0"><br>\
							cubes.<span class="greentext">green</span>:<input type="number" min="0" max="255" class="cubes_green" value="0"><br>\
							cubes.<span class="bluetext">blue</span>:<input type="number" min="0" max="255" class="cubes_blue" value="0"><br>\
							cubes.<span class="purpletext">purple</span>:<input type="number" min="0" max="255" class="cubes_purple" value="0">\
						</div>\
						<span class="whitetext">action:</span><span class="select_outer yellowtext"><select class="yellowtext action">\
							<option value="power">power</option>\
							<option value="take">take</option>\
							<option value="sleep">sleep</option>\
							<option value="sap">sap</option>\
							<option value="burn">burn</option>\
							<option value="shock">shock</option>\
							<option value="halftake">halftake</option>\
							<option value="swaptake">swaptake</option>\
							<option value="fliptake">fliptake</option>\
						</select></span>\
					</div>\
					<pre class="avatar_pre ' + ["red","orange","yellow","green","blue","purple"][Math.floor(Math.random() * 6)] + 'text" monospace>\
<span class="transparenttext leftDot">•</span><span class="transparenttext">•••••</span><span class="avatar avatar_antennae" value=" _|_ "> _|_ </span><span class="transparenttext">•••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand" value="{**}">{**}</span><span class="transparenttext">•</span><span class="avatar avatar_eyes" value="|v v|">|v v|</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand transparenttext" value="{**}">{**}</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist" value=" {} "> {} </span><span class="transparenttext">•</span><span class="avatar avatar_mouth" value="\\ ^ /">\\ ^ /</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist transparenttext" value=" {} "> {} </span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••</span><span class="avatar avatar_left_shoulder_up">\\</span><span class="avatar avatar_left_shoulder_down" style="display: none">/</span><span class="avatar avatar_left_arm" value="==">==</span><span class="avatar avatar_torso_1" value="HHHHH">HHHHH</span><span class="avatar avatar_right_arm" value="==">==</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_right_shoulder_down">\\</span><span class="transparenttext">••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist transparenttext" value=" {} "> {} </span><span class="transparenttext">•</span><span class="avatar avatar_torso_2" value="[[-]]">[[-]]</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist" value=" {} "> {} </span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand transparenttext" value="{**}">{**}</span><span class="transparenttext">•</span><span class="avatar avatar_torso_3" value="HHHHH">HHHHH</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand" value="{**}">{**}</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_legs" value=" /] [\\ "> /] [\\ </span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="MWM">MWM</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="MWM">MWM</span><span class="transparenttext">••••</span>\n\
</pre></div>');
			}

			window.remove_opponent = function(button) {
				var opponent = $(button).closest(".opponent");
				var name = $(opponent).attr("id");
				$(opponent).remove();
			}

			window.add_cube = function() {
				var color = $("#cube_color").val();
				$("#cubes").append("<div class='cube_outer " + color + "back'><div class='cube_inner'>" + color + "<br><form action='javascript:;' onsubmit='window.remove_cube(this);'>.<button name='action' value='remove_cube'>x()</button></form></div></div>");
			}

			window.remove_cube = function(button) {
				var cube = $(button).closest(".cube_outer");
				$(cube).remove();
			}
			
	});
