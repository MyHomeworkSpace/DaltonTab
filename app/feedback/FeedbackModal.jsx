import "feedback/FeedbackModal.styl";

import { h, Component } from "preact";
import linkState from "linkstate";

import Modal from "ui/Modal.jsx";

import ajax from "ajax.js";
import analytics from "analytics.js";

export default class FeedbackModal extends Component {
	close() {
		this.props.openModal("");
	}

	submit() {
		var that = this;

		if (!this.state.message || this.state.message.trim() == "") {
			this.setState({
				error: "You must enter a message."
			});
			return;
		}

		var feedbackType = this.props.modalState.type;
		var feedbackMessage = this.state.message;

		this.setState({
			loading: true
		}, function() {
			analytics.getClientID(function(clientID) {
				var version = chrome.runtime.getManifest().version;
				var metadata = {
					clientID: clientID
				};
				ajax.request("POST", "https://daltontabservices.myhomework.space/v1/submitFeedback.php", {
					type: feedbackType,
					message: feedbackMessage,
					version: version,
					metadata: JSON.stringify(metadata)
				}, function(response) {
					if (response.status == "ok") {
						that.setState({
							loading: false,
							done: true
						});
					} else {
						that.setState({
							error: "An unexpected error occurred. Try again later.",
							loading: false
						});
					}
				});
			});
		});
	}

	render(props, state) {
		if (state.done) {
			return <Modal title="Thanks!" openModal={props.openModal}>
				<div class="modal-body">
					<p>Thanks for the feedback!</p>
				</div>
				<div class="modal-footer">
					<button class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
				</div>
			</Modal>;
		}

		var feedbackType = props.modalState.type;

		var desc = "Liked a feature? Found something helpful? Tell us what you like! We'd love to hear it, and your feedback helps us make even better things in the future!";
		if (feedbackType == "frown") {
			desc = "Annoyed by something? Found a glitch? Hate how something works? Tell us! We'd love to help you and improve DaltonTab.";
		} else if (feedbackType == "idea") {
			desc = "Have an idea for a new feature? Something that helps you? A tweak to make your life easier? Tell us! We'd love to include it and make DaltonTab even better!";
		}

		return <Modal title={`Send a${feedbackType == "idea" ? "n": ""} ${feedbackType}`} class="feedbackModal" openModal={props.openModal}>
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}
				<p>{desc}</p>
				<textarea class="form-control" disabled={state.loading} placeholder="Write your message here..." value={state.message} onChange={linkState(this, "message")} />
				<strong>The following information will be sent with your feedback:</strong>
				<ul>
					<li>Your DaltonTab version (<strong>{chrome.runtime.getManifest().version}</strong>)</li>
					<li>Your Chrome version</li>
					<li>Information about what services you've enabled and are signed into</li>
				</ul>
				<p>Thanks for the feedback! Click "Submit" to send it!</p>
			</div>
			<div class="modal-footer">
				{!state.loading && <button class="btn btn-default" onClick={this.close.bind(this)}>Close without submitting</button>}
				{!state.loading && <button class="btn btn-primary" onClick={this.submit.bind(this)}>Submit</button>}
				{state.loading && <span><i class="fa fa-circle-o-notch fa-spin" /> Loading...</span>}
			</div>
		</Modal>;
	}
};