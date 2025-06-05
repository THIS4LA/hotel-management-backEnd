import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import argon2 from "argon2";

export function getUsers(req, res) {
  User.find().then((users) => {
    res.status(200).json({
      userList: users,
    });
  });
}

export async function postUsers(req, res) {
  try {
    const user = req.body;

    // Hash the password
    const hashPassword = await argon2.hash(user.password);
    user.password = hashPassword;

    // Create and save the new user
    const newUser = new User(user);
    await newUser.save();

    // Respond with success (avoid sending back sensitive data)
    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id, // Optional: Return the user ID if needed
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle duplicate email/username errors (MongoDB duplicate key error)
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Handle validation errors (e.g., missing required fields)
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    // Generic error fallback
    res.status(500).json({ message: "Failed to create user" });
  }
}

export function putUsers(req, res) {
  res.json({
    message: "put request",
  });
}

export function deleteUsers(req, res) {
  const userEmail = req.body.email;
  User.deleteOne({ email: userEmail })
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch(() => {
      res.status(404).json({ message: "User not found" });
    });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Invalid Username" });
    }

    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const payload = {
      id: user.id,
      email: user.email,
      type: user.type,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const secret = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret, { expiresIn: "14 days" });

    res.status(200).json({
      message: "User authenticated successfully",
      userId: user._id,
      type: user.type,
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error during login" });
  }
}

export function getUser(req, res) {
  const user = req.body.user;
  if (user == null) {
    return res.status(404).json({ message: "User not found" });
  } else {
    res.status(200).json({
      message: "User found",
      user: user,
    });
  }
}

// export function deleteUsers(req, res) {
//   const userEmail = req.body.email;
//   User.findOneAndDelete({ email: userEmail })
//     .then((deletedUser) => {
//       if (!deletedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       res.status(200).json({ message: "User deleted successfully" });
//     })
//     .catch(() => {
//       res.status(404).json({ message: "User not found" });
//     });
// }
