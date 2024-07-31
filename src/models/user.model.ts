import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
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

userSchema.methods.generateAccessToken = function genAccessToken() {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing env ACCESS TOKEN");
  }
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
};
userSchema.methods.verifyAccessToken = function verifyToken(
  accessToken: string
) {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("Missing env ACCESS TOKEN");
  }
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
};

export const User = mongoose.model("User", userSchema);
