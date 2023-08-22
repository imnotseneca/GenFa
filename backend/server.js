import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from 'cors'
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;
import userRoutes from "./routes/userRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

connectDB();

const app = express();

const corsOptions = {
    origin: 'https://genfa.vercel.app',
    credentials: true, // Important for sending cookies
  };

  app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/invoices", invoiceRoutes);

app.get("/", (req, res) => res.send("Server is ready bro."));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started at port ${port}`));
