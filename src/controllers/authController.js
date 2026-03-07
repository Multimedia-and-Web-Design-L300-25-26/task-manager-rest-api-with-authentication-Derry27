import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //Check if user exists 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "user already exists"
      });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //save user 
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();

    //return user (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    }
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate JWT
    const payload = {
      userId: user._id,
    };
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" });

    res.json({
      message: "login successful",
      token
    });
  }
  catch (error) {
    res.status(500).json({ message: "Error logging in user", error });
  }
};
