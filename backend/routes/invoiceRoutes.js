import express from "express";

import {
    getInvoices,
    setInvoice,
    updateInvoice,
    deleteInvoice
} from "../controllers/invoiceControllers.js";

const router = express.Router();

import { handleProtection } from "../middlewares/authMiddleware.js";

router.get("/", handleProtection, getInvoices);
router.post("/", handleProtection, setInvoice);
router.put("/:id", handleProtection, updateInvoice);
router.delete("/:id", handleProtection, deleteInvoice);

export default router;