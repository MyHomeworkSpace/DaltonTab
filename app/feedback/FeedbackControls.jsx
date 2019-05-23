import "feedback/FeedbackControls.styl";

import { h, Component } from "preact";

export default class FeedbackControls extends Component {
	openFeedbackModal(type) {
		this.props.openModal("feedback", {
			type: type
		});
	}

	render(props, state) {
		return <div class="feedbackControls">
			<button class="btn btn-default" onClick={this.openFeedbackModal.bind(this, "smile")}><i class="fa fa-fw fa-smile-o" /></button>
			<button class="btn btn-default" onClick={this.openFeedbackModal.bind(this, "frown")}><i class="fa fa-fw fa-frown-o" /></button>
			<button class="btn btn-default" onClick={this.openFeedbackModal.bind(this, "idea")}><i class="fa fa-fw fa-lightbulb-o" /></button>
		</div>;
	}
};