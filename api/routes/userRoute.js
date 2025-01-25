import express from "express";
const router = express.Router();
import { test, updateUser } from "../controllers/userController.js";
import { verifyUser } from "../utils/verfiyUser.js";

router.get("/", test);
router.post("/update/:id", verifyUser, updateUser );

export default router;
