import mongoose, { Schema, Document } from "mongoose";

interface IVideo extends Document {
  youtubeId: string;
  title: string;
  description: string;
  duration: number;
}

const VideoSchema: Schema = new Schema({
  youtubeId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
});

export default mongoose.models.Video ||
  mongoose.model<IVideo>("Video", VideoSchema);
