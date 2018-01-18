import "ui/IconButton.styl";

import { h, Component } from "preact";
import Scrollchor from 'react-scrollchor';

export default class IconButton extends Component {
	click() {
		if (this.props.onClick) {
			this.props.onClick();
		}
	}

	render(props, state) {
		var icon = <i class={`fa ${props.icon}`} />;
		if (props.scroll) {
			return <Scrollchor to={props.href} className={`iconButton ${props.class || ""}`}>
				{icon}
			</Scrollchor>;
		} else {
			return <a href={props.href} onClick={this.click.bind(this)} class={`iconButton ${props.class || ""}`}>
				{icon}
			</a>;
		}
	}
};