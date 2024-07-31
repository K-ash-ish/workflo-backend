import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJWT, createTask);
router.route("/getAllTasks").get(verifyJWT, getAllTasks);

router.route("/delete").post(verifyJWT, deleteTask);

router.route("/update").post(verifyJWT, updateTask);

export default router;
