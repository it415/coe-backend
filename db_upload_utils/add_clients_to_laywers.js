const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

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

Client = mongoose.model("Client", clientSchema, "clients");

const lawyerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  assigned_clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // Reference to the Client model
    },
  ],
});

// Hash password before saving
lawyerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
lawyerSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
lawyerSchema.methods.toJSON = function () {
  const lawyerObject = this.toObject();
  delete lawyerObject.password;
  return lawyerObject;
};

Lawyer = mongoose.model("Lawyer", lawyerSchema, "lawyers");

// Function to assign clients to a lawyer by client names
const assignClientsToLawyer = async (lawyerEmail, clientNames) => {
  try {
    // Find the lawyer by email
    const lawyer = await Lawyer.findOne({ email: lawyerEmail });
    if (!lawyer) throw new Error(`Lawyer with email ${lawyerEmail} not found`);

    // Find clients by their names
    const clients = await Client.find({ client_name: { $in: clientNames } });
    if (clients.length !== clientNames.length) {
      const foundNames = clients.map((c) => c.client_name);
      const missing = clientNames.filter((name) => !foundNames.includes(name));
      console.warn(`Clients not found: ${missing.join(", ")}`);
    }

    // Get client IDs
    const clientIds = clients.map((client) => client._id);

    // Update lawyer's assigned_clients (avoid duplicates)
    lawyer.assigned_clients = [
      ...new Set([...lawyer.assigned_clients, ...clientIds]),
    ];

    // Save the updated lawyer document
    await lawyer.save();
    console.log(
      `Assigned clients ${clientNames.join(", ")} to lawyer ${lawyerEmail}`
    );
  } catch (err) {
    console.error("Error assigning clients:", err.message);
  } finally {
    mongoose.connection.close();
  }
};

// Example usage
const lawyerEmail = "ikechwuo@lineablu.com"; // Replace with actual lawyer email
const clientNames = ["Test Company", "Test Company 2"]; // Replace with client names to assign
assignClientsToLawyer(lawyerEmail, clientNames);
