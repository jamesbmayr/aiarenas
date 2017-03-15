$(document).ready(function() {

	/* navbar */
		$("#navbar_open").click(function() {
			$("#navbar_open").animate({left: "+=200px"}, 500);
			$("#navbar_open").find(".glyphicon").animate({opacity: 0},500);
			setTimeout(function() {
				$("#navbar_open").hide();
			}, 500);
			
			$("#navbar_close").show().animate({left: "+=200px"}, 500);
			$("#navbar_close").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "+=200px"}, 500);
		});

		$("#navbar_close").click(function() {
			$("#navbar_close").animate({left: "-=200px"}, 500);
			$("#navbar_close").find(".glyphicon").animate({opacity: 0},500);;
			setTimeout(function() {
				$("#navbar_close").hide();
			}, 500);

			$("#navbar_open").show().animate({left: "-=200px"}, 500);
			$("#navbar_open").find(".glyphicon").css("opacity",0).animate({opacity: 1},500);
			
			$("#navbar").animate({left: "-=200px"}, 500);
		});

	/* signinup */
		$("#actions").change(function() {
			console.log('test');
			var action = $(this).val();

			if (action === "signin") {
				$("#signin_form").show();
				$("#signup_form").hide();
				$("#signin").prop("disabled",false);
				$("#signup").prop("disabled",true);
			}
			else if (action === "signup") {
				$("#signup_form").show();
				$("#signin_form").hide();
				$("#signup").prop("disabled",false);
				$("#signin").prop("disabled",true);
			}
		});
});