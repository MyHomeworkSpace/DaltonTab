import "ui/IconButton.styl";

import { h, Component } from "preact";

export default class IconButton extends Component {
	click() {
		if (this.props.onClick) {
			this.props.onClick();
		}
	}

	render(props, state) {
		return <a href={props.href} onClick={this.click.bind(this)} class={`iconButton ${props.class || ""}`}>
			<i class={`fa ${props.icon}`} />
		</a>;
	}
};