import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    createdAt: {
      type: Date,
      default: () => new Date(new Date().setHours(new Date().getHours() + 9)),
    },
    updatedAt: {
      type: Date,
      default: () => new Date(new Date().setHours(new Date().getHours() + 9)),
    },
    password: {
      type: String,
      required: true,
    },
    delete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 모델이 이미 존재하는지 확인하고, 존재하지 않으면 새로 생성
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
