export default function saveRecord(transaction) {//this function needs to get the transaction data
    const request = window.indexedDB.open("budgetTracker", 1);
    request.onupgradeneeded = event => { //create schema
        const db = event.target.result;
    // Creates an object store with a name keypath that can be used to query on.
        const budgetStore = db.createObjectStore("budgetTracker", {keyPath: "name"});
    budgetStore.createIndex("statusIndex", "status"); //this creates statusIndex for us to query on
}
// Opens a transaction, accesses objectStore & statusIndex.
    request.onsuccess = () => { 
        const db = request.result;
        const transactionDB = db.transaction(["budgetTracker"], "readwrite");
        const budgetStorage = transactionDB.objectStore("budgetTracker");
        const statusIndex = budgetStorage.index("statusIndex");
  // Adds data to our objectStore -- has to be the transaction param's object values from the other page
        budgetStorage.add({ name: transaction.name, value: transaction.value, date: transaction.date });
        const getRequest = budgetStorage.get("1"); //returns item by keyPath
            getRequest.onsuccess = () => {
        };
        const getRequestIdx = budgetStorage.getAll(); //return item by index
            getRequestIdx.onsuccess = () => {
                console.log(getRequestIdx.result); 
            }; 
    };
}
