import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const handleProtection = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  console.log(req.cookies)

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-password");

      next();

    } catch (error) {
      res.status(401);

      throw new Error("Acceso denegado, token inválido.");
    }
  } else {
    res.status(401);
    throw new Error('Acceso denegado, no se encontró token de acceso.')
  }
});

export { handleProtection };
