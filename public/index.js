let transactions = [];
let myChart;
import saveRecord from "./saveRecord.js";

fetch("/api/transaction")
  .then(response => {
    return response.json();
  })
  .then(data => {
    transactions = data; // save db data on global variable

    populateTotal();
    populateTable();
    populateChart();
  });

function populateTotal() {
  let total = transactions.reduce((total, t) => { //reduce transaction amounts 
    return total + parseInt(t.value); //to a single total value
  }, 0);

  let totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}

function populateTable() {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach(transaction => {
    let tr = document.createElement("tr"); //create & populate a table row
    tr.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;
    tbody.appendChild(tr);
  });
}

function populateChart() {
  let reversed = transactions.slice().reverse(); //copy array & reverse it
  let sum = 0;

  let labels = reversed.map(t => { //create date labels for chart
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  let data = reversed.map(t => { //create incremental values for chart
    sum += parseInt(t.value);
    return sum;
  });

  if (myChart) { //remove old chart if it exists
    myChart.destroy();
  }

  let ctx = document.getElementById("myChart").getContext("2d");

  myChart = new Chart(ctx, {
    type: 'line',
      data: {
        labels,
        datasets: [{
            label: "Total Over Time",
            fill: true,
            backgroundColor: "#6666ff",
            data
        }]
    }
  });
}

function sendTransaction(isAdding) {
  let nameEl = document.querySelector("#t-name");
  let amountEl = document.querySelector("#t-amount");
  let errorEl = document.querySelector(".form .error");

  // validate form
  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Missing Information";
    return;
  }
  else {
    errorEl.textContent = "";
  }

  let transaction = { //create record
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString()
  };

  if (!isAdding) { //if subtracting funds, convert amount to negative #
    transaction.value *= -1;
  }

  // add to beginning of current array of data
  transactions.unshift(transaction);
  
  populateChart(); //re-run logic to populate UI w/new record
  populateTable();
  populateTotal();
  
  // also send to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      // clear form
      nameEl.value = "";
      amountEl.value = "";
    }
  })
  .catch(err => {
    // fetch failed bc it's offline, so save in indexed db
    saveRecord(transaction);

    // clear form
    nameEl.value = "";
    amountEl.value = "";
  });
}

document.querySelector("#add-btn").onclick = function() {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
  sendTransaction(false);
};

