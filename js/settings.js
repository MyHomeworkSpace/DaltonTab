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

		// === BACKGROUND ===
		chrome.storage.sync.get("backImgTog", function(storage) {
			$("#backImgTog").prop("checked", storage.backImgTog);
		});
		$("#backImgTog").change(function() {
			chrome.storage.sync.set({"backImgTog": $(this).prop("checked")}, function() {

			});
		});
		chrome.storage.sync.get("jumpingArrowTog", function(storage) {
			$("#jumpingArrowTog").prop("checked", storage.jumpingArrowTog);
		});
		$("#jumpingArrowTog").change(function() {
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
	}
};