$(document).ready(function() {
	$("#mhsSignin").click(function() {
		window.open(MyHomeworkSpace.getAuthURL());
		$("#mhs-connect").hide();
		$("#mhs-connect-sh").hide();
		$("#main-setup").text("Welcome to DaltonTab!");
		$("#sh-setup").text("Open a new tab to get started...");
		$("#main-setup").show();
		$("#sh-setup").show();
	});
    $( "#getName" ).click(function() {
        var newName = $("#name").val();
        chrome.storage.sync.set({ name: newName }, function() {
			$("#main-setup").fadeOut(400, function(){
				$("#main-setup").text("Awesome, " + newName + "!");
				$("#main-setup").fadeIn(400, function(){});
				setTimeout(function(){
					$("#main-setup").fadeOut(400, function(){
						$("#main-setup").text("It's a pleasure to meet you.");
						$("#main-setup").fadeIn(400, function(){});
						setTimeout(function(){
							$("#main-setup").fadeOut(400, function(){
								$("#main-setup").text("Let's get you connected to MyHomeworkSpace!");
								$("#main-setup").fadeIn(400, function(){});
								setTimeout(function(){
									$("#main-setup").fadeOut(400, function(){
										$("#mhs-connect").fadeIn(400, function(){});
										$("#mhs-connect-sh").fadeIn(400, function(){});
									});
								}, 3000)
							});
						}, 3000);
					});
				}, 3000);
			});
			$("#sh-setup").fadeOut(400);
			$("#sh-setup").fadeOut(400);
			$( "#skipMHSSignIn" ).click(function() {
				$("#mhs-connect").fadeOut(400);
				$("#mhs-connect-sh").fadeOut(400, function(){
					$("#main-setup").text("Welcome to DaltonTab!");
					$("#sh-setup").text("Open a new tab to get started...");
					$("#main-setup").fadeIn(400);
					$("#sh-setup").fadeIn(400);
				});
			});
        });;
    });
});