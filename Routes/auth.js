// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "yourSuperSecretKey";

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // 4. Save to database
    await newUser.save();

    // 5. Generate token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "1h" });

    // 6. Respond with user info and token
    res.status(201).json({
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

// LOGIN ROUTE

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // 3. Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // 4. Return user + token
    res.json({
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains user id
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};


module.exports = router;
