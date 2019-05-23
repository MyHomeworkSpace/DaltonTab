import "sections/calendar/CalendarEvent.styl";

import { h, Component } from "preact";
import moment from "moment";

import consts from "consts.js";
import mhs from "mhs.js";

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

		if (props.event.tags[consts.EVENT_TAG_CLASS_ID]) {
			var displayNameSectionless = displayName.replace(/ -(.*)\(.*\)/g, "");
			displayName = displayNameSectionless.trim();
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

		var displayNameSecondPart = displayName.split(" ");
		displayNameSecondPart.shift();

		return <div
			class="calendarEvent"
			style={`top: ${offset - props.earliestEvent}px; left:${groupWidth * props.groupIndex}%; width: ${groupWidth}%; height: ${height}px;`}
		>
			{(props.event.source == -1 && props.event.tags["1"] != "") ?
				<div class="calendarEventName" title={displayName}>
					<span
						style={
							`background-color: #${mhs.matchPrefix(displayName.split(" ")[0]).background};
							color: #${mhs.matchPrefix(displayName.split(" ")[0]).color}`}
					>{displayName.split(" ")[0]}</span>{" " + displayNameSecondPart.join(" ")}
				</div> :
				<div class="calendarEventName" title={displayName}>{displayName}</div>

			}
			<div class="calendarEventTime" title={timeDisplay}>{timeDisplay}</div>
		</div>;
	}
};