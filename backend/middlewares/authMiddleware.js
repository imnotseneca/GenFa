import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import CryptoJS from "crypto-js";
import User from "../models/userModel";

const handleProtection = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const encryptedToken = authHeader; // Obtain the encrypted token from the auth header

    try {
      // Decrypt the token
      const decryptedBytes = CryptoJS.AES.decrypt(
        encryptedToken,
        process.env.ENCRYPTED_KEY
      );
      const decryptedToken = decryptedBytes.toString(CryptoJS.enc.Utf8);

      // Verify the decrypted token
      const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET);

      // Fetch user details
      req.user = await User.findById(decoded.userId).select("-password");

      next();
    } catch (error) {
      res.status(401).json({ message: "Acceso denegado, token inválido." });
    }
  } else {
    res.status(401).json({ message: "Acceso denegado, no se encontró token de acceso." });
  }
});

export { handleProtection };
