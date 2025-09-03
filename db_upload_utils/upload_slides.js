const mongoose = require("mongoose");
const fs = require("fs");
const { parse } = require("csv-parse");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define the Client schema
const clientSchema = new mongoose.Schema({
  client_name: {
    type: String,
    required: true,
    trim: true,
  },
  client_brief: {
    type: String,
    trim: true,
  },
  client_slides: [
    {
      location: {
        type: String,
        required: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },
    },
  ],
});

const Client = mongoose.model("Client", clientSchema, "clients");

// Function to read CSV and upload to MongoDB
const uploadCSVToMongoDB = (csvFilePath, clientName, clientBrief) => {
  const slides = [];

  fs.createReadStream(csvFilePath)
    .pipe(
      parse({
        columns: true, // Treat first row as headers
        trim: true, // Trim whitespace
        skip_empty_lines: true, // Skip empty lines
      })
    )
    .on("data", (row) => {
      // Add each row to the slides array
      slides.push({
        location: row.location,
        description: row.description,
      });
    })
    .on("end", async () => {
      console.log("CSV file successfully processed. Uploading to MongoDB...");

      try {
        // Create a single Client document with the slides
        const clientData = {
          client_name: clientName,
          client_brief: clientBrief || "", // Use empty string if clientBrief is not provided
          client_slides: slides,
        };

        // Insert or update the Client document
        await Client.updateOne(
          { client_name: clientName }, // Find by client_name
          { $set: clientData }, // Update with new data
          { upsert: true } // Insert if not found
        );

        console.log(`Client "${clientName}" successfully uploaded to MongoDB`);
      } catch (err) {
        console.error("Error uploading to MongoDB:", err.message);
      } finally {
        // Close the MongoDB connection
        mongoose.connection.close();
      }
    })
    .on("error", (err) => {
      console.error("Error reading CSV file:", err.message);
    });
};

// Configuration
const csvFilePath = "files.csv";
const clientName = "Test Company 2";
const clientBrief = "Brief description for Test Company 2";

// Run the upload function
uploadCSVToMongoDB(csvFilePath, clientName, clientBrief);
