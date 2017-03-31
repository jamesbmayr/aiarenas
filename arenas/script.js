/*** arenas ***/
	$(document).ready(function() {
		/* inactive arena */
			window.join_arena = function() {
				var arena_id = $("#join_key").val();

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

		/* active arena */

		/* paused arena */

	});