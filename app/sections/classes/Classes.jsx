import "sections/classes/Classes.styl";

import { h, Component } from "preact";

export default class Classes extends Component {
	render(props, state) {
		return <div class="classesSection">
			<div>Unfortunately, the Classes section is no longer available.</div>
			<div>You can remove this section by clicking the <i class="fa fa-fw fa-gear" /> in the top right and then pressing the <i class="fa fa-fw fa-trash" /> next to "Classes".</div>
		</div>;
	}
};