import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  const globalWithMongo = global as typeof global & {
    _mongoClientPromise?: Promise<MongoClient>;
  };
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
