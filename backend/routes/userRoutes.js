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
router.get("/profile",  getUserProfile);
router.put("/profile",  updateUserProfile);

export default router;
