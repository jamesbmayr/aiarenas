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
						<span class="whitetext">action: </span><span class="select_outer yellowtext"><select class="yellowtext action">\
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
				$("#cubes").append("<div class='cube_outer " + color + "back'><div class='cube_inner whitetext'>" + color + "<br><form action='javascript:;' onsubmit='window.remove_cube(this);'><span class='whitetext'>.</span><button class='whitetext' name='action' value='remove_cube'>x()</button></form></div></div>");
			}

			window.remove_cube = function(button) {
				var cube = $(button).closest(".cube_outer");
				$(cube).remove();
			}

		/* eval_code */
			window.logs = [];
			window.consoleLog = function(line, log) {
				window.logs.push(line + ":: " + log);
			}

			window.lines = [];
			window.lineLog = function(log) {
				window.lines.push(log);
			}

			window.evaluating = false;
			window.eval_code = function() {
				if (!window.evaluating) {
					//reset
						window.evaluating = true;
						$("#console").empty();
						$("#next_step").prop("disabled",true);
						
						$(".top_inner").find(".indented").hide();
						$(".top_inner").find(".section-toggle").removeClass("section-toggle-down").addClass("section-toggle-up").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
						resizeTop();

					//get code and inputs
						window.code = $("#code").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
						window.code = window.code.split("\n");

						window.inputs = $("#inputs").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s/g,"");
						window.inputs = window.inputs.split(",");

					//get arena rules
						var rules = {
							players: {},
							cubes: {},
							robots: {},
							victory: {}
						};

						$("#rules select").each(function() {
							var id = String($(this).attr("id")).split("_");
							rules[id[0]][id[1]] = $(this).val();
						});

						$("#rules input").each(function() {
							var id = String($(this).attr("id")).split("_");
							if (typeof rules[id[0]][id[1]] === "undefined") {
								rules[id[0]][id[1]] = [];
							}
							if ($(this).prop("checked")) {
								rules[id[0]][id[1]].push($(this).val());
							}
						});

					//get arena cubes
						var sandbox_cubes = [];
						var array = $(".cube_outer").toArray();
						for (var i = 0; i < array.length; i++) {
							var cube_color = $(array[i]).text();
							if (cube_color.indexOf(".") > -1) {
								cube_color = cube_color.substring(0, cube_color.indexOf("."));
							}
							sandbox_cubes.push(cube_color);
						}

					//get arena robots
						var sandbox_robots = [
							{
								name: $(".self").attr("id"),
								power: Number($(".self").find(".power").val()),
								cubes: {
									red: Number($(".self").find(".cubes_red").val()),
									orange: Number($(".self").find(".cubes_orange").val()),
									yellow: Number($(".self").find(".cubes_yellow").val()),
									green: Number($(".self").find(".cubes_green").val()),
									blue: Number($(".self").find(".cubes_blue").val()),
									purple: Number($(".self").find(".cubes_purple").val()),
								},
								action: $(".self").find(".action").val(),
							}
						];
						var array = $(".opponent").toArray();
						for (var i = 0; i < array.length; i++) {
							var opponent = {
								name: $(array[i]).attr("id"),
								power: Number($(array[i]).find(".power").val()),
								cubes: {
									red: Number($(array[i]).find(".cubes_red").val()),
									orange: Number($(array[i]).find(".cubes_orange").val()),
									yellow: Number($(array[i]).find(".cubes_yellow").val()),
									green: Number($(array[i]).find(".cubes_green").val()),
									blue: Number($(array[i]).find(".cubes_blue").val()),
									purple: Number($(array[i]).find(".cubes_purple").val()),
								},
								action: $(array[i]).find(".action").val(),
							}
							sandbox_robots.push(opponent);
						} 

					//build arena sandbox
						var sandbox = {
							rules: rules,
							rounds: [
								{
									start: new Date().getTime(),
									cubes: sandbox_cubes,
									robots: sandbox_robots,
									winner: null
								}
							]
						};

					//create sandbox from arena data
						for (var j = 0; j < window.inputs.length; j++) {
							switch(inputs[j]) {
								case "arena": //all other inputs can be derived from this one
									var arena = { //for arena, only include rules and rounds data (no id, created, humans, state, or entrants)
										rules: sandbox.rules,
										rounds: sandbox.rounds
									};
								break;

								case "name":
									var name = sandbox.rounds[0].robots[0].name; //can be derived in robot-code as `arguments.callee.name` - it'll still actually be the robot's id
								break;

								case "rules":
									var rules = sandbox.rules;
								break;

								case "rounds":
									var rounds = sandbox.rounds;
								break;

								case "roundCount":
									var roundCount = sandbox.rounds.length - 1;
								break;

								case "currentRound":
									var currentRound = sandbox.rounds[sandbox.rounds.length - 1];
								break;

								case "lastRound":
									var lastRound = sandbox.rounds[sandbox.rounds.length - 2];
								break;

								case "firstRound":
									var firstRound = sandbox.rounds[0];
								break;

								case "robots":
									var robots = sandbox.rounds[sandbox.rounds.length - 1].robots;
								break;

								case "robotCount":
									var robotCount = sandbox.rounds[sandbox.rounds.length - 1].robots.length;
								break;

								case "allCubes":
									var allCubes = sandbox.rounds[sandbox.rounds.length - 1].cubes;
								break;

								case "newCubes":
									var newCubes = sandbox.rounds[sandbox.rounds.length - 1].cubes.slice(-sandbox.rules.cubes.spawnRate);
								break;

								case "self":
									var self = sandbox.rounds[sandbox.rounds.length - 1].robots.find(function(robot) {return robot.name === sandbox.rounds[0].robots[0].name});
								break;

								case "power":
									var power = sandbox.rounds[sandbox.rounds.length - 1].robots.find(function(robot) {return robot.name === sandbox.rounds[0].robots[0].name}).power;
								break;

								case "cubes":
									var cubes = sandbox.rounds[sandbox.rounds.length - 1].robots.find(function(robot) {return robot.name === sandbox.rounds[0].robots[0].name}).cubes;
								break;

								case "action":
									var action = sandbox.rounds[sandbox.rounds.length - 1].robots.find(function(robot) {return robot.name === sandbox.rounds[0].robots[0].name}).action;
								break;

								case "winner":
									var winner = sandbox.rounds[sandbox.rounds.length - 1].winner;
								break;

								case "opponents":
									var opponents = sandbox.rounds[sandbox.rounds.length - 1].robots.filter(function(robot) {return robot.name !== sandbox.rounds[0].robots[0].name});
								break;

								case "colors":
									var colors = sandbox.rules.cubes.colors;
								break;

								case "actions":
									var actions = sandbox.rules.robots.actions;
								break;

								case "conditions":
									var conditions = sandbox.rules.victory.conditions;
								break;
							}
						}

					//clean up code and add path following logs
						for (var line = 0; line < window.code.length; line++) {
							if (window.code[line].replace(/[\n\s\t\}\;\)\,\]]/g,"").length === 0) {
								//no executable code - just space / close brackets
							}
							else if (window.code[line].replace(/[\s]*?\/\/.*?$/g,"").length === 0) {
								//no executable code - just //comments
							}
							else if (window.code[line].replace(/[\s]*?\/\*[^\*\/]*?\*\/[\s]*?$/g,"").length === 0) {
								//no executable code - just /* comments */
							}
							else if ((/^[\s]*[a-zA-Z0-9_\"\']*\:[\s]*[a-zA-Z0-9_\"\']\,?[\s]*$/g).test(window.code[line])) {
								//object
							}
							else if ((/^[\s]*catch/g).test(window.code[line])) {
								//catch block
								window.code[line] = window.code[line].replace(/catch[\s]*\(([a-zA-Z0-9_\"\'])\)[\s]*\{/g, "catch ($1) { \nwindow.lineLog(" + line + ");\n").replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
							}
							else if ((/^[\s]*finally/g).test(window.code[line])) {
								//finally block
								window.code[line] = window.code[line].replace(/finally[\s]*\{/g, "finally { \nwindow.lineLog(" + line + ");\n").replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
							}
							else if ((/^[\s]*else/).test(window.code[line])) {
								//else or else if
								window.code[line] = ("else if (window.lineLog(" + line + ")) {}\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
							}
							else if ((/^[\s]*(case|default)/).test(window.code[line])) {
								// case or default
								window.code[line] = ("case (window.lineLog(" + line + ")):\nbreak;\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
							}
							else {
								//normal code
								window.code[line] = ("window.lineLog(" + line + ");\n") + window.code[line].replace(/console\.log\(/g,"window.consoleLog(" + line + ",");
							}
						}

					//execute code
						try {
							window.output = eval("function " + sandbox.rounds[0].robots[0].name + "(" + window.inputs.join(", ") + ") {" + window.code.join("\n") + "} \n " + sandbox.rounds[0].robots[0].name + "(" + window.inputs.join(", ") + ");");
						}
						catch (error) {
							window.output = "";
							$("#console").html("//" + error + "<br>");
						}

						if (window.output === undefined) {
							window.output = "";
						}

					//display code, logs, output, errors
						window.code = window.code.join("\n").replace(/else\ if\ \(window\.lineLog\([\d]*\)\)\ \{\}\n/g,"").replace(/case\ \(window\.lineLog\([\d]*\)\):\nbreak\;\n/g,"").replace(/window\.lineLog\([\d]*\);\n/g,"").replace(/window\.consoleLog\([\d]*\,/g,"console.log("); 
						window.code = window.code.split("\n");

						$("#code").prop("contenteditable",false);
						$("#code").closest(".field_frame").removeClass("active");

						$("#inputs").prop("contenteditable",false);
						$("#inputs").closest(".field_frame").removeClass("active");

						window.loop = setInterval(function() {
							if (window.lines.length > 0) {
								console.log(window.code[window.lines[0]]);
								$("#code").html(window.colorText(window.code.slice(0,window.lines[0]).join("\n").replace(/\n/g,"<br>")) + (window.lines[0] > 0 ? "<br>" : "") + "<div class='live_line'>" + window.colorText(window.code[window.lines[0]]) + "</div>");
								
								var log = window.logs.find(function(l) { return Number(l.substring(0,l.indexOf("::"))) === window.lines[0];});
								if ((typeof log !== "undefined") && (log !== null)) {
									$("#console").html($("#console").html() + "//" + log + "<br>");
									window.logs.splice(window.logs.indexOf(log),1);
								}
								
								window.lines.shift();
							}
							else {
								var step = Number($("#step").attr("value")) || 0;

								if ((window.code.join("\n").replace(/\/\/[^\n]*?(\n|$)/g,"").replace(/\/\*[^\*\/]*?(\*\/|$)/g,"").replace(/[\n\s\t\;]/g,"") == window.tutorial.steps[step].end.code.replace(/\/\/[^\n]*?(\n|$)/g,"").replace(/\/\*[^\*\/]*?(\*\/|$)/g,"").replace(/[\n\s\t\;]/g,"")) && (String(window.output).replace(/[\n\s\t\;]/g,"") == window.tutorial.steps[step].end.output.replace(/[\n\s\t\;]/g,"")) && ($("#inputs").text().replace(/[\n\s\t\;]/g,"") == window.tutorial.steps[step].end.inputs.replace(/[\n\s\t\;]/g,""))) {
									$("#instructions").animateText({text: window.tutorial.steps[step].messages.success || "", interval: 50, colorText: true, resizeTop: true});
								}
								else {
									$("#instructions").animateText({text: window.tutorial.steps[step].messages.error || "", interval: 50, colorText: true, resizeTop: true});
								}

								$("#code").html(window.colorText(window.code.join("\n")));
								$("#output").text(window.output);
								window.animateRobot($(".self").attr("id"), window.output);

								window.logs = [];
								window.lines = [];
								clearInterval(window.loop);

								$(".top_inner").find(".indented").show();
								$(".top_inner").find(".section-toggle").removeClass("section-toggle-up").addClass("section-toggle-down").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
								resizeTop();
								
								setTimeout(function() {
									$("#inputs").animateText({text: window.inputs.join(", ") || ""},1000);
									$("#inputs").prop("contenteditable",true).closest(".field_frame").addClass("active");
									$("#code").animateText({text: window.code.join("\n") || ""},1000);
									$("#code").prop("contenteditable",true).closest(".field_frame").addClass("active");
									
									window.evaluating = false;
									$("#next_step").prop("disabled",false);
									resizeTop();
								},3000);
							}
						},1000);
				}
			}
	});
