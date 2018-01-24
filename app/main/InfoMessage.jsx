import "main/InfoMessage.styl";

import { h, Component } from "preact";

import analytics from "analytics.js";
import image from "image.js";

export default class InfoMessage extends Component {
	clickMessage() {
		var message = this.props.message;
		if (message.type == "url") {
			window.location.href = message.url;
		} else if (message.type == "eoy") {
			this.props.openModal("endOfYear");
			setTimeout(function() {
				document.querySelector(".eoy-email-input").focus();
			}, 500);
		} else {
			if (message.url) {
				// fallback url
				window.location.href = message.url;
			} else {
				alert("To view this message, please update DaltonTab.");
			}
		}
	}

	render(props, state) {
		var backgrounds = image.getInfoBackgrounds();
		return <div>
			<div class="infoMessage" style={`background-color: ${backgrounds.hover}`} onClick={this.clickMessage.bind(this)}>
				<div class="infoMessageHackyHoverWrapper" style={`background-color: ${backgrounds.normal}`}>
					<div class="infoMessageHeader"><i class={`fa ${props.message.icon}`} /> {props.message.header}</div>
					<div class="infoMessageSubtext">{props.message.subtext}</div>
				</div>
			</div>
			<div class="infoMessageLinks" style={`background-color: ${backgrounds.normal}`}>
				{props.message.canDismiss && <div>
					<a href="#" onClick={this.props.dismissMessage}>dismiss message</a>
				</div>}
			</div>
		</div>;
	}
};