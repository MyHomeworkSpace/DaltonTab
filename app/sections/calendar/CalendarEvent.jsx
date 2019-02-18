import "sections/calendar/CalendarEvent.styl";

import { h, Component } from "preact";
import moment from "moment";

import consts from "consts.js";

export default class CalendarEvent extends Component {
	render(props, state) {		
		var dayStart = moment.unix(props.event.start).startOf("day");

		var start = moment.unix(props.event.start);
		var end = moment.unix(props.event.end);

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var displayName = (props.event.type == consts.EVENT_TYPE_HOMEWORK ? props.event.data.homework.name : props.event.name);

		if (props.event.type == consts.EVENT_TYPE_SCHEDULE) {
			var displayNameSectionless = displayName.replace(/ -(.*)\(.*\)/g, "");
			displayName = displayNameSectionless.trim();
		}

		var groupWidth = 100 / props.groupLength;
		var height = durationInMinutes;
		if (height < 10) {
			height = 10;
		}

		var timeDisplay = startDisplay + " to " + endDisplay;
		if (props.event.type == consts.EVENT_TYPE_SCHEDULE) {
			timeDisplay += " in " + props.event.data.roomNumber;
		}

		return <div
			class="calendarEvent"
			style={`top: ${offset-props.earliestEvent}px; left:${groupWidth*props.groupIndex}%; width: ${groupWidth}%; height: ${height}px;`}
		>
			<div class="calendarEventName" title={displayName}>{displayName}</div>
			<div class="calendarEventTime" title={timeDisplay}>{timeDisplay}</div>
		</div>;
	}
};