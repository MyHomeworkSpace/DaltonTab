import { h, Component } from "preact";

import image from "image.js";
import sections from "sections.js";

import Section from "sections/Section.jsx";

export default class SectionContainer extends Component {
	render(props, state) {
		var sectionElements = props.sections.map(function(sectionName, sectionIndex) {
			var section = sections[sectionName];
			var background = image.getSectionBackground(sectionIndex, section.background);
			return <Section section={section} background={background} openModal={props.openModal} />;
		});
		return <div class="sectionContainer">
			<div id="sectionContainer"></div>
			{sectionElements}
		</div>;
	}
};