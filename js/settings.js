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
		DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.settings.AccountPane, {

		}), null, document.querySelector("#settingsPanePage-accounts > div"));

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
		DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.settings.SettingCheckbox, {
			label: "Disable jumping arrow",
			storageKey: "jumpingArrowTog",
			change: function(buttonHidden) {
				if (buttonHidden) {
					$(".hwButton").addClass("hidden");
				} else {
					$(".hwButton").removeClass("hidden");
				}
			}
		}), null, document.querySelector("#jumpingArrowTog"));

		// === CLOCK ===
		chrome.storage.sync.get("clockType", function(storage) {
			var type = storage.clockType || "12hr";
			$("input[name=clockMode][value=" + type + "]").prop("checked", true);
		});
		DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.settings.SettingCheckbox, {
			label: "Show current date underneath time",
			storageKey: "displayDate",
			defaultValue: true,
			change: function(displayDate) {
				DaltonTab.Clock.setDisplayDate(displayDate);
				DaltonTab.Clock.render();
			}
		}), null, document.querySelector("#showDate"));
		$("input[name=clockMode]").change(function() {
			DaltonTab.Clock.setType($(this).val());
			DaltonTab.Clock.render();
			chrome.storage.sync.set({
				clockType: $(this).val()
			});
		});

		// === ABOUT ===
		$(".daltontab-version").text(chrome.runtime.getManifest().version);
	},
	open: function(page) {
		$("#settingsPaneClose").click();
		$("#settingsPanePages li[data-page=" + page + "]").click();
	}
};