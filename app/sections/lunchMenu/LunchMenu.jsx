import { h, Component } from "preact";

import ajax from "ajax.js";

export default class LunchMenu extends Component {
	componentDidMount() {
		var that = this;
		ajax.request("GET", "https://daltontabservices.myhomework.space/v1/lunch.php", {}, function(data) {
			if (!data) {
				that.setState({
					noLunch: true
				});
			} else {
				that.setState({
					menu: data["meal periods"][0]["menu items"]
				});
			}
		});
	}

	render(props, state) {
		if (state.noLunch) {
			return <div>There's no lunch today.</div>;
		}
		if (!state.menu) {
			return <div>Loading, please wait...</div>;
		}
		var that = this;
		var menuItems = state.menu.map(function(item) {
			return <div>{item.name}</div>;
		});
		return <div>{menuItems}</div>;
	}
};