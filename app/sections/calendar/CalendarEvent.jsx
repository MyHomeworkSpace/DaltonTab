import "sections/calendar/CalendarEvent.styl";

import { h, Component } from "preact";
import moment from "moment";

import consts from "consts.js";
import mhs from "mhs.js";

import HomeworkName from "ui/HomeworkName.jsx";

export default class CalendarEvent extends Component {
	render(props, state) {
		var dayStart = moment.unix(props.event.start).startOf("day");

		var start = moment.unix(props.event.start);
		var end = moment.unix(props.event.end);

		var offset = start.diff(dayStart, "minutes");
		var durationInMinutes = end.diff(start, "minutes");

		var startDisplay = start.format("h:mm a");
		var endDisplay = end.format("h:mm a");

		var displayName = props.event.name;

		if (props.event.tags[consts.EVENT_TAG_SHORT_NAME]) {
			displayName = props.event.tags[consts.EVENT_TAG_SHORT_NAME];
		}

		var groupWidth = 100 / props.groupLength;
		var height = durationInMinutes;
		if (height < 10) {
			height = 10;
		}

		var timeDisplay = startDisplay + " to " + endDisplay;
		if (props.event.tags[consts.EVENT_TAG_ROOM_NUMBER]) {
			timeDisplay += " in " + props.event.tags[consts.EVENT_TAG_ROOM_NUMBER];
		}
		if (props.event.tags[consts.EVENT_TAG_LOCATION]) {
			timeDisplay += " at " + props.event.tags[consts.EVENT_TAG_LOCATION];
		}

		var cancelled = !!props.event.tags[consts.EVENT_TAG_CANCELLED];

		return <div
			class={`calendarEvent ${cancelled ? "calendarEventCancelled" : ""}`}
			style={`top: ${offset - props.earliestEvent}px; left:${groupWidth * props.groupIndex}%; width: ${groupWidth}%; height: ${height}px;`}
		>
			<div class="calendarEventName" title={displayName}>
				{props.event.tags[consts.EVENT_TAG_HOMEWORK] ? <HomeworkName name={displayName} /> : displayName}
			</div>
			<div class="calendarEventTime" title={timeDisplay}>
				{cancelled ? <span><i class="fa fa-fw fa-ban" /> cancelled</span> : timeDisplay}
			</div>
		</div>;
	}
};