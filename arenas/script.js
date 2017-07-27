/*** arenas ***/
	$(document).ready(function() {
		resizeTop();

		/* presets */
			$(document).on("change", "#presets", function() {
				var preset = $("#presets").val();

				switch (preset) {
					case "default":
						var parameters = {
							players: {
								minimum: 2,
								maximum: 6,
								workshopDuration: 300000,
								workshopPeriod: 10
							},
							cubes: {
								colors: ["red", "orange", "yellow", "green", "blue", "purple"],
								startCount: 1,
								maximum: 255,
								spawnRate: 1,
								spawnMemory: 2,
								dissolveRate: 0,
								dissolveIndex: "none"
							},
							robots: {
								startPower: 1,
								maxPower: 255,
								powerRate: 1,
								tieBreaker: "cascade",
								actions: ["power","take","sleep"]
							},
							victory: {
								conditions: ["1of6","2of3","6of1"],
								tieBreaker: "efficient",
								multiplier: 1
							}
						}
					break;

					case "simple":
						var parameters = {
							players: {
								minimum: 2,
								maximum: 4,
								workshopDuration: 300000,
								workshopPeriod: 10
							},
							cubes: {
								colors: ["red", "yellow", "blue"],
								startCount: 0,
								maximum: 255,
								spawnRate: 1,
								spawnMemory: 0,
								dissolveRate: 1,
								dissolveIndex: "newest"
							},
							robots: {
								startPower: 1,
								maxPower: 255,
								powerRate: 1,
								tieBreaker: "dissolve",
								actions: ["power","take","sleep"]
							},
							victory: {
								conditions: ["2of3","6of1"],
								tieBreaker: "tie",
								multiplier: 1
							}
						}
					break;

					case "deathmatch":
						var parameters = {
							players: {
								minimum: 2,
								maximum: 2,
								workshopDuration: 300000,
								workshopPeriod: 5
							},
							cubes: {
								colors: ["red", "orange", "yellow", "green", "blue", "purple"],
								startCount: 1,
								maximum: 24,
								spawnRate: 2,
								spawnMemory: 3,
								dissolveRate: 0,
								dissolveIndex: "none"
							},
							robots: {
								startPower: 10,
								maxPower: 20,
								powerRate: 2,
								tieBreaker: "leave",
								actions: ["power","take","sleep","sap","halftake"]
							},
							victory: {
								conditions: ["1of6","2of3","6of1"],
								tieBreaker: "efficient",
								multiplier: 1
							}
						}
					break;

					case "advanced":
						var parameters = {
							players: {
								minimum: 2,
								maximum: 6,
								workshopDuration: 300000,
								workshopPeriod: 10
							},
							cubes: {
								colors: ["red", "orange", "yellow", "green", "blue", "purple"],
								startCount: 2,
								maximum: 48,
								spawnRate: 2,
								spawnMemory: 4,
								dissolveRate: 1,
								dissolveIndex: "oldest"
							},
							robots: {
								startPower: 3,
								maxPower: 20,
								powerRate: 3,
								tieBreaker: "leave",
								actions: ["power","take","sleep","sap","halftake","fliptake"]
							},
							victory: {
								conditions: ["1of6","2of3","3of2","6of1"],
								tieBreaker: "greedy",
								multiplier: 2
							}
						}
					break;

					case "intense":
						var parameters = {
							players: {
								minimum: 6,
								maximum: 6,
								workshopDuration: 120000,
								workshopPeriod: 20
							},
							cubes: {
								colors: ["red", "orange", "yellow", "green", "blue", "purple"],
								startCount: 0,
								maximum: 48,
								spawnRate: 4,
								spawnMemory: 2,
								dissolveRate: 2,
								dissolveIndex: "newest"
							},
							robots: {
								startPower: 10,
								maxPower: 255,
								powerRate: 10,
								tieBreaker: "catchup",
								actions: ["power","take","sleep","sap","shock","burn","halftake","swaptake","fliptake"]
							},
							victory: {
								conditions: ["1of6","2of3","3of2","6of1"],
								tieBreaker: "efficient",
								multiplier: 4
							}
						}
					break;

					case "scarcity":
						var parameters = {
							players: {
								minimum: 4,
								maximum: 6,
								workshopDuration: 120000,
								workshopPeriod: 10
							},
							cubes: {
								colors: ["red", "orange", "yellow", "green", "blue", "purple"],
								startCount: 2,
								maximum: 255,
								spawnRate: 1,
								spawnMemory: 4,
								dissolveRate: 0,
								dissolveIndex: "none"
							},
							robots: {
								startPower: 255,
								maxPower: 255,
								powerRate: 10,
								tieBreaker: "leave",
								actions: ["sleep","sap","shock","burn","halftake","swaptake","fliptake"]
							},
							victory: {
								conditions: ["1of6","6of1"],
								tieBreaker: "greedy",
								multiplier: 1
							}
						}
					break;

					case "random":
						var parameters = {
							players: {
								minimum: 3,
								maximum: 6,
								workshopDuration: 60000,
								workshopPeriod: 20
							},
							cubes: {
								colors: ["red", "orange", "yellow", "green", "blue", "purple"],
								startCount: 1,
								maximum: 255,
								spawnRate: 2,
								spawnMemory: 0,
								dissolveRate: 1,
								dissolveIndex: "random"
							},
							robots: {
								startPower: 2,
								maxPower: 255,
								powerRate: 2,
								tieBreaker: "random",
								actions: ["power","take","sleep","sap","shock","fliptake"]
							},
							victory: {
								conditions: ["1of6","3of2","6of1"],
								tieBreaker: "random",
								multiplier: 3
							}
						}
					break;

					case "custom":
					default:
						//
					break;
				}

				if ((typeof parameters !== "undefined") && (parameters !== null)) {
					$("#players_minimum").val(parameters.players.minimum);
					$("#players_maximum").val(parameters.players.maximum);
					$("#players_workshopDuration").val(parameters.players.workshopDuration);
					$("#players_workshopPeriod").val(parameters.players.workshopPeriod);

					$("#cubes_colors_red").prop("checked",(parameters.cubes.colors.indexOf("red") > -1));
					$("#cubes_colors_orange").prop("checked",(parameters.cubes.colors.indexOf("orange") > -1));
					$("#cubes_colors_yellow").prop("checked",(parameters.cubes.colors.indexOf("yellow") > -1));
					$("#cubes_colors_green").prop("checked",(parameters.cubes.colors.indexOf("green") > -1));
					$("#cubes_colors_blue").prop("checked",(parameters.cubes.colors.indexOf("blue") > -1));
					$("#cubes_colors_purple").prop("checked",(parameters.cubes.colors.indexOf("purple") > -1));

					$("#cubes_startCount").val(parameters.cubes.startCount);
					$("#cubes_maximum").val(parameters.cubes.maximum);
					$("#cubes_spawnRate").val(parameters.cubes.spawnRate);
					$("#cubes_spawnMemory").val(parameters.cubes.spawnMemory);
					$("#cubes_dissolveRate").val(parameters.cubes.dissolveRate);
					$("#cubes_dissolveIndex").val(parameters.cubes.dissolveIndex);

					$("#robots_startPower").val(parameters.robots.startPower);
					$("#robots_maxPower").val(parameters.robots.maxPower);
					$("#robots_powerRate").val(parameters.robots.powerRate);
					$("#robots_tieBreaker").val(parameters.robots.tieBreaker);

					$("#robots_actions_power").prop("checked",(parameters.robots.actions.indexOf("power") > -1));
					$("#robots_actions_take").prop("checked",(parameters.robots.actions.indexOf("take") > -1));
					$("#robots_actions_sleep").prop("checked",(parameters.robots.actions.indexOf("sleep") > -1));
					$("#robots_actions_sap").prop("checked",(parameters.robots.actions.indexOf("sap") > -1));
					$("#robots_actions_shock").prop("checked",(parameters.robots.actions.indexOf("shock") > -1));
					$("#robots_actions_burn").prop("checked",(parameters.robots.actions.indexOf("burn") > -1));
					$("#robots_actions_halftake").prop("checked",(parameters.robots.actions.indexOf("halftake") > -1));
					$("#robots_actions_swaptake").prop("checked",(parameters.robots.actions.indexOf("swaptake") > -1));
					$("#robots_actions_fliptake").prop("checked",(parameters.robots.actions.indexOf("fliptake") > -1));

					$("#victory_multiplier").val(parameters.victory.multiplier);
					$("#victory_tieBreaker").val(parameters.victory.tieBreaker);
					$("#victory_conditions_1of6").prop("checked",(parameters.victory.conditions.indexOf("1of6") > -1));
					$("#victory_conditions_2of3").prop("checked",(parameters.victory.conditions.indexOf("2of3") > -1));
					$("#victory_conditions_3of2").prop("checked",(parameters.victory.conditions.indexOf("3of2") > -1));
					$("#victory_conditions_6of1").prop("checked",(parameters.victory.conditions.indexOf("6of1") > -1));
				}
			});

			$(document).on("change","#parameters select",function() {
				if ($(this).attr("id") !== "presets") {
					$("#presets").val("custom");
				}
			});

			$(document).on("change","#parameters input",function() {
				if ($(this).attr("id") !== "join_key") {
					$("#presets").val("custom");
				}
			});
		
		/* arenas main page */
			window.join_arena = function() {
				var arena_id = $("#join_key").val() || $(".container").attr("value").substring(0,4);

				if (arena_id.length === 4) {
					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "join_arena",
							data: JSON.stringify({arena_id: arena_id || null})
						},
						success: function(data) {
							if (data.success) {
								window.location = data.redirect;
							}
							else {
								$("#message_top").animateText({text: (data.messages.top || "//unable to join arena")}, 1000);
							}
						}
					});
				}
				else {
					$("#message_top").animateText({text: "//enter a 4-character arena_id"}, 1000);
				}
			}

			window.create_arena = function() {
				var parameters = {
					preset: $("#presets").val(),
					players: {},
					cubes: {},
					robots: {},
					victory: {}
				};

				$("#parameters select").each(function() {
					var id = String($(this).attr("id")).split("_");
					parameters[id[0]][id[1]] = $(this).val();
				});

				$("#parameters input").each(function() {
					var id = String($(this).attr("id")).split("_");
					if (typeof parameters[id[0]][id[1]] === "undefined") {
						parameters[id[0]][id[1]] = [];
					}
					if ($(this).prop("checked")) {
						parameters[id[0]][id[1]].push($(this).val());
					}
				});

				//sanity checks
					if (parameters.players.minimum > parameters.players.maximum) {
						$("#message_top").animateText({text: "//minimum player count cannot exceed maximum player count"}, 1000);
					}
					else if (parameters.cubes.colors.length < 1) {
						$("#message_top").animateText({text: "//select at least 1 cube color"}, 1000);
					}
					else if (parameters.cubes.startCount > parameters.cubes.maximum) {
						$("#message_top").animateText({text: "//starting cube count cannot exceed maximum cube count"}, 1000);
					}
					else if (parameters.cubes.spawnMemory >= parameters.cubes.colors.length) {
						$("#message_top").animateText({text: "//cube spawnMemory must be less than the number of cube colors"}, 1000);
					}
					else if (parameters.robots.startPower > parameters.robots.maxPower) {
						$("#message_top").animateText({text: "//starting power cannot exceed maximum power"}, 1000);
					}
					else if (!(parameters.robots.actions.indexOf("take") > -1) && !(parameters.robots.actions.indexOf("swaptake") > -1) && !(parameters.robots.actions.indexOf("fliptake") > -1) && !(parameters.robots.actions.indexOf("halftake") > -1)) {
						$("#message_top").animateText({text: "//select at least 1 take action"}, 1000);
					}
					else if (!(parameters.robots.actions.indexOf("power") > -1) && !(parameters.robots.actions.indexOf("sap") > -1) && !(parameters.robots.actions.indexOf("burn") > -1)) {
						$("#message_top").animateText({text: "//select at least 1 power action"}, 1000);
					}
					else if (parameters.victory.conditions.length < 1) {
						$("#message_top").animateText({text: "//select at least 1 victory condition"}, 1000);
					}
				else {

					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "create_arena",
							data: JSON.stringify(parameters)
						},
						success: function(data) {
							if (data.success) {
								window.location = data.redirect;
							}
							else {
								$("#message_top").animateText({text: (data.messages.top || "//unable to create arena")}, 1000);
							}
						}
					});

				}
			}

			window.random_arena = function() {
				var preset = $("#random_preset").val() || "default";
				
				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "random_arena",
						data: JSON.stringify({preset: preset || null})
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to join a random arena of that type")}, 1000);
						}
					}
				});
			}

		/* arenas individual page */
			window.leave_arena = function() {
				var arena_id = $(".container").attr("value");

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "leave_arena",
						data: JSON.stringify({arena_id: arena_id || null})
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to leave arena")}, 1000);
						}
					}
				});
			}

			window.select_robot = function() {
				var robot_id = $("#robot_selection").val();
				var arena_id = $(".container").attr("value");

				if (robot_id === "upload") {
					$("#file_chooser").click();
				}
				else {
					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "select_robot",
							data: JSON.stringify({
								robot_id: (robot_id || null),
								arena_id: (arena_id || null)
							})
						},
						success: function(data) {
							if (data.success) {
								window.location = data.redirect;
							}
							else {
								$("#message_top").animateText({text: (data.messages.top || "//unable to select robot")}, 1000);
							}
						}
					});
				}
			}

			$(document).on("change","#file_chooser",function(event) {
				if (($("#file_chooser").val() !== null) && ($("#file_chooser").val().length > 0)) {
					var reader = new FileReader();
					reader.readAsText(event.target.files[0]);
					reader.onload = function(event) {
						var robot = JSON.parse(event.target.result);
						var arena_id = $(".container").attr("value");

						$.ajax({
							type: "POST",
							url: window.location.pathname,
							data: {
								action: "select_robot",
								data: JSON.stringify({
									robot_id: "upload",
									arena_id: (arena_id || null),
									robot: robot
								})
							},
							success: function(data) {
								if (data.success) {
									window.location = data.redirect;
								}
								else {
									$("#message_top").animateText({text: (data.messages.top || "unable to upload robot")},1000);
								}
							}
						});
					}
				}
			});

			window.delete_arena = function() {
				var arena_id = $(".container").attr("value");

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "delete_arena",
						data: JSON.stringify({arena_id: arena_id || null})
					},
					success: function(data) {
						if (data.success) {
							window.location = data.redirect;
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to delete arena")}, 1000);
						}
					}
				});
			}

			window.add_aibot = function() {
				var aibot = $("#aibot_selection").val() || null;
				var arena_id = $(".container").attr("value");

				if (aibot) {
					clearInterval(window.aibot_timeout);
					$("#add_aibot").prop("disabled",true).css("cursor","wait");

					window.aibot_timeout = setTimeout(function() {
						$("#add_aibot").prop("disabled",false).css("cursor","pointer");
					}, 5000);

					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "add_aibot",
							data: JSON.stringify({
								aibot: (aibot || null),
								arena_id: (arena_id || null)
							})
						},
						success: function(results) {
							if (results.success) {
								$("#message_top").animateText({text: results.messages.top || ("//adding " + aibot + "...")},1000);
								$("#aibot_selection").find("option[value=" + aibot + "]").remove();
							}
							else {
								$("#message_top").animateText({text: results.messages.top || ("//unable to add " + aibot)},1000);
							}
						}
					});
				}
			}

			window.launch_arena = function() {
				var arena_id = $(".container").attr("value");

				$.ajax({
					type: "POST",
					url: window.location.pathname,
					data: {
						action: "launch_arena",
						data: JSON.stringify({arena_id: arena_id || null})
					},
					success: function(data) {
						if (data.success) {
							resizeTop();
							window.location = window.location;
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to launch arena")}, 1000);
						}
					}
				});
			}

			window.robot_save = function() {
				if ((window.arena.state.pauseFrom !== null) && (window.arena.state.pauseTo !== null)) {
					var data = {
						arena_id: $(".container").attr("value"),
						robot_id: $("#workshop").attr("value")
					}
					
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

					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "adjust_robot",
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

							}
						}
					});
				}
			}

			$("#workshop_select").change(function() {
				var id = $("#workshop_select").val() || "";
				if ((typeof window.arena.entrants[id] !== "undefined") && (window.arena.entrants[id] !== null)) {
					$("#output").text("");
					$("#console").text("");
					clearInterval(window.evalLoop);
					window.evaluating = false;

					$("#inputs").html(window.colorText(window.arena.entrants[id].inputs));
					$("#code").html(window.colorText(window.arena.entrants[id].code));
				}
			});

		/* checkLoop */
			window.startCheckLoop = function() {
				window.checkLoop = setInterval(function() {
					console.log("checkloop");
					var arena_id = $(".container").attr("value");
					var timeNow = new Date().getTime();

					$.ajax({
						type: "POST",
						url: window.location.pathname,
						data: {
							action: "read_arena",
							data: JSON.stringify({arena_id: arena_id || null})
						},
						success: function(data) {
							if (data.success) {
								if ((data.arena.state.start !== null) && (data.arena.state.start - 5000 < timeNow)) { //game has started or starts in under 5 seconds
									clearInterval(window.checkLoop);
									window.location = window.location; //refresh to start gameLoop
								}
								else {
									if (data.arena.state.start !== null) {
										$("#message_top").animateText({text: "//" + Math.max(0, Math.floor(Math.ceil((data.arena.state.start - timeNow) / 1000) / 5) * 5) + "..."}, 1000); //show a countdown
									}
									else {
										$("#message_top").animateText({text: "//not started..."}, 1000);
									}
									
									//update player list
										if (($("#players").attr("value") !== data.arena.humans.join()) || ($("#players").find(".unknown").toArray().length > 0)) {
											var string = "";
											for (var i = 0; i < data.arena.humans.length; i++) {
												var entrant = data.arena.entrants[Object.keys(data.arena.entrants).find(function(j) { return (data.arena.entrants[j].human.id === data.arena.humans[i])})];
												if ((typeof entrant !== "undefined") && (entrant !== "undefined") && (entrant !== null)) {
													if (entrant.human.name === "guest") {
														string += "<span class='bluetext player'>guest</a>, ";
													}
													else {
														string += "<a class='bluetext player' target='_blank' href='../../../../humans/" + entrant.human.name + "'>" + entrant.human.name + "</a>, ";
													}
												}
												else if (data.arena.humans[i] !== 0) { //no ??? for fake human in random arena
													string += "<span class='yellowtext unknown player'>???</span>, ";
												}
											}

											$("#players").attr("value", data.arena.humans);
											$("#players").html(string.substring(0, string.length - 2));
										}

									//update robot list
										if ($("#robots").attr("value") !== Object.keys(data.arena.entrants).join()) {
											if ((data.arena.entrants !== null) && (Object.keys(data.arena.entrants).length > 0)) {
												var entrants = Object.keys(data.arena.entrants);
												$("#robots").attr("value", entrants);

												var string = "";
												for (var i = 0; i < entrants.length; i++) {
													if ($("#" + entrants[i]).toArray().length === 0) {
														var entrant = data.arena.entrants[entrants[i]];
														if (data.arena.rounds.length > 0) {
															var robot = data.arena.rounds[data.arena.rounds.length - 1].robots.find(function(i) { return i.name = entrant.id}) || {};
														}
														else {
															var robot = {
																power: 0,
																cubes: {
																	red: 0,
																	orange: 0,
																	yellow: 0,
																	green: 0,
																	blue: 0,
																	purple: 0
																}
															};
														}

														if (entrant.human.name === "guest") {
															var robot_link = '<span class="bluetext avatar_name">' + entrant.name + '</span>';
														}
														else {
															var robot_link = '<a class="bluetext avatar_name" href="../../../../robots/' + entrant.id + '" target="_blank">' + entrant.name + '</a>';
														}

														string += ('<div class="section opponent" id="' + entrant.id + '">'
															+ robot_link + 
															'<div class="stats">\
																<span class="whitetext">power:</span><span class="purpletext power count">' + (robot.power || "0") + '</span><span class="whitetext">,</span><br>\
																<div class="whitetext">\
																	cubes.<span class="redtext">red</span>:<span class="cubes_red purpletext count">' + (robot.cubes.red || "0") + '</span><br>\
																	cubes.<span class="orangetext">orange</span>:<span class="cubes_orange purpletext count">' + (robot.cubes.orange || "0") + '</span><br>\
																	cubes.<span class="yellowtext">yellow</span>:<span class="cubes_yellow purpletext count">' + (robot.cubes.yellow || "0") + '</span><br>\
																	cubes.<span class="greentext">green</span>:<span class="cubes_green purpletext count">' + (robot.cubes.green || "0") + '</span><br>\
																	cubes.<span class="bluetext">blue</span>:<span class="cubes_blue purpletext count">' + (robot.cubes.blue || "0") + '</span><br>\
																	cubes.<span class="purpletext">purple</span>:<span class="cubes_purple purpletext count">' + (robot.cubes.purple || "0") + '</span>\
																</div>\
																<span class="whitetext">action: </span><span class="yellowtext action count">' + (robot.action || "?") + '</span>\
															</div>\
															<pre class="avatar_pre" monospace style="color: ' + (entrant.avatar.color || "var(--white)") + '">\
<span class="transparenttext leftDot">•</span><span class="transparenttext">•••••</span><span class="avatar avatar_antennae" value="' + (entrant.avatar.antennae.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.antennae || "•••••") + '</span><span class="transparenttext">•••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand" value="' + (entrant.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_eyes" value="' + (entrant.avatar.eyes.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.eyes || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand transparenttext" value="' + (entrant.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist" value="' + (entrant.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_mouth" value="' + (entrant.avatar.mouth.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.mouth || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist transparenttext" value="' + (entrant.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (entrant.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••</span><span class="avatar avatar_left_shoulder_up">\\</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_left_arm" value="' + (entrant.avatar.left_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (entrant.avatar.left_arm || "••") + '</span><span class="avatar avatar_torso_1" value="' + (entrant.avatar.torso_1.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.torso_1 || "•••••") + '</span><span class="avatar avatar_right_arm" value="' + (entrant.avatar.right_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (entrant.avatar.right_arm || "••") + '</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_right_shoulder_down">\\</span><span class="transparenttext">••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist transparenttext" value="' + (entrant.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_2" value="' + (entrant.avatar.torso_2.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.torso_2 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist" value="' + (entrant.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (entrant.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand transparenttext" value="' + (entrant.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_3" value="' + (entrant.avatar.torso_3.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.torso_3 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand" value="' + (entrant.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_leg" value="' + (entrant.avatar.left_leg.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (entrant.avatar.left_leg || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_leg" value="' + (entrant.avatar.right_leg.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (entrant.avatar.right_leg || "•••") + '</span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="' + (entrant.avatar.left_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (entrant.avatar.left_foot || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="' + (entrant.avatar.right_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (entrant.avatar.right_foot || "•••") + '</span><span class="transparenttext">••••</span>\n\
</pre></div>');
														
														$("#robots").find("div.indented").append(string);
													}
												}

												clearInterval(window.aibot_timeout);
												$("#add_aibot").prop("disabled",false).css("cursor","pointer");
											}
										}
								}
							}
							else {
								$("#message_top").animateText({text: (data.messages.top || "//unable to read arena")}, 1000);
							}
						}
					});
				},5000);
			}

		/* gameLoop */
			window.startGameLoop = function() {
				window.gameLoop = setInterval(function() {
					console.log("gameloop");
					if ((typeof window.arena === "undefined") || (window.arena === null)) {
						if ((typeof window.wait === "undefined") || (window.wait === null)) {
							window.wait = true;		
							setTimeout(function() {
								window.wait = null;
							}, 5000);

							var arena_id = $(".container").attr("value");

							$.ajax({
								type: "POST",
								url: window.location.pathname,
								data: {
									action: "read_arena",
									data: JSON.stringify({arena_id: arena_id || null})
								},
								success: function(data) {
									if (data.success) {
										window.arena = data.arena;
										$("#message_top").animateText({text: (data.messages.top || "//arena retrieved")}, 1000);
									}
									else {
										$("#message_top").animateText({text: (data.messages.top || "//unable to read arena")}, 1000);
									}
								}
							});
						}
					}
					else {
						var timeNow = new Date().getTime();
						var pastRounds = window.arena.rounds.filter(function(round) { return (round.start <= timeNow);});
						//console.log(timeNow + ": round " + (pastRounds.length - 1));
						
						//starting soon
							if (timeNow < window.arena.state.start) {
								$("#message_top").animateText({text: "//" + Math.max(0, Math.ceil((window.arena.state.start - timeNow) / 1000)) + "..."}, 500); //show a countdown
							}

						//display up-to-date info
							else if (($("#round").text() === "null") || (Number($("#round").text()) < (pastRounds.length - 1))) { //displayedRound is out of date
								$("#message_top").animateText({text: "//round " + (pastRounds.length - 1)}, 1000);

								//state
									if (pastRounds.length - 1 >= 0) {
										$("#round").text(pastRounds.length - 1);
										var currentRound = pastRounds[pastRounds.length - 1] || {};
										//console.log("data: " + JSON.stringify(currentRound));
									}
									else {
										$("#round").hide().text("null");
									}

								//code
									if (pastRounds.length > 1) {
										window.eval_code();
									}

								setTimeout(function() {
									//robots
										if ((typeof currentRound !== "undefined") && (currentRound !== null)) {
											for (var i = 0; i < currentRound.robots.length; i++) {
												var robot = currentRound.robots[i];
												var id = robot.name;
												
												$("#" + id).find(".action").animateText({text: (String(robot.action) || "?"), indicator: "|", color: "var(--white)"}, 1000);
												window.animateRobot(id, robot.action);
												
												if ($("#" + id).find(".power").text() !== String(Number(robot.power))) {
													$("#" + id).find(".power").animate({},2000).animateText({text: (String(Number(robot.power)) || "?"), indicator: "_", color: "var(--white)"}, 1000);
												}
												
												if ($("#" + id).find(".cubes_red").text() !== String(Number(robot.cubes.red))) {
													$("#" + id).find(".cubes_red").animate({},2000).animateText({text: (String(Number(robot.cubes.red)) || "?"), indicator: "_", color: "var(--white)"}, 1000);
												}
												if ($("#" + id).find(".cubes_orange").text() !== String(Number(robot.cubes.orange))) {
													$("#" + id).find(".cubes_orange").animate({},2000).animateText({text: (String(Number(robot.cubes.orange)) || "?"), indicator: "_", color: "var(--white)"}, 1000);
												}
												if ($("#" + id).find(".cubes_yellow").text() !== String(Number(robot.cubes.yellow))) {
													$("#" + id).find(".cubes_yellow").animate({},2000).animateText({text: (String(Number(robot.cubes.yellow)) || "?"), indicator: "_", color: "var(--white)"}, 1000);
												}
												if ($("#" + id).find(".cubes_green").text() !== String(Number(robot.cubes.green))) {
													$("#" + id).find(".cubes_green").animate({},2000).animateText({text: (String(Number(robot.cubes.green)) || "?"), indicator: "_", color: "var(--white)"}, 1000);
												}
												if ($("#" + id).find(".cubes_blue").text() !== String(Number(robot.cubes.blue))) {
													$("#" + id).find(".cubes_blue").animate({},2000).animateText({text: (String(Number(robot.cubes.blue)) || "?"), indicator: "_", color: "var(--white)"}, 1000);
												}
												if ($("#" + id).find(".cubes_purple").text() !== String(Number(robot.cubes.purple))) {
													$("#" + id).find(".cubes_purple").animate({},2000).animateText({text: (String(Number(robot.cubes.purple)) || "?"), indicator: "_", color: "var(--white)"}, 1000);
												}

											}
										}

									//winner
										if ((typeof currentRound !== "undefined") && (currentRound !== null) && (currentRound.winner !== null)) {
											var winnerTop = $("#" + currentRound.winner).find("pre").position().top;
											var winnerLeft = $("#" + currentRound.winner).find("pre").position().left;
											var winnerBottom = winnerTop + Number($("#" + currentRound.winner).find("pre").css("height").replace("px",""));
											var winnerRight = winnerLeft + Number($("#" + currentRound.winner).find("pre").css("width").replace("px",""));

											var top = (((winnerTop + winnerBottom) / 2) - 40 + "px");
											var left = (((winnerLeft + winnerRight) / 2) - 40 + "px");

											var i = 0;
											$(".cube_outer").each(function(index) {
												var cube = $(this);
												setTimeout(function() {
													var currentTop = $(cube).position().top;
													var currentLeft = $(cube).position().left;
													$(cube).css("position","absolute").css("top",currentTop).css("left",currentLeft).animate({
														top: top,
														left: left,
														opacity: 0
													}, 2000);
												}, 250 * i);
												
												i++;
											});
										}

									//cubes
										if ((typeof currentRound !== "undefined") && (currentRound !== null)) {
											window.cubes = "";
											for (var i = 0; i < currentRound.cubes.length; i++) {
												window.cubes += "<div class='cube_outer " + currentRound.cubes[i] + "back'><div class='cube_inner whitetext'>" + currentRound.cubes[i] + "</div></div>";
											}

											setTimeout(function() {
												$("#cubes").animate({
													opacity: 0,
												}, 2000);
											}, 2000);

											setTimeout(function() {
												$("#cubes").css("opacity",0).empty().html('<div id="cube_spacer"></div>' + window.cubes).animate({
													opacity: 1,
												}, 2000);
											}, 4000);
										}
								}, 5000);
							}
							else {
								//
							}

						//concluded
							if ((window.arena.state.end !== null) && (window.arena.state.end < timeNow)) { //if the game is over AND displayedRound is up to date
								$("#message_top").animateText({text: "//arena concluded"}, 1000);
								clearInterval(gameLoop);

								//sections
									$("#pauseDetails").hide();
									$("#players_outer").hide();
									$("#cubes_outer").hide();
									$("#victors").show();
									$("#workshop_outer").hide();
									$("#postgame_outer").show();

									$("#leave_form").remove();
									$("#delete_form").remove();

									$("#round").text("null").closest(".section").hide();
									$("#round").attr("value", "concluded");

								//victors
									$(".self").addClass("loss");
									$(".opponent").addClass("loss");

									var victors = window.arena.state.victors;
									var string = "";

									for (var i = 0; i < victors.length; i++) {
										if (window.arena.entrants[victors[i]].human.name === "guest") {
											string += "{<span class='victor'><span class='victor_human bluetext'>" + window.arena.entrants[victors[i]].human.name + "</span>: <span class='victor_robot bluetext'>" + window.arena.entrants[victors[i]].name + "</span></span>}, ";
										}
										else {
											string += "{<span class='victor'><a class='victor_human bluetext' href='../../../../humans/" + window.arena.entrants[victors[i]].human.name + "'>" + window.arena.entrants[victors[i]].human.name + "</a>: <a class='victor_robot bluetext' href='../../../../robots/" + victors[i] + "'>" + window.arena.entrants[victors[i]].name + "</a></span>}, ";
										}

										$("#" + victors[i]).removeClass("loss").addClass("win");
									}

									$(".victorList").html(string.substring(0, string.length - 2));

									$(".loss").each(function(index) {
										window.animateRobot($(this).attr("id"), "loss");
									});

									$(".win").each(function(index) {
										window.animateRobot($(this).attr("id"), "win");
									});

								//message
									if (window.arena.state.victors.indexOf(String($("#workshop").attr("value"))) > -1) {
										var message = '<div class="indented">\
											<span class="graytext spectatorMessage">//your robot has achieved victory in this arena</span>\
										</div>';
									}
									else if (String($("#workshop").attr("value")).length > 0) {
										var message = '<div class="indented">\
											<span class="graytext spectatorMessage">//your robot has achieved defeat in this arena</span>\
										</div>';
									}
									else {
										var message = '<div class="indented">\
											<span class="graytext spectatorMessage">//this arena has concluded</span>\
										</div>';
									}

									$("#postgame").html(message || "//arena concluded");
									resizeTop();
							}
							
						//active
							else if (timeNow > window.arena.state.start) {
								if (window.arena.rounds.length > 0) {
									var lastTime = window.arena.rounds[window.arena.rounds.length - 1].start || 0;

									//paused
										if ((window.arena.state.pauseFrom !== null) && (window.arena.state.pauseTo !== null) && (timeNow > window.arena.state.pauseFrom) && (timeNow < window.arena.state.pauseTo)) {
											if ($("#pauseDetails").css("display") === "none") {
												$("#pauseDetails").show();
												$("#message_top").animateText({text: "//workshop activated"}, 1000);
												resizeTop();
												
												var id = String($("#workshop").attr("value")) || "";
												if ((id !== null) && (id.length > 0)) {
													$("#save_form").show();
													$("#output").closest(".section").hide();
													$("#workshop_select").val(id).prop("disabled",true);

													var entrant = window.arena.entrants[id];
													$("#inputs").animateText({text: entrant.inputs || ""},1000);
													$("#inputs").prop("contenteditable",true).closest(".field_frame").addClass("active");
													$("#code").animateText({text: entrant.code || ""},1000);
													$("#code").prop("contenteditable",true).closest(".field_frame").addClass("active");
												}
												else {
													$("#code_outer").hide();
													$("#spectator_workshop").show();
													$("#output").closest(".section").hide();
												}
											}

											lastTime = window.arena.state.pauseTo;
											$("#pause").text(Math.floor((lastTime - timeNow) / 1000));
										}

									//unpaused
										else if ($("#pauseDetails").css("display") !== "none") {
											$("#pauseDetails").hide();
											$("#pause").text("null");
											resizeTop();

											$("#save_form").hide();
											$("#output").closest(".section").show();
											$("#workshop_select").val(id).prop("disabled",false);
											
											$("#code_outer").show();
											$("#spectator_workshop").hide();
											$("#output").closest(".section").show();

											$("#code").prop("contenteditable",false);
											$("#code").closest(".field_frame").removeClass("active");
											$("#inputs").prop("contenteditable",false);
											$("#inputs").closest(".field_frame").removeClass("active");
										}

									//fetch more data if necessary										
										if (timeNow >= lastTime) {
											var arena_id = $(".container").attr("value");

											$.ajax({
												type: "POST",
												url: window.location.pathname,
												data: {
													action: "read_arena",
													data: JSON.stringify({arena_id: arena_id || null})
												},
												success: function(data) {
													if (data.success) {
														window.arena = data.arena;
													}
													else {
														$("#message_top").animateText({text: (data.messages.top || "//unable to read arena")}, 1000);
													}
												}
											});
										}
								}
								else { //for random arenas, read and refresh
									var arena_id = $(".container").attr("value");

									$.ajax({
										type: "POST",
										url: window.location.pathname,
										data: {
											action: "read_arena",
											data: JSON.stringify({arena_id: arena_id || null})
										},
										success: function(data) {
											window.location = window.location; //refresh to start gameLoop (for random arenas)
										}
									});
								}
							}
					}
				}, 1000);
			}

		/* state? */
			if ((typeof $(".container").attr("value") !== "undefined") && ($(".container").attr("value").length > 0)) { //if this is an individual game
				var state = $("#round").attr("value");
				
				if (state === "unstarted") { //unstarted game --> checkLoop
					window.startCheckLoop();
				}
				else if (state === "concluded") { //concluded game --> do nothing
					$("#code").html(window.colorText($("#code").text()));
					clearInterval(window.checkLoop);
					clearInterval(window.gameLoop);
					$("#message_top").animateText({text: "//arena concluded"}, 1000);
					resizeTop();

					$(".win").each(function(index) {
						window.animateRobot($(this).attr("id"), "win");
					});

					$(".loss").each(function(index) {
						window.animateRobot($(this).attr("id"), "loss");
					});
				}
				else { //active game --> gameLoop
					$("#code:not([contenteditable='true'])").html(window.colorText($("#code").text()));
					window.startGameLoop();
				}
			}
	});