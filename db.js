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

export async function kvi() {
  const rows = await pool.query(
    `
WITH availability AS (SELECT
count(k.ItemNo) as available
from main_sheet ms
join kvi k on ms.ItemNo = k.ItemNo
where ms.physical_qty > 0
order by k.ItemNo),

kvi_count AS (SELECT count(k.ItemNo) as kvi_count from kvi k)

SELECT
ROUND((available/kvi_count) * 100, 0) as kvi_percentage
FROM (
SELECT
*
from availability
join kvi_count on 1=1
) AS subquery
      `,
  );
  return rows;
}
export async function wastePercentage() {
  const rows = await pool.query(
    "SELECT ROUND((totalwaste/totalsalesvat)*100, 2) AS `percentage`, FORMAT(ROUND(totalwaste, 2), 0) AS `totalwaste`, FORMAT(ROUND(totalsales, 2), 0) AS totalsales, FORMAT(ROUND(totalsalesvat, 2), 0) AS totalsalesvat, datediff(date_format(now(), '%Y-%m-%d'), date_format('2024-05-04', '%Y-%m-%d') ) as DaysSince, FORMAT(ROUND(sales, 2), 0) AS totalsalesbudget, ROUND((totalsales/Sales)*100, 0) AS `vsbudget`,  FORMAT(ROUND(AvgSales, 2), 0) AS `Avg_Sales` FROM ( SELECT ROUND(SUM(`total price`), 2) AS `totalwaste` FROM `write_off`) AS `totalwaste`, ( SELECT ROUND(SUM(`Amount`), 2) AS `totalsales` FROM `sales`) AS `totalsales`, ( SELECT ROUND(SUM(`AmountVAT`), 2) AS `totalsalesvat` FROM `sales`) AS `totalsalesvat`, ( SELECT ROUND(SUM(`Sales`), 2) AS `Sales` from `budget`) AS `salesbudget`, ( SELECT COALESCE(c.`ItemCategory`, 'Total') as ItemCategory, FORMAT(ROUND(SUM(ms.`Amount`),2),0) as Total_Sales, ROUND(SUM(ms.`Amount`)/datediff(date_format(now(), '%Y-%m-%d'), date_format('2024-05-04', '%Y-%m-%d')),0) as AvgSales from `sales` ms JOIN `category` c ON ms.`itemno` = c.`itemno` GROUP BY  c.`ItemCategory` WITH ROLLUP ORDER BY SUM(ms.`Amount`) DESC LIMIT 1) AS `Avg_Sales`",
  );
  return rows;
}

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

export async function dsdDelivery(item) {
  const rows = await pool.query(
    `SELECT ItemNo, Description, Qty, Date FROM dsd_receiving  WHERE ItemNo = ?;`,
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

export async function missingAvailability() {
  const rows = await pool.query(
    "SELECT `ac`.*, `dd`.QtyPCs/`dd`.QtyVPE as PcsPerCarton, `ms`.physical_qty AS stock FROM `active_list` ac JOIN `main_sheet` ms ON `ac`.`ItemNo` = `ms`.`ItemNo` JOIN `pack_size` dd ON `ac`.`ItemNo` = `dd`.`ItemNo` WHERE `ac`.`Mode` = 'DC' AND ac.ItemClass IN ('P-A', 'P-B', 'S', 'G-A') AND ms.physical_qty < dd.QtyPCs/`dd`.QtyVPE AND ac.ItemCategory NOT IN ('Smoking Needs', 'Frozen Foods') GROUP BY ac.ItemNo, ac.Description, ac.Mode, ac.ItemCategory, ac.Status, ac.ItemClass, dd.QtyPCs/`dd`.QtyVPE, ms.physical_qty",
  );

  return rows;
}
