import "sections/todo/Todo.styl";

import { h, Component } from "preact";

import TodoListItem from "sections/todo/TodoListItem.jsx";

import Loading from "ui/Loading.jsx";

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

	toggleItem(i) {
		var that = this;
		var data = this.state.data;
		data[i].done = !data[i].done;
		chrome.storage.sync.set({
			todoList: data
		}, function() {
			that.setState({
				data: data
			});
		});
	}

	deleteItem(i) {
		var that = this;
		var data = this.state.data;
		data.splice(i, 1);
		chrome.storage.sync.set({
			todoList: data
		}, function() {
			that.setState({
				data: data
			});
		});
	}

	render(props, state) {
		if (state.loading) {
			return <Loading section="Todo List" />;
		}
		var that = this;
		return <div class="todoSection">
			<form class="addItem" onSubmit={this.handleSubmit.bind(this)}>
				<div class="input-group">
					<input type="text" class="form-control" value={state.newName} placeholder="Add an item" onChange={this.handleChange.bind(this)} required />
					<span class="input-group-btn">
						<input type="submit" class="btn btn-default" value="Add" />
					</span>
				</div>
			</form>
			{state.data.length == 0 && <div class="todoListEmpty">
				<h3>Your todo list is empty.</h3>
				<p class="lead">Add some items using the field above.</p>
			</div>}
			{state.data.map(function(listItem, i) {
				return <TodoListItem
					done={listItem.done}
					toggleItem={that.toggleItem.bind(that, i)}
					deleteItem={that.deleteItem.bind(that, i)}
					name={listItem.name}
				/>;
			})}
		</div>;
	}
}