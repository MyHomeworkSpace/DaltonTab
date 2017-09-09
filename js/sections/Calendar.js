DaltonTab.Components.Sections.Calendar = c({
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

				var mondayDate = moment();
				while (mondayDate.day() != 1) {
					mondayDate.subtract(1, "day");
				}
				mondayDate.add(1, "week");
				
				that.setState({
					loaded: true,
					loggedIn: true,
					calendarEnabled: true,
					token: token,
					monday: mondayDate,
					loadingWeek: true
				}, function() {
					that.loadCurrentWeek.call(that);
				});
			});
		});
	},
	loadCurrentWeek: function() {
		var that = this;
		this.setState({
			loadingWeek: true
		}, function() {
			MyHomeworkSpace.get(that.state.token, "calendar/events/getWeek/" + that.state.monday.format("YYYY-MM-DD"), {}, function(data) {
				that.setState({
					loadingWeek: false,
					weekInfo: data
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
		if (!state.calendarEnabled) {
			return h(DaltonTab.Components.Sections.MHSConnect, { type: "calendar" });
		}

		var fridayIndex = (state.loadingWeek ? -1 : state.weekInfo.friday.index);

		var dayHeaders = [];
		var dayContents = [];
		var names = [ "Monday", "Tuesday", "Wednesday", "Thursday", (fridayIndex > 0 ? "Friday " + fridayIndex : "Friday"), "Saturday", "Sunday" ];

		var currentDay = moment(state.monday);

		for (var dayNumber = 0; dayNumber < 7; dayNumber++) {
			// create list of all events
			var allEvents = [];

			if (!state.loadingWeek) {
				(state.weekInfo.scheduleEvents[dayNumber] || []).forEach(function(event) {
					event.type = "schedule";
					allEvents.push(event);
				});
			}

			// group events that occur at same time
			var groupsForDay = [];
			allEvents = allEvents.map(function(eventItem) {
				var isScheduleItem = (props.type == "schedule"); 
				eventItem.groupInfo = {
					dayStart: (isScheduleItem ? moment.unix(0).utc() : moment.unix(eventItem.start).startOf("day")),
					start: moment.unix(eventItem.start),
					end: moment.unix(eventItem.end),
				};
				if (isScheduleItem) {
					eventItem.groupInfo.start = eventItem.groupInfo.start.utc();
					eventItem.groupInfo.end = eventItem.groupInfo.end.utc();
				}
				eventItem.groupInfo.offset = eventItem.groupInfo.start.diff(eventItem.groupInfo.dayStart, "minutes");
				eventItem.groupInfo.durationInMinutes = eventItem.groupInfo.end.diff(eventItem.groupInfo.start, "minutes");
				eventItem.groupInfo.height = (eventItem.groupInfo.durationInMinutes < 10 ? 10: eventItem.groupInfo.durationInMinutes);
				eventItem.groupInfo.endOffset = eventItem.groupInfo.offset + eventItem.groupInfo.durationInMinutes;
				eventItem.groupInfo.endOffsetHeight = eventItem.groupInfo.offset + eventItem.groupInfo.height;
				return eventItem;
			});
			allEvents.forEach(function(eventItem, eventItemIndex) {
				// find which group this event belongs to
				var foundGroupIndex = -1;
				for (var groupIndex in groupsForDay) {
					var groupToTest = groupsForDay[groupIndex];
					for (var eventIndex in groupToTest) {
						var groupEventToTest = groupToTest[eventIndex];

						if (
							(eventItem.groupInfo.offset <= groupEventToTest.groupInfo.endOffsetHeight) &&
							(groupEventToTest.groupInfo.offset <= eventItem.groupInfo.endOffsetHeight)
						) {
							foundGroupIndex = groupIndex;
							break;
						}
					}
				}

				if (foundGroupIndex != -1) {
					groupsForDay[foundGroupIndex].push(eventItem);
				} else {
					groupsForDay.push([ eventItem ]);
				}
			});
	
			// make the elements
			var eventElements = [];
			groupsForDay.forEach(function(eventGroup) {
				eventGroup.forEach(function(eventItem, eventGroupIndex) {
					eventElements.push(h("div", {}, eventItem.name));
				});
			});

			allEvents.forEach(function(event) {
				eventElements.push(event.name);
			});

			dayHeaders.push(h("div", { class: "calendarDayHeader" }, names[dayNumber] + " " + currentDay.format("M/D")));
			dayContents.push(h("div", { class: "calendarDayContents day" + dayNumber }, eventElements));
			
			currentDay.add(1, "day");
		}

		return (
			h("div", { class: "calendarSection" }, 
				h("div", { class: "calendarHeader" },
					"Week of " + state.monday.format("MMMM D, YYYY"),
					(state.loadingWeek ? " Loading week, please wait...": "")
				),
				h("div", { class: "calendarWeek" }, dayHeaders),
				h("div", { class: "calendarViewport" },
					h("div", { class: "calendarWeek" }, dayContents)
				)
			)
		);
	}
});