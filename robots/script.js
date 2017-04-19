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

					$("#avatar_selection select").each(function() {
						var key = $(this).attr("id").substring($(this).attr("id").indexOf("_") + 1);
						var value = String(avatar[key]).replace(/\\/g,"\\\\");
						console.log("finding " + value);
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
							var messages = results.messages;

							data.code = data.code.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

							$(".field").each(function() {
								$(this).text(data[$(this).attr("id")]).attr("value",data[$(this).attr("id")]);
								$(this).closest(".section").find(".message").animateText({text: (messages[$(this).attr("id")] || "")}, 1000);
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
									$("#avatar").find(".message").animateText({text: (messages["avatar"] || "")}, 1000);
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

						$("#message_top").animateText({text: (messages.top || "//changes submitted")}, 1000);

						if (window.location.pathname !== "/robots/") {
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

		/* load */
			window.load_robot = function() {
				var robot_id = $("#robot_select").val() || null;

				if (robot_id === "new_robot") {
					window.navbar_create_robot();
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
								$("#message_top").animateText({text: (results.messages.top || "successfully loaded robot")},1000);
								$(".content").show();
								$("#workshop_save").show();

								$(".robot_name").animateText({text: data.name},1000);
								$(".container").attr("value",data.id);

								$("#inputs").attr("value", data.inputs.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;")).text(data.inputs);
								$("#code").attr("value", data.code.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;")).text(data.code);
								
								$(".self").find(".avatar_pre").replaceWith('<pre class="avatar_pre" monospace style="color: ' + (data.avatar.color || "var(--white)") + '">\
<span class="transparenttext leftDot">•</span><span class="transparenttext">•••••</span><span class="avatar avatar_antennae" value="' + (data.avatar.antennae.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.antennae || "•••••") + '</span><span class="transparenttext">•••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand" value="' + (data.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_eyes" value="' + (data.avatar.eyes.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.eyes || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand transparenttext" value="' + (data.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist" value="' + (data.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_mouth" value="' + (data.avatar.mouth.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.mouth || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist transparenttext" value="' + (data.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••</span><span class="avatar avatar_left_shoulder_up">\\</span><span class="avatar avatar_left_shoulder_down" style="display: none">/</span><span class="avatar avatar_left_arm" value="' + (data.avatar.left_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.left_arm || "••") + '</span><span class="avatar avatar_torso_1" value="' + (data.avatar.torso_1.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_1 || "•••••") + '</span><span class="avatar avatar_right_arm" value="' + (data.avatar.right_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_arm || "••") + '</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_right_shoulder_down">\\</span><span class="transparenttext">••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist transparenttext" value="' + (data.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_2" value="' + (data.avatar.torso_2.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_2 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist" value="' + (data.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (data.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand transparenttext" value="' + (data.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_3" value="' + (data.avatar.torso_3.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (data.avatar.torso_3 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand" value="' + (data.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (data.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_legs" value="' + (data.avatar.legs.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••••') + '">' + (data.avatar.legs || "•••••••") + '</span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="' + (data.avatar.left_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.left_foot || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="' + (data.avatar.right_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (data.avatar.right_foot || "•••") + '</span><span class="transparenttext">••••</span>\n\
 <a class="bluetext" href="../../../../robots/' + data.id + '" target="_blank">' + data.name + '</a></pre>');

								resizeTop();
							}
							else {
								$("#message_top").animateText({text: (data.messages.top || "unable to retrieve robot")},1000);
							}
						}
					});
				}
			}

			window.add_opponent = function() {
				var opponentCount = $(".opponent").toArray().length || 0;

				$("#opponents").append('<div class="section opponent" id="opponentBot_' + opponentCount + '">\
					<div class="stats">\
						<span class="whitetext">power: </span><input type="number" min="0" max="255" class="purpletext power" value="0"><span class="whitetext">,</span><br>\
						<span class="whitetext">cubes: {\
							<div class="indented">\
								<span class="redtext">r: <input type="number" min="0" max="255" class="cubes_red" value="0"></span>,<br>\
								<span class="orangetext">o: <input type="number" min="0" max="255" class="cubes_orange" value="0"></span>,<br>\
								<span class="yellowtext">y: <input type="number" min="0" max="255" class="cubes_yellow" value="0"></span>,<br>\
								<span class="greentext">g: <input type="number" min="0" max="255" class="cubes_green" value="0"></span>,<br>\
								<span class="bluetext">b: <input type="number" min="0" max="255" class="cubes_blue" value="0"></span>,<br>\
								<span class="purpletext">p: <input type="number" min="0" max="255" class="cubes_purple" value="0"></span>\
							</div>\
						},</span><br>\
						<span class="whitetext">action: </span><span class="greentext action"></span>\
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
<form action="javascript:;" onsubmit="window.remove_opponent(this);"> <span class="bluetext">bot_' + opponentCount + '</span><span class="whitetext">.</span><button class="whitetext" name="action" value="remove_opponent"><span class="greentext">remove</span>();</button></form></pre>\
 				</div>');
			}

			window.remove_opponent = function(button) {
				var opponent = $(button).closest(".opponent");
				var name = $(opponent).attr("id");
				$(opponent).remove();
			}

		/* eval_code */
			window.logs = [];
			window.consoleLog = function(log) {
				window.logs.push(log);
			}

			window.lines = [];
			window.lineLog = function(log) {
				window.lines.push(log);
			}

			window.eval_code = function() {
				$("*").bind("blur change click dblclick error focus focusin focusout hover keydown keypress keyup load mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup resize scroll select submit", function(event) {
					event.stopPropagation();
				});

				$("#console").empty();

				//get code and inputs
					window.code = $("#code").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
					window.code = window.code.split("\n");

					window.inputs = $("#inputs").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s/g,"");
					window.inputs = window.inputs.split(",");

				//build arena data //SAMPLE ???
					var data = {
						rules: {
							players: {
								minimum: 2,
								maximum: 8,
								pauseDuration: (5 * 60 * 1000),
								pausePeriod: 10,
							},
							cubes: {
								colors: ["red", "orange", "yellow", "green", "blue", "purple"],
								startCount: 1,
								maximum: 255,
								spawnRate: 1,
								spawnMemory: 3,
								dissolveRate: 1,
								dissolveIndex: "oldest",
							},
							robots: {
								startPower: 1,
								maxPower: 255,
								powerRate: 1,
								tieBreaker: "cascade",
								actions: ["power", "take", "sleep"],
							},
							victory: {
								conditions: ["6of1", "2of3", "1of6"],
								tieBreaker: "efficient",
								multiplier: 1,
							}
						},	
						rounds: [
							{
								robots: [
									{
										name: "learnBot",
										power: Math.floor(Math.random() * 4),
										cubes: {
											red: Math.floor(Math.random() * 2),
											orange: Math.floor(Math.random() * 2),
											yellow: Math.floor(Math.random() * 2),
											green: Math.floor(Math.random() * 2),
											blue: Math.floor(Math.random() * 2),
											purple: Math.floor(Math.random() * 2),
										},
										action: ["sleep","take","power"][Math.floor(Math.random() * 3)]
									},
									{
										name: "otherBot",
										power: Math.floor(Math.random() * 4),
										cubes: {
											red: Math.floor(Math.random() * 2),
											orange: Math.floor(Math.random() * 2),
											yellow: Math.floor(Math.random() * 2),
											green: Math.floor(Math.random() * 2),
											blue: Math.floor(Math.random() * 2),
											purple: Math.floor(Math.random() * 2),
										},
										action: ["sleep","take","power"][Math.floor(Math.random() * 3)]
									}
								],
								cubes: [ ["red","orange","yellow","green","blue","purple"][Math.floor(Math.random() * 6)] ],
								winner: ["learnBot","otherBot"][Math.floor(Math.random() * 2)]
							}
						],
					}

				//create sandbox from arena data
					for (var j = 0; j < window.inputs.length; j++) {
						switch(inputs[j]) {
							case "arena": //all other inputs can be derived from this one
								var arena = { //for arena, only include state, rules, and rounds data (no id, created, humans, or entrants)
									state: data.state,
									rules: data.rules,
									rounds: data.rounds
								};
							break;

							case "name":
								var name = "learnBot"; //can be derived in robot-code as `arguments.callee.name` - it'll still actually be the robot's id
							break;

							case "rules":
								var rules = data.rules;
							break;

							case "rounds":
								var rounds = data.rounds;
							break;

							case "roundCount":
								var roundCount = data.rounds.length - 1;
							break;

							case "currentRound":
								var currentRound = data.rounds[data.rounds.length - 1];
							break;

							case "lastRound":
								var lastRound = data.rounds[data.rounds.length - 2];
							break;

							case "robots":
								var robots = data.rounds[data.rounds.length - 1].robots;
							break;

							case "robotCount":
								var robotCount = data.rounds[data.rounds.length - 1].robots.length;
							break;

							case "newCube":
								var newCube = data.rounds[data.rounds.length - 1].cubes[data.rounds[data.rounds.length - 1].cubes.length - 1];
							break;

							case "newCubes":
								var newCubes = data.rounds[data.rounds.length - 1].cubes.slice(-data.rules.cubes.spawnRate);
							break;

							case "self":
								var self = data.rounds[data.rounds.length - 1].robots.find(function(robot) {return robot.name === "learnBot"});
							break;

							case "slot":
								var slot = data.rounds[data.rounds.length - 1].robots.indexOf(data.rounds[data.rounds.length - 1].robots.find(function(robot) {return robot.name === "learnBot"}));
							break;

							case "power":
								var power = data.rounds[data.rounds.length - 1].robots.find(function(robot) {return robot.name === "learnBot"}).power;
							break;

							case "cubes":
								var cubes = data.rounds[data.rounds.length - 1].robots.find(function(robot) {return robot.name === "learnBot"}).cubes;
							break;

							case "action":
								var action = data.rounds[data.rounds.length - 1].robots.find(function(robot) {return robot.name === "learnBot"}).action;
							break;

							case "winner":
								var winner = data.rounds[data.rounds.length - 1].winner;
							break;

							case "opponents":
								var opponents = data.rounds[data.rounds.length - 1].robots.filter(function(robot) {return robot.name !== "learnBot"});
							break;

							case "colors":
								var colors = data.rules.cubes.colors;
							break;
						}
					}

				//clean up code and add path following logs
					for (var line = 0; line < window.code.length; line++) {
						if (window.code[line].replace(/[\n\s\t\}\;\)\,\]]/g,"").length === 0) {
							//no executable code - just space / close brackets
						}
						else if ((/^[\s]*[a-zA-Z0-9_\"\']*\:[\s]*[a-zA-Z0-9_\"\']\,?[\s]*$/g).test(window.code[line])) {
							//object
						}
						else if ((/^[\s]*catch/g).test(window.code[line])) {
							//catch block
							window.code[line] = window.code[line].replace(/catch[\s]*\(([a-zA-Z0-9_\"\'])\)[\s]*\{/g, "catch ($1) { \nwindow.lineLog(" + line + ");\n").replace(/console\.log\(/g,"window.consoleLog(\"" + line + ":: \" + ");
						}
						else if ((/^[\s]*finally/g).test(window.code[line])) {
							//finally block
							window.code[line] = window.code[line].replace(/finally[\s]*\{/g, "finally { \nwindow.lineLog(" + line + ");\n").replace(/console\.log\(/g,"window.consoleLog(\"" + line + ":: \" + ");
						}
						else if ((/^[\s]*else/).test(window.code[line])) {
							//else or else if
							window.code[line] = ("else if (window.lineLog(" + line + ")) {}\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(\"" + line + ":: \" + ");
						}
						else if ((/^[\s]*(case|default)/).test(window.code[line])) {
							// case or default
							window.code[line] = ("case (window.lineLog(" + line + ")):\nbreak;\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(\"" + line + ":: \" + ");
						}
						else {
							//normal code
							window.code[line] = ("window.lineLog(" + line + ");\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(\"" + line + ":: \" + ");
						}
					}

				//execute code
					try {
						window.output = eval("function learnBot(" + window.inputs.join(", ") + ") {" + window.code.join("\n") + "} \n learnBot(" + window.inputs.join(", ") + ");");
						console.log(window.output);
					}
					catch (error) {
						window.output = "";
						$("#console").html("//" + error + "<br>");
					}

				//display code, logs, output, errors
					console.log(window.lines);
					console.log(window.logs);
					console.log(window.code);
					window.code = window.code.join("\n").replace(/else\ if\ \(window\.lineLog\([\d]*\)\)\ \{\}\n/g,"").replace(/case\ \(window\.lineLog\([\d]*\)\):\nbreak\;\n/g,"").replace(/window\.lineLog\([\d]*\);\n/g,"").replace(/window\.consoleLog\(\"[\d]*\:\:\s\"\s\+\s/g,"console.log(");
					window.code = window.code.split("\n");

					$("#code").prop("contenteditable",false);
					$("#code").closest(".field_frame").removeClass("active");

					$("#inputs").prop("contenteditable",false);
					$("#inputs").closest(".field_frame").removeClass("active");

					window.loop = setInterval(function() {
						if (window.lines.length > 0) {
							console.log(window.code[window.lines[0]]);
							$("#code").html(window.colorText(window.code.slice(0,window.lines[0]).join("\n")) + "<div class='live_line'>" + window.colorText(window.code[window.lines[0]]) + "</div>");
							
							var log = window.logs.find(function(l) { return Number(l.substring(0,l.indexOf("::"))) === window.lines[0];});
							if ((typeof log !== "undefined") && (log !== null)) {
								$("#console").html($("#console").html() + "//" + log + "<br>");
								window.logs.splice(window.logs.indexOf(log),1);
							}
							
							window.lines.shift();
						}
						else {
							$("#code").html(window.colorText(window.code.join("\n")));
							$("#output").text(window.output || "null");

							window.logs = [];
							window.lines = [];
							clearInterval(window.loop);

							setTimeout(function() {
								$("#inputs").animateText({text: window.inputs.join(", ") || ""},1000);
								$("#inputs").prop("contenteditable",true).closest(".field_frame").addClass("active");
								$("#code").animateText({text: window.code.join("\n") || ""},1000);
								$("#code").prop("contenteditable",true).closest(".field_frame").addClass("active");
							},3000);
						}
					},1000);
			}
		
	});
