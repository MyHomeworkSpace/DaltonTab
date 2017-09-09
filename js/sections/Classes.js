DaltonTab.Components.Sections.Classes = c({
	componentDidMount: function() {
		var that = this;
		chrome.storage.sync.get("mhsToken", function(storage) {
			var token = storage["mhsToken"] || "";
			MyHomeworkSpace.get(token, "calendar/getClasses", {}, function(data) {
				if (data.status != "ok") {
					that.setState({
						loaded: true,
						loggedIn: false
					});
					return;
				}
				that.setState({
					loaded: true,
					loggedIn: true,
					classes: data.classes
				});
			});
		});
	},
	render: function(props, state) {
		if (!state.loaded) {
			return h("div", {}, "Loading, please wait...");
		}
		if (!state.loggedIn) {
			return h(DaltonTab.Components.Sections.MHSConnect, {});
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