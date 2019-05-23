import "sections/todo/Todo.styl";

import { h, Component } from "preact";

import Loading from "ui/Loading.jsx";
import TodoListItem from "sections/todo/TodoListItem.jsx";

export default class Todo extends Component {
	constructor() {
		super();
		this.state = {
			loading: true,
			newName: ""
		};
	}

	componentWillReceiveProps(nextProps) {
		var list;
		if (!nextProps.storage.todoList) {
			list = [
				{
					name: "This is a todo list.",
					done: false
				},
				{
					name: "Check the box next to an item to mark it as done.",
					done: true
				},
				{
					name: "Click the trash can to delete an item.",
					done: false
				}
			];
		} else {
			list = nextProps.storage.todoList;
		}
		this.setState({
			data: list,
			loading: false
		});
	}

	handleChange(event) {
		this.setState({
			newName: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		var data = this.state.data;
		data.push({
			name: this.state.newName,
			done: false
		});
		var that = this;
		chrome.storage.sync.set({
			todoList: data
		}, function() {
			that.setState({
				data: data,
				newName: ""
			});
		});
	}

	render(props, state) {
		if (state.loading) {
			return <Loading section="Todo List" />;
		}
		var that = this;
		return <div class="todo-section">
			<form class="add-item" onSubmit={this.handleSubmit.bind(this)}>
				<div class="input-group">
					<input type="text" class="form-control" value={state.newName} placeholder="Add an item" onChange={this.handleChange.bind(this)} required />
					<span class="input-group-btn">
						<input type="submit" class="btn btn-default" value="Add!" />
					</span>
				</div>
			</form>
			{/* <pre>{JSON.stringify(state, " ", 4)}</pre> */}
			{state.data.map(function(listItem, i) {
				return <TodoListItem
					done={listItem.done}
					toggleItem={(() => {
						var data = state.data;
						data[i].done = !data[i].done;
						chrome.storage.sync.set({
							todoList: data
						}, function() {
							that.setState({
								data: data
							});
						});
					}).bind(this)}
					deleteItem={(() => {
						var data = state.data;
						data.splice(i, 1);
						chrome.storage.sync.set({
							todoList: data
						}, function() {
							that.setState({
								data: data
							});
						});
					}).bind(this)}
					name={listItem.name} />;
			})}
		</div>;
	}
}