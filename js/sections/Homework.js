DaltonTab.Components.Sections.Homework = c({
	componentDidMount: function() {
		var that = this;
		chrome.storage.sync.get("mhsToken", function(storage) {
			var token = storage["mhsToken"] || "";
			MyHomeworkSpace.get(token, "classes/get", {}, function(classesData) {
				if (classesData.status != "ok") {
					that.setState({
						loaded: true,
						loggedIn: false
					});
					return;
				}
				MyHomeworkSpace.get(token, "homework/getHWView", {}, function(data) {
					if (data.status == "ok") {
						that.setState({
							loaded: true,
							loggedIn: true,
							classes: classesData.classes,
							homework: data.homework
						});
					} else {
						that.setState({
							loaded: true,
							loggedIn: false
						});
					}
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

		var showMonday = (moment().day() == 5 || moment().day() == 6);
		var tomorrowDaysToThreshold = 2;

		if (showMonday) {
			if (moment().day() == 5) {
				tomorrowDaysToThreshold = 4;
			} else {
				tomorrowDaysToThreshold = 3;
			}
		}

		var overdue = [];
		var tomorrow = [];
		var soon = [];
		var longterm = [];

		state.homework.forEach(function(hw) {
			var due = moment(hw.due);
			var daysTo = Math.ceil(due.diff(moment()) / 1000 / 60 / 60 / 24);

			if (daysTo < 1) {
				overdue.push(hw);
			} else if (daysTo < tomorrowDaysToThreshold) {
				tomorrow.push(hw);
			} else if (daysTo < 5) {
				soon.push(hw);
			} else {
				longterm.push(hw);
			}
		});

		return (
			h("div", { class: "homeworkSection" },
				(overdue.length > 0 ? h(DaltonTab.Components.Sections.HomeworkColumn, { classes: state.classes, title: "Overdue", homework: overdue }) : undefined),
				h(DaltonTab.Components.Sections.HomeworkColumn, { classes: state.classes, title: (showMonday ? "Monday": "Tomorrow"), homework: tomorrow }),
				h(DaltonTab.Components.Sections.HomeworkColumn, { classes: state.classes, title: "Soon", homework: soon }),
				h(DaltonTab.Components.Sections.HomeworkColumn, { classes: state.classes, title: "Long-term", homework: longterm })
			)
		);
	}
});