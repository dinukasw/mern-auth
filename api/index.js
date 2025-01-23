import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB...");
    })
    .catch((err) => {
        console.log(err);
    });

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);



app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});
