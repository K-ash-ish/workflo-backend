import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  resendOTP,
  verifyOTP,
  verifyUserToken,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/verifyuser").get(verifyJWT, verifyUserToken);
router.route("/verify-otp").post(verifyJWT, verifyOTP);
router.route("/resend-otp").get(verifyJWT, resendOTP);

export default router;
