import { h, Component } from "preact";

import TransitListItem from "sections/transit/TransitListItem.jsx";

export default class TransitList extends Component {
	render(props, state) {
		return <ul>
			{props.data.map(function(element, i) {
				var color = props.colors[element.name];
				return <TransitListItem data={element} key={i} color={color} />;
			})}
		</ul>;
	}
};