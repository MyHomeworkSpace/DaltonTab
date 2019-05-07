import "sections/classes/Classes.styl";

import { h, Component } from "preact";

import mhs from "mhs.js";

import MHSConnect from "other/MHSConnect.jsx";
import Loading from "ui/Loading.jsx"

export default class Classes extends Component {
	componentDidMount() {
		var that = this;
		var token = this.props.storage.mhsToken || "";
		mhs.get(token, "calendar/getStatus", {}, function (statusData) {
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
			mhs.get(token, "calendar/getClasses", {}, function (data) {
				that.setState({
					loaded: true,
					loggedIn: true,
					calendarEnabled: true,
					classes: data.classes
				});
			});
		});
	}

	render(props, state) {
		if (!state.loaded) {
			return <Loading section="classes" />
		}
		if (!state.loggedIn) {
			return <MHSConnect />;
		}
		if (!state.calendarEnabled) {
			return <MHSConnect type="calendar" />;
		}

		var classItems = state.classes.map(function (classItem) {
			var linkURL = "https://dalton.myschoolapp.com/app/student#academicclass/" + classItem.sectionId + "/0/bulletinboard";
			return <div class="classesSectionItem">
				<a href={linkURL}>
					<div class="classesSectionItemName">{classItem.name}</div>
					<div class="classesSectionOwnerName">{classItem.ownerName}</div>
				</a>
			</div>;
		});

		return (
			<div class="classesSection">{classItems}</div>
		);
	}
};