import express from "express";
import {
  authUser,
  registerUser,
  updateUserRole,
  getUserProfile,
  getAllInvoiceReceivers,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
const router = express.Router();
import {
  handleProtection,
  handleAdminProtection,
} from "../middlewares/authMiddleware.js";

router.post("/", registerUser);
router.post("/auth", authUser);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:id/:token", resetPassword);
router.get("/profile", handleProtection, getUserProfile);
router.get("/getAllInvoiceReceivers", getAllInvoiceReceivers);
router.put("/profile", handleProtection, updateUserProfile);
router.put("/:id", handleAdminProtection, updateUserRole);

export default router;
