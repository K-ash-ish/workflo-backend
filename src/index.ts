// entry point
import dotenv from "dotenv";

import express, { Express } from "express";

dotenv.config({
  path: "./.env",
});

const app: Express = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log("server started at: ", port);
});
