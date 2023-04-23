import { TodoDataBaseState } from "./TodoDataBaseState.js";
import { TodoDataBaseTasks } from "./TodoDataBaseTasks.js";

export class TodoModelState {
  #dbState = new TodoDataBaseState();
  #dbTasks = new TodoDataBaseTasks();

  state() {
    this.#dbState.initState();
  }

  currentState() {
    return this.#dbState.getCurrentState();
  }

  updateState(value) {
    return this.#dbState.toggleState(value);
  }
}
