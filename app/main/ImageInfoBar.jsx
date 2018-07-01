import "main/ImageInfoBar.styl";

import { h, Component } from "preact";

export default class ImageInfoBar extends Component {
	render(props, state) {
		return <div class={`imageInfoBar ${props.scrolled ? "scrolled" : ""}`}>
			<div class="imageInfo">
				{props.loading && <div class="imageDesc smallText">
					<i class="fa fa-refresh fa-spin" /> loading image...
				</div>}
				{props.error && <div class="imageDesc smallText">
					<i class="fa fa-exclamation-triangle" /> couldn't get image!
				</div>}
				{!props.loading && !props.error && props.image.description && <div class="imageDesc">
					{props.image.description}
				</div>}
				{!props.loading && !props.error && <div class="imageSubDesc">Photo by <a href={props.image.authorUrl}>{props.image.authorName}</a> from <a href={props.image.siteUrl}>{props.image.siteName}</a></div>}
			</div>
		</div>;
	}
};