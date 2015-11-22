$(document).ready(function() {
	var schedulesUrl = "https://schedules.dalton.org/roux/index.php";
	//$("#scheduleSignIn").click(function() {

	var start = moment();
	if (start.day() == 0 || start.day() == 6) {
		while (start.day() != 1) {
			start.add(1, "day");
		}
	} else {
		while (start.day() != 1) {
			start.subtract(1, "day");
		}
	}
	var end = moment().add(7, "days");
	var dd = start.date();
	var mm = start.month()+1; //January is 0!
	var yyyy = start.year();
	var startFormat = moment(start).format("YYYYMMDD");
	var endFormat = moment(end).format("YYYYMMDD");

	if(dd<10) {
		dd='0'+dd
	} 

	if(mm<10) {
		mm='0'+mm
	} 

	var today = yyyy+mm+dd;
	
	chrome.storage.sync.get(["schedulesLogin"], function(storage) {
		var key = storage.schedulesLogin.key;
		var owner = storage.schedulesLogin.username;
		var id = key.split(":")[3];
		var year = yyyy;
		$.post(schedulesUrl, {rouxRequest: "<request><key>"+key+"</key><action>selectStudentCalendar</action><ID>" + id +"</ID><academicyear>" + year + "</academicyear><start>" + startFormat + "</start><end>" + endFormat + "</end></request>"}, function(response) {
			var $data = $(response);
			var periods = $data.find("period");
			
		});
	});
});