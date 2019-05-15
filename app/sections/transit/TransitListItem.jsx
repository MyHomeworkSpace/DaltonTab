import { h, Component } from 'preact'

export default class Transit extends Component {
    render(props, state) {
        return <li key={props.key} class="service">
            <span class="service-name" style={`background-color: ${props.color}`}>
                {props.data.name}
            </span>
            {props.data.status.toLowerCase()}
        </li>
    }
}