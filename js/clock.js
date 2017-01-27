DaltonTab.Clock = {
	type: "12hr",
	displayDate: true,

	init: function() {
		chrome.storage.sync.get(["clockType", "displayDate"], function(storage) {
			DaltonTab.Clock.type = storage.clockType || "12hr";
			DaltonTab.Clock.displayDate = storage.displayDate;

			if (DaltonTab.Clock.displayDate === undefined) {
				DaltonTab.Clock.displayDate = true;
			}

			DaltonTab.Clock.updateTime();
			setInterval(DaltonTab.Clock.updateTime, 1000);
		});

		$("#timeTop").dblclick(function() {
			$("#sectionsButton").click();
			$("#settingsPanePages li[data-page=clock]").click();
		});
	},

	updateTime: function() {
		if (DaltonTab.Clock.type == "12hr" || DaltonTab.Clock.type == "12hrnopm") {
			$(".current-time").text(moment().format("h:mm"));
		} else if (DaltonTab.Clock.type == "24hr") {
			$(".current-time").text(moment().format("k:mm"));
		} else if (DaltonTab.Clock.type == "percent") {
			// TODO: make this an option
			var start = moment().set("hour", 8);
			var end = moment().set("hour", 12 + 3).set("minute", 15);
			var now = moment();

			if (start.diff(now, "hours") > 0) {
				// day hasn't started yet
				$(".current-time").text("0%");
			} else if (end.diff(now, "hours") < 0) {
				// day is over
				$(".current-time").text("100%");
			} else {
				var secondsToEnd = now.diff(start);
				var secondsTotal = end.diff(start);
				var percent = Math.floor((secondsToEnd / secondsTotal) * 100);
				$(".current-time").text(percent + "%");
			}
		}

		if (DaltonTab.Clock.type == "12hr") {
			$(".current-time-ampm").text(moment().format("A"));
		} else {
			$(".current-time-ampm").text("");
		}

		if (DaltonTab.Clock.displayDate) {
			if (navigator.onLine) {
				$(".current-date").text(moment().format("MMMM Do, YYYY"));
			} else {
				$(".current-date").text("You are not connected to the internet!");
			}
		} else {
			$(".current-date").text("");
		}
	}
};