import { redisClient } from "../config/redis.config.js";
import { User } from "../models/user.model.js";
import { EmailService } from "../services/emailService.js";
import { setOTP } from "../services/otpService.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateOTP } from "../utils/otpGenerator.js";

export const verifyOTP = asyncHandler(async function verify(req, res, next) {
  const { otp } = req.body;
  if (!req.user) {
    throw new ApiError(401, "Unauthorized action");
  }

  const storedOTP = await redisClient.get(req.user._id.toString());

  if (storedOTP?.toString() !== otp.toString()) {
    return res.status(201).json(new ApiResponse(422, "Invalid OTP!"));
  }

  const userVerified = await User.findByIdAndUpdate(
    req.user._id,
    {
      active: true,
    },
    { new: true }
  );
  if (!userVerified) {
    throw new ApiError(404, "Something went wrong");
  }
  const accessToken = await userVerified.generateAccessToken();
  const options = {
    httpOnly: true,
    maxAge: 7 * 86400 * 1000,
    secure: true,
    sameSite: "none" as const,
    domain: process.env.DOMAIN,
  };

  await redisClient.del(req.user._id.toString());

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, "Verification Complete"));
});

export const resendOTP = asyncHandler(async function resend(req, res, next) {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized action");
  }

  const isUserExist = await User.findById(req.user._id).select("-password");

  if (!isUserExist) throw new ApiError(401, "Something went wrong");

  const otp = generateOTP();

  await setOTP(req.user._id.toString(), otp);
  const emailService = new EmailService(
    isUserExist.email,
    `Your OTP is ${otp}. Valid for 2 minutes.`
  );

  await emailService.sendVerificationEmail();

  return res
    .status(200)
    .json(new ApiResponse(200, "New OTP send successfully"));
});

export const registerUser = asyncHandler(async function register(
  req,
  res,
  next
) {
  const { name, email, password } = req.body;
  if ([name, email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new ApiError(409, "User with email exist");
  }
  const user = await User.create({ email, password, name });
  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser || !createdUser._id) {
    throw new ApiError(500, "Something went wrong while registering");
  }

  const otp = generateOTP();
  const emailService = new EmailService(
    createdUser.email,
    `Your OTP is ${otp}. Valid for 2 minutes.`
  );
  await emailService.sendVerificationEmail();

  await setOTP(createdUser._id.toString(), otp);

  const accessToken = await user.generateAccessToken();
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 86400 * 1000,
    sameSite: "none" as const,
    domain: process.env.DOMAIN,
    // domain: ".assignment.wiki",
  };
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, "User registered successfully", createdUser));
});

export const loginUser = asyncHandler(async function login(req, res, next) {
  const { email, password } = req.body;
  if ([email, password].some((field) => field.trim() === "")) {
    throw new ApiError(409, "All fields are requireds");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "Check your credentials");
  }
  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(401, "Check your credentials");
  }
  const data = { id: user._id, name: user.name, acitve: user.active };
  const accessToken = await user.generateAccessToken();
  const options = {
    httpOnly: true,
    maxAge: 7 * 86400 * 1000,
    secure: true,
    sameSite: "none" as const,
    domain: process.env.DOMAIN,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .header("Referrer-Policy", "no-referrer-when-downgrade")
    .json(new ApiResponse(200, "Login succesfull", data));
});

export const logoutUser = asyncHandler(async function logout(req, res, next) {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    throw new ApiError(400, "Something went wrong ");
  }
  const options = {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 86400 * 1000,
    sameSite: "none" as const,
    // domain: ".assignment.wiki",
    domain: process.env.DOMAIN,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, "Logout successfull"));
});

export const verifyUserToken = asyncHandler(async function auth(
  req,
  res,
  next
) {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized action");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "User authenticated", req.user));
});
