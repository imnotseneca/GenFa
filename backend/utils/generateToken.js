import jwt from "jsonwebtoken";

//It will receive the response and the  userId cauase we need to add the userId to the payload from jwt.

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export default generateToken;
