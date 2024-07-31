import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
export const verifyJWT = asyncHandler(async function verifyToken(req, res, next) {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
        throw new ApiError(401, "Unauthorized action");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("Missing env ACCESS TOKEN");
    }
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) {
        throw new ApiError(401, "Unauthorized action");
    }
    const user = await User.findById(decodedToken?._id).select("-password -email -name");
    if (!user) {
        throw new ApiError(401, "Unauthorized action");
    }
    req.user = user;
    next();
});
