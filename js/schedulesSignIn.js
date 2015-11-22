$(document).ready(function() {
	var schedulesUrl = "https://schedules.dalton.org/roux/index.php";
	$("#signIn").click(function() {
		var daltonid = $("#username").val();
		var password = $("#password").val();

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
					chrome.storage.sync.set({"schedulesLogin": {
						key: key,
						username: daltonid,
						owner: owner
					}}, function() {
						swal({
							title: "Awesome!",
							text: "You signed into Schedules.",
							type: "success"
						}, function() {
							window.close();
						});
					});
				} else {
					// Uh oh.
					var errCode = $data.find("error").children("code").text();
					var errMsg = $data.find("error").children("message").text();
					if (errCode == "505") {
						swal("Uh Oh...", "It seems like you put in the wrong credentials. Try again!", "warning");
						$("#loginform").show();
						$("#loggingin").hide();
					} else {
						swal("Error" + errCode, errMsg, "error")
					}
				}
			},
			error: function() {
				swal("Whoops! An error occured while connecting to Schedules.", "Try again later, or, if that doesn't work, send an email to emails@coursesplus.tk.", "error");
				window.close();
			}
		});
	});
});
