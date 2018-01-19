import "settings/LayoutSection.styl";

import { h, Component } from "preact";

export default class LayoutSection extends Component {
	move(offset) {
		var order = this.props.order;
		var i = this.props.index;
		
		var swapWith = i + offset;
		var temp = order[swapWith];
		order[swapWith] = order[i];
		order[i] = temp;

		this.props.updateStorage({
			sections: order
		});
	}

	delete() {
		var order = this.props.order;
		order.splice(this.props.index, 1);
		this.props.updateStorage({
			sections: order
		});
	}

	render(props, state) {
		return <div class="layoutSection">
			<div class="layoutSectionLabel">
				<i class={`fa fa-fw ${props.section.icon}`} /> {props.section.name}
			</div>
			<div class="layoutSectionControls">
				{props.index != 0 && <div class="layoutSectionButton" onClick={this.move.bind(this, -1)}><i class="fa fa-fw fa-arrow-up" /></div>}
				{props.index != props.order.length - 1 ? <div class="layoutSectionButton" onClick={this.move.bind(this, 1)}><i class="fa fa-fw fa-arrow-down" /></div> : <div class="layoutSectionSpacer"></div>}
				<div class="layoutSectionButton" onClick={this.delete.bind(this)}><i class="fa fa-fw fa-trash" /></div>
			</div>
		</div>;
	}
};