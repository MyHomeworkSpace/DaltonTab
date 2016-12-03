DaltonTab = {
	subjects: {}
};
window.daltonTab = DaltonTab;

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
				$subject.text(" in " + window.daltonTab.subjects[ev.classId].name);
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

$(document).ready(function() {
	var timeUpdFunc = function() {
		$(".current-time").text(moment().format("h:mm A"));
		$(".current-date").text(moment().format("MMMM Do, YYYY"));
	};
	timeUpdFunc();
	setInterval(timeUpdFunc, 1000);

	$(window).scroll(function() {
		if ($(window).scrollTop() > 80) {
			$("#hwButton").attr("href", "#topFiller");
			$("#hwButton").addClass("flipped");
		} else {
			$("#hwButton").attr("href", "#sectionContainer");
			$("#hwButton").removeClass("flipped");
		}
	});
	$("#hwButton").smoothScroll();

	chrome.storage.sync.get("backImgTog", function(storage) {
		if (storage.backImgTog == undefined || !storage.backImgTog) {
			$.get("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US&video=1", function(response) {
				console.log("===START BING IMAGE STUFF===");
				console.log(response);
				console.log("===END BING IMAGE STUFF===");
				var url = "https://www.bing.com" + response.images[0].url;
				$("#topSection").css("background-image", "url(" + url + ")");
				$("#topSection").addClass("imageLoaded");
				$(window).trigger('resize');
				$("#daltontab-image-caption").text(response.images[0].copyright);
				$("#daltontab-image-link").attr("href", response.images[0].copyrightlink)
				$("#daltontab-image-link").text("Learn more");
				if (response.images[0].vid) {
					// a video!
					var vidUrl = response.images[0].vid.sources[1][2];
					if (vidUrl[0] == "/") {
						vidUrl = "https:" + vidUrl;
					}
					$("#videoBg").attr("src", vidUrl);
					$("#videoBg")[0].play();
					$("#topSection").css("background", "transparent");
				}
			});
		} else {
			$("#daltontab-image-caption").text("You've disabled the image background!");
		}
	});

	for (var sectionIndex in DaltonTab.Sections) {
		var section = DaltonTab.Sections[sectionIndex];
		var $section = $('<div class="section container-fluid"></div>');
			$section.attr("id", "section-" + sectionIndex);
			$section.css("background-color", section.background);
			var $header = $('<h1></h1>');
				var $icon = $('<i class="fa"></i>');
					$icon.addClass(section.icon);
				$header.append($icon);
				$header.append(" " + section.name);
			$section.append($header);
			$section.append(section.createHtml());
		$("#sectionContainer").append($section);
	}

	for (var sectionIndex in DaltonTab.Sections) {
		var section = DaltonTab.Sections[sectionIndex];
		section.run();
	}

	$("#settingsBtn").click(function() {
		$("#settingsModal").modal();
	});

	$("#newTabDefault").click(function() {
		window.location.href = "chrome-search://local-ntp/local-ntp.html"
	});

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

	var easter_egg = new Konami();
	easter_egg.code = function() {
		swal("Unexpected T_PAAMAYIM_NEKUDOTAYIM!", "MWAHHHAHAHAHAHAHAHAH\nConfused? Search on...\n This product uses Sapi, Papi, Capy, Wapi", "warning");
	}
	easter_egg.load();

	setTimeout(function() {
		$(window).trigger('resize');
	}, 100);
	$(".daltontab-version").text(chrome.runtime.getManifest().version);
});
