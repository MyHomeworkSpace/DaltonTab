import { h, Component } from "preact";

export default class SettingTimeInput extends Component {
    render(props, state) {
        var value = props.storage[props.storageKey];
        if (value === undefined || value == "") {
            value = props.defaultValue;
        }

        return (
            <label><input type="time" onChange={props.onChange} value={value} /> {props.label}</label>
        );
    }
};