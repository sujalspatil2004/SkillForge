import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

// Import Routes & Models
import pathwayRoutes from "./routes/pathwayRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import User from "./models/User.js";
import authMiddleware from "./middleware/auth.js"; // Middleware for protected routes

dotenv.config();

const app = express();

// 🔹 Middleware
app.use(express.json());
app.use(bodyParser.json());
// app.use(cors());
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// 🔹 MongoDB Connection

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// ==========================
// 🔹 AUTHENTICATION ROUTES 🔹
// ==========================

// ✅ User Signup
app.post("/api/signup", async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        console.log("New user saved:", newUser);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ User Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login Error:", error);  // <-- ADD THIS LINE
        res.status(500).json({ error: "Internal server error" });
    }
});


// ✅ Get User Profile (Protected)
app.get("/api/user", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ===========================
// 🔹 COURSE & PATHWAY ROUTES 🔹
// ===========================

// ✅ Pathway Routes
app.use("/api/pathways", pathwayRoutes);

// ✅ Course Routes
app.use("/api/courses", courseRoutes);

// ===================
// 🔹 SERVER START 🔹
// ===================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
