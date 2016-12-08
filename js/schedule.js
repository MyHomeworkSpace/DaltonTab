DaltonTab.Schedule = {
	hasTried: false,
	daltonTestUrl: "https://daltontabservices.myhomework.space/v1/isDalton.php",
	extendUrl: "https://rouxkeyextend.myhomework.space/extend.php",
	rouxUrl: "https://schedules.dalton.org/roux/index.php",
	scheduleData: undefined,
	reset: function() {
		DaltonTab.Schedule.hasTried = false;
		DaltonTab.Schedule.scheduleData = undefined;
	},
	init: function(schedulesLogin, successCallback, expiredCallback, failureCallback, keyChangeCallback) {
		var key = schedulesLogin.key;
		var owner = schedulesLogin.username;
		var id = key.split(":")[3];

		// try to find what dates we're asking schedules for
		var start = moment(); // start is this monday
		if (start.day() == 0 || start.day() == 6) {
			while (start.day() != 1) {
				start.add(1, "day");
			}
		} else {
			while (start.day() != 1) {
				start.subtract(1, "day");
			}
		}
		var end = start.clone();
		end.add(5, "days"); // and the end is 5 days after the start
		var year = start.year(); // schedules also likes to know the year

		// put the dates in the way schedules wants them
		var startString = moment(start).format("YYYYMMDD");
		var endString = moment(end).format("YYYYMMDD");

		// try and get the schedule
		$.post(DaltonTab.Schedule.rouxUrl, {
			rouxRequest: "<request><key>" + key + "</key><action>selectStudentCalendar</action><ID>" + id + "</ID><academicyear>" + year + "</academicyear><start>" + startString + "</start><end>" + endString + "</end></request>"
		}, function(response) {
			var $data = $(response);
			if ($data.find("result").children("error").children("code").text() == "505") {
				// session is no good

				// have we been here before?
				if (DaltonTab.Schedule.hasTried) {
					// yes
					console.warn("Giving up on session extension.");
					expiredCallback();
					return;
				}

				DaltonTab.Schedule.hasTried = true; // set a flag so we don't get stuck doing this forever

				// no we haven't, let's try to extend it!
				console.warn("Schedules session is expired, trying to extend...");

				// let's see if we're inside dalton first
				$.get(DaltonTab.Schedule.daltonTestUrl, function(dataStr) {
					var extendKeyWithIp = function(ip) {
						$.get(DaltonTab.Schedule.extendUrl, {
							application: "schedules",
							key: key,
							ip: ip
						}, function(dataStr) {
							var data = JSON.parse(dataStr);
							if (data.status != "ok") {
								// didn't work :(
								console.warn("RKE couldn't extend session!");
								expiredCallback();
								return;
							}
							// it worked!
							var newKey = data.key;
							keyChangeCallback(newKey, function() {
								// try again
								var loginObj = schedulesLogin;
								loginObj.key = newKey;
								DaltonTab.Schedule.init(loginObj, successCallback, expiredCallback, failureCallback, keyChangeCallback);
							});
						});
					};
					var data = JSON.parse(dataStr);
					if (data.result) {
						// we're at dalton
						// find our local ip
						DaltonTab.LocalIP.getLocalIP(function(ip) {
							// and try and extend it with that
							extendKeyWithIp(ip);
							return;
						});
						return;
					}
					// ooh let's try and extend it then
					extendKeyWithIp(data.remoteIp);
				});
			}

			// yay it worked! set the scheduleData parameter
			DaltonTab.Schedule.scheduleData = $data;
			successCallback();
		}).fail(failureCallback);
	}
};
