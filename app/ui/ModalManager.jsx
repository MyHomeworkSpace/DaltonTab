import "ui/ModalManager.styl";

import { h, Component } from "preact";

import WeatherModal from "sections/weather/WeatherModal.jsx";

import EndOfYearModal from "other/EndOfYearModal.jsx";

export default class ModalManager extends Component {
	closeModal() {
		this.props.openModal("", {});
	}

	render(props, state) {
		var modal;

		if (props.modalName == "endOfYear") {
			modal = <EndOfYearModal modalState={props.modalState} openModal={props.openModal} />;
		} else if (props.modalName == "weather") {
			modal = <WeatherModal modalState={props.modalState} openModal={props.openModal} />;
		}

		return <div>
			{modal && <div class="modalOverlay" onClick={this.closeModal.bind(this)}></div>}
			{modal}
		</div>;
	}
};