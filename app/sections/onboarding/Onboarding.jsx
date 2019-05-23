import "sections/onboarding/Onboarding.styl";

import { h, Component } from "preact";

export default class Onboarding extends Component {
	render(props, state) {
		return <div class="onboarding">
			<h1>Welcome to DaltonTab!</h1>
			<p class="lead intro-text">We're glad you're here.</p>
			<div class="row features">
				<div class="col-md-4 feature">
					<h2 class="feature-name">Customize</h2>
					<p>Customize DaltonTab to your liking by changing settings. To access settings,
                        use the <i class="fa fa-cog"></i> button in the upper right-hand corner of
                        the screen. From there, you can customize different aspects of DaltonTab,
                        such as your preferred clock style.</p>
				</div>
				<div class="col-md-4 feature">
					<h2 class="feature-name">Accessorize</h2>
					<p>DaltonTab is made up of sections, each of which can be removed and ordered.
                        To add or remove sections, open settings by clicking the
					<i class="fa fa-cog"></i> button in the upper right-hand corner of the screen.
                        From there, you can use the <i class="fa fa-th-large"></i> Layout settings to
                        add or remove settings according to your liking.
					</p>
				</div>
				<div class="col-md-4 feature">
					<h2 class="feature-name">Explore</h2>
					<p>To remove this "Getting Started" section, open settigns by clicking the
						<i class="fa fa-cog"></i> button in the upper right-hand corner of the screen.
                        From there, click the <i class="fa fa-trash"></i> button next to "Getting Started."
                        If you have any questions, concerns, or feedback, feel free to reach out to us at
						<a href="mailto:hello@myhomework.space" class="link">hello@myhomework.space</a>.
					</p>
				</div>
			</div>
		</div>;
	}
};