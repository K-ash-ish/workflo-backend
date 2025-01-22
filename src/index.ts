// entry point
import dotenv from "dotenv";

import connectDB from "./db/index.js";
import { app } from "./app.js";
import { initRedis } from "./config/redis.config.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT ?? 8080;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error: ", error);
    });
    app.listen(port, () => {
      console.log("Server started at port: ", port);
    });
  })
  .catch((error) => console.error("MongoDB connection failed, ", error));
  
await initRedis();
