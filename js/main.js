window.daltonTab = {
	subjects: []
};

window.daltonTab.addEventToList = function(ev, list) {
	var tag = window.utils.getPrefix(ev.name);
	var name = ev.name.split(" ");
	name.splice(0, 1);
	name = name.join(" ");
	var done = (ev.done == 1 ? true : false);

	if (name.trim() == "") {
		return;
	}

	var $item = $('<li></li>');
		if (done) {
			$item.addClass("daltonTab-done");
		}
		var $name = $('<h4></h4>');
			$name.text(name);
		$item.append($name);

		var $lineTwo = $('<h4></h4>');
			var $tag = $('<span></span>');
				$tag.addClass("first-word");
				if (tag.toLowerCase() == "read") {
					tag = tag + "ing";
				}
				$tag.addClass(window.utils.getPrefixClass(tag));

				$tag.text(tag);
			$lineTwo.append($tag);

			var $subject = $('<span></span>');
				$subject.text(" in " + window.daltonTab.subjects[ev.subject].name);
			$lineTwo.append($subject);

			var $due = $('<span></span>');
				var keyword = "due";
				if (tag.toLowerCase() == "test" || tag.toLowerCase() == "exam" || tag.toLowerCase() == "midterm" || tag.toLowerCase() == "quiz" || tag.toLowerCase() == "ica" || tag.toLowerCase() == "lab") {
					keyword = "on";
				}
				var dueText = window.utils.formatDate_pretty(moment(ev.due).add(1, "day").toDate());
				if (moment(ev.due).add(1, "day").week() == moment().week()) {
					dueText = window.utils.getDayOfWeek(moment(ev.due).add(1, "day").day());
				}
				$due.text(" " + keyword + " " + dueText);
			$lineTwo.append($due);
		$item.append($lineTwo);
	$("#hw" + list).append($item);
};
window.daltonTab.findNextDay = function(offset) {
	var retVal = moment(); //moment().add("days", offset);
	if (retVal.day() == 6) {
		// don't start on Saturday
		retVal.add(1, "day");
	}
	for (var i = 0; i < offset; i++) {
		retVal.add(1, "day"); //add a day
		// is it a Saturday?
		if (retVal.day() == 6) {
			retVal.add(2, "day"); // skip the weekend
		}
	}
	return retVal.toDate();
};

window.daltonTab.loadHomework = function() {
		window.planhub.get("hwView/getHw?date=" + moment().format('YYYY-MM-DD'), function(data) {
			var ev = data.events;
			if (ev.length == 0) {
				return;
			}
			for (var evIndex in ev) {
				var evObj = {
					name: ev[evIndex].text,
					due: new Date(ev[evIndex].date.split("T")[0]),
					subject: ev[evIndex].sectionIndex,
					done: ev[evIndex].done
				};
				var list = "LongTerm";
				var dueMoment = moment(evObj.due).utcOffset(0);
				var tomorrow = moment(window.daltonTab.findNextDay(1)).date();
				if (dueMoment.date() == tomorrow && dueMoment.month() == moment(window.daltonTab.findNextDay(1)).month() && dueMoment.year() == moment(window.daltonTab.findNextDay(1)).year()) { // moment.isSame didn't work here. /shrug
					list = "Tomorrow";
				} else if (dueMoment.isBefore(moment(window.daltonTab.findNextDay(5)).subtract(1, "day"))) {
					list = "Soon";
				}
				window.daltonTab.addEventToList(evObj, list);
			};
		});
};

