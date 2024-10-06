import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUserToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/verifyuser").get(verifyJWT, verifyUserToken);

export default router;
