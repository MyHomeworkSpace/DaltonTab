import "sections/homework/Homework.styl";

import { h, Component } from "preact";
import moment from "moment";

import mhs from "mhs.js";

import MHSConnect from "other/MHSConnect.jsx";

import HomeworkColumn from "sections/homework/HomeworkColumn.jsx";

import Loading from "ui/Loading.jsx";

export default class Homework extends Component {
	componentDidMount() {
		var that = this;
		var token = this.props.storage.mhsToken || "";
		mhs.initPrefixes(token, function() {
			mhs.get(token, "classes/get", {}, function(classesData) {
				if (classesData.status != "ok") {
					that.setState({
						loaded: true,
						loggedIn: false
					});
					return;
				}
				mhs.get(token, "homework/getHWViewSorted", {
					showToday: true
				}, function(data) {
					if (data.status == "ok") {
						that.setState({
							loaded: true,
							loggedIn: true,
							classes: classesData.classes,
							homework: data
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
	}

	render(props, state) {
		if (!state.loaded) {
			return <Loading section="homework" />;
		}
		if (!state.loggedIn) {
			return <MHSConnect />;
		}

		return <div class="homeworkSection">
			{state.homework.overdue.length > 0 ? <HomeworkColumn classes={state.classes} title="Overdue" homework={state.homework.overdue} /> : undefined}
			{state.homework.showToday > 0 ? <HomeworkColumn classes={state.classes} title="Today" homework={state.homework.today} /> : undefined}
			<HomeworkColumn classes={state.classes} title={state.homework.tomorrowName} homework={state.homework.tomorrow} />
			<HomeworkColumn classes={state.classes} title="Soon" homework={state.homework.soon} />
			<HomeworkColumn classes={state.classes} title="Long-term" homework={state.homework.longterm} />
		</div>;
	}
};