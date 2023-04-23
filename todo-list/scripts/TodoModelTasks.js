import { TodoDataBaseTasks } from "./TodoDataBaseTasks.js";

export class TodoModelTasks {
  #dbTasks = new TodoDataBaseTasks();

  toggle(taskID) {
    return this.#dbTasks.toggleTask(taskID);
  }

  getAll() {
    return this.#dbTasks.getAllTasks();
  }

  add(data) {
    return this.#dbTasks.addTask(data);
  }

  remove(taskID) {
    return this.#dbTasks.removeTask(taskID);
  }

  removeAll() {
    return this.#dbTasks.removeAllTasks();
  }

  removeCompleted(tasks) {
    return new Promise((resolve, reject) => {
      for (const task of tasks) {
        this.#dbTasks.removeTask(task.id);
      }
      resolve();
    });
  }

  toggle(taskID) {
    return this.#dbTasks.toggleTask(taskID);
  }

  destroy() {
    return this.#dbTasks.closeDB();
  }
}
