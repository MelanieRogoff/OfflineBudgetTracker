const mongoose = require("mongoose");
const Transaction = require("../models/transaction.js");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budgetTracker", {
  useNewUrlParser: true
});

const postSeed = [
  {
    name: "Weekly Paycheck",
    value: 100,
    date: new Date(Date.now())
  },
  {
    name: "Groceries",
    value: -50,
    date: new Date(Date.now())
  },
  {
    name: "Bonus Pay",
    value: 1100,
    date: new Date(Date.now())
  }
];

Transaction.deleteMany({})
  .then(() => Transaction.collection.insertMany(postSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
