/*** robots ***/
	$(document).ready(function() {
		resizeTop();
		$(".field#code").html(colorText(String($(".field#code").html())));
		$(".code").each(function(index) {
			$(this).html(window.colorText($(this).text()));
		});

		/* avatar */
			$(document).on("change", "#avatar_color select", function() {
				var value = $("#avatar_color select").val();
				$("#avatar_color").find("select").css("color",value);
				$("#avatar_color").find(".select_outer").css("color",value);
				$("#avatar_selection").css("color",value);
			});

			window.randomize = function() {
				$(".avatar_select").each(function() {
					var count = $(this).find("option").toArray().length;
					var random = Math.floor(Math.random() * count);
					var selected = $(this).find("option").toArray()[random];
					$(this).val($(selected).val());
				});
			}

		/* cube_color */
			$(document).on("change", "#cube_color", function() {
				var value = $("#cube_color").val();
				$("#cube_color").css("color","var(--" + value + ")");
				$("#cube_color").closest(".select_outer").css("color","var(--" + value + ")");
			});

		/* edit */
			window.robot_edit = function() {
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
					$("#avatar_randomizer").show();

					$("#avatar_selection select").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf("_") + 1);
						var value = String(avatar[key]).replace(/\\/g,"\\\\");
						$(this).find("option[value=\"" + value + "\"]").attr("selected",true);
					});

				$(".message").text("");
				$("#message_top").animateText({text: "//editing robot"}, 1000);
				resizeTop();
			}

			window.robot_cancel = function() {
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
					$("#avatar_randomizer").hide();

				$("#message_top").animateText({text: "//edits canceled"}, 1000);
				$(".field#code").html(colorText(String($(".field#code").html())));
				resizeTop();
			}

			window.robot_save = function() {
				var data = {
					id: $(".container").attr("value")
				};

				$(".field").each(function() {
					var field = $(this).attr("id");
					var value = $(this).text().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
					data[field] = value;
				});

				/* code */
					$("body").append("<div id='temp'></div>");
					$("#temp").html($("#code").text());
					data.code = $("#temp").text();
					$("#temp").remove();

				/* avatar */
					var avatar = {};
					$("#avatar_selection select").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf("_") + 1);
						var value = $(this).val();
						avatar[key] = String(value);
					});

					avatar.color = $("#avatar_color select").val();
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

							data.code = data.code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

							/* navbar name */
								if (data.name !== $("#name").attr("value")) {
									$("#name").attr("value",data.name);
									$("#navbar").find("a[href='../../../../robots/" + data.id + "']").find("span.bluetext").text(data.name);
									$("title").text("ai_arenas." + data.name);
								}

							/* fields */
								$(".field").each(function() {
									$(this).text(data[$(this).attr("id")]).attr("value",data[$(this).attr("id")]);
									$(this).closest(".section").find(".message").animateText({text: (results.messages[$(this).attr("id")] || "")}, 1000);
								});

							/* avatar */
								if (Object.keys(data.avatar).length > 0) {
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
									$("#avatar").find(".message").animateText({text: (results.messages["avatar"] || "")}, 1000);
								}

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
							$("#avatar_randomizer").hide();

						$("#message_top").animateText({text: (results.messages.top || "//changes submitted")}, 1000);

						if ((window.location.pathname !== "/robots") && (window.location.pathname !== "/robots/")) {
							$(".field").prop("contenteditable",false).closest(".field_frame").removeClass("active");
							$(".field#code").html(colorText(String($(".field#code").html())));
						}

						resizeTop();
					}
				});
			}
	
		/* delete */
			window.robot_delete = function() {
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
				$("#message_top").animateText({text: "//confirm robot deletion?"}, 1000);

				resizeTop();
			}

			window.robot_confirm_delete = function() {
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
			}

		/* arena */
			window.load_robot = function() {
				var robot_id = $("#robot_select").val() || null;

				if (robot_id === "new") {
					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "create_robot",
						},
						success: function(results) {
							if (results.success) {
								var data = results.data;
								$("#message_top").animateText({text: (results.messages.top || "//successfully created robot")},1000);
								$(".content").show();
								$("#workshop_save").show();
								$("#workshop_download").show();

								$(".robot_name").animateText({text: data.name},1000);
								$(".container").attr("value",data.id);

								$("#inputs").attr("value", data.inputs.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;")).text(data.inputs);
								$("#code").attr("value", data.code.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;")).text(data.code);

								$(".avatar_name").replaceWith('<a class="bluetext avatar_name" href="../../../../robots/' + data.id + '" target="_blank">' + data.name + '</a>');
								$(".self").attr("id",data.id).find(".avatar_pre").replaceWith('<pre class="avatar_pre" monospace style="color: ' + (data.avatar.color || "var(--white)") + '">\
<span class="transparenttext leftDot">•</span><span class="transparenttext">•••••</span><span class="avatar avatar_antennae" value="' + (data.avatar.antennae.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.antennae || "•••••") + '</span><span class="transparenttext">•••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand" value="' + (data.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_eyes" value="' + (data.avatar.eyes.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.eyes || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand transparenttext" value="' + (data.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist" value="' + (data.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_mouth" value="' + (data.avatar.mouth.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.mouth || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist transparenttext" value="' + (data.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••</span><span class="avatar avatar_left_shoulder_up">\\</span><span class="avatar avatar_left_shoulder_down" style="display: none">/</span><span class="avatar avatar_left_arm" value="' + (data.avatar.left_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.left_arm || "••") + '</span><span class="avatar avatar_torso_1" value="' + (data.avatar.torso_1.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_1 || "•••••") + '</span><span class="avatar avatar_right_arm" value="' + (data.avatar.right_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_arm || "••") + '</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_right_shoulder_down">\\</span><span class="transparenttext">••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist transparenttext" value="' + (data.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_2" value="' + (data.avatar.torso_2.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_2 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist" value="' + (data.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand transparenttext" value="' + (data.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_3" value="' + (data.avatar.torso_3.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_3 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand" value="' + (data.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_leg" value="' + (data.avatar.left_leg.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.left_leg || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_leg" value="' + (data.avatar.right_leg.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.right_leg || "•••") + '</span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="' + (data.avatar.left_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.left_foot || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="' + (data.avatar.right_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.right_foot || "•••") + '</span><span class="transparenttext">••••</span>\n\
</pre>');
								
								resizeTop();

								$("#navbar_robots").find(".robot_list").append('<div class="navbar_item"><a class="navbar_link" href="../../../../robots/' + data.id + '"><span class="whitetext">.</span><span class="bluetext">' + data.name + '</span></a></div>');
							}
							else {
								$("#message_top").animateText({text: (results.messages.top || "//unable to create robot")},1000);
							}
						}
					});
				}
				else if (robot_id === "upload") {
					$("#file_chooser").click();
				}
				else {
					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "load_robot",
							data: JSON.stringify({robot_id: robot_id})
						},
						success: function(results) {
							if (results.success) {
								var data = results.data;
								$("#message_top").animateText({text: (results.messages.top || "//successfully loaded robot")},1000);
								$(".content").show();
								$("#workshop_save").show();
								$("#workshop_download").show();

								$(".robot_name").animateText({text: data.name},1000);
								$(".container").attr("value",data.id);

								$("#inputs").attr("value", data.inputs.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;")).text(data.inputs);
								$("#code").attr("value", data.code.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;")).text(data.code);
								
								$(".avatar_name").replaceWith('<a class="bluetext avatar_name" href="../../../../robots/' + data.id + '" target="_blank">' + data.name + '</a>');
								$(".self").attr("id",data.id).find(".avatar_pre").replaceWith('<pre class="avatar_pre" monospace style="color: ' + (data.avatar.color || "var(--white)") + '">\
<span class="transparenttext leftDot">•</span><span class="transparenttext">•••••</span><span class="avatar avatar_antennae" value="' + (data.avatar.antennae.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.antennae || "•••••") + '</span><span class="transparenttext">•••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand" value="' + (data.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_eyes" value="' + (data.avatar.eyes.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.eyes || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand transparenttext" value="' + (data.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist" value="' + (data.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_mouth" value="' + (data.avatar.mouth.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.mouth || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist transparenttext" value="' + (data.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••</span><span class="avatar avatar_left_shoulder_up">\\</span><span class="avatar avatar_left_shoulder_down" style="display: none">/</span><span class="avatar avatar_left_arm" value="' + (data.avatar.left_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.left_arm || "••") + '</span><span class="avatar avatar_torso_1" value="' + (data.avatar.torso_1.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_1 || "•••••") + '</span><span class="avatar avatar_right_arm" value="' + (data.avatar.right_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_arm || "••") + '</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_right_shoulder_down">\\</span><span class="transparenttext">••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist transparenttext" value="' + (data.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_2" value="' + (data.avatar.torso_2.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_2 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist" value="' + (data.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand transparenttext" value="' + (data.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_3" value="' + (data.avatar.torso_3.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_3 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand" value="' + (data.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_leg" value="' + (data.avatar.left_leg.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.left_leg || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_leg" value="' + (data.avatar.right_leg.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.right_leg || "•••") + '</span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="' + (data.avatar.left_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.left_foot || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="' + (data.avatar.right_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.right_foot || "•••") + '</span><span class="transparenttext">••••</span>\n\
</pre>');
								
								resizeTop();
							}
							else {
								$("#message_top").animateText({text: (results.messages.top || "unable to retrieve robot")},1000);
							}
						}
					});
				}
			}

			window.add_opponent = function() {
				var opponentCount = $(".opponent").toArray().length || 0;

				if (opponentCount < 5) {
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
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_leg" value=" /]"> /]</span><span class="transparenttext">•</span><span class="avatar avatar_right_leg" value="[\\ ">[\\ </span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="MWM">MWM</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="MWM">MWM</span><span class="transparenttext">••••</span>\n\
</pre></div>');
				}
			}

			window.remove_opponent = function(button) {
				var opponent = $(button).closest(".opponent");
				var name = $(opponent).attr("id");
				$(opponent).remove();
			}

			window.add_cube = function() {
				var cubeCount = $(".cube_outer").toArray().length || 0;
				if (cubeCount < 255) {
					var color = $("#cube_color").val();
					$("#cubes").append("<div class='cube_outer " + color + "back'><div class='cube_inner'>" + color + "<br><form action='javascript:;' onsubmit='window.remove_cube(this);'>.<button name='action' value='remove_cube'>x()</button></form></div></div>");
				}
			}

			window.remove_cube = function(button) {
				var cube = $(button).closest(".cube_outer");
				$(cube).remove();
			}
		
		/* download & upload */
			window.robot_download = function() {
				//data
					var robot = {
						id: $(".container").attr("value"),
						name: $(".robot_name").toArray()[0].innerHTML.trim(),
						human: {
							id: null,
							name: null
						},
						created: new Date().getTime(),
						information: {
							show_code: true,
							bio: null,
							music: {}
						},
						avatar: {
							color: $(".avatar_pre").attr("style").toString().replace("color: ",""),
							antennae: $(".avatar_antennae").attr("value"),
							eyes: $(".avatar_eyes").attr("value"),
							mouth: $(".avatar_mouth").attr("value"),
							left_arm: $(".avatar_left_arm").attr("value"),
							right_arm: $(".avatar_right_arm").attr("value"),
							left_wrist: $(".avatar_left_wrist").attr("value"),
							right_wrist: $(".avatar_right_wrist").attr("value"),
							left_hand: $(".avatar_left_hand").attr("value"),
							right_hand: $(".avatar_right_hand").attr("value"),
							torso_1:$(".avatar_torso_1").attr("value"),
							torso_2: $(".avatar_torso_2").attr("value"),
							torso_3: $(".avatar_torso_3").attr("value"),
							left_leg: $(".avatar_left_leg").attr("value"),
							right_leg: $(".avatar_right_leg").attr("value"),
							left_foot: $(".avatar_left_foot").attr("value"),
							right_foot: $(".avatar_right_foot").attr("value"),
						},
						statistics: {
							wins: 0,
							losses: 0,
						},
						inputs: $("#inputs").text(),
						code: $("#code").text()
					}

				//package
					var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(robot));

					$("body").append("<a id='download_link' href='data:" + data + "' download='" + robot.name + ".json'></a>");

				//download
					$("#download_link").click(function() {
						$(this).remove();
					})[0].click();
			}

			$(document).on("change","#file_chooser",function(event) {
				if (($("#file_chooser").val() !== null) && ($("#file_chooser").val().length > 0)) {
				var reader = new FileReader();
				reader.readAsText(event.target.files[0]);
				reader.onload = function(event) {
					try {
						var data = JSON.parse(event.target.result);
						var test = data.human.id;
					}
					catch (error) {
						$("#message_top").animateText({text: "//invalid filetype or corrupt data"},1000);
						console.log(error);
						return;
					}
					
					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "upload_robot",
							data: JSON.stringify(data)
						},
						success: function(results) {
							if (results.success) {
								var data = results.data;
								$("#message_top").animateText({text: (results.messages.top || "//successfully uploaded robot")},1000);
								$(".content").show();
								$("#workshop_save").show();
								$("#workshop_download").show();

								$(".robot_name").animateText({text: data.name},1000);
								$(".container").attr("value",data.id);

								$("#inputs").attr("value", data.inputs.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;")).text(data.inputs);
								$("#code").attr("value", data.code.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;")).text(data.code);
								
								if (data.human.id !== null) {
									$(".avatar_name").replaceWith('<a class="bluetext avatar_name" href="../../../../robots/' + data.id + '" target="_blank">' + data.name + '</a>');
									$("#navbar_robots").find(".robot_list").append('<div class="navbar_item"><a class="navbar_link" href="../../../../robots/' + data.id + '"><span class="whitetext">.</span><span class="bluetext">' + data.name + '</span></a></div>');
								}
								else {
									$(".avatar_name").replaceWith('<span class="bluetext avatar_name">' + data.name + '</span>');
								}
								
								$(".self").attr("id",data.id).find(".avatar_pre").replaceWith('<pre class="avatar_pre" monospace style="color: ' + (data.avatar.color || "var(--white)") + '">\
<span class="transparenttext leftDot">•</span><span class="transparenttext">•••••</span><span class="avatar avatar_antennae" value="' + (data.avatar.antennae.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.antennae || "•••••") + '</span><span class="transparenttext">•••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand" value="' + (data.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_eyes" value="' + (data.avatar.eyes.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.eyes || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand transparenttext" value="' + (data.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist" value="' + (data.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_mouth" value="' + (data.avatar.mouth.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.mouth || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist transparenttext" value="' + (data.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••</span><span class="avatar avatar_left_shoulder_up">\\</span><span class="avatar avatar_left_shoulder_down" style="display: none">/</span><span class="avatar avatar_left_arm" value="' + (data.avatar.left_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.left_arm || "••") + '</span><span class="avatar avatar_torso_1" value="' + (data.avatar.torso_1.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_1 || "•••••") + '</span><span class="avatar avatar_right_arm" value="' + (data.avatar.right_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_arm || "••") + '</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_right_shoulder_down">\\</span><span class="transparenttext">••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist transparenttext" value="' + (data.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_2" value="' + (data.avatar.torso_2.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_2 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist" value="' + (data.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand transparenttext" value="' + (data.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_3" value="' + (data.avatar.torso_3.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_3 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand" value="' + (data.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_leg" value="' + (data.avatar.left_leg.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.left_leg || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_leg" value="' + (data.avatar.right_leg.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.right_leg || "•••") + '</span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="' + (data.avatar.left_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.left_foot || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="' + (data.avatar.right_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.right_foot || "•••") + '</span><span class="transparenttext">••••</span>\n\
</pre>');
								
								resizeTop();
							}
							else {
								$("#message_top").animateText({text: (results.messages.top || "unable to upload robot")},1000);
							}
						}
					});
				}
			}
		});

	});