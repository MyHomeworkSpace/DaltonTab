DaltonTab.Settings = {
	init: function() {
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

		$("#settingsPanePages ul li").click(function() {
			var newPage = $(this).attr("data-page");
			
			$("#settingsPanePages ul li.selected").removeClass("selected");
			$(this).addClass("selected");

			$(".settingsPanePage:not(.hidden)").addClass("hidden");
			$("#settingsPanePage-" + newPage).removeClass("hidden");
		});

		$(".daltontab-version").text(chrome.runtime.getManifest().version);
	}
};