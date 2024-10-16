import mongoose from "mongoose";

const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/demo_nextauth";

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB에 성공적으로 연결되었습니다. 🎃"))
  .catch((err) => console.error("MongoDB 연결 오류:", err));

export default mongoose;
