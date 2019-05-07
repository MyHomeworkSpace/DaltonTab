import "ui/Loading.styl"
import { h, Component } from "preact";

export default class Loading extends Component {
    render(props, state) {
        return <div class="loading">
            <h3><i class="fa fa-spin fa-refresh"></i> Loading {props.section}</h3>
        </div>
    }
}