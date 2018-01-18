var type = "12hr";
var displayDate = true;

DaltonTab.Clock = {
	init: function() {
		chrome.storage.sync.get(["clockType", "displayDate"], function(storage) {
			type = storage.clockType || "12hr";
			displayDate = storage.displayDate;

			if (displayDate === undefined) {
				displayDate = true;
			}

			DaltonTab.Clock.render();
		});
	},

	render: function() {
		DaltonTabBridge.default.render(DaltonTabBridge.default.h(DaltonTabBridge.default.Clock, {
			type: type,
			showDate: displayDate
		}), null, document.querySelector(".clock"));
	},

	setDisplayDate: function(newDisplayDate) {
		displayDate = newDisplayDate;
	},

	setType: function(newType) {
		type = newType;
	}
};