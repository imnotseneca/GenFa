import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
const router = express.Router();
import { handleProtection } from "../middlewares/authMiddleware.js";

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
router.get("/profile", handleProtection, getUserProfile);
router.put("/profile", handleProtection, updateUserProfile);

export default router;