$(document).ready(function() {
	var timeUpdFunc = function() {
		$(".current-time").text(moment().format("h:mm A"));
		$(".current-date").text(moment().format("MMMM Do, YYYY"));
	};
	timeUpdFunc();
	setInterval(timeUpdFunc, 1000);

	chrome.storage.sync.get("backImgTog", function(storage) {
		if (storage.backImgTog == undefined || !storage.backImgTog) {
			$.get("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US", function(response) {
				console.log("===START BING IMAGE STUFF===");
				console.log(response);
				console.log("===END BING IMAGE STUFF===");
				var url = "https://www.bing.com" + response.images[0].url;
				$("#par").parallax({ imageSrc: url, bleed: 20, positionY: "0px" });
				$("#par").addClass("imageLoaded");
				$("#section1").addClass("imageLoaded");
				$(window).trigger('resize');
				$("#daltontab-image-caption").text(response.images[0].copyright);
				$("#daltontab-image-link").attr("href", response.images[0].copyrightlink)
				$("#daltontab-image-link").text("Learn more");
				//$("body").css("background-image", "url(" + url + ")");
			});
		} else {
			$("#daltontab-image-caption").text("You've disabled the image background!");
		}
	});

	for (var sectionIndex in window.sections) {
		var section = window.sections[sectionIndex];
		var $section = $('<div class="section"></div>');
			$section.attr("id", "section-" + sectionIndex);
			var $header = $('<h1></h1>');
				var $icon = $('<i class="fa"></i>');
					$icon.addClass(section.icon);
				$header.append($icon);
				$header.append(" " + section.name);
			$section.append($header);
			$section.append(section.createHtml());
	}

	$("#settingsBtn").click(function() {
		$("#settingsModal").modal();
	});

	$("#newTabDefault").click(function() {
		window.location.href = "chrome-search://local-ntp/local-ntp.html"
	});
	$("#hwButton").smoothScroll();

	$("#schedulesAccountBtn").click(function() {
		var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
		var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

		width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		var w = 600;
		var h = 400;

		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 2) - (h / 2)) + dualScreenTop;
		window.location.href = chrome.runtime.getURL("schedulesSignIn.html");
	});

	chrome.storage.sync.get(["schedulesLogin"], function(response) {
		if (response.schedulesLogin != undefined) {
			$("#schedulesSignIn").addClass("hidden");
			$("#schedulesSignedIn").removeClass("hidden");
			$("#schedulesAccountName").text(response.schedulesLogin.username);
		}
	});

	$("#schedulesLogOut").click(function() {
		chrome.storage.sync.remove("schedulesLogin", function() {
			swal("Logged Out", "You are now logged out of Schedules.", "success")
			window.location.reload();
		});
	});

	chrome.storage.sync.get("backImgTog", function(storage) {
		$("#backImgTog").prop("checked", storage.backImgTog);
	});
	$("#backImgTog").change(function() {
		chrome.storage.sync.set({"backImgTog": $(this).prop("checked")}, function() {

		});
	});

	window.coursesLib.checkLoggedIn(function(response) {
		if (!response.isLoggedIn) {
			$("#classes-warning").html('<i class="fa fa-exclamation-circle"></i> Please log in <a href="http://courses.dalton.org">to Courses</a>.');
			$("#classes-warning").css("font-size", "3em");
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
	});

	var easter_egg = new Konami();
	easter_egg.code = function() {
		swal("Unexpected T_PAAMAYIM_NEKUDOTAYIM!", "MWAHHHAHAHAHAHAHAHAH\nConfused? Search on...\n This product uses Sapi, Papi, Capy, Wapi", "warning");
	}
	easter_egg.load();

	window.planhub.get("features/get/", function(data) {
		console.log(data);
		if (data.status == "error" || data.status == "auth_required") {
			$("#hw-warning").html('<i class="fa fa-exclamation-circle"></i> Sign into <a href="https://planhub.me">PlanHub</a> to view your homework.');
			$("#hw-warning").css("font-size", "3em");
			$("#hwRow").remove();
			return;
		}
		if (data.features.indexOf("hwView") == -1) {
			$("#hw-warning").html('<i class="fa fa-exclamation-circle"></i> Enable <a href="https://planhub.me/app#hwView">Homework View</a> to see your homework here.');
			$("#hw-warning").css("font-size", "3em");
			$("#hwRow").remove();
			return;
		}

		window.planhub.get("planner/sections/get/", function(data) {
			for (var i = 0; i < data.sections.length; i++) {
				var itm = data.sections[i];
				window.daltonTab.subjects[itm.sectionIndex] = itm;
			};
			window.daltonTab.loadHomework();
		});
	});
	setTimeout(function() {
		$(window).trigger('resize');
	}, 100);
	$(".daltontab-version").text(chrome.runtime.getManifest().version);
});
