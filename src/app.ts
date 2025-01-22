// configs, cookies

import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    credentials: true,

    origin: [
      "http://localhost:3000",
      "https://crework-assignment-git-main-kashishs-projects-e2fda6bb.vercel.app",
      "https://crework-assignment-lyart.vercel.app",
      "https://www.assignment.wiki",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

import userrouter from "./routes/user.route.js";
import taskrouter from "./routes/task.route.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

app.use("/api/user", userrouter);
app.use("/api/task", taskrouter);

app.use(errorHandler);

export { app };
