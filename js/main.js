function beginPlanHub() {

}

function beginSchedules() {

}

function beginCourses() {

}


$(document).ready(function() {
	var timeUpdFunc = function() {
		$(".current-time").text(moment().format("h:mm A"));
		$(".current-date").text(moment().format("MMMM Do, YYYY"));
	};
	timeUpdFunc();
	setInterval(timeUpdFunc, 1000);

	$.get("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US", function(response) {
		var url = "https://www.bing.com" + response.images[0].url;
		$("#section1").parallax({ imageSrc: url, bleed: 20, positionY: "0px" });
		$("#section1").addClass("imageLoaded");
		$("body").css("background-image", "url(" + url + ")");
	});

	$("#settingsBtn").click(function() {
		$("#settingsModal").modal();
	});

	$("#hwButton").smoothScroll();

	window.coursesLib.checkLoggedIn(function(response) {
		if (!response.isLoggedIn) {
			$(".section-warning").html('<i class="fa fa-exclamation-circle"></i> Please log in <a href="http://courses.dalton.org">here</a>.');
		} else {
			window.coursesLib.getCourseList(function(response) {
				for (var courseIndex in response.classes) {
					var course = response.classes[courseIndex];
					console.log(course);
					var $element = $("<li></li>");
						$element.html('<a href="' + course.url + '" style="color:white">' + course.name + '</a>');
					$("#courses").append($element);
				}
			});
		}

		var easter_egg = new Konami();
		easter_egg.code = function() {
			alert("MWWWHAHAHAHAHAHAH!");
		}
		easter_egg.load();
	});
});
