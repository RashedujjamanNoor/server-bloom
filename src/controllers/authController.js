const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken.js");
const admin = require("../config/firebase/firebaseAdmin.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return;
    }

    res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//Firebase Login
const firebaseLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify Firebase Token
    const decoded = await admin.auth().verifyIdToken(token);

    const email = decoded.email;

    // Find User
    let user = await User.findOne({ email });

    // Create User If Not Exists
    if (!user) {
      user = await User.create({
        name: decoded.name,
        email: decoded.email,
        photoURL: decoded.picture,
        firebaseUid: decoded.uid,
      });
    }

    // Generate JWT
    const jwtToken = generateToken(user._id);

    res.status(200).json({
      user,
      token: jwtToken,
    });
  } catch (error) {
    res.status(401).json({
      message: "Firebase login failed",
    });
  }
};

module.exports = { registerUser, loginUser, currentUser, firebaseLogin };
