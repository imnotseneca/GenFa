import asyncHandler from "express-async-handler";
import Invoice from '../models/invoiceModel.js'
import User from '../models/userModel.js'
import jwt from "jsonwebtoken";


// @desc    Get invoice
// @route   GET /api/v1/invoices/
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
  
  let token = req.headers.cookie

  const decoded = jwt.verify(token.substring(4), process.env.JWT_SECRET);

    const invoice = await Invoice.find({ user: decoded.userId });
  
    res.status(200).json(invoice);
  });
  

// @desc    Set invoice
// @route   POST /api/v1/invoices/
// @access  Private
const setInvoice = asyncHandler(async (req, res) => {

    // const {email} = req.body

    // const user = await User.findOne({ email });

    if (!req.body.invoiceTo) {
      res.status(400);
      throw new Error("Por favor agrega un destinatario!");
    }
    if (!req.body.invoiceFrom) {
        res.status(400);
        throw new Error("Por favor agrega un emisor!");
    }
    if (!req.body.quantity) {
        res.status(400);
        throw new Error("Por favor agrega una cantidad!");
    }
    if (!req.body.price) {
        res.status(400);
        throw new Error("Por favor agrega un precio!");
    }

    const invoice = await Invoice.create({
      user: req.user.id,
      invoiceTo: req.body.invoiceTo,
      invoiceFrom: req.body.invoiceFrom,
      // receptorEmail: req.body.receptorEmail,
      reason: req.body.reason,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price,
    });

    // if(user) {
    //   if(req.body.reason.toLowerCase() === 'multa') {
    //     user.penalties.push({
    //       reason: req.body.reason,
    //       description: req.body.description,
    //       amount: req.body.price
    //     })
    //   }
    //   if(req.body.reason.toLowerCase() === 'cuota') {
    //     user.dues.push({
    //       reason: req.body.reason,
    //       description: req.body.description,
    //       amount: req.body.price
    //     })
    //   }
    // }
    // const updatedUser = await user.save();
  
    res.status(200).json(invoice);
  });

// @desc    Update invoice
// @route   PUT /api/v1/invoices/:id
// @access  Private
const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);
  const user = await User.findById(req.user.id);

  // Check for invoice
  if (!invoice) {
    res.status(400);
    throw new Error("Factura no encontrada.");
  }

  // Check for user
  if (!user) {
    res.status(401);
    throw new Error("Usuario no encontrado.");
  }

  // Make sure the logged-in user matches the goal user
  if (invoice.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Usuario no autorizado");
  }
  
  invoice.status = req.body.status; // Assuming the request body contains { state: 'Pago' }
  const updatedInvoice = await invoice.save();
  

  res.status(200).json(updatedInvoice);
});

// @desc    Delete invoice
// @route   DELETE /api/v1/invoices/:id
// @access  Private
const deleteInvoice = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id);
    const user = await User.findById(req.user.id);
  
    if (!invoice) {
      res.status(400);
      throw new Error("Factura no encontrada.");
    }
  
    // Check for user
    if (!user) {
      res.status(401);
      throw new Error("Usuario no encontrado.");
    }
  
    // Make sure the logged-in user matches the goal user
    if (invoice.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error("Usuario no autorizado");
    }
  
    await invoice.deleteOne();
  
    res.status(200).json({ id: req.params.id });
  });

  export {
    getInvoices,
    setInvoice,
    updateInvoice,
    deleteInvoice
  };