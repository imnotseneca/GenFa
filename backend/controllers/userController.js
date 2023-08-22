import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc   Auth user/set token
// @route  POST api/v1/users/auth
// @acces  Public.
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPasswords(password))) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      career: user.career,
      university: user.university,
      token: token,
    });
  } else {
    res.status(401);
    throw new Error("El email o la contraseña ingresada no es válida");
  }
});

// @desc   Register new user
// @route  POST api/v1/users
// @acces  Public.
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, career, university } = req.body;

  //check in DB if user with same email already exists.
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Ya existe un usuario con ese mail.");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    career,
    university,
  });

  if (user) {
    const token = generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      career: user.career,
      university: user.university,
      token: token,
    });
  } else {
    res.status(400);
    throw new Error("La información del usuario es inválida");
  }
});

// @desc   Logout user
// @route  POST api/v1/users/logout
// @acces  Public.

// const logoutUser = asyncHandler(async (req, res) => {
//   const { firstName, lastName } = req.body;
//   if (firstName && lastName) {
//     res.status(200).json({ message: `Adios ${firstName} ${lastName}` });
//   } else {
//     res.status(200).json({ message: `Usuario deslogeado` });
//   }
// });

// @desc   Get user profile
// @route  GET api/v1/users/profile
// @acces  Private.

const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    career: req.user.career,
    university: req.user.university,
  };
  res.status(200).json(user);
});

// @desc   Update user profile
// @route  PUT api/v1/users/profile
// @acces  Private.

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.career = req.body.career || user.career;
    user.university = req.body.university || user.university;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      career: updatedUser.career,
      university: updatedUser.university,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado.");
  }
});
export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
