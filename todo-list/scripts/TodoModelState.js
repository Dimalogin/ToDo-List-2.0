import { TodoDataBaseState } from "./TodoDataBaseState.js";
import { TodoDataBaseTasks } from "./TodoDataBaseTasks.js";

export class TodoModelState {
  #dbState = new TodoDataBaseState();
  #dbTasks = new TodoDataBaseTasks();

  state(state) {
    return this.#dbState.initState(state);
  }

  updateState(value) {
    return this.#dbState.toggleState(value);
  }
}
