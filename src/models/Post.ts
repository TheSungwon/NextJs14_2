import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  fileUrl: { type: String, required: false },
  isDeleted: { type: Boolean, default: false },
});

export default mongoose.models.Post || mongoose.model("Post", PostSchema);