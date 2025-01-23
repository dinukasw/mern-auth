import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB...");
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(3000, () => {
    console.log("Server is running on port 3000...");
});

app.use("/api/user", userRoutes);