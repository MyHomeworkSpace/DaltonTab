import { h, Component } from "preact";

import mhs from "mhs.js";

export default class AccountSettings extends Component {
	componentDidMount() {
		var that = this;
		mhs.get(this.props.tabStorage.mhsToken, "auth/me", {}, function(data) {
			if (data.status == "ok") {
				that.setState({
					loaded: true,
					loggedIn: true,
					user: data.user
				});
			} else {
				that.setState({
					loaded: true,
					loggedIn: false
				});
			}
		});
	}

	connect() {
		window.location.href = mhs.getAuthURL();
	}

	disconnect() {
		var that = this;

		if (!confirm("Are you sure? You'll need to reconnect your account if you want to see your schedule, classes, and homework.")) {
			return;
		}

		this.setState({
			loaded: false
		}, function() {
			mhs.post(that.props.tabStorage.mhsToken, "application/revokeSelf", {}, function(data) {
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
			{details}
		</div>;
	}
};