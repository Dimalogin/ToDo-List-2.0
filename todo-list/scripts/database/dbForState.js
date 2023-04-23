export function openStateDb(dbName, dbMigrations) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbMigrations.length);

    request.addEventListener("error", function () {
      reject(request.error);
    });

    request.addEventListener("success", function () {
      resolve(request.result);
    });

    request.addEventListener("upgradeneeded", function (event) {
      const db = request.result;
      const { oldVersion } = event;

      for (const migration of dbMigrations.slice(oldVersion)) {
        migration(db);
      }
    });
  });
}

export function addStateIntoDB(db, storeName, data, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);

    const addRequest = objectStore.add({ state: "all-tasks" });

    addRequest.addEventListener("error", function () {
      reject(addRequest.error);
    });

    addRequest.addEventListener("success", function () {
      resolve(addRequest.result);
    });
  });
}

export function readStateFromDB(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const objectStore = transaction.objectStore(storeName);

    const request = objectStore.get(key);

    request.addEventListener("error", function () {
      reject(request.error);
    });

    request.addEventListener("success", function () {
      resolve(request.result);
    });
  });
}

export function updateStateInDB(db, storeName, data, key) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const objectStore = transaction.objectStore(storeName);

    const updateRequest = objectStore.put(data);

    updateRequest.addEventListener("error", function () {
      reject(updateRequest.error);
    });

    updateRequest.addEventListener("success", function () {
      resolve();
    });
  });
}
