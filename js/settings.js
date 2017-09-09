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
		preact.render(h(DaltonTab.Components.Settings.SettingCheckbox, {
			label: "Disable jumping arrow",
			storageKey: "jumpingArrowTog",
			change: function(buttonHidden) {
				if (buttonHidden) {
					$("#hwButton").addClass("hidden");
				} else {
					$("#hwButton").removeClass("hidden");
				}
			}
		}), null, document.querySelector("#jumpingArrowTog"));

		// === CLOCK ===
		chrome.storage.sync.get("clockType", function(storage) {
			var type = storage.clockType || "12hr";
			$("input[name=clockMode][value=" + type + "]").prop("checked", true);
		});
		preact.render(h(DaltonTab.Components.Settings.SettingCheckbox, {
			label: "Show current date underneath time",
			storageKey: "displayDate",
			defaultValue: true,
			change: function(displayDate) {
				DaltonTab.Clock.displayDate = displayDate;
				DaltonTab.Clock.updateTime();
			}
		}), null, document.querySelector("#showDate"));
		$("input[name=clockMode]").change(function() {
			DaltonTab.Clock.type = $(this).val();
			DaltonTab.Clock.updateTime();
			chrome.storage.sync.set({
				clockType: $(this).val()
			});
		});

		// === ABOUT ===
		$(".daltontab-version").text(chrome.runtime.getManifest().version);
	},
	open: function(page) {
		$("#settingsButton").click();
		$("#settingsPanePages li[data-page=" + page + "]").click();
	}
};