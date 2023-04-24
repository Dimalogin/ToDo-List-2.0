import {
  openStateDb,
  addStateIntoDB,
  readStateFromDB,
  updateStateInDB,
} from "./database/dbForState.js";

export class TodoDataBaseState {
  #dbName = "SelectState";
  #storageName = "state";

  #migrations = [
    (db) => {
      db.createObjectStore(this.#storageName, {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  ];

  #dbPromise = openStateDb(this.#dbName, this.#migrations);

  initState(state) {
    return this.#dbPromise.then((db) => {
      return readStateFromDB(db, this.#storageName, 1).then((res) => {
        if (res === undefined) {
          addStateIntoDB(db, this.#storageName, state);
          return state;
        } else {
          return readStateFromDB(db, this.#storageName, 1);
        }
      });
    });
  }

  toggleState(state) {
    return this.#dbPromise.then(async (db) => {
      const object = await readStateFromDB(db, this.#storageName, 1);

      const update = { ...object, state: state };

      await updateStateInDB(db, this.#storageName, update, 1);
      return update;
    });
  }
}
