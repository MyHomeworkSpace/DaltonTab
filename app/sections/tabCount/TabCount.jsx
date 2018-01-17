import "sections/tabCount/TabCount.styl";

import { h, Component } from "preact";

export default class TabCount extends Component {
	componentDidMount() {
		var that = this;
		chrome.storage.sync.get("tabCount", function(response) {
			that.setState({
				tabCount: response.tabCount
			});
		});
	}

	render(props, state) {
		return <div class="tabCount">
			<h1>{state.tabCount ? state.tabCount : "Error"}</h1>
			<h2>{state.tabCount == 1 ? "tab": "tabs"} opened today</h2>
		</div>;
	}
};