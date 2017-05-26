DaltonTab.Components.Sections.LunchMenu = c({
	componentDidMount: function() {
		var that = this;
		$.get("https://daltontabservices.myhomework.space/v1/lunch.php", function(data) {
			console.log(data);
			console.log(data["meal periods"][0]);
			that.setState({
				menu: data["meal periods"][0]["menu items"]
			});
		});
	},
	render: function(props, state) {
		if (!state.menu) {
			return (
				h("div", {}, "Loading, please wait...")
			);
		}
		var that = this;
		var menuItems = state.menu.map(function(item) {
			return h("div", {}, item.name);
		});
		return (
			h("div", {}, menuItems)
		);
	}
});