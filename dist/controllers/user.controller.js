import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
export const registerUser = asyncHandler(async function register(req, res, next) {
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
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering");
    }
    const accessToken = await user.generateAccessToken();
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, "User registered successfully", createdUser));
});
export const loginUser = asyncHandler(async function login(req, res, next) {
    const { email, password } = req.body;
    console.log(email, password);
    if ([email, password].some((field) => field.trim() === "")) {
        throw new ApiError(409, "All fields are requireds");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }
    const isValidPassword = await user.isPasswordCorrect(password);
    if (!isValidPassword) {
        return new ApiError(401, "Enter correct password");
    }
    const data = { id: user._id, name: user.name };
    const accessToken = await user.generateAccessToken();
    const options = {
        httpOnly: true,
        secure: true,
    };
    console.log(accessToken, data);
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, "Login succesfull", data));
});
export const logoutUser = asyncHandler(async function logout(req, res, next) {
    const { accessToken } = req.cookies;
    if (!accessToken) {
        throw new ApiError(400, "Something went wrong");
    }
    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, "Logout successfull"));
});
