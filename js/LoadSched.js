$(document).ready(function() {
	var schedulesUrl = "https://schedules.dalton.org/roux/index.php";
	//$("#scheduleSignIn").click(function() {

		var daltonid = "c20et";
		var password = "---";

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
			dd='0'+dd
		} 

		if(mm<10) {
			mm='0'+mm
		} 

		var today = yyyy+mm+dd;
		
		$.ajax({
			url: schedulesUrl,
			type: "POST",
			data: {
				rouxRequest: "<request><key></key><action>authenticate</action><credentials><username>" + daltonid + "</username><password type=\"plaintext\">" + password + "</password></credentials></request>"
			},
			success: function(data) {
				console.log(data);
				var $data = $(data);
				var statusCode = $data.find("result").attr("status");
				if (statusCode == 200) {
					var key = $data.find("result").children("key").text();
					var owner = $data.find("result").children("key").attr("owner");
					//alert("Success! You've been signed in to Schedules.");
					var id = key.split(":")[3]
					var year = yyyy;
					$.post(schedulesUrl, {rouxRequest: "<request><key>"+key+"</key><action>selectStudentCalendar</action><ID>" + id +"</ID><academicyear>" + year + "</academicyear><start>" + today + "</start><end>" + today + "</end></request>"}, function(response) {
						console.log(response);
						console.log($(response).find("period"));
					});
					//window.location.reload();
				} else {
					// Uh oh.
					var errCode = $data.find("error").children("code").text();
					var errMsg = $data.find("error").children("message").text();
					if (errCode == "505") {
						//alert("That username and password combination didn't work.\n\nDouble-check you have't made any typos.");
						$("#loginform").show();
						$("#loggingin").hide();
					} else {
						alert("Error " + errCode + " - " + errMsg);
					}
				}
			},
			error: function() {
				//alert("An error occured while connecting to Schedules.\n\nTry again later, or, if that doesn't work, send an email to emails@coursesplus.tk.");
				window.close();
			}
		});
	//});
});