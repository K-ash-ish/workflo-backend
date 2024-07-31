// configs, cookies

import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
const app = express();

const corsoptions = {};
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

import userrouter from "./routes/user.route.js";

app.use("/api/user", userrouter);

export { app };
