const User = require("../models/user.model");

const allowedRoles = ["admin", "analyst", "viewer"];
const allowedStatuses = ["active", "inactive"];

const isAdmin = (req) => req.user?.role === "admin";

const createUser = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this resource",
        data: null,
      });
    }

    const { name, email, password, role, status } = req.body;

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
      status,
    });

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
      data: null,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this resource",
        data: null,
      });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      data: null,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this resource",
        data: null,
      });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      data: null,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this resource",
        data: null,
      });
    }

    const { role } = req.body;

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed values: admin, analyst, viewer",
        data: null,
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    if (user.role === role) {
      return res.status(400).json({
        success: false,
        message: "Role is already set to this value",
        data: null,
      });
    }

    user.role = role;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user role",
      data: null,
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this resource",
        data: null,
      });
    }

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: active, inactive",
        data: null,
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    if (user.status === status) {
      return res.status(400).json({
        success: false,
        message: "Status is already set to this value",
        data: null,
      });
    }

    user.status = status;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
      data: null,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Only admin can access this resource",
        data: null,
      });
    }

    const { role, status } = req.body;

    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Allowed values: admin, analyst, viewer",
        data: null,
      });
    }

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Allowed values: active, inactive",
        data: null,
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    const noRoleChange = role === undefined || user.role === role;
    const noStatusChange = status === undefined || user.status === status;

    if (noRoleChange && noStatusChange) {
      return res.status(400).json({
        success: false,
        message: "No changes detected for update",
        data: null,
      });
    }

    if (role !== undefined) {
      user.role = role;
    }

    if (status !== undefined) {
      user.status = status;
    }

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      data: null,
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  updateUserStatus,
};
