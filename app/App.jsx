import { h, Component } from "preact";

import sections from "sections.js";

import SectionContainer from "sections/SectionContainer.jsx";

const defaultOrder = ["myhomeworkspace", "schedule", "classes"];

export default class App extends Component {
	componentWillMount() {
		var that = this;
		chrome.storage.sync.get(["sections"], function(tabStorage) {
			var order = tabStorage.sections || defaultOrder;

			// create list of storage keys
			var storageKeys = ["mhsToken"];
			order.forEach(function(sectionName) {
				var section = sections[sectionName];
				storageKeys = storageKeys.concat(section.storage);
			});
			chrome.storage.sync.get(storageKeys, function(sectionStorage) {
				that.setState({
					loaded: true,
					order: order,
					storage: tabStorage,
					sectionStorage: sectionStorage
				});
			});
		});
	}

	render(props, state) {
		if (!state.loaded) {
			return <div></div>;
		}

		return <div>
			<SectionContainer sections={state.order} storage={state.sectionStorage} />
		</div>;
	}
};