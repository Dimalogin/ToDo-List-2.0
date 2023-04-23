import { todoTemplate } from "./templates/TodoTemplate.js";
import { todoItemTemplate } from "./templates/TodoItemTemplate.js";
import { todoEmptyListTemplate } from "./templates/TodoEmptyListTemplate.js";
import { TodoModelState } from "./TodoModelState.js";
import { TodoModelTasks } from "./TodoModelTasks.js";

export class TodoView {
  #eventListeners = {
    handleEvent: (event) => {
      if (event.currentTarget === this.#form) {
        this.#onAddTask(event);
      } else if (event.currentTarget === this.#select) {
        const index = event.target.selectedIndex;
        const option = event.target.options[index];
        const valueOption = option.value;

        if (valueOption === "all-tasks") {
          this.#onUpdateState(valueOption);
        } else if (valueOption === "completed-tasks") {
          this.#onUpdateState(valueOption);
        } else if (valueOption === "uncompleted-tasks") {
          this.#onUpdateState(valueOption);
        }
      } else if (event.currentTarget === this.#list) {
        const target = event.target;
        const taskId = Number(target.closest(".task-item").dataset.taskId);

        if (target.matches(".task-item__toggle")) {
          this.#onToggleTask(taskId);
        }
        if (target.matches(".task-item__delete")) {
          this.#onDeleteTask(taskId);
        }
      } else if (event.currentTarget === this.#buttons) {
        const button = event.target;

        if (button.matches(".button-del-all")) {
          this.#onDeleteAllTasks();
        }
        if (button.matches(".button-del-completed")) {
          this.#onDeleteCompletedTasks();
        }
      }
    },
  };

  #form = null;
  #list = null;
  #modelState = null;
  #modelTasks = null;
  #select = null;
  #buttons = null;
  #tasks = [];

  constructor() {
    this.render();
  }

  // Render

  render() {
    this.#initTemplate();
    this.#initModels();
    this.#onState();
    this.#onCurrentState();
    this.#bindListeners();
  }

  // Initialization

  #initTemplate() {
    const body = document.body;
    let todoMainTemplate = document.createElement("template");
    todoMainTemplate.innerHTML = todoTemplate;
    const fullView = todoMainTemplate.content.cloneNode(true);

    this.#form = fullView.querySelector(".form-data");
    this.#select = fullView.querySelector(".state-filter");
    this.#list = fullView.querySelector(".list-tasks");
    this.#buttons = fullView.querySelector(".todo__buttons");

    body.innerHTML = "";
    body.appendChild(fullView);
  }

  #initModels() {
    this.#modelState = new TodoModelState();
    this.#modelTasks = new TodoModelTasks();
  }

  #bindListeners() {
    this.#form.addEventListener("submit", this.#eventListeners);
    this.#select.addEventListener("change", this.#eventListeners);
    this.#list.addEventListener("click", this.#eventListeners);
    this.#buttons.addEventListener("click", this.#eventListeners);
  }

  // State

  #onState() {
    this.#modelState.state();
  }

  #onCurrentState() {
    this.#modelState.currentState().then((object) => {
      this.#selectOption(object);
      this.#viewData(object.state);
    });
  }

  #selectOption(option) {
    const { state } = option;

    const options = Array.from(this.#select.children);
    options.forEach((element) => {
      if (element.value === state) {
        element.selected = true;
      }
    });
  }

  #onUpdateState(value) {
    this.#modelState.updateState(value).then((result) => {
      this.#viewData(result.state);
    });
  }

  #viewData(state) {
    if (state === "all-tasks") {
      this.#onGetAll();
    } else if (state === "completed-tasks") {
      this.#onGetComplited();
    } else if (state === "uncompleted-tasks") {
      this.#onGetUncomplited();
    }
  }

  // Tasks

  #onGetAll() {
    this.#modelTasks.getAll().then((tasks) => {
      this.#tasks = tasks;
      this.#onTriggerList(this.#tasks);
    });
  }

  #onGetComplited() {
    this.#modelTasks.getAll().then((tasks) => {
      this.#tasks = tasks.filter((task) => task.completed === true);
      this.#onTriggerList(this.#tasks);
    });
  }

  #onGetUncomplited() {
    this.#modelTasks.getAll().then((tasks) => {
      this.#tasks = tasks.filter((task) => task.completed === false);
      this.#onTriggerList(this.#tasks);
    });
  }

  #onAddTask(event) {
    event.preventDefault();

    const data = new FormData(this.#form);

    this.#modelTasks
      .add({
        completed: false,
        description: data.get("taskDescription"),
        date: new Date(data.get("taskDate")),
      })
      .then((task) => {
        this.#tasks = [...this.#tasks, task];
        this.#onTriggerList(this.#tasks);
      });

    this.#form.reset();
  }

  #onToggleTask(taskID) {
    this.#modelTasks.toggle(taskID).then((updatedTask) => {
      this.#tasks = this.#tasks.map((task) => {
        return task.id === taskID ? updatedTask : task;
      });
      this.#onTriggerList(this.#tasks);
    });
  }

  #onDeleteTask(taskID) {
    this.#modelTasks.remove(taskID).then(() => {
      this.#tasks = this.#tasks.filter((task) => task.id !== taskID);
      this.#onTriggerList(this.#tasks);
    });
  }

  #onDeleteAllTasks() {
    this.#modelTasks.removeAll().then(() => {
      this.#tasks = [];
      this.#onTriggerList(this.#tasks);
    });
  }

  #onDeleteCompletedTasks() {
    const completedTasks = this.#tasks.filter(
      (task) => task.completed === true
    );

    this.#modelTasks.removeCompleted(completedTasks).then(() => {
      this.#tasks = this.#tasks.filter((task) => task.completed === false);
      this.#onTriggerList(this.#tasks);
    });
  }

  #onTriggerList(listTasks) {
    if (listTasks.length === 0) {
      this.#onListEmpty();
    } else {
      this.#onListUpdate(listTasks);
    }
  }

  #onListUpdate(list) {
    let itemTemplate = document.createElement("template");
    itemTemplate.innerHTML = todoItemTemplate;

    const groupedList = this.#listToGroups(list);
    const fragment = document.createDocumentFragment();

    for (const items of groupedList) {
      const { id, completed, date, description } = items;
      const element = itemTemplate.content.cloneNode(true);
      const elementLi = element.querySelector(".task-item");
      const elementDate = element.querySelector(".task-item__date");
      const elementDescription = element.querySelector(
        ".task-item__description"
      );
      const elementInput = element.querySelector(".task-item__toggle");

      const fullDate = new Date(date).toLocaleDateString("ru", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "short",
      });

      elementLi.dataset.taskId = id.toString();
      elementDate.textContent = fullDate;
      elementDescription.textContent = description;
      elementDescription.classList.toggle("task-completed", completed);
      elementInput.checked = completed;

      fragment.appendChild(element);
    }

    this.#list.innerHTML = "";
    this.#list.appendChild(fragment);
  }

  #listToGroups(list) {
    return list.sort((a, b) => {
      const diff = a.date.getTime() - b.date.getTime();

      if (!diff) {
        return a.id - b.id;
      }

      return diff;
    });
  }

  #onListEmpty() {
    let emptyListTemplate = document.createElement("template");
    emptyListTemplate.innerHTML = todoEmptyListTemplate;

    const emptyListView = emptyListTemplate.content.cloneNode(true);

    this.#list.innerHTML = "";
    this.#list.appendChild(emptyListView);
  }
}
