DaltonTab.Components.Sections.Classes = c({
	componentDidMount: function() {
		var that = this;
		chrome.storage.sync.get("mhsToken", function(storage) {
			var token = storage["mhsToken"] || "";
			MyHomeworkSpace.get(token, "calendar/getStatus", {}, function(statusData) {
				if (statusData.status != "ok") {
					that.setState({
						loaded: true,
						loggedIn: false
					});
					return;
				}
				if (statusData.statusNum != 1) {
					that.setState({
						loaded: true,
						loggedIn: true,
						calendarEnabled: false
					});
					return;
				}
				MyHomeworkSpace.get(token, "calendar/getClasses", {}, function(data) {
					that.setState({
						loaded: true,
						loggedIn: true,
						calendarEnabled: true,
						classes: data.classes
					});
				});
			});
		});
	},
	render: function(props, state) {
		if (!state.loaded) {
			return h("div", {}, "Loading, please wait...");
		}
		if (!state.loggedIn) {
			return DaltonTabBridge.default.h(DaltonTabBridge.default.other.MHSConnect, {});
		}
		if (!state.calendarEnabled) {
			return DaltonTabBridge.default.h(DaltonTabBridge.default.other.MHSConnect, { type: "calendar" });
		}

		var classItems = state.classes.map(function(classItem) {
			var linkURL = "https://dalton.myschoolapp.com/app/student#academicclass/" + classItem.sectionId + "/0/bulletinboard";
			return h("div", { class: "classesSectionItem" }, 
				h("a", { href: linkURL }, 
					h("div", { class: "classesSectionItemName" }, classItem.name),
					h("div", { class: "classesSectionOwnerName" }, classItem.ownerName)
				)
			);
		});

		return (
			h("div", { class: "classesSection" }, classItems)
		);
	}
});