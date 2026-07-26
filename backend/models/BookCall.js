const mongoose = require("mongoose");

const bookCallSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    bottleneck: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "bookcalls",
  }
);

module.exports = mongoose.model("BookCall", bookCallSchema, "bookcalls");