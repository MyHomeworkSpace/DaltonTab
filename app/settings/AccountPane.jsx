import { h, Component } from "preact";

export default class AccountPane extends Component {
	componentDidMount() {
		var that = this;
		chrome.storage.sync.get("mhsToken", function(storage) {
			var token = storage["mhsToken"] || "";
			that.setState({
				token: token
			}, function() {
				MyHomeworkSpace.get(token, "auth/me", {}, function(data) {
					if (data.status == "ok") {
						that.setState({
							loaded: true,
							loggedIn: true,
							user: data
						});
					} else {
						that.setState({
							loaded: true,
							loggedIn: false
						});
					}
				});
			});
		})
	}

	connect() {
		window.location.href = MyHomeworkSpace.getAuthURL();
	}

	disconnect() {
		if (!confirm("Are you sure? You'll need to reconnect your account if you want to see your schedule, classes, and homework.")) {
			return;
		}
		this.setState({
			loaded: false
		}, function() {
			MyHomeworkSpace.post(this.state.token, "application/revokeSelf", {}, function(data) {
				window.location.reload();
			});
		});
	}

	render(props, state) {
		if (!state.loaded) {
			return <div>Loading, please wait...</div>;
		}

		var details;
		if (state.loggedIn) {
			details = <div>
				<div>
					Connected to MyHomeworkSpace as <strong>{state.user.name}</strong>.
				</div>
				<button class="btn btn-default btn-sm" onClick={this.disconnect.bind(this)}>Disconnect</button>
			</div>;
		} else {
			details = <div>
				<p>You haven't connected your MyHomeworkSpace account! Connecting your MyHomeworkSpace account lets DaltonTab access your classes, schedule, and homework.</p>
				<button class="btn btn-primary" onClick={this.connect.bind(this)}>
					<i class="fa fa-plug" /> Connect account
				</button>
			</div>;
		}
		
		return <div>
			<h3>Connected accounts</h3>
			{details}
		</div>;
	}
};