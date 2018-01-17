import "other/MHSConnect.styl";

import { h, Component } from "preact";

export default class MHSConnect extends Component {
	connect() {
		if (this.props.type == "calendar") {
			window.location.href = "https://myhomework.space/app.html#!calendar";
		} else {
			window.location.href = MyHomeworkSpace.getAuthURL();
		}
	}

	render(props, state) {
		var title = "You haven't connected DaltonTab to MyHomeworkSpace!";
		var subtitle = "We need access to your MyHomeworkSpace account so we can get your schedule, classes, and homework.";
		var button = "Connect";

		if (props.type == "calendar") {
			title = "Enable calendar";
			subtitle = "To get your classes and schedule, you'll have to enable the Calendar feature on MyHomeworkSpace.";
			button = "Enable";
		}

		return <div class="mhsConnect">
			<h3>{title}</h3>
			<h4>{subtitle}</h4>
			<button class="btn btn-primary btn-lg" onClick={this.connect.bind(this)}>{button}</button>
		</div>;
	}
}