import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export async function readData(item) {
  const rows = await pool.query(`CALL history(?);`, [item]);
  return rows;
}

export async function dryDelivery(item) {
  const rows = await pool.query(
    `SELECT ItemNo, Description, QtyPCs, Date FROM dry_delivey  WHERE ItemNo = ?;`,
    [item],
  );
  return rows;
}

export async function mainSheet() {
  const rows = await pool.query(`SELECT * FROM main_sheet;`);
  return rows;
}

export async function searchTable(query = "") {
  let sql = "";
  if (query != "") {
    sql = `SELECT itemno, description FROM main_sheet WHERE ItemNo LIKE '%${query}%' OR Description LIKE '%${query}%'`;
  } else {
    sql = `SELECT itemno, description FROM main_sheet`;
  }

  const rows = await pool.query(sql);
  return rows;
}

export async function writeOff() {
  const rows = await pool.query(`CALL writeoff();`);
  return rows;
}

export async function highValue() {
  const rows =
    await pool.query(`SELECT ms.itemno, ms.description, ms.opening_qty, ms.dry_qty, ms.write_off_qty, ms.rtw_qty, ms.inter_store_qty, ms.sales_qty, physical_qty, ROUND((s.AmountVAT / s.Qty)  * physical_qty, 2) as value from main_sheet ms  JOIN sales s ON ms.itemno = s.itemno WHERE physical_qty > 0 AND ROUND((s.AmountVAT / s.Qty)  * physical_qty, 2)  > 500 ORDER BY value DESC 
`);
  return rows;
}
