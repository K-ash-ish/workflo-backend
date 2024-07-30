// entry point
import dotenv from "dotenv";

import express, { Express } from "express";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env"
});

connectDB();

const app: Express = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log("server started at: ", port);
});
