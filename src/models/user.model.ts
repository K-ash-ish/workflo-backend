import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import * as jose from "jose";

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  active: boolean;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => Promise<string>;
  verifyAccessToken: (accessToken: string) => string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
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
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function encryptPassword(next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function checkPassword(
  password: string
) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function genAccessToken() {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing env ACCESS TOKEN");
  }
  const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

  const alg = "HS256";
  const jwt = await new jose.SignJWT({
    _id: this.id,
    name: this.name,
    active: this.active,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("1d")
    .sign(secret);
  return jwt;
};
export const User = mongoose.model("User", userSchema);
