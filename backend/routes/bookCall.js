const express = require("express");
const BookCall = require("../models/BookCall");

const router = express.Router();

router.post("/", async (req, res) => {
  console.log("===== API HIT =====");
  console.log(req.body);

  try {
    const { fullName, company, email, bottleneck } = req.body;

    if (!fullName || !company || !email || !bottleneck) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const bookCall = new BookCall({ fullName, company, email, bottleneck });

    await bookCall.save();

    console.log("✅ Saved Successfully");

    res.status(201).json({
      success: true,
      message: "Book Call Saved Successfully",
    });
  } catch (error) {
    console.log("❌ Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;