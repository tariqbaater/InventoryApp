// *********** IMPORTS ***********
import {
  searchAllProducts,
  itemHistoryTableData,
  whDeliveriesTableData,
  writeOff,
  highValueReport,
  missingAvailiabilityReport,
} from "./searchAllProducts.mjs";

// *********** VARIABLES ***********
export const table = document.querySelector(".table");
export const searchHistBox = document.querySelector("#search-history");
const searchHistBtn = document.querySelector(".search-button");
export const searchHistory = document.querySelector(".search-bar");
export const searchDiv3 = document.querySelector(".search-bar3");
export const searchName = document.querySelector(".search-name");
const searchLiveBox = document.querySelector(".search-live");
const whDeliveriesBtn = document.querySelector("#wh-deliveries");
const itemHistoryBtn = document.querySelector("#item-history");
const allProductsBtn = document.querySelector("#all-products");
const writeOffBtn = document.querySelector("#write-off");
const highValueBtn = document.querySelector("#high-value");
const missingAvailiabilityBtn = document.querySelector("#missing-availability");
export const printBtnDiv = document.querySelector(".print-btn-container");

// *********** FUNCTIONS ***********
// function for creating dynamic th rows
export const createThead = (data) => {
  const thead = document.createElement("thead");
  const tr = document.createElement("tr");
  table.appendChild(thead);
  thead.appendChild(tr);
  for (const item of data) {
    const th = document.createElement("th");
    th.textContent = item;
    tr.appendChild(th);
  }
};

// function for creating rows with data
export const createRow = (rowData) => {
  // Check if tbody already exists, if not, create one
  let tbody = document.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }

  const tr = document.createElement("tr");
  tr.className = "table-row";

  for (const item of rowData) {
    const td = document.createElement("td");
    td.textContent = item;
    td.className = "table-data";
    tr.appendChild(td);
  }

  // Append the row to the tbody
  tbody.appendChild(tr);
};

//*********** EVENT LISTENERS *************
window.onload = () => {
  printBtnDiv.style.display = "none";
  searchDiv3.style.display = "none";
};
// listen for the all products button to load all products
allProductsBtn.addEventListener("click", () => {
  searchHistory.style.display = "none";
  searchDiv3.style.display = "block";
  printBtnDiv.style.display = "none";
  table.innerHTML = "";
  searchAllProducts();
});

// read main_sheet da// listen for search button on history data
searchHistBtn.addEventListener("click", () => {
  if (searchHistBox.value.length > 0) {
    itemHistoryTableData(searchHistBox.value);
  } else {
    alert("Please enter an item number");
  }
});
// listen for enter button on history data
searchHistBox.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (searchHistBox.value.length > 0) {
      itemHistoryTableData(searchHistBox.value);
    } else {
      alert("Please enter an item number");
    }
  }
});

//listen for item history button
itemHistoryBtn.addEventListener("click", () => {
  searchHistory.style.display = "block";
  searchDiv3.style.display = "none";
  printBtnDiv.style.display = "none";
  table.innerHTML = "";
  if (searchHistBox.value.length > 0) {
    itemHistoryTableData(searchHistBox.value);
  }
});

// listen for wh deliveries button
whDeliveriesBtn.addEventListener("click", () => {
  searchHistory.style.display = "block";
  table.innerHTML = "";
  if (searchHistBox.value.length > 0) {
    whDeliveriesTableData(searchHistBox.value);
  } else {
    alert("Please enter an item number");
  }
});

// listen for write off button
writeOffBtn.addEventListener("click", writeOff);

// listen for high value button
highValueBtn.addEventListener("click", () => {
  highValueReport();
});

// listen for the search-live input
searchLiveBox.addEventListener("input", (event) => {
  const value = event.target.value;
  const filteredRows = table.querySelectorAll("tbody tr");
  filteredRows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    let found = false;
    cells.forEach((cell) => {
      if (cell.textContent.toLowerCase().includes(value.toLowerCase())) {
        found = true;
      }
    });
    if (found) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

// listen for missing availability button
missingAvailiabilityBtn.addEventListener("click", () => {
  missingAvailiabilityReport();
});
