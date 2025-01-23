import express from "express";
const router = express.Router();
import { test } from "../controllers/userController.js";

router.get("/", test);

export default router;
