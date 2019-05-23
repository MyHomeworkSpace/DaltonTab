import Articles from "sections/articles/Articles.jsx";
import Calendar from "sections/calendar/Calendar.jsx";
import Classes from "sections/classes/Classes.jsx";
import Homework from "sections/homework/Homework.jsx";
import LunchMenu from "sections/lunchMenu/LunchMenu.jsx";
import TabCount from "sections/tabCount/TabCount.jsx";
import Transit from "sections/transit/Transit.jsx";
import Weather from "sections/weather/Weather.jsx";
import Todo from "sections/todo/Todo.jsx";
import Onboarding from "sections/onboarding/Onboarding.jsx";

export default {
	defaultOrder: ["onboarding", "myhomeworkspace", "schedule", "weather"],
	myhomeworkspace: {
		name: "Homework",
		icon: "fa-file",
		description: "View your homework information from MyHomeworkSpace.",
		background: "rgba(60, 77, 99, 0.9)",
		storage: [],
		component: Homework
	},
	schedule: {
		name: "Calendar",
		icon: "fa-calendar",
		description: "View your calendar from MyHomeworkSpace.",
		background: "rgba(121, 70, 26, 0.9)",
		storage: [],
		component: Calendar
	},
	classes: {
		name: "Classes",
		icon: "fa-list",
		description: "View and access your classes.",
		background: "rgba(57, 146, 108, 0.9)",
		storage: [],
		component: Classes,
		hidden: true
	},
	weather: {
		name: "Weather",
		icon: "fa-sun-o",
		description: "View the current weather.",
		background: "rgba(14, 100, 18, 0.9)",
		storage: ["weather", "weatherUnits"],
		component: Weather
	},
	tabCount: {
		name: "Tab Count",
		icon: "fa-clone",
		description: "Count the number of tabs that you open in a day",
		background: "rgba(0, 140, 186, 0.9)",
		storage: [],
		component: TabCount
	},
	lunchMenu: {
		name: "Lunch Menu",
		icon: "fa-cutlery",
		description: "Displays the lunch menu for the day.",
		background: "rgba(0, 140, 186, 0.9)",
		storage: [],
		component: LunchMenu
	},
	articles: {
		name: "Articles",
		icon: "fa-newspaper-o",
		description: "Displays stories from Pocket",
		background: "rgba(0, 140, 186, 0.9)",
		storage: [],
		component: Articles
	},
	transit: {
		name: "Transit",
		icon: "fa-train",
		description: "Displays bus and train status from the MTA",
		background: "rgba(0, 140, 186, 0.9)",
		storage: [],
		component: Transit
	},
	todo: {
		name: "Todo List",
		icon: "fa-check-square-o",
		description: "Add tasks that you need to complete",
		background: "rgba(0, 140, 186, 0.9)",
		storage: ["todoList"],
		component: Todo
	},
	onboarding: {
		name: "Getting started",
		icon: "fa-smile-o",
		description: "Get started with DaltonTab",
		background: "rgba(0, 140, 186, 0.9)",
		storage: [],
		component: Onboarding,
		hidden: true
	}
};
