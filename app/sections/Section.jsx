import "sections/Section.styl";

import { h, Component } from "preact";

export default class Section extends Component {
	render(props, state) {
		var SectionComponent = props.section.component;
		return <div class="section container-fluid" style={`background-color: ${props.background}`}>
			<div class="sectionTitle"><i class={`fa ${props.section.icon}`} />{props.section.name}</div>
			<SectionComponent openModal={props.openModal} storage={props.storage} />
		</div>;
	}
};