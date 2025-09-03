const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables in the parent directory
dotenv.config({ path: "../.env" });

// Import models
require("../models/lawyers");
require("../models/clients");

// MongoDB connection URL
const url = process.env.MONGODB_URI;

if (!url) {
  console.error("MONGODB_URI is not defined in .env file");
  process.exit(1);
}

console.log(url);

async function createCollections() {
  try {
    // Connect to MongoDB
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // List registered collections
    const collections = Object.keys(mongoose.models).map(
      (modelName) => mongoose.models[modelName].collection.name
    );
    console.log("Ensuring collections:", collections);

    // Insert sample data to ensure collection creation
    const Lawyer = mongoose.model("Lawyer");
    const Client = mongoose.model("Client");

    // Check if collections are empty
    const lawyerCount = await Lawyer.countDocuments();
    const clientCount = await Client.countDocuments();

    console.log("Collections processed");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

createCollections();
