import { h, Component } from "preact";

import Modal from "ui/Modal.jsx";

export default class EndOfYearModal extends Component {
	componentDidMount() {
		this.setState({
			error: "",
			email: "",
			loading: false
		});
	}

	close() {
		this.props.openModal("");
	}

	submit() {
		var that = this;

		if (this.state.email.trim() == "") {
			this.setState({
				error: "Please enter your Dalton username."
			});
			return;
		}

		var normalizedEmail = this.state.email;
		if (normalizedEmail.indexOf("@dalton.org") > -1) {
			// they wrote the @dalton.org in the textbox...
			normalizedEmail = normalizedEmail.replace("@dalton.org", "");
		}

		this.setState({
			loading: true,
			error: ""
		}, function() {
			DaltonTabBridge.default.analytics.getClientID(function(clientID) {
				$.post("https://daltontabservices.myhomework.space/v1/eoy/submitEmail.php", {
					clientID: clientID,
					email: normalizedEmail + "@dalton.org"
				}, function(data) {
					if (data.status == "ok") {
						that.setState({
							loading: false,
							done: true
						}, function() {
							$("#frontMessageContainer").addClass("hidden");
						});
					} else {
						that.setState({
							loading: false,
							error: data.error
						});
					}
				});
			});
		});
	}

	render(props, state) {
		if (state.done) {
			return <Modal title="Start of year reminder" openModal={props.openModal} class="endOfYearModal">
				<div class="modal-body">
					<p>Thanks for signing up! We'll email you at the start of the next school year, reminding you to download DaltonTab. If you'd like to cancel your reminder, please email c19as3@dalton.org.</p>
				</div>
				<div class="modal-footer">
					<button class="btn btn-default" onClick={this.close.bind(this)}>Close</button>
				</div>
			</Modal>;
		}

		return <Modal title="Start of year reminder" openModal={props.openModal} class="endOfYearModal">
			<div class="modal-body">
				{state.error && <div class="alert alert-danger">{state.error}</div>}
				<p>Sign up to receive a reminder email at the start of the next school year to download DaltonTab onto your new school laptop.</p>
				<div class="input-group">
					<input
						type="text"
						class="form-control eoy-email-input"
						placeholder="Dalton username"
						value={state.email || ""}
						disabled={!!state.loading}
						onChange={(function(e) {
							this.setState({
								email: e.target.value
							});
						}).bind(this)}
						onKeyup={(function(e) {
							if (e.keyCode == 13) {
								this.submit();
							}
						}).bind(this)}
					/>
					<div class="input-group-addon eoy-email-suffix">@dalton.org</div>
				</div>
				<p>We will only send one email, and your email address will not be used for any other purpose.</p>
			</div>
			<div class="modal-footer">
				{!state.loading && <button class="btn btn-default" onClick={this.close.bind(this)}>Close</button>}
				{!state.loading && <button class="btn btn-primary" onClick={this.submit.bind(this)}>Submit</button>}
				{state.loading && "Loading..."}
			</div>
		</Modal>;
	}
};