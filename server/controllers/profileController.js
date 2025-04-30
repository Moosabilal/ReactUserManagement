import bcrypt from "bcryptjs";
import User from "../models/User.js";

const profileUpdate = async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    const userId = req.user._id; //   JWT from authMiddleware

    let updatedData = { name, email, bio };

    if (req.file) {
      const profileImageUrl = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      updatedData.profileImage = profileImageUrl;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateUsers = async (req,res)=>{
  const { name, email, role } = req.body;
  const { id } = req.params;
    try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          { name, email, role },
          { new: true, runValidators: true }
        );
    
        if (!updatedUser) {
          return res.status(404).json({ success: false, error: "User not found" });
        }
    
        res.status(200).json({ success: true, user: updatedUser });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }  
};

const deleteUser =  async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
      }
  
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
};

const createUsers = async (req,res)=>{
  const { name, email,role, password } = req.body;
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
      password: hashPassword,
      role
    });

    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "User Created Successfully !!" ,user:newUser});
    console.log("user created successfully");
  } catch (error) {
    console.log(error);
  }
};

export { profileUpdate,getAllUsers,updateUsers,deleteUser,createUsers};
