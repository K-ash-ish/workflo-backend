// configs, cookies

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const corsOptions = {};
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

export { app };
