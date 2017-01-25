DaltonTab = {
	mustUpdateSectionPositions: false
};

$(document).ready(function() {
	var timeUpdFunc = function() {
		$(".current-time").text(moment().format("h:mm"));
		$(".current-time-ampm").text(moment().format("A"));
		if (navigator.onLine) {
			$(".current-date").text(moment().format("MMMM Do, YYYY"));
		} else {
			$(".current-date").text("You are not connected to the internet!")
		}
	};
	timeUpdFunc();
	setInterval(timeUpdFunc, 1000);

	$(window).scroll(function() {
		if ($(window).scrollTop() >= 20) {
			$("#hwButton").attr("href", "#topFiller");
			$("#hwButton").addClass("flipped");
			$("#sectionsButton").addClass("visible");
		} else {
			$("#hwButton").attr("href", "#sectionContainer");
			$("#hwButton").removeClass("flipped");
			$("#sectionsButton").removeClass("visible");
			$("#sectionsButton").removeClass("visible");
		}
	});
	$("#hwButton").smoothScroll();

	$("#sectionsButton, #settingsPaneClose, #manageOverlay").click(function() {
		$("#settingsPane").toggleClass("opened");
		$("body").toggleClass("frozen");
		if ($("#settingsPane").hasClass("opened")) {
			// we just opened it
			DaltonTab.mustUpdateSectionPositions = false;
		} else {
			// we just closed it
			if (DaltonTab.mustUpdateSectionPositions) {
				// update section stuff
				var newOrder = [];
				$("#currentSections li").each(function() {
					var section = $(this).attr("data-section");
					newOrder.push(section);
				});
				DaltonTab.SectionHandler.updateOrder(newOrder, function() {
					chrome.storage.sync.set({
						sections: newOrder
					}, function() {
						DaltonTab.SectionHandler.createSections();
					});
				});
			}
		}
	});

	chrome.storage.sync.get("backImgTog", function(storage) {
		if (storage.backImgTog == undefined || !storage.backImgTog) {
			var channel = "normal";
			if (localStorage.nc) {
				console.log("Channel override set, using image channel " + localStorage.nc);
				channel = localStorage.nc;
				localStorage.removeItem("nc");
			}
			$.get("https://daltontabservices.myhomework.space/v1/getImage.php?channel=" + channel, function(data) {
				var image = JSON.parse(data);

				$("#topSection").css("background-image", "url(" + image.imgUrl + ")");
				$("#topSection").addClass("imageLoaded");

				if (!image.description) {
					$("#imageDesc").text("");
				} else {
					$("#imageDesc").text(image.description);
				}

				$("#imageAuthor").attr("href", image.authorUrl);
				$("#imageAuthor").text(image.authorName);

				$("#imageSite").attr("href", image.siteUrl);
				$("#imageSite").text(image.siteName);

				$("#imageInfo").removeClass("hidden");
			});
		} else {
			$("#daltontab-image-caption").text("You've disabled the image background!");
		}
	});

	DaltonTab.SectionHandler.init(function() {
		DaltonTab.SectionHandler.updateSectionLists();
		DaltonTab.SectionHandler.createSections();
	});

	// weather code
	// no real good place to put this yet...
	$("#weatherModal").on("hide.bs.modal", function() {
		DaltonTab.SectionHandler.createSections();
	});
	$("#weatherLocationSubmit").click(function() {
		$("#weatherLocationUnset").addClass("hidden");
		$("#weatherLocationLoading").removeClass("hidden");
		$("#weatherLocationError").addClass("hidden");
		$.get("https://daltontabservices.myhomework.space/v1/weather.php", {
			units: "f",
			place: $("#weatherLocationText").val()
		}, function(data) {
			if (data.query.count == 0) {
				// invalid location
				$("#weatherLocationUnset").removeClass("hidden");
				$("#weatherLocationLoading").addClass("hidden");
				$("#weatherLocationError").removeClass("hidden");
				return;
			}
			// valid location!
			var prettyName = data.query.results.channel.location.city + "," + data.query.results.channel.location.region;
			chrome.storage.sync.set({
				weather: {
					query: $("#weatherLocationText").val(),
					prettyName: prettyName
				}
			}, function() {
				$("#weatherLocationLoading").addClass("hidden");
				$("#weatherLocationSet").removeClass("hidden");
				$("#weatherLocationName").text(prettyName);
			});
		});
	});
	$("#weatherLocationCurrent").click(function() {
		if ($(this).hasClass("disabled")) {
			return;
		}
		$(this).addClass("disabled");
		$(this).text("Getting your location...");
		navigator.geolocation.getCurrentPosition(function(pos) {
			$("#weatherLocationCurrent").text("Use current location");
			$("#weatherLocationCurrent").removeClass("disabled");
			var yahooFmt = "(" + pos.coords.latitude + ", " + pos.coords.longitude + ")";
			$("#weatherLocationText").val(yahooFmt);
			$("#weatherLocationSubmit").click();
		}, function() {
			$("#weatherLocationCurrent").text("Couldn't get location");
			//$("#weatherLocationCurrent").removeClass("disabled");
		});
	});
	$("#weatherLocationChange").click(function() {
		chrome.storage.sync.remove("weather", function() {
			$("#weatherLocationUnset").removeClass("hidden");
			$("#weatherLocationSet").addClass("hidden");
			$("#weatherLocationError").addClass("hidden");
			$("#weatherLocationText").val("");
		});
	});
	chrome.storage.sync.get("weather", function(storage) {
		var w = storage.weather;
		if (w == undefined) {
			return;
		}
		$("#weatherLocationUnset").addClass("hidden");
		$("#weatherLocationSet").removeClass("hidden");
		$("#weatherLocationName").text(w.prettyName);
	});
	chrome.storage.sync.get("weatherUnits", function(storage) {
		var u = storage.weatherUnits;
		if (u == undefined) {
			return;
		}
		$("#weatherUnitsF").prop("checked", false);
		$("#weatherUnits" + u.toUpperCase()).prop("checked", true);
	});
	$("#weatherUnitsF, #weatherUnitsC").change(function() {
		var newUnit = $("input[name=weatherUnits]:checked").val();
		chrome.storage.sync.set({
			weatherUnits: newUnit
		}, function() {

		});
	});

	$("#newTabDefault").click(function() {
		window.location.href = "chrome-search://local-ntp/local-ntp.html"
	});

	DaltonTab.Settings.init();
	DaltonTab.Survey.init();

	setTimeout(function() {
		$("#loadOverlay").addClass("fade");
		setTimeout(function() {
			$("#loadOverlay").remove();
		}, 300);
	}, 200);
});
