import dotenv from "dotenv";
dotenv.config({path:"../.env"}); // Load .env file from parent directory

import mongoose from "mongoose";
import User from "./models/userModel.js";

const start = async () => {
    try {

        console.log("Mongo URI:", process.env.MONGO_URI);

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI,);
        console.log("Connected to MongoDB...");

        // Delete all users
        await User.deleteMany();
        console.log("All users deleted successfully!");

        process.exit(0); // Exit gracefully
    } catch (error) {
        console.error("Error:", error);

        // Disconnect if connected
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
};

start();
