import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
      },
      invoiceTo: {
        type: String,
        required: [true, 'Por favor agrega un destinatario'],
      },
      invoiceFrom: {
        type: String,
        required: [true, 'Por favor agrega un emisor'],
      },
      // receptorEmail: {
      //   type: String,
      //   required: [true, "Por favor agrega un email"],
      //   // match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'El formato de email debe ser el siguiente: johndoe@example.com'],
      // },
      reason: {
        type: String,
        required: [true, 'Por favor agrega una descripción'],
      },
      description: {
        type: String,
        required: [true, 'Por favor agrega una descripción'],
      },
      quantity: {
        type: Number,
        required: [true, 'Por favor agrega una cantidad'],
      },
      price: {
        type: Number,
        required: [true, 'Por favor agrega un precio'],
      },
      status: {
        type: String,
        default: 'Pendiente',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  )

  const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;
