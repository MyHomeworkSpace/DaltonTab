$(document).ready(function() {
	$(".current-time").text(moment().format("h:mm A"));
	setInterval(function() {
		$(".current-time").text(moment().format("h:mm A"));
	}, 1000);
});