import { h, Component } from "preact";

export default class TransitListItem extends Component {
	render(props, state) {
		return <div class="transitListItem">
			<span class="transitListItemName" style={`background-color: ${props.color}`}>
				{props.data.name}
			</span>
			<span class="transitListItemStatus">{props.data.status.toLowerCase()}</span>
		</div>;
	}
};