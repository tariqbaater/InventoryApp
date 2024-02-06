import {
  historyData,
  deliveryData,
  loadData,
  loadWriteOff,
  loadHighValue,
  loadMissingAvailiability,
} from "./apiCalls.mjs";
import {
  searchHistory,
  searchDiv3,
  table,
  createThead,
  searchHistBox,
  createRow,
  searchName,
  printBtnDiv,
} from "./index.mjs";

// *********** DATA FUNCTIONS ***********
// function to be called when search/item history button is clicked
export const itemHistoryTableData = () => {
  searchHistory.style.display = "block";
  searchDiv3.style.display = "none";
  table.innerHTML = "";
  const theaderRow = ["Item No", "Description", "Qty", "Remarks"];
  createThead(theaderRow);
  historyData(searchHistBox.value).then((data) => {
    for (const item of data) {
      createRow([item.ItemNo, item.Description, item.QtyPCs, item.Remarks]);
    }
  });
};
// function to be called when search/wh deliveries button is clicked
export const whDeliveriesTableData = () => {
  table.innerHTML = "";
  const theaderRow = ["Item No", "Description", "Qty", "Date"];
  createThead(theaderRow);
  deliveryData(searchHistBox.value).then((data) => {
    for (const item of data) {
      createRow([
        item.ItemNo,
        item.Description,
        item.QtyPCs,
        item.Date.substring(0, 10),
      ]);
    }
  });
};
// function to be called when all products button is clicked
export const searchAllProducts = () => {
  searchHistory.style.display = "none";
  searchDiv3.style.display = "block";
  table.innerHTML = "";
  const theaderRow = ["Item No", "Description"];
  createThead(theaderRow);
  loadData(searchName.value).then((data) => {
    for (const item of data) {
      createRow([item.itemno, item.description]);
    }
  });
};
// function to be called when write off button is clicked
export const writeOff = () => {
  searchHistory.style.display = "none";
  searchDiv3.style.display = "block";
  printBtnDiv.style.display = "none";
  table.innerHTML = "";
  const theaderRow = ["Item No", "Description", "Qty", "Totals"];
  createThead(theaderRow);
  loadWriteOff().then((data) => {
    for (const item of data) {
      createRow([item.ItemNo, item.Description, item.QtyPCs, item.TotalPrice]);
      if (item.ItemNo === "TOTAL") {
        document.querySelector(".table-row").style.fontWeight = "700";
        document.querySelector(".table-row").style.fontSize = "18px";
        document.querySelector(".table-row").style.color = "red";
      }
    }
  });
};
// function to be called when high value button is clicked
export const highValueReport = () => {
  searchHistory.style.display = "none";
  searchDiv3.style.display = "block";
  printBtnDiv.style.display = "flex";
  table.innerHTML = "";
  const theaderRow = [
    "Item No",
    "Description",
    "Opening",
    "Dry",
    "Write Off",
    "RTW",
    "Inter Store",
    "Sales",
    "Physical",
    "Value",
  ];
  createThead(theaderRow);
  loadHighValue().then((data) => {
    for (const item of data) {
      createRow([
        item.itemno,
        item.description,
        item.opening_qty,
        item.dry_qty,
        item.write_off_qty,
        item.rtw_qty,
        item.inter_store_qty,
        item.sales_qty,
        item.physical_qty,
        item.value,
      ]);
    }
  });
};

// function to be called when missing availability button is clicked
export const missingAvailiabilityReport = () => {
  searchHistory.style.display = "none";
  searchDiv3.style.display = "block";
  printBtnDiv.style.display = "flex";
  printBtnDiv.innerHTML = `
    <div class="print-btn-container">
     <a href="http://127.0.0.1:8080/missing_availability_csv" class="download-btn">
        <button class="print-btn">
          <i class="fa-solid fa-print"></i> Print Report
        </button></a>
    </div>
`;
  table.innerHTML = "";
  const theaderRow = ["Item No", "Description", "Category", "VPE", "Stock"];
  createThead(theaderRow);
  loadMissingAvailiability().then((data) => {
    for (const item of data) {
      createRow([
        item.ItemNo,
        item.Description,
        item.ItemCategory,
        item.PcsPerCarton,
        item.stock,
      ]);
    }
  });
};
