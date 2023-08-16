import express from "express";

import {
    getInvoices,
    setInvoice,
    updateInvoice,
    deleteInvoice
} from "../controllers/invoiceControllers.js";

const router = express.Router();

import { handleProtection } from "../middlewares/authMiddleware.js";

router.get("/",  getInvoices);
router.post("/",  setInvoice);
router.put("/:id",  updateInvoice);
router.delete("/:id",  deleteInvoice);

export default router;