import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

//It will receive the response and the  userId cauase we need to add the userId to the payload from jwt.
const generateToken = (res, userId) => {
  
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  
  const encryptedToken = CryptoJS.AES.encrypt(token, process.env.ENCRYPTED_KEY).toString();

  return encryptedToken
};

export default generateToken;
