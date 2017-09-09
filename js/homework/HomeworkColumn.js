DaltonTab.Components.Sections.HomeworkColumn = c({
	render: function(props, state) {
		var homework = [];

		props.homework.forEach(function(hw) {
			var nameParts = hw.name.split(" ");
			
			var prefix = nameParts[0];
			var notPrefix = nameParts.slice(1).join(" ");

			var prefixInfo = MyHomeworkSpace.Prefixes.matchPrefix(prefix);

			var due = moment(hw.due);
			var dueText = due.calendar().split(" at ")[0];
			var daysTo = Math.ceil(due.diff(moment()) / 1000 / 60 / 60 / 24);
			var late = (daysTo < 1);

			if (dueText.indexOf(' ') > -1) {
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

			var element = h("div", { class: "homeworkColumnItem " + (late ? "homeworkColumnItemLate " : "")  + (state.complete == "1" ? "homeworkColumnItemDone" : "") }, 
				h("div", {}, h("span", { style: "background-color:" + prefixInfo.background + ";color:" + prefixInfo.color }, prefix), " " + notPrefix),
				h("div", {}, keyword + dueText + " in " + classObject.name)
			);
			homework.push(element);
		});

		return h("div", { class: "homeworkColumn" }, 
			h("div", { class: "homeworkColumnTitle" }, props.title),
			h("div", { class: "homeworkColumnItems" }, homework)
		);
	}
});