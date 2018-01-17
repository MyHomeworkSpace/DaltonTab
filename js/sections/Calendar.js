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
				
				that.setState({
					loaded: true,
					loggedIn: true,
					calendarEnabled: true,
					token: token,
					monday: mondayDate,
					loadingWeek: true
				}, function() {
					that.loadCurrentWeek.call(that);
					that.setInitialScroll.call(that);
				});
			});
		});
	},
	setInitialScroll: function() {
		var time = Math.floor((moment().unix() - moment("00:00:00", "HH:mm:ss").unix()) / 60);
		var scrollPos = time - 150;
		if (scrollPos < 0) {
			scrollPos = 0;
		}
		document.querySelector(".calendarViewport").scrollTop = scrollPos;
	},
	loadCurrentWeek: function() {
		var that = this;
		this.setState({
			loadingWeek: true,
			weekInfo: null
		}, function() {
			MyHomeworkSpace.get(that.state.token, "calendar/events/getWeek/" + that.state.monday.format("YYYY-MM-DD"), {}, function(data) {
				that.setState({
					loadingWeek: false,
					weekInfo: data
				});
			});
		});
	},
	jumpToday: function() {
		var mondayDate = moment();
		while (mondayDate.day() != 1) {
			mondayDate.subtract(1, "day");
		}
		this.setState({
			monday: mondayDate
		}, function() {
			this.loadCurrentWeek();
		});
	},
	jumpWeek: function(amount) {
		var newDate = moment(this.state.monday);
		newDate.add(amount, "week"); 
		this.setState({
			monday: newDate
		}, function() {
			this.loadCurrentWeek();
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

		var fridayIndex = (state.loadingWeek ? -1 : state.weekInfo.friday.index);

		var dayHeaders = [];
		var dayContents = [];
		var names = [ "Monday", "Tuesday", "Wednesday", "Thursday", (fridayIndex > 0 ? "Friday " + fridayIndex : "Friday"), "Saturday", "Sunday" ];

		var currentDay = moment(state.monday);

		var sortedEvents = [
			[], [], [], [], [], [], []
		];

		if (!state.loadingWeek) {
			state.weekInfo.events.map(function(e){
				var newEvent = e;
				newEvent.type = "event";
				return newEvent;
			}).concat(state.weekInfo.hwEvents.map(function(e){
				var newEvent = e;
				newEvent.type = "homework";
				return newEvent;
			})).forEach(function(calendarEvent) {
				var start = moment.unix(calendarEvent.start);
				var dow = start.isoWeekday() - 1;
				sortedEvents[dow].push(calendarEvent);
			});
		}

		var earliestEvent = 1440;
		var latestEvent = 0;

		var allGroupsForDays = {};

		for (var dayNumber = 0; dayNumber < 7; dayNumber++) {
			// create list of all events
			var allEvents = [];

			if (!state.loadingWeek) {
				var scheduleEvents = state.weekInfo.scheduleEvents && state.weekInfo.scheduleEvents[dayNumber];
				if (!scheduleEvents) {
					scheduleEvents = [];
				}
				scheduleEvents.forEach(function(event) {
					event.type = "schedule";
					allEvents.push(event);
				});

				allEvents = allEvents.concat(sortedEvents[dayNumber]);
			}

			// group events that occur at same time
			var groupsForDay = [];
			allEvents = allEvents.map(function(eventItem) {
				var isScheduleItem = (eventItem.type == "schedule"); 
				eventItem.groupInfo = {
					dayStart: (isScheduleItem ? moment.unix(0).utc() : moment.unix(eventItem.start).startOf("day").utc()),
					start: moment.unix(eventItem.start).utc(),
					end: moment.unix(eventItem.end).utc(),
				};
				eventItem.groupInfo.offset = eventItem.groupInfo.start.diff(eventItem.groupInfo.dayStart, "minutes");
				eventItem.groupInfo.durationInMinutes = eventItem.groupInfo.end.diff(eventItem.groupInfo.start, "minutes");
				eventItem.groupInfo.height = (eventItem.groupInfo.durationInMinutes < 10 ? 10: eventItem.groupInfo.durationInMinutes);
				eventItem.groupInfo.endOffset = eventItem.groupInfo.offset + eventItem.groupInfo.durationInMinutes;
				eventItem.groupInfo.endOffsetHeight = eventItem.groupInfo.offset + eventItem.groupInfo.height;
				return eventItem;
			});
			allEvents.forEach(function(eventItem, eventItemIndex) {
				// if the earliest time we've found so far is after this
				if (earliestEvent > eventItem.groupInfo.offset) {
					// update the earliest event
					earliestEvent = eventItem.groupInfo.offset;
				}

				// if the latest time we've found so far is before this
				if (latestEvent < eventItem.groupInfo.endOffset) {
					// update the latest event
					latestEvent = eventItem.groupInfo.endOffset;
				}

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

			allGroupsForDays[dayNumber] = groupsForDay;
		}
		
		var height = latestEvent - earliestEvent;
	
		for (var dayNumber = 0; dayNumber < 7; dayNumber++) {
			// make the elements
			var eventElements = [];
			allGroupsForDays[dayNumber].forEach(function(eventGroup) {
				eventGroup.forEach(function(eventItem, eventGroupIndex) {
					eventElements.push(h(DaltonTab.Components.Calendar.CalendarEvent, {
						event: eventItem,
						type: eventItem.type,
						groupIndex: eventGroupIndex,
						groupLength: eventGroup.length,
						earliestEvent: earliestEvent
					}));
				});
			});

			dayHeaders.push(h("div", { class: "calendarDayHeader" }, names[dayNumber] + " " + currentDay.format("M/D")));
			dayContents.push(h("div", { class: "calendarDayContents day" + dayNumber, style: "height: " + height + "px" }, eventElements));
			
			currentDay.add(1, "day");
		}

		return (
			h("div", { class: "calendarSection" }, 
				h("div", { class: "calendarHeader row" },
					h("div", { class: "col-md-6 calendarHeaderLeft" },
						"Week of " + state.monday.format("MMMM D, YYYY"),
						h("span", { class: "calendarHeaderLoading" }, (state.loadingWeek ? " Loading week, please wait...": ""))
					),
					h("div", { class: "col-md-6 calendarHeaderRight" }, 
						h("button", { class: "btn btn-default", onClick: this.jumpWeek.bind(this, -1) }, h("i", { class: "fa fa-chevron-left" })),
						h("button", { class: "btn btn-default", onClick: this.jumpToday.bind(this) }, "Today"),
						h("button", { class: "btn btn-default", onClick: this.jumpWeek.bind(this, 1) }, h("i", { class: "fa fa-chevron-right" })),
					)
				),
				h("div", { class: "calendarWeek" }, dayHeaders),
				h("div", { class: "calendarViewport", style: "height: " + height + "px" },
					h("div", { class: "calendarWeek" }, dayContents)
				)
			)
		);
	}
});