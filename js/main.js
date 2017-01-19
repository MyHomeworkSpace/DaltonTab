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
			DaltonTab.mustUpdateSectionPositions = true;
			$("#schedulesSignIn").removeClass("hidden");
			$("#schedulesSignedIn").addClass("hidden");
		});
	});

	$(".sectionList").sortable({
		connectWith: ".sectionList",
		placeholder: "ui-state-highlight",
		change: function(e, ui) {
			DaltonTab.mustUpdateSectionPositions = true;
		}
    }).disableSelection();

	chrome.storage.sync.get("backImgTog", function(storage) {
		$("#backImgTog").prop("checked", storage.backImgTog);
	});
	$("#backImgTog").change(function() {
		chrome.storage.sync.set({"backImgTog": $(this).prop("checked")}, function() {

		});
	});

	var easter_egg = new Konami();
	easter_egg.code = function() {
		swal({
			title: "Unexpected T_PAAMAYIM_NEKUDOTAYIM!",
			text: "MWAHHHAHAHAHAHAHAHAH\nConfused? Search on...\n This product uses Sapi, Papi, Capy, Wapi",
			type: "warning",
			confirmButtonText: "Clear section data", // i had nowhere else to but it
  			showCancelButton: true,
			cancelButtonText: "What?",
  			closeOnConfirm: false
		}, function() {
			chrome.storage.sync.remove("sections", function() {
				swal("Deleted!", "Your section data has been deleted.", "success");
			});
		});
	};
	easter_egg.load();

	setTimeout(function() {
		$(window).trigger('resize');
	}, 100);
	$(".daltontab-version").text(chrome.runtime.getManifest().version);

	DaltonTab.Survey.init();

	setTimeout(function() {
		$("#loadOverlay").addClass("fade");
		setTimeout(function() {
			$("#loadOverlay").remove();
		}, 300);
	}, 200);
});
