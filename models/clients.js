const mongoose = require("mongoose");

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

module.exports = mongoose.model("Client", clientSchema, "clients");
