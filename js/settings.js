DaltonTab.Settings = {
	init: function() {
		$("#settingsPanePages ul li").click(function() {
			var newPage = $(this).attr("data-page");

			if (newPage == "_layoutEditor") {
				$("#settingsPane").removeClass("opened");
				DaltonTab.LayoutEditor.open();
				return;
			}
			
			$("#settingsPanePages ul li.selected").removeClass("selected");
			$(this).addClass("selected");

			$(".settingsPanePage:not(.hidden)").addClass("hidden");
			$("#settingsPanePage-" + newPage).removeClass("hidden");
		});

		// === ACCOUNTS ===
		$("#schedulesAccountBtn").click(function() {
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

		$("#coursesSignInBtn").click(function() {
			$(".accountSignInService").text("Courses");
			$("#accountSignInUsername").val("");
			$("#accountSignInPassword").val("");
			$("#accountSignInAlert").addClass("hidden");
			$("#accountSignInModal").modal({
				backdrop: "static",
				keyboard: false
			});
		});

		$("#accountSignInUsername, #accountSignInPassword").keyup(function(e) {
			if (e.keyCode == 13) { // enter key
				$("#accountSignInBtn").click();
			}
		});

		$("#accountSignInBtn").click(function() {
			$("#accountSignInLoadingFooter").removeClass("hidden");
			$("#accountSignInButtonFooter").addClass("hidden");
			CoursesLib.login($("#accountSignInUsername").val(), $("#accountSignInPassword").val(), function(response) {
				if (response.error) {
					$("#accountSignInLoadingFooter").addClass("hidden");
					$("#accountSignInButtonFooter").removeClass("hidden");
					$("#accountSignInAlert").removeClass("hidden");
					$("#accountSignInAlert").text(response.error);
					return;
				}
				chrome.storage.sync.set({
					coursesToken: response.token
				}, function() {
					$("#accountSignInLoadingFooter").addClass("hidden");
					$("#accountSignInButtonFooter").removeClass("hidden");
					$("#accountSignInModal").modal("hide");
					DaltonTab.SectionHandler.createSections();
				});
			});
		});

		$("#coursesLogOut").click(function() {
			chrome.storage.sync.remove("coursesToken", function() {
				DaltonTab.mustUpdateSectionPositions = true;
				$("#coursesSignedIn").addClass("hidden");
				$("#coursesSignInInfo").removeClass("hidden");
			});
		});

		// === BACKGROUND ===
		chrome.storage.sync.get("backImgTog", function(storage) {
			$("input[name=backgroundImageSource]").val([ (storage.backImgTog ? "none" : "live") ]);
		});
		$("input[name=backgroundImageSource]").change(function() {
			$("#refreshWarn").show();
			var value = $("input[name=backgroundImageSource]:checked").val();
			var backImgTog = (value == "none" ? true : false);
			chrome.storage.sync.set({"backImgTog": backImgTog}, function() {

			});
		});
		chrome.storage.sync.get("jumpingArrowTog", function(storage) {
			$("#jumpingArrowTog").prop("checked", storage.jumpingArrowTog);
		});
		$("#jumpingArrowTog").change(function() {
			$("#refreshWarn").show();
			if ($(this).prop("checked")) {
				$("#hwButton").addClass("hidden");
			} else {
				$("#hwButton").removeClass("hidden");
			}
			chrome.storage.sync.set({"jumpingArrowTog": $(this).prop("checked")}, function() {

			});
		});

		// === CLOCK ===
		chrome.storage.sync.get("clockType", function(storage) {
			var type = storage.clockType || "12hr";
			$("input[name=clockMode][value=" + type + "]").prop("checked", true);
		});
		chrome.storage.sync.get("displayDate", function(storage) {
			var displayDate = storage.displayDate;
			if (displayDate === undefined) {
				displayDate = true;
			}
			$("#showDate").prop("checked", displayDate);
		});
		$("input[name=clockMode]").change(function() {
			DaltonTab.Clock.type = $(this).val();
			DaltonTab.Clock.updateTime();
			chrome.storage.sync.set({
				clockType: $(this).val()
			});
		});
		$("#showDate").change(function() {
			DaltonTab.Clock.displayDate = $(this).prop("checked");
			DaltonTab.Clock.updateTime();
			chrome.storage.sync.set({
				displayDate: $(this).prop("checked")
			});
		});

		// === ABOUT ===
		$(".daltontab-version").text(chrome.runtime.getManifest().version);
	},
	open: function(page) {
		$("#sectionsButton").click();
		$("#settingsPanePages li[data-page=" + page + "]").click();
	}
};