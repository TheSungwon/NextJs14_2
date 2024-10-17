import mongoose from "mongoose";

const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/demo_nextauth";

// 전역 연결을 위한 변수
let isConnected: boolean = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log("MongoDB에 이미 연결되어 있습니다. 🎃");
    return;
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log("MongoDB에 성공적으로 연결되었습니다. 🎃");
  } catch (err) {
    console.error("MongoDB 연결 오류:", err);
  }
};

connectToDatabase();

export default mongoose;
