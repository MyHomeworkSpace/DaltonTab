import "sections/homework/HomeworkColumn.styl";

import { h, Component } from "preact";
import moment from "moment";

import mhs from "mhs.js";

export default class HomeworkColumn extends Component {
	render(props, state) {
		var homework = [];

		props.homework.forEach(function(hw) {
			var nameParts = hw.name.split(" ");
			
			var prefix = nameParts[0];
			var notPrefix = nameParts.slice(1).join(" ");

			var prefixInfo = mhs.matchPrefix(prefix);

			var due = moment(hw.due);
			var dueText = due.calendar().split(" at ")[0];
			var daysTo = Math.ceil(due.diff(moment()) / 1000 / 60 / 60 / 24);
			var late = (daysTo < 1);

			if (dueText.indexOf(" ") > -1) {
				dueText = dueText[0].toLowerCase() + dueText.substr(1);
			}

			var keyword = "due ";
			if (prefix.toLowerCase() == "test" || prefix.toLowerCase() == "exam" || prefix.toLowerCase() == "midterm" || prefix.toLowerCase() == "quiz" || prefix.toLowerCase() == "ica" || prefix.toLowerCase() == "lab") {
				keyword = "on ";
			}
	
			if (keyword == "on " && (dueText.toLowerCase() == "tomorrow" || dueText.substr(0, 4) == "last" || dueText.substr(0, 4) == "next")) {
				keyword = "";
			}

			var classObject;
			for (var classIndex in props.classes) {
				if (props.classes[classIndex].id == hw.classId) {
					classObject = props.classes[classIndex];
				}
			}

			var element = <div class={"homeworkColumnItem " + (late ? "homeworkColumnItemLate " : "") + (hw.complete ? "homeworkColumnItemDone" : "")}>
				<div class="homeworkColumnItemName">
					<span style={"background-color:#" + prefixInfo.background + ";color:#" + prefixInfo.color}>{prefix}</span> {" " + notPrefix}
				</div>
				<div>{keyword + dueText + " in " + classObject.name}</div>
			</div>;
			homework.push(element);
		});

		return <div class="homeworkColumn">
			<div class="homeworkColumnTitle">{props.title}</div>
			<div class="homeworkColumnItems">{homework}</div>
		</div>;
	}
};