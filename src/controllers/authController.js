const User = require("../models/user.model");
const { generateToken } = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
        data: null,
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = generateToken(user);
    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to register user",
      data: null,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        data: null,
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Contact admin",
        data: null,
      });
    }

    const token = generateToken(user);
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login user",
      data: null,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch current user",
      data: null,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
