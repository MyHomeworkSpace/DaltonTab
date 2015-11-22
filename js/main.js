$(document).ready(function() {
	var timeUpdFunc = function() {
		$(".current-time").text(moment().format("h:mm A"));
		$(".current-date").text(moment().format("MMMM Do, YYYY"));
	};
	timeUpdFunc();
	setInterval(timeUpdFunc, 1000);

	$.get("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US", function(response) {
		$("#section1").parallax({ imageSrc: "https://www.bing.com" + response.images[0].url, bleed: 20, positionY: "0px" });
		$("#section1").addClass("imageLoaded");
	});

	$("#settingsBtn").click(function() {
		$("#settingsModal").modal();
	});

	$("#hwButton").smoothScroll();
});