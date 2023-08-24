import express from "express";

import {
  getInvoices,
  setInvoice,
  updateInvoice,
  getReceiverInvoices,
  deleteInvoice,
} from "../controllers/invoiceControllers.js";

const router = express.Router();

import {
  handleProtection,
  handleInvoiceMakerProtection,
} from "../middlewares/authMiddleware.js";

router.get("/", handleInvoiceMakerProtection, getInvoices);
router.get("/receiverInvoices", handleProtection, getReceiverInvoices);
router.post("/", handleInvoiceMakerProtection, setInvoice);
router.put("/:id", handleInvoiceMakerProtection, updateInvoice);
router.delete("/:id", handleInvoiceMakerProtection, deleteInvoice);

export default router;
