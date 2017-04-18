/*** arenas ***/
	$(document).ready(function() {
		resizeTop();

		/* presets */
			$(document).on("change", "#presets", function() {
				var preset = $("#presets").val();

				switch (preset) {
					case "default":
						$("#players_minimum").val(2);
						$("#players_maximum").val(6);
						$("#players_pauseDuration").val("5:00");
						$("#players_pausePeriod").val(10);

						$("#cubes_colors_red").prop("checked",true);
						$("#cubes_colors_orange").prop("checked",true);
						$("#cubes_colors_yellow").prop("checked",true);
						$("#cubes_colors_green").prop("checked",true);
						$("#cubes_colors_blue").prop("checked",true);
						$("#cubes_colors_purple").prop("checked",true);

						$("#cubes_startCount").val(1);
						$("#cubes_maximum").val(255);
						$("#cubes_spawnRate").val(1);
						$("#cubes_spawnMemory").val(3);
						$("#cubes_dissolveRate").val(1);
						$("#cubes_dissolveIndex").val("oldest");

						$("#robots_startPower").val(1);
						$("#robots_maxPower").val(255);
						$("#robots_powerRate").val(1);
						$("#robots_tieBreaker").val("cascade");

						$("#robots_actions_power").prop("checked",true);
						$("#robots_actions_take").prop("checked",true);
						$("#robots_actions_sleep").prop("checked",true);
						$("#robots_actions_sap").prop("checked",false);
						$("#robots_actions_shock").prop("checked",false);
						$("#robots_actions_burn").prop("checked",false);
						$("#robots_actions_halftake").prop("checked",false);
						$("#robots_actions_swaptake").prop("checked",false);
						$("#robots_actions_fliptake").prop("checked",false);

						$("#victory_multiplier").val(1);
						$("#victory_tieBreaker").val("efficient");
						$("#victory_conditions_1of6").prop("checked",true);
						$("#victory_conditions_2of3").prop("checked",true);
						$("#victory_conditions_3of2").prop("checked",false);
						$("#victory_conditions_6of1").prop("checked",true);
					break;

					case "simple":
						$("#players_minimum").val(2);
						$("#players_maximum").val(4);
						$("#players_pauseDuration").val("5:00");
						$("#players_pausePeriod").val(10);

						$("#cubes_colors_red").prop("checked",true);
						$("#cubes_colors_orange").prop("checked",false);
						$("#cubes_colors_yellow").prop("checked",true);
						$("#cubes_colors_green").prop("checked",false);
						$("#cubes_colors_blue").prop("checked",true);
						$("#cubes_colors_purple").prop("checked",false);

						$("#cubes_startCount").val(0);
						$("#cubes_maximum").val(255);
						$("#cubes_spawnRate").val(1);
						$("#cubes_spawnMemory").val(0);
						$("#cubes_dissolveRate").val(1);
						$("#cubes_dissolveIndex").val("newest");

						$("#robots_startPower").val(1);
						$("#robots_maxPower").val(255);
						$("#robots_powerRate").val(1);
						$("#robots_tieBreaker").val("dissolve");

						$("#robots_actions_power").prop("checked",true);
						$("#robots_actions_take").prop("checked",true);
						$("#robots_actions_sleep").prop("checked",true);
						$("#robots_actions_sap").prop("checked",false);
						$("#robots_actions_shock").prop("checked",false);
						$("#robots_actions_burn").prop("checked",false);
						$("#robots_actions_halftake").prop("checked",false);
						$("#robots_actions_swaptake").prop("checked",false);
						$("#robots_actions_fliptake").prop("checked",false);

						$("#victory_multiplier").val(1);
						$("#victory_tieBreaker").val("tie");
						$("#victory_conditions_1of6").prop("checked",false);
						$("#victory_conditions_2of3").prop("checked",true);
						$("#victory_conditions_3of2").prop("checked",false);
						$("#victory_conditions_6of1").prop("checked",true);
					break;

					case "deathmatch":
						$("#players_minimum").val(2);
						$("#players_maximum").val(2);
						$("#players_pauseDuration").val("5:00");
						$("#players_pausePeriod").val(5);

						$("#cubes_colors_red").prop("checked",true);
						$("#cubes_colors_orange").prop("checked",true);
						$("#cubes_colors_yellow").prop("checked",true);
						$("#cubes_colors_green").prop("checked",true);
						$("#cubes_colors_blue").prop("checked",true);
						$("#cubes_colors_purple").prop("checked",true);

						$("#cubes_startCount").val(1);
						$("#cubes_maximum").val(24);
						$("#cubes_spawnRate").val(2);
						$("#cubes_spawnMemory").val(3);
						$("#cubes_dissolveRate").val(0);
						$("#cubes_dissolveIndex").val("none");

						$("#robots_startPower").val(10);
						$("#robots_maxPower").val(20);
						$("#robots_powerRate").val(2);
						$("#robots_tieBreaker").val("leave");

						$("#robots_actions_power").prop("checked",true);
						$("#robots_actions_take").prop("checked",true);
						$("#robots_actions_sleep").prop("checked",true);
						$("#robots_actions_sap").prop("checked",true);
						$("#robots_actions_shock").prop("checked",false);
						$("#robots_actions_burn").prop("checked",false);
						$("#robots_actions_halftake").prop("checked",true);
						$("#robots_actions_swaptake").prop("checked",false);
						$("#robots_actions_fliptake").prop("checked",false);

						$("#victory_multiplier").val(1);
						$("#victory_tieBreaker").val("efficient");
						$("#victory_conditions_1of6").prop("checked",true);
						$("#victory_conditions_2of3").prop("checked",true);
						$("#victory_conditions_3of2").prop("checked",false);
						$("#victory_conditions_6of1").prop("checked",true);
					break;

					case "advanced":
						$("#players_minimum").val(2);
						$("#players_maximum").val(6);
						$("#players_pauseDuration").val("5:00");
						$("#players_pausePeriod").val(10);

						$("#cubes_colors_red").prop("checked",true);
						$("#cubes_colors_orange").prop("checked",true);
						$("#cubes_colors_yellow").prop("checked",true);
						$("#cubes_colors_green").prop("checked",true);
						$("#cubes_colors_blue").prop("checked",true);
						$("#cubes_colors_purple").prop("checked",true);

						$("#cubes_startCount").val(2);
						$("#cubes_maximum").val(48);
						$("#cubes_spawnRate").val(2);
						$("#cubes_spawnMemory").val(4);
						$("#cubes_dissolveRate").val(1);
						$("#cubes_dissolveIndex").val("oldest");

						$("#robots_startPower").val(3);
						$("#robots_maxPower").val(20);
						$("#robots_powerRate").val(3);
						$("#robots_tieBreaker").val("leave");

						$("#robots_actions_power").prop("checked",true);
						$("#robots_actions_take").prop("checked",true);
						$("#robots_actions_sleep").prop("checked",true);
						$("#robots_actions_sap").prop("checked",true);
						$("#robots_actions_shock").prop("checked",false);
						$("#robots_actions_burn").prop("checked",false);
						$("#robots_actions_halftake").prop("checked",true);
						$("#robots_actions_swaptake").prop("checked",false);
						$("#robots_actions_fliptake").prop("checked",true);

						$("#victory_multiplier").val(2);
						$("#victory_tieBreaker").val("greedy");
						$("#victory_conditions_1of6").prop("checked",true);
						$("#victory_conditions_2of3").prop("checked",true);
						$("#victory_conditions_3of2").prop("checked",true);
						$("#victory_conditions_6of1").prop("checked",true);
					break;

					case "intense":
						$("#players_minimum").val(6);
						$("#players_maximum").val(6);
						$("#players_pauseDuration").val("2:00");
						$("#players_pausePeriod").val(20);

						$("#cubes_colors_red").prop("checked",true);
						$("#cubes_colors_orange").prop("checked",true);
						$("#cubes_colors_yellow").prop("checked",true);
						$("#cubes_colors_green").prop("checked",true);
						$("#cubes_colors_blue").prop("checked",true);
						$("#cubes_colors_purple").prop("checked",true);

						$("#cubes_startCount").val(0);
						$("#cubes_maximum").val(48);
						$("#cubes_spawnRate").val(4);
						$("#cubes_spawnMemory").val(2);
						$("#cubes_dissolveRate").val(2);
						$("#cubes_dissolveIndex").val("newest");

						$("#robots_startPower").val(10);
						$("#robots_maxPower").val(255);
						$("#robots_powerRate").val(10);
						$("#robots_tieBreaker").val("catchup");

						$("#robots_actions_power").prop("checked",true);
						$("#robots_actions_take").prop("checked",true);
						$("#robots_actions_sleep").prop("checked",true);
						$("#robots_actions_sap").prop("checked",true);
						$("#robots_actions_shock").prop("checked",true);
						$("#robots_actions_burn").prop("checked",true);
						$("#robots_actions_halftake").prop("checked",true);
						$("#robots_actions_swaptake").prop("checked",true);
						$("#robots_actions_fliptake").prop("checked",true);

						$("#victory_multiplier").val(4);
						$("#victory_tieBreaker").val("efficient");
						$("#victory_conditions_1of6").prop("checked",true);
						$("#victory_conditions_2of3").prop("checked",true);
						$("#victory_conditions_3of2").prop("checked",true);
						$("#victory_conditions_6of1").prop("checked",true);
					break;

					case "scarcity":
						$("#players_minimum").val(4);
						$("#players_maximum").val(6);
						$("#players_pauseDuration").val("2:00");
						$("#players_pausePeriod").val(10);

						$("#cubes_colors_red").prop("checked",true);
						$("#cubes_colors_orange").prop("checked",true);
						$("#cubes_colors_yellow").prop("checked",true);
						$("#cubes_colors_green").prop("checked",true);
						$("#cubes_colors_blue").prop("checked",true);
						$("#cubes_colors_purple").prop("checked",true);

						$("#cubes_startCount").val(2);
						$("#cubes_maximum").val(255);
						$("#cubes_spawnRate").val(1);
						$("#cubes_spawnMemory").val(4);
						$("#cubes_dissolveRate").val(0);
						$("#cubes_dissolveIndex").val("none");

						$("#robots_startPower").val(255);
						$("#robots_maxPower").val(255);
						$("#robots_powerRate").val(10);
						$("#robots_tieBreaker").val("leave");

						$("#robots_actions_power").prop("checked",false);
						$("#robots_actions_take").prop("checked",false);
						$("#robots_actions_sleep").prop("checked",true);
						$("#robots_actions_sap").prop("checked",true);
						$("#robots_actions_shock").prop("checked",true);
						$("#robots_actions_burn").prop("checked",true);
						$("#robots_actions_halftake").prop("checked",true);
						$("#robots_actions_swaptake").prop("checked",true);
						$("#robots_actions_fliptake").prop("checked",true);

						$("#victory_multiplier").val(1);
						$("#victory_tieBreaker").val("greedy");
						$("#victory_conditions_1of6").prop("checked",true);
						$("#victory_conditions_2of3").prop("checked",false);
						$("#victory_conditions_3of2").prop("checked",false);
						$("#victory_conditions_6of1").prop("checked",true);
					break;

					case "random":
						$("#players_minimum").val(3);
						$("#players_maximum").val(6);
						$("#players_pauseDuration").val("1:00");
						$("#players_pausePeriod").val(255);

						$("#cubes_colors_red").prop("checked",true);
						$("#cubes_colors_orange").prop("checked",true);
						$("#cubes_colors_yellow").prop("checked",true);
						$("#cubes_colors_green").prop("checked",true);
						$("#cubes_colors_blue").prop("checked",true);
						$("#cubes_colors_purple").prop("checked",true);

						$("#cubes_startCount").val(1);
						$("#cubes_maximum").val(255);
						$("#cubes_spawnRate").val(2);
						$("#cubes_spawnMemory").val(0);
						$("#cubes_dissolveRate").val(1);
						$("#cubes_dissolveIndex").val("random");

						$("#robots_startPower").val(2);
						$("#robots_maxPower").val(255);
						$("#robots_powerRate").val(2);
						$("#robots_tieBreaker").val("random");

						$("#robots_actions_power").prop("checked",true);
						$("#robots_actions_take").prop("checked",true);
						$("#robots_actions_sleep").prop("checked",true);
						$("#robots_actions_sap").prop("checked",true);
						$("#robots_actions_shock").prop("checked",true);
						$("#robots_actions_burn").prop("checked",false);
						$("#robots_actions_halftake").prop("checked",false);
						$("#robots_actions_swaptake").prop("checked",false);
						$("#robots_actions_fliptake").prop("checked",true);

						$("#victory_multiplier").val(3);
						$("#victory_tieBreaker").val("random");
						$("#victory_conditions_1of6").prop("checked",true);
						$("#victory_conditions_2of3").prop("checked",false);
						$("#victory_conditions_3of2").prop("checked",true);
						$("#victory_conditions_6of1").prop("checked",true);
					break;

					case "custom":
					default:
						//do nothing
					break;
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
							$("#message_top").animateText({text: (data.messages.top || "//unable to join arena")}, 1000);
						}
					}
				});
			}

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
						var value = $(this).html().replace(/<\\? ?br ?\\?>/g,"\n").replace(/(<([^>]+)>)/ig,"").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
						data[field] = value;
					});

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
	
		/* gameLoop */
			if ((typeof $(".container").attr("value") !== "undefined") && ($(".container").attr("value").length > 0)) { //if this is an individual game
				var state = $("#round").attr("value");
				
				if (state === "unstarted") { //unstarted game --> checkLoop
					window.checkLoop = setInterval(function() {
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
									if (data.arena.state.start !== null) { //game has started
										clearInterval(window.checkLoop);
										window.location = window.location; //refresh to start gameLoop
									}
									else {
										$("#message_top").animateText({text: "//not started..."}, 1000);
										
										//update player list								
											if ($("#players").attr("value") !== data.arena.humans.join()) {
												var string = "";
												for (var i = 0; i < data.arena.humans.length; i++) {
													var entrant = data.arena.entrants[Object.keys(data.arena.entrants).find(function(j) { return (data.arena.entrants[j].human.id === data.arena.humans[i])})];
													if ((typeof entrant !== "undefined") && (entrant !== "undefined") && (entrant !== null)) {
														string += "<a class='bluetext' target='_blank' href='../../../../humans/" + entrant.human.name + "'>" + entrant.human.name + "</a>, ";
													}
													else {
														string += "<span class='yellowtext'>???</span>, ";
													}
												}

												$("#players").attr("value", data.arena.humans);
												$("#players").html(string.substring(0, string.length - 2));
											}

										//update robot list
											if ($("#robots").attr("value") !== Object.keys(data.arena.entrants).join()) {
												if ((data.arena.entrants !== null) && (Object.keys(data.arena.entrants).length > 0)) {
													var string = "";
													var entrants = Object.keys(data.arena.entrants);

													for (var i = 0; i < entrants.length; i++) {
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

														string += ('<div class="section opponent" id="' + entrant.id + '">\
															<div class="stats">\
																<span class="whitetext">power: </span><span class="purpletext power">' + (robot.power || "0") + '</span><span class="whitetext">,</span><br>\
																<span class="whitetext">cubes: {\
																	<div class="indented">\
																		<span class="redtext">r: <span class="cubes_red">' + (robot.cubes.red || "0") + '</span></span>,<br>\
																		<span class="orangetext">o: <span class="cubes_orange">' + (robot.cubes.orange || "0") + '</span></span>,<br>\
																		<span class="yellowtext">y: <span class="cubes_yellow">' + (robot.cubes.yellow || "0") + '</span></span>,<br>\
																		<span class="greentext">g: <span class="cubes_green">' + (robot.cubes.green || "0") + '</span></span>,<br>\
																		<span class="bluetext">b: <span class="cubes_blue">' + (robot.cubes.blue || "0") + '</span></span>,<br>\
																		<span class="purpletext">p: <span class="cubes_purple">' + (robot.cubes.purple || "0") + '</span></span>\
																	</div>\
																},</span><br>\
																<span class="whitetext">action: </span><span class="greentext action">' + (robot.action || "???") + '</span>\
															</div>\
															<pre class="avatar_pre" monospace style="color: ' + (entrant.avatar.color || "var(--white)") + '">\
<span class="transparenttext leftDot">•</span><span class="transparenttext">•••••</span><span class="avatar avatar_antennae" value="' + (entrant.avatar.antennae.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.antennae || "•••••") + '</span><span class="transparenttext">•••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand" value="' + (entrant.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_eyes" value="' + (entrant.avatar.eyes.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.eyes || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand transparenttext" value="' + (entrant.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist" value="' + (entrant.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_mouth" value="' + (entrant.avatar.mouth.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.mouth || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist transparenttext" value="' + (entrant.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (entrant.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••</span><span class="avatar avatar_left_shoulder_up">\\</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_left_arm" value="' + (entrant.avatar.left_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (entrant.avatar.left_arm || "••") + '</span><span class="avatar avatar_torso_1" value="' + (entrant.avatar.torso_1.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.torso_1 || "•••••") + '</span><span class="avatar avatar_right_arm" value="' + (entrant.avatar.right_arm.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (entrant.avatar.right_arm || "••") + '</span><span class="avatar avatar_right_shoulder_up" style="display: none">/</span><span class="avatar avatar_right_shoulder_down">\\</span><span class="transparenttext">••</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_wrist transparenttext" value="' + (entrant.avatar.left_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.left_wrist || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_2" value="' + (entrant.avatar.torso_2.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.torso_2 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_wrist" value="' + (entrant.avatar.right_wrist.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••') + '">' + (entrant.avatar.right_wrist || "••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="avatar avatar_left_hand transparenttext" value="' + (entrant.avatar.left_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.left_hand || "••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_torso_3" value="' + (entrant.avatar.torso_3.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••') + '">' + (entrant.avatar.torso_3 || "•••••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_hand" value="' + (entrant.avatar.right_hand.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '••••') + '">' + (entrant.avatar.right_hand || "••••") + '</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_legs" value="' + (entrant.avatar.legs.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••••••') + '">' + (entrant.avatar.legs || "•••••••") + '</span><span class="transparenttext">••••</span>\n\
<span class="transparenttext leftDot">•</span><span class="transparenttext">••••</span><span class="avatar avatar_left_foot" value="' + (entrant.avatar.left_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (entrant.avatar.left_foot || "•••") + '</span><span class="transparenttext">•</span><span class="avatar avatar_right_foot" value="' + (entrant.avatar.right_foot.replace(/\"/g, "&#34;").replace(/\'/g, "&#39;") || '•••') + '">' + (entrant.avatar.right_foot || "•••") + '</span><span class="transparenttext">••••</span>\n\
 <a class="bluetext" href="../../../../robots/' + entrant.id + '" target="_blank">' + entrant.name + '</a></pre>\
														</div>');
													}

													$("#robots").attr("value", Object.keys(data.arena.entrants));
													$("#robots").find("div.indented").html(string);
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
				else if (state === "concluded") { //concluded game --> do nothing
					clearInterval(window.checkLoop);
					clearInterval(window.gameLoop);
					$("#message_top").animateText({text: "//arena concluded"}, 1000);
					resizeTop();
				}
				else { //active game --> gameLoop
					resizeTop();
					window.gameLoop = setInterval(function() {
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

							console.log(timeNow + ": round " + (pastRounds.length - 1));
							
							//starting soon
								if (timeNow < window.arena.state.start) {
									$("#message_top").animateText({text: "//starting arena"}, 500);
								}

							//display up-to-date info
								else if (($("#round").text() === "null") || (Number($("#round").text()) < (pastRounds.length - 1))) { //displayedRound is out of date
									$("#message_top").animateText({text: "//displaying round " + (pastRounds.length - 1)}, 1000);

									//state
										if (pastRounds.length - 1 >= 0) {
											$("#round").text(pastRounds.length - 1);
											var currentRound = pastRounds[pastRounds.length - 1] || {};
											console.log("data: " + JSON.stringify(currentRound));
										}
										else {
											$("#round").text("null");
										}

									//robots
										if ((typeof currentRound !== "undefined") && (currentRound !== null)) {
											for (var i = 0; i < currentRound.robots.length; i++) {
												var robot = currentRound.robots[i];
												var id = robot.name;
												
												$("#" + id).find(".action").animateText({text: (String(robot.action) || "?"), indicator: "|", color: "var(--white)"}, 1000);
												window.animateAction(id, robot.action);
												
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
											console.log("winner: " + currentRound.winner);
											var winnerTop = $("#" + currentRound.winner).find("pre").position().top;
											var winnerLeft = $("#" + currentRound.winner).find("pre").position().left;
											var winnerBottom = winnerTop + Number($("#" + currentRound.winner).find("pre").css("height").replace("px",""));
											var winnerRight = winnerLeft + Number($("#" + currentRound.winner).find("pre").css("width").replace("px",""));

											var i = 0;
											$(".cube_outer").each(function(index) {
												var cube = $(this);
												setTimeout(function() {
													$(cube).css("position","absolute").animate({
														top: (((winnerTop + winnerBottom) / 2) - 40 + "px"),
														left: (((winnerLeft + winnerRight) / 2) - 40 + "px"),
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
												console.log(i + " :: "  + currentRound.cubes[i]);
												window.cubes += "<div class='cube_outer " + currentRound.cubes[i] + "back'><div class='cube_inner whitetext'>" + currentRound.cubes[i] + "</div></div>";
											}

											setTimeout(function() {
												$("#cubes").animate({
													opacity: 0,
												}, 2000);
											}, 2000);

											setTimeout(function() {
												$("#cubes").css("opacity",0).empty().html(window.cubes).animate({
													opacity: 1,
												}, 2000);
											}, 4000);
										}
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
										$("#postgame").show();

										$("#round").text("null").hide();
										$("#round").attr("value", "concluded");

									//victors
										var victors = window.arena.state.victors;
										var string = "";

										for (var i = 0; i < victors.length; i++) {
											string += "{<span class='victor'><a class='victor_robot bluetext' href='../../../../robots/" + victors[i] + "'>" + window.arena.entrants[victors[i]].name + "</a> : <a class='victor_human bluetext' href='../../../../humans/" + window.arena.entrants[victors[i]].human.name + "'>" + window.arena.entrants[victors[i]].human.name + "</a></span>}, ";
										}

										$(".victorList").html(string.substring(0, string.length - 2));

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
									var lastTime = window.arena.rounds[window.arena.rounds.length - 1].start;

									//paused
										if ((window.arena.state.pauseFrom !== null) && (window.arena.state.pauseTo !== null) && (timeNow > window.arena.state.pauseFrom) && (timeNow < window.arena.state.pauseTo)) {
											console.log("HERE");
											if ($("#pauseDetails").css("display") === "none") {
												$("#pauseDetails").show();
												$("#players_outer").hide();
												$("#cubes_outer").show();
												$("#victors").hide();
												$("#workshop_outer").show();

												resizeTop();
												$("#message_top").animateText({text: "//arena paused"}, 1000);
											}

											lastTime = window.arena.state.pauseTo;
											$("#pause").text(Math.floor((lastTime - timeNow) / 1000));
										}

									//unpaused
										else if ($("#pauseDetails").css("display") !== "none") {
											$("#pauseDetails").hide();
											$("#players_outer").hide();
											$("#cubes_outer").show();
											$("#victors").hide();
											$("#workshop_outer").hide();

											$("#pause").text("null");

											resizeTop();
										}

									//fetch more data if necessary										
										if (timeNow >= lastTime) {
											console.log("getting more data");
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
						}
					}, 1000);
				}
			}

		/* robot animations */
			window.animateRobot = function(robot, action) {
				if ((robot !== null) && (robot.length > 0)) {
					switch(action) {
						case "power":
							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
							},0);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_legs").css("font-weight","bold");
							},100);

							setTimeout(function() {
								$("#" + robot).find(".avatar_legs").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
							},200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
							},300);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");
							},400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
							},500);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
							},600);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_eyes").css("font-weight","normal");
								$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
							},700);

							setTimeout(function() {
								$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
							},800);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
							},900);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_legs").css("font-weight","bold");
							},1000);

							setTimeout(function() {
								$("#" + robot).find(".avatar_legs").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
							},1100);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
							},1200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");
							},1300);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
							},1400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
							},1500);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_eyes").css("font-weight","normal");
								$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
							},1600);

							setTimeout(function() {
								$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
							},1700);
						break;

						case "sap":
							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").show();
								$("#" + robot).find(".avatar_left_shoulder_up").hide();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
							},0);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_legs").css("font-weight","bold");
							},200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_legs").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
							},400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
							},600);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");


								$("#" + robot).find(".avatar_left_shoulder_down").hide();
								$("#" + robot).find(".avatar_left_shoulder_up").show();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_right_shoulder_down").hide();
								$("#" + robot).find(".avatar_right_shoulder_up").show();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
							},800);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
							},1000);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
							},1200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_eyes").css("font-weight","normal");
								$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
							},1400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_antennae").css("font-weight","normal");

								$("#" + robot).find(".avatar_right_shoulder_down").show();
								$("#" + robot).find(".avatar_right_shoulder_up").hide();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
							},1600);
						break;

						case "burn":
							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").hide();
								$("#" + robot).find(".avatar_right_shoulder_up").show();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
							},0);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_legs").css("font-weight","bold");
							},200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_legs").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
							},400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
							},600);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");


								$("#" + robot).find(".avatar_left_shoulder_up").hide();
								$("#" + robot).find(".avatar_left_shoulder_down").show();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_right_shoulder_up").hide();
								$("#" + robot).find(".avatar_right_shoulder_down").show();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
							},800);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
							},1000);

							setTimeout(function() {
								$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
								$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
							},1200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_eyes").css("font-weight","normal");
								$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
							},1400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_antennae").css("font-weight","normal");

								$("#" + robot).find(".avatar_left_shoulder_down").hide();
								$("#" + robot).find(".avatar_left_shoulder_up").show();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");
							},1600);
						break;

						case "shock":
							setTimeout(function() {
								$("#" + robot).find(".avatar_antennae").css("font-weight","bold");
							},0);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
								$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
							},100);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_eyes").css("font-weight","normal");

								$("#" + robot).find(".leftDot").hide();
							},200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
							},300);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");

								$("#" + robot).find(".leftDot").show();
							},400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
							},500);

							setTimeout(function() {
								$("#" + robot).find(".avatar_legs").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");

								$("#" + robot).find(".leftDot").hide();
							},600);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
								$("#" + robot).find(".avatar_legs").css("font-weight","normal");
							},700);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_antennae").css("font-weight","bold");

								$("#" + robot).find(".leftDot").show();
							},800);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_eyes").css("font-weight","bold");
								$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
							},900);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_mouth").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_hand").css("font-weight","normal");
								$("#" + robot).find(".avatar_eyes").css("font-weight","normal");

								$("#" + robot).find(".leftDot").hide();
							},1000);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_wrist").css("font-weight","normal");
								$("#" + robot).find(".avatar_mouth").css("font-weight","normal");
							},1100);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_2").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","bold");
								$("#" + robot).find(".avatar_left_shoulder_down").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_left_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_torso_1").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_arm").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_up").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_shoulder_down").css("font-weight","normal");

								$("#" + robot).find(".leftDot").show();
							},1200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_torso_3").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_2").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_wrist").css("font-weight","normal");
							},1300);

							setTimeout(function() {
								$("#" + robot).find(".avatar_legs").css("font-weight","bold");
								$("#" + robot).find(".avatar_torso_3").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_hand").css("font-weight","normal");

								$("#" + robot).find(".leftDot").hide();
							},1400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","bold");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","bold");
								$("#" + robot).find(".avatar_legs").css("font-weight","normal");
							},1500);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_foot").css("font-weight","normal");
								$("#" + robot).find(".avatar_right_foot").css("font-weight","normal");

								$("#" + robot).find(".leftDot").show();
							},1600);

							setTimeout(function() {
								$("#" + robot).find(".avatar_antennae").css("font-weight","normal");
							},1700);
						break;

						case "take":
							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").hide();
								$("#" + robot).find(".avatar_right_shoulder_up").show();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
							},0);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").hide();
							},200);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},400);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").hide();
							},600);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},800);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").hide();
							},1000);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},1200);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").hide();
							},1400);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
								$("#" + robot).find(".avatar_right_shoulder_down").show();
								$("#" + robot).find(".avatar_right_shoulder_up").hide();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");
							},1600);
						break;

						case "halftake":
							setTimeout(function() {
								$("#" + robot).find(".leftDot").hide();
							},200);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},400);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").hide();
							},600);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},800);
						break;

						case "swaptake":
							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").hide();
								$("#" + robot).find(".avatar_right_shoulder_up").show();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".leftDot").hide();
							},200);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").show();
								$("#" + robot).find(".avatar_right_shoulder_up").hide();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_left_shoulder_up").hide();
								$("#" + robot).find(".avatar_left_shoulder_down").show();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".leftDot").hide();
							},600);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},800);

							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").hide();
								$("#" + robot).find(".avatar_right_shoulder_up").show();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_left_shoulder_up").show();
								$("#" + robot).find(".avatar_left_shoulder_down").hide();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".leftDot").hide();
							},1000);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},1200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").show();
								$("#" + robot).find(".avatar_right_shoulder_up").hide();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_left_shoulder_up").hide();
								$("#" + robot).find(".avatar_left_shoulder_down").show();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".leftDot").hide();
							},1400);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},1600);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_up").show();
								$("#" + robot).find(".avatar_left_shoulder_down").hide();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");
							},1800);
						break;

						case "fliptake":
							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").hide();
								$("#" + robot).find(".avatar_right_shoulder_up").show();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_left_shoulder_up").hide();
								$("#" + robot).find(".avatar_left_shoulder_down").show();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".leftDot").hide();
							},200);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},400);

							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").show();
								$("#" + robot).find(".avatar_right_shoulder_up").hide();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_left_shoulder_up").show();
								$("#" + robot).find(".avatar_left_shoulder_down").hide();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".leftDot").hide();
							},600);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},800);

							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").hide();
								$("#" + robot).find(".avatar_right_shoulder_up").show();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_left_shoulder_up").hide();
								$("#" + robot).find(".avatar_left_shoulder_down").show();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".leftDot").hide();
							},1000);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},1200);

							setTimeout(function() {
								$("#" + robot).find(".avatar_right_shoulder_down").show();
								$("#" + robot).find(".avatar_right_shoulder_up").hide();
								$("#" + robot).find(".avatar_right_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_right_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar_left_shoulder_up").show();
								$("#" + robot).find(".avatar_left_shoulder_down").hide();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".leftDot").hide();
							},1400);

							setTimeout(function() {
								$("#" + robot).find(".leftDot").show();
							},1600);
						break;

						case "sleep":
						default:
							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").show();
								$("#" + robot).find(".avatar_left_shoulder_up").hide();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");

								$("#" + robot).find(".avatar").animate({
									opacity: 0.1
								},2000);
							},0);
							
							setTimeout(function() {
								$("#" + robot).find(".avatar").animate({
									opacity: 1
								},2000);
							},2000);

							setTimeout(function() {
								$("#" + robot).find(".avatar_left_shoulder_down").hide();
								$("#" + robot).find(".avatar_left_shoulder_up").show();
								$("#" + robot).find(".avatar_left_hand").toggleClass("transparenttext");
								$("#" + robot).find(".avatar_left_wrist").toggleClass("transparenttext");
							},3000)
						break;
					}
				}
			}
	});