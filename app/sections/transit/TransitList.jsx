import { h, Component } from "preact";

import TransitListItem from "sections/transit/TransitListItem.jsx";

export default class TransitList extends Component {
	render(props, state) {
		return <div>
			{props.data.map(function(element) {
				var color = props.colors[element.name];
				return <TransitListItem data={element} color={color} />;
			})}
		</div>;
	}
};