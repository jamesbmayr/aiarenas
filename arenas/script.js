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
						$("#players_pauseDuration").val("05:00");
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
						$("#cubes_dissolveRate").val(0);
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
						$("#players_pauseDuration").val("05:00");
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

					case "advanced":
						$("#players_minimum").val(2);
						$("#players_maximum").val(6);
						$("#players_pauseDuration").val("05:00");
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
						$("#players_pauseDuration").val("02:00");
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

					case "random":
						$("#players_minimum").val(2);
						$("#players_maximum").val(6);
						$("#players_pauseDuration").val("00:00");
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
						$("#victory_conditions_3of2").prop("checked",false);
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
							updateFields(data.arena);
						}
						else {
							$("#message_top").animateText({text: (data.messages.top || "//unable to launch arena")}, 1000);
						}
					}
				});
			}

			$(document).on("click", "#robot_save", function() {
				if ((data.state.pauseFrom !== null) && (data.state.pauseTo !== null)) {
					var arena_id = $(".container").attr("value");
					
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
							data: JSON.stringify({arena_id: arena_id, inputs: inputs, code: code})
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

							$(".field#code").html(colorText(String($(".field#code").html())));
						}
					});
				}
			});
	
		/* gameLoop */
			window.read_arena = function() {
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

			window.updateFields = function() {
				if (window.round >= window.arena.rounds.length) {
					window.read_arena();
				}
				else {
					var timeNow = new Date().getTime();

					//state
						if (window.arena.state.start === null) {
							$("#state").text("false");
						}
						else if ((window.round >= window.arena.rounds.length) && (window.arena.state.end !== null)) {
							$("#state").text("false");
						}
						else if ((window.arena.state.pauseFrom !== null) && (window.arena.state.pauseTo !== null) && (timeNow >= window.arena.state.pauseFrom) && (timeNow < window.arena.state.pauseTo)) {
							$("#state").text("true");
						}
						else {
							$("#state").text("true");
						}

					//pause
						if ((window.arena.state.pauseFrom !== null) && (window.arena.state.pauseTo !== null) && (timeNow >= window.arena.state.pauseFrom) && (timeNow < window.arena.state.pauseTo)) {
							$("#pauseDetails").show();
							$("#players").hide();
							$("#cubes").hide();
							$("#victors").hide();
							$("#workshop").show();

							window.pause = true;
						}
						else {
							$("#pauseDetails").hide();
							$("#players").hide();
							$("#cubes").show();
							$("#victors").hide();
							$("#workshop").hide();

							window.pause = false;
						}

					//cubes
						var currentRound = window.arena.rounds[window.round] || {};
						var cubes = "";
						for (var i = 0; i < currentRound.cubes.length; i++) {
							cubes += "<span class='bigCube_outer " + currentRound.cubes[i] + "text'>[<span class='bigCube_inner'>" + currentRound.cubes[i] + "</span>]</span>";
						}
						$(".currentCubes").html(cubes);

					//robots
						var lastRound = window.arena.rounds[window.round - 1] || {};

						for (var i = 0; i < currentRound.robots.length; i++) {
							var id = currentRound.robots[i].id;
							$("#" + id).find(".action").animateText({text: lastRound.robots[i].action, indicator: "[]", "color: var(--white)"}, 2000);
							setTimeout(function() {	
								$("#" + id).find(".power").text(currentRound.robots[i].action);
								$("#" + id).find(".cubes_red").text(currentRound.robots[i].cubes.red);
								$("#" + id).find(".cubes_orange").text(currentRound.robots[i].cubes.orange);
								$("#" + id).find(".cubes_yellow").text(currentRound.robots[i].cubes.yellow);
								$("#" + id).find(".cubes_green").text(currentRound.robots[i].cubes.green);
								$("#" + id).find(".cubes_blue").text(currentRound.robots[i].cubes.blue);
								$("#" + id).find(".cubes_purple").text(currentRound.robots[i].cubes.purple);
							}, 3000);
						}

					//victors
						if ((window.round >= window.arena.rounds.length) && (window.arena.state.end !== null)) {
							clearInterval(pauseTimeout);
							clearInterval(gameLoop);

							$("#pauseDetails").hide();
							$("#players").hide();
							$("#cubes").hide();
							$("#victors").show();
							$("#workshop").hide();

							var victors = "";
							for (var i = 0; i < window.arena.state.victors.length; i++); {
								victors += "<span class='victor'>\
									<a class='victor_robot bluetext' href='../../../../robots/" + window.arena.state.victors[i] + "'>" + window.arena.entrants[window.arena.state.victors[i]].name + "</a>\
									<a class='victor_user bluetext' href='../../../../users/" + window.arena.entrants[window.arena.state.victors[i]].user.name + "'>" + window.arena.entrants[window.arena.state.victors[i]].user.name + "</a>\
								</span>";
							}
							$(".victorList").html(victors);
						}
						else {
							window.round++;
						}
				}
			}

		//start???
			window.round = 0; //how do we accurately determine the round???
			window.pause = true; //how do we determine this???

			window.gameLoop = setInterval(function() {
				if (window.pause) {
					var timeRemaining = Math.floor((data.state.pauseTo - (new Date().getTime())) / 1000);
					if (timeRemaining >= 0) {
						$("#pause").text(timeRemaining);
					}
					else {
						window.pause = false;
						read_arena();
					}
				}
				else {
					updateFields();
				}
			}, 10000);

	});