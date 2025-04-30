import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exist with same Email !!",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const capName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const newUser = new User({
      name:capName,
      email,
      role:'user',
      password: hashPassword,
    });

    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "User Created Successfully !!" });
    console.log("user created successfully");
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_KEY,
      { expiresIn: "50m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: `Hi ${user.name}`,
      token,
      user: {
        _id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logout Successfully !!",
  });
};

const getUserProfile = async (req, res) => {
  try {
    console.log('came to backend')
    const user = await User.findById(req.user._id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, logoutUser ,getUserProfile };
