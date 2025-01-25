import express from "express";
const router = express.Router();
import { test, updateUser, deleteUser } from "../controllers/userController.js";
import { verifyUser } from "../utils/verfiyUser.js";

router.get("/", test);
router.post("/update/:id", verifyUser, updateUser );
router.delete("/delete/:id", verifyUser, deleteUser);

export default router;
