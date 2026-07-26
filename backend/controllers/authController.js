const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "stellar_ai_secret_key_2024";
const JWT_EXPIRE = "7d";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
};

// Login - POST /api/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      company: user.company,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      token,
      user: userData
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
};

// Register - POST /api/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, company } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user
    user = await User.create({
      fullName,
      email,
      password,
      company: company || "",
      role: email === "admin@stellar.ai" ? "admin" : "user"
    });

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      company: user.company,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      token,
      user: userData
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Get Profile - GET /api/profile
exports.getProfile = async (req, res) => {
  try {
    // Extract token from header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user data (without password)
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      company: user.company,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.status(200).json(userData);
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update Profile - PUT /api/profile
exports.updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update allowed fields
    const { fullName, company, avatar, email } = req.body;
    
    if (fullName) user.fullName = fullName;
    if (company) user.company = company;
    if (avatar) user.avatar = avatar;
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
      user.email = email;
    }

    await user.save();

    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      company: user.company,
      avatar: user.avatar,
      createdAt: user.createdAt
    };

    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Logout - POST /api/logout
exports.logout = (req, res) => {
  // Logout is handled client-side by removing token
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
