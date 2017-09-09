DaltonTab.Components.Settings.AccountPane = c({
	componentDidMount: function() {
		var that = this;
		chrome.storage.sync.get("mhsToken", function(storage) {
			var token = storage["mhsToken"] || "";
			that.setState({
				token: token
			}, function() {
				MyHomeworkSpace.get(token, "auth/me", {}, function(data) {
					if (data.status == "ok") {
						that.setState({
							loaded: true,
							loggedIn: true,
							user: data
						});
					} else {
						that.setState({
							loaded: true,
							loggedIn: false
						});
					}
				});
			});
		})
	},

	connect: function() {
		window.location.href = MyHomeworkSpace.getAuthURL();
	},

	render: function(props, state) {
		if (!state.loaded) {
			return h("div", {}, "Loading, please wait...");
		}

		var details;
		if (state.loggedIn) {
			details = h("div", {},
				"Connected to MyHomeworkSpace as ",
				h("strong", {}, state.user.name),
				"."
			);
		} else {
			details = h("div", {},
				h("p", {}, "You haven't connected your MyHomeworkSpace account! Connecting your MyHomeworkSpace account lets DaltonTab access your classes, schedule, and homework."),
				h("button", { class: "btn btn-primary", onClick: this.connect.bind(this) },
					h("i", { class: "fa fa-plug" }, ""), " Connect account"
				)
			);
		}
		
		return (
			h("div", {},
				h("h3", {}, "Connected accounts"),
				details
			)
		);
	}
});