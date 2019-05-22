import "sections/todo/TodoListItem.styl";

import { h, Component } from "preact";

export default class TodoListItem extends Component {
	render(props, state) {
		return <div class="todo-list-item">
			<label class={props.done ? "done" : ""}>
				<input type="checkbox" checked={props.done} onChange={props.toggleItem} />
				<span class={props.done ? "todo-list-item-done" : ""}>{" " + props.name}</span>
			</label>
			<a class="delete-item" onClick={props.deleteItem}><i class="fa fa-trash"></i></a>
		</div>;
	}
}