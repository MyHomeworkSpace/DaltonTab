import "settings/LayoutSettings.styl";

import { h, Component } from "preact";

import sections from "sections.js";

import LayoutSection from "settings/LayoutSection.jsx";

export default class LayoutSettings extends Component {
	constructor() {
		super();
		this._bodyClick = this.onBodyClick.bind(this);
		this.state = {};
	}

	toggleAdd() {
		this.setState({
			addOpen: !this.state.addOpen
		}, function() {
			var body = document.querySelector("body");
			if (this.state.addOpen) {
				body.addEventListener("click", this._bodyClick);
			} else {
				body.removeEventListener("click", this._bodyClick);
			}
		});
	}

	addSection(sectionName) {
		var order = this.props.storage.sections || sections.defaultOrder;
		order.push(sectionName);
		this.props.updateStorage({
			sections: order
		});
	}

	onBodyClick(e) {
		if (e.target.parentElement && (e.target.className.indexOf("dropdown-toggle") > -1 || e.target.parentElement.className.indexOf("dropdown-toggle") > -1 || e.target.className.indexOf("caret") > -1)) {
			return false;
		}
		this.toggleAdd();
	}

	render(props, state) {
		var that = this;
		var order = props.storage.sections || sections.defaultOrder;

		return <div class="layoutSettings">
			<h4>
				<i class="fa fa-fw fa-th-large" /> Layout
				<div class={`dropdown ${state.addOpen ? "open" : ""}`}>
					<button class="btn btn-default btn-xs dropdown-toggle" type="button" onClick={this.toggleAdd.bind(this)}>
						<i class="fa fa-plus" /> add
						<span class="caret"></span>
					</button>
					<ul class="dropdown-menu">
						{Object.keys(sections).map(function(sectionName) {
							if (sectionName == "defaultOrder") {
								return;
							}
							if (order.indexOf(sectionName) > -1) {
								return;
							}
							var section = sections[sectionName];
							return <li onClick={that.addSection.bind(that, sectionName)}>
								<a href="#">
									<i class={`fa fa-fw ${section.icon}`} />
									{section.name}
								</a>
							</li>;
						})}
						{order.length == Object.keys(sections).length - 1 && <li><a>You've added all of the available sections!</a></li>}
					</ul>
				</div>
			</h4>
			{order.map(function(sectionName, i) {
				return <LayoutSection
					storage={props.storage} updateStorage={props.updateStorage} order={order}
					section={sections[sectionName]} index={i}
				/>;
			})}
		</div>;
	}
};