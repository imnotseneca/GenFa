import jwt from "jsonwebtoken";

//It will receive the response and the  userId cauase we need to add the userId to the payload from jwt.
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return token
};

export default generateToken;
