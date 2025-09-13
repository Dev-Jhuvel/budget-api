// const express  = require("express") #old syntax
import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionRoute from "./routes/transactionRoutes.js";
import job from "./config/cron.js";
dotenv.config();
if (process.env.NODE_ENV === "production") job.start;
const app = express();
const PORT = process.env.PORT;
// const TRANSACTION_URL = "/api/transactions";
// TODO: PRACTICE ACTIVE RECALL
// middleware
app.use(rateLimiter);
app.use(express.json());

app.use("/api/transactions", transactionRoute);
app.use("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and running on PORT: ${PORT}`);
    console.log(
      "🔥 TODO: PRACTICE ACTIVE RECALL: \x1b[4mWHAT DO YOU LEARN TODAY?\x1b[0m 🔗 \u001b]8;;https://www.notion.so/199a52e4c0fb80e6b23bd5a6ee60ebf6?v=199a52e4c0fb807abe24000c7b44352b&source=copy_link\u0007Add it to Notion\u001b]8;;\u0007 🔥"
    );
  });
});
