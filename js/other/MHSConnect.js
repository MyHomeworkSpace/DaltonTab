DaltonTab.Components.Sections.MHSConnect = c({
	connect: function() {
		window.location.href = MyHomeworkSpace.getAuthURL();
	},

	render: function(props, state) {
		return h("div", {}, 
			h("h3", {}, "You haven't connected DaltonTab to MyHomeworkSpace!"),
			h("h4", {}, "We need access to your MyHomeworkSpace account so we can get your schedule, classes, and homework."),
			h("button", { class: "btn btn-primary btn-lg", onClick: this.connect.bind(this) }, "Connect")
		);
	}
});