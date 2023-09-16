const mongoose = require("mongoose");

// Create a Mongoose model for the user  detail collection using this schema.
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("contact", contactSchema);
