import {
  openTasksDb,
  readTasksFromDB,
  addTasksIntoDB,
  updateTasksInDB,
  removeTasksFromDB,
  getAllTasksFromDB,
  removeAllTasksFromDB,
} from "./database/dbForTasks.js";

export class TodoDataBaseTasks {
  #dbName = "TaskStorage";
  #storageName = "tasks";

  #migrations = [
    (db) => {
      db.createObjectStore(this.#storageName, {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  ];

  #dbPromise = openTasksDb(this.#dbName, this.#migrations);

  getAllTasks() {
    return this.#dbPromise.then((db) =>
      getAllTasksFromDB(db, this.#storageName)
    );
  }

  addTask(task) {
    return this.#dbPromise.then((db) =>
      addTasksIntoDB(db, this.#storageName, task).then((id) => {
        return { ...task, id };
      })
    );
  }

  removeTask(taskId) {
    return this.#dbPromise.then((db) =>
      removeTasksFromDB(db, this.#storageName, taskId)
    );
  }

  removeAllTasks() {
    return this.#dbPromise.then((db) =>
      removeAllTasksFromDB(db, this.#storageName)
    );
  }

  toggleTask(taskId) {
    return this.#dbPromise.then(async (db) => {
      const task = await readTasksFromDB(db, this.#storageName, taskId);
      const updateTask = { ...task, completed: !task.completed };
      await updateTasksInDB(db, this.#storageName, updateTask);
      return updateTask;
    });
  }

  closeDB() {
    this.#dbPromise.then((db) => db.close());
  }
}
