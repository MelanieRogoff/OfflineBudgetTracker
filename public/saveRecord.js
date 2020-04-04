export default function saveRecord(transaction) {//this function needs to get the transaction data
    // onSuccessRequest(transaction); 

const request = window.indexedDB.open("budgetTracker", 1);

// Create schema
request.onupgradeneeded = event => {
  const db = event.target.result;
  console.log("db", db);
  // Creates an object store with a name keypath that can be used to query on.
  const budgetStore = db.createObjectStore("budgetTracker", {keyPath: "name"});
  // Creates a statusIndex that we can query on.
  budgetStore.createIndex("statusIndex", "status"); 
}

// Opens a transaction, accesses the objectStore and statusIndex.
// function onSuccessRequest(transaction) { //making a function FOR all of this
    request.onsuccess = () => {
        const db = request.result;
        const transactionDB = db.transaction(["budgetTracker"], "readwrite");
        const budgetStorage = transactionDB.objectStore("budgetTracker");
        const statusIndex = budgetStorage.index("statusIndex");

  // Adds data to our objectStore -- has to be the transaction param's object values from the other page
  console.log(transaction, "TRANSACTION")
        budgetStorage.add({ name: transaction.name, value: transaction.value, date: transaction.date });
 
            console.log(budgetStorage, "budgetStorage");
  // Return an item by keyPath
        const getRequest = budgetStorage.get("1");
            getRequest.onsuccess = () => {
        };

  // Return an item by index
        const getRequestIdx = statusIndex.getAll();
        console.log("HALLO")
            getRequestIdx.onsuccess = () => {
                console.log(getRequestIdx.result); 
            }; 
    };
}
// }