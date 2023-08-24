import express from "express";
import {
  authUser,
  registerUser,
  updateUserRole,
  getUserProfile,
  getAllInvoiceReceivers,
  updateUserProfile,
  
} from "../controllers/userController.js";
const router = express.Router();
import { handleProtection, handleAdminProtection } from "../middlewares/authMiddleware.js";

router.post("/", registerUser);
router.post("/auth", authUser);
router.get("/profile", handleProtection, getUserProfile);
router.get("/getAllInvoiceReceivers", getAllInvoiceReceivers);
router.put("/profile", handleProtection, updateUserProfile);
router.put("/:id", handleAdminProtection, updateUserRole);

export default router;
