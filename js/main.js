$(document).ready(function() {
	var timeUpdFunc = function() {
		$(".current-time").text(moment().format("h:mm A"));
		$(".current-date").text(moment().format("MMMM Do, YYYY"));
	};
	timeUpdFunc();
	setInterval(timeUpdFunc, 1000);
});