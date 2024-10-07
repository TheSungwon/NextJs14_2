import mongoose from "mongoose";

const WatchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  watchSeconds: {
    type: Number,
    default: 0,
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("WatchHistory", WatchHistorySchema);
