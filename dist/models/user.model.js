import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as jose from "jose";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });
userSchema.pre("save", async function encryptPassword(next) {
    if (!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.isPasswordCorrect = async function checkPassword(password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.generateAccessToken = async function genAccessToken() {
    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("Missing env ACCESS TOKEN");
    }
    const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
    const alg = "HS256";
    const jwt = await new jose.SignJWT({ _id: this.id, name: this.name })
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer("urn:example:issuer")
        .setAudience("urn:example:audience")
        .setExpirationTime("1d")
        .sign(secret);
    return jwt;
};
export const User = mongoose.model("User", userSchema);