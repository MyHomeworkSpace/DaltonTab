DaltonTab.Schedule = {
	hasTried: false,
	rouxUrl: "https://schedules.dalton.org/roux/index.php",
	scheduleData: undefined,
	init: function(schedulesLogin, successCallback, expiredCallback, failureCallback) {
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
				console.warn("Schedules session is expired, trying to extend...");
				expiredCallback();
				return;
			}

			// yay it worked! set the scheduleData parameter
			DaltonTab.Schedule.scheduleData = $data;
			successCallback();
		});
	}
};
