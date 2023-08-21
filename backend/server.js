import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";
const port = process.env.PORT || 5000;
import cors from "cors";
// const { auth } = require("express-oauth2-jwt-bearer");
// import guard from "express-jwt-permissions";
import userRoutes from "./routes/userRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
connectDB();

const app = express();

// const jwtCheck = auth({
//   audience: "https://genfa-api.com",
//   issuerBaseURL: "https://dev-srdr08y4lab1swyl.us.auth0.com/",
//   tokenSigningAlg: "RS256",
// });

// app.use(jwtCheck);


app.use(
  cors({
    origin: "https://genfa-cech.vercel.app",
    methods: ["POST", "PUT", "GET", "DELETE"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
    allowedHeaders: [
      "Access-Control-Allow-Origin",
      "Content-type",
      "Authorization",
    ],
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/invoices", invoiceRoutes);

app.get("/", (req, res) => res.json("Server is ready bro."));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started at port ${port}`));
