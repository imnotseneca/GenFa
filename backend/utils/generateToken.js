import jwt from "jsonwebtoken";

//It will receive the response and the  userId cauase we need to add the userId to the payload from jwt.
const generateToken = (res, userId) => {
  return new Promise((resolve, rej) => {
    jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      },
      (err, token) => {
        if (err) {
          console.error(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

export default generateToken;
