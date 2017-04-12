var jumpingArrow = document.getElementById('hwButton');
var backgroundImageURL = "";

DaltonTab = {
	mustUpdateSectionPositions: false
};

$(document).ready(function() {
	$(window).scroll(function() {
		if ($(window).scrollTop() >= 20) {
			$("#hwButton").attr("href", "#topFiller");
			$("#hwButton").addClass("flipped");
			$("#sectionsButton").addClass("visible");
		} else {
			$("#hwButton").attr("href", "#sectionContainer");
			$("#hwButton").removeClass("flipped");
			$("#sectionsButton").removeClass("visible");
		}
	});
	$("#hwButton").smoothScroll();

	$("#sectionsButton, #settingsPaneClose, #manageOverlay").click(function() {
		$("#settingsPane").toggleClass("opened");
		$("body").toggleClass("frozen");
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
				var backgroundImageURL = image.imgUrl;
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

	chrome.storage.sync.get("jumpingArrowTog", function(storage) {
		if (!(storage.jumpingArrowTog == undefined || !storage.jumpingArrowTog)) {
			$("#hwButton").addClass("hidden");
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

	DaltonTab.Clock.init();
	DaltonTab.LayoutEditor.init();
	DaltonTab.Settings.init();
	DaltonTab.Survey.init();

	$('[data-toggle="tooltip"]').tooltip();

	setTimeout(function() {
		$("#loadOverlay").addClass("fade");
		setTimeout(function() {
			$("#loadOverlay").remove();
		}, 300);
	}, 200);

	var backgroundImageVibrant = document.createElement('img');
	$(backgroundImageVibrant).css({"display": "none"});
	backgroundImageVibrant.setAttribute('src', backgroundImageURL);

	backgroundImageVibrant.addEventListener('load', function(){
		alert("I'm feeling vibrant!");
		var vibrant = new Vibrant(backgroundImageVibrant);
		var swatches = vibrant.swatches();
		var swatch;
		for (swatch in swatches){
			if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
				console.log(swatch, swatches[swatch].getHex());
			}
		}
	});
});
