import "main/Clock.styl";

import { h, Component } from "preact";
import moment from "moment";

export default class Clock extends Component {
	constructor() {
		super();
		this.state = {
			now: moment()
		};
	}

	componentWillMount() {
		this._timer = setInterval((function () {
			this.setState({
				now: moment()
			});
		}).bind(this), 1000);
	}

	componentWillUnmount() {
		clearInterval(this._timer);
	}

	render(props, state) {
		var timeText;
		var dayStartString = !props.dayStart || props.dayStart == "" ? "8:10" : props.dayStart;
		var dayEndString = !props.dayEnd || props.dayEnd == "" ? "8:10" : props.dayEnd;
		var dayStart = dayStartString.split(":");
		var dayEnd = dayEndString.split(":");
		var start = moment().set("hour", dayStart[0]).set("minute", dayStart[1]);
		var end = moment().set("hour", dayEnd[0]).set("minute", dayEnd[1]);

		var percent;
		if (start.diff(state.now, "hours") > 0) {
			// day hasn't started yet
			percent = 0;
		} else if (end.diff(state.now, "hours") < 0) {
			// day is over
			percent = 100;
		} else {
			var secondsToEnd = state.now.diff(start);
			var secondsTotal = end.diff(start);
			var percentUnrounded = Math.floor((secondsToEnd / secondsTotal) * 100);
			percent = Math.max(percentUnrounded, 0);
			if (percent > 100) {
				percent = 100
			} else if (percent < 0) {
				percent = 0
			}
		}

		if (props.type == "12hr" || props.type == "12hrnopm") {
			timeText = state.now.format("h:mm");
		} else if (props.type == "24hr") {
			timeText = state.now.format("k:mm");
		} else if (props.type == "percent") {
			timeText = percent + "%";
		}

		return <div>
			<div class="clock">
				<div class="clockTime">
					{timeText}
					{props.type == "12hr" && <div class="clockTimeAMPM">
						{state.now.format("A")}
					</div>}
				</div>
				{props.showDate && <div class="clockDate">{state.now.format("MMMM Do, YYYY")}</div>}
				{props.progressBar && <div class="progressBarContainer"><div class="progressBar" style={`width: ${percent}%`}></div></div>}
				{props.showPercent && <h4>{percent}%</h4>}
			</div>
		</div>;
	}
};