const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

module.exports = mongoose.model("Lawyer", lawyerSchema, "lawyers");
