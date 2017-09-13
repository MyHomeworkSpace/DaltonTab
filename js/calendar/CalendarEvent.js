DaltonTab.Components.Calendar.CalendarEvent = c({
	render: function(props, state) {
		var isScheduleItem = (props.type == "schedule");
		
		var dayStart = moment.unix(props.event.start).startOf("day");
		if (isScheduleItem) {
			dayStart = moment.unix(0).utc();
		}

		var start = moment.unix(props.event.start);
		var end = moment.unix(props.event.end);
		if (isScheduleItem) {
			start = start.utc();
			end = end.utc();
		}

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var displayName = (props.type == "homework" ? props.event.homework.name : props.event.name);

		if (isScheduleItem) {
			var displayNameSectionless = displayName.replace(/ -(.*)\(.*\)/g, "");
			displayName = displayNameSectionless.trim();
		}

		var groupWidth = 100 / props.groupLength;
		var height = durationInMinutes;
		if (height < 10) {
			height = 10;
		}

		var timeDisplay = startDisplay + " to " + endDisplay;
		if (props.type == "schedule") {
			timeDisplay += " in " + props.event.roomNumber;
		}

		return h("div", {
			class: "calendarEvent",
			style: `top: ${offset}px; left:${groupWidth*props.groupIndex}%; width: ${groupWidth}%; height: ${height}px;`
		},
			h("div", { class: "calendarEventName", title: displayName }, displayName),
			h("div", { class: "calendarEventTime", title: timeDisplay }, timeDisplay),
		);
	}
});