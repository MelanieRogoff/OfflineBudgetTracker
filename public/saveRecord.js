function saveRecord(transaction) {//this function needs to get the transaction data
    onSuccessRequest(transaction); 
}

const request = window.indexedDB.open("budgetTracker", 1);

// Create schema
request.onupgradeneeded = event => {
  const db = event.target.result;
  // Creates an object store with a listID keypath that can be used to query on.
  const budgetStore = db.createObjectStore("budgetTracker", {keyPath: "listID"});
  // Creates a statusIndex that we can query on.
  budgetStore.createIndex("statusIndex", "status"); 
}

// Opens a transaction, accesses the objectStore and statusIndex.
function onSuccessRequest(transaction) { //making a function FOR all of this
    return request.onsuccess = () => {
        const db = request.result;
        const transactionDB = db.transaction(["budgetTracker"], "readwrite");
        const budgetStorage = transactionDB.objectStore("budgetTracker");
        const statusIndex = toDoListStore.index("statusIndex");

  // Adds data to our objectStore -- has to be the transaction param's object values from the other page
        budgetStorage.add({ name: transaction.name, value: transaction.value, date: transaction.date });
 
  // Return an item by keyPath
        const getRequest = budgetStorage.get("1");
            getRequest.onsuccess = () => {
                console.log(getRequest.result);
        };

  // Return an item by index
        const getRequestIdx = statusIndex.getAll("complete");
            getRequestIdx.onsuccess = () => {
                console.log(getRequestIdx.result); 
            }; 
    };
}

module.exports = saveRecord;