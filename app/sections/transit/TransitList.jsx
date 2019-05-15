import { h, Component } from 'preact'

import TransitListItem from 'sections/transit/TransitListItem.jsx'

export default class Transit extends Component {
    render(props, state) {
        return <ul>
            {props.data.map((element, i) => {
                let color = props.colors[element.name]
                return <TransitListItem data={element} key={i} color={color} />
            })}
        </ul>
    }
}