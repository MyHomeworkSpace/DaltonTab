import { h, Component } from "preact";

export default class EndOfYearModal extends Component {
	componentDidMount() {
		this.setState({
			error: "",
			email: "",
			loading: false
		});
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
			return (
				h("div", { class: "modal-dialog", role: "document" },
					h("div", { class: "modal-content" },
						h("div", { class: "modal-header" },
							h("h4", { class: "modal-title" }, "Start of year reminder")
						),
						h("div", { class: "modal-body" },
							h("p", {}, "Thanks for signing up! We'll email you at the start of the next school year, reminding you to download DaltonTab. If you'd like to cancel your reminder, please email c19as3@dalton.org.")
						),
						h("div", { class: "modal-footer" },
							h("button", { type: "button", "data-dismiss": "modal", class: "btn btn-default" }, "Close")
						)
					)
				)
			);
		}

		return (
			h("div", { class: "modal-dialog", role: "document" },
				h("div", { class: "modal-content" },
					h("div", { class: "modal-header" },
						h("h4", { class: "modal-title" }, "Start of year reminder")
					),
					h("div", { class: "modal-body" },
						(state.error && h("div", { class: "alert alert-danger" }, state.error)),
						h("p", {}, "Sign up to receive a reminder email at the start of the next school year to download DaltonTab onto your new school laptop."),
						h("div", { class: "input-group"},
							h("input", {
								type: "text",
								class: "form-control eoy-email-input",
								placeholder: "Dalton username",
								value: state.email || "",
								disabled: !!state.loading,
								onChange: (function(e) {
									this.setState({
										email: e.target.value
									});
								}).bind(this),
								onKeyup: (function(e) {
									if (e.keyCode == 13) {
										this.submit();
									}
								}).bind(this)
							}),
							h("div", { class: "input-group-addon eoy-email-suffix" }, "@dalton.org")
						),
						h("p", {}, "We will only send one email, and your email address will not be used for any other purpose.")
					),
					h("div", { class: "modal-footer" },
						(!state.loading && h("button", { type: "button", "data-dismiss": "modal", class: "btn btn-default" }, "Close")),
						(!state.loading && h("button", { class: "btn btn-primary", onClick: this.submit.bind(this) }, "Submit")),
						(state.loading && "Loading...")
					)
				)
			)
		);
	}
};