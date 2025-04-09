import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

async function connectAndTest() {
  try {
    console.log("Attempting alternative MongoDB connection...");
    
    // Extract parts from your connection string
    const connectionString = process.env.MONGODB_URI;
    console.log("Connection string format check:", 
                connectionString.startsWith("mongodb+srv://") ? "SRV format" : "Standard format");
    
    // Set DNS options to try to bypass DNS SRV lookup issues
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      directConnection: false,
      serverSelectionTimeoutMS: 5000,
    };
    
    const client = new MongoClient(connectionString, options);
    
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    
    const db = client.db("clean_beats_db");
    const testCollection = db.collection("test_collection");
    const result = await testCollection.insertOne({ test: "Hello MongoDB" });
    
    console.log("Successfully created database and inserted test document:", result);
    
    await client.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

connectAndTest();