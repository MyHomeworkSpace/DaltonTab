import { h, Component } from "preact";

export default class LunchMenu extends Component {
	componentDidMount() {
		var that = this;
		$.get("https://daltontabservices.myhomework.space/v1/lunch.php", function(data) {
			console.log(data);
			console.log(data["meal periods"][0]);
			that.setState({
				menu: data["meal periods"][0]["menu items"]
			});
		});
	}

	render(props, state) {
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