/*** tutorials ***/
	$(document).ready(function() {
		resizeTop();
		$(".field#code").html(colorText(String($(".field#code").html())));

		/* next_step */
			window.next_step = function() {
				var step = Number($("#step").attr("value")) || 0;

				if ((step + 1) < window.tutorial.steps.length) {
					step++;
					$("#step").attr("value",step).text(step);
					$("#instructions").animateText({text: window.tutorial.steps[step].messages.instructions || ""},1000);
					$("#inputs").attr("value", window.tutorial.steps[step].start.inputs).animateText({text: window.tutorial.steps[step].start.inputs || ""},1000);
					$("#inputs").prop("contenteditable",true).closest(".field_frame").addClass("active");
					$("#code").attr("value", window.tutorial.steps[step].start.inputs).animateText({text: window.tutorial.steps[step].start.code || ""},1000);
					$("#code").prop("contenteditable",true).closest(".field_frame").addClass("active");
					$("#output").delay(2000).animateText({text: window.tutorial.steps[step].start.output || ""},1000);
					$("#eval_code").closest("form").show();

					resizeTop();
				}
				else {
					$("#step").attr("value","complete").text("complete");
					$("#instructions").animateText({text: "tutorial completed;"},1000);
					
					$("#step").closest(".section").hide();
					$("#next_step").closest("form").hide();
					$("#eval_code").closest("form").hide();
					$("#exit").show();

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
								$("#message_top").animateText({text: (data.messages.top || "//unable to update tutorial completion")},1000);
							}
						}
					});
				}
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

				// console.log("eval coding");

					// var inputs = String($("#inputs").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));
					// var code = String($("#code").html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&"));

					// console.log("code: " + code);

					// try {
					// 	var output = eval("function code(" + inputs + "){\n" + code + "\n}\ncode();");
					// 	console.log(output);
					// 	$("#output").animateText({text: output || ""},1000);
					// }
					// catch (error) {
					// 	console.log(error);
					// 	$("#code").closest(".section").find(".message").animateText({text: ("//" + (String(error) || "error"))},1000);
					// }
			}
		
	});
