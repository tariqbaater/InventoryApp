// imports from node_modules
import express from "express";
import path from "path";
import cors from "cors";
import { Parser } from "json2csv";

// imports from local files
import {
  readData,
  dryDelivery,
  searchTable,
  writeOff,
  highValue,
} from "./db.js";

// initialize express
const app = express();
// set port
const __dirname = path.resolve();
// set cors
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.listen(8080, () => {
  console.log("Listening on port 8080");
});

// serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.get("", (_req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});
// parse json
app.use(express.json());

// export csv file using json2csv
app.get("/export", async (_req, res) => {
  const loadHighValue = async () => {
    const response = await fetch(`http://localhost:8080/high_value/`);
    const data = await response.json();
    return data;
  };

  loadHighValue().then((data) => {
    const parser = new Parser();
    const csv = parser.parse(data);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=high_value.csv");
    res.send(csv);
  });
});
// get history procedure
app.get("/history/:id", async (req, res) => {
  // check if id is an integer
  if (!Number.isInteger(parseInt(req.params.id))) {
    res.status(400).send("Invalid item number");
    return;
  } else {
    const { id } = req.params;
    const dukan = await readData(id);
    res.send(dukan[0][0]);
  }
});

// get dry_delivey
app.get("/dry_delivery/:id", async (req, res) => {
  // check if id is an integer
  if (!Number.isInteger(parseInt(req.params.id))) {
    res.status(400).send("Invalid item number");
    return;
  } else {
    const { id } = req.params;
    const dukan = await dryDelivery(id);
    res.send(dukan[0]);
  }
});

// search all products
app.get("/search", async (req, res) => {
  const { q } = req.query;
  const dukan = await searchTable(q);
  res.send(dukan[0]);
});

// get writeoff totals
app.get("/writeoff/", async (_req, res) => {
  const dukan = await writeOff();
  res.send(dukan[0][0]);
});

// get high value products
app.get("/high_value/", async (_req, res) => {
  const dukan = await highValue();
  res.send(dukan[0]);
});

// catch errors
app.use((err, res) => {
  console.error(err.stack);
  res.status(500).send("<h1>Error 500: Internal server error</h1>");
});

app.use((err, res) => {
  console.log(err.stack);
  res.status(404).send("<h1>Error 404: Page not found</h1>");
});

app.use((err, res) => {
  console.log(err.stack);
  res.status(405).send("<h1>Error 405: Method not allowed</h1>");
});
