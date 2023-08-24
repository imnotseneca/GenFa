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
      role: user.role,
      phoneNumber: user.phoneNumber,
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
  const {
    firstName,
    lastName,
    email,
    password,
    career,
    university,
    phoneNumber,
  } = req.body;

  //check in DB if user with same email already exists.
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Ya existe un usuario con ese mail.");
  }

  // Check if phoneNumber starts with "54" and has at least 12 digits
  if (
    !phoneNumber.startsWith("54") ||
    phoneNumber.replace(/\D/g, "").length < 12
  ) {
    res.status(400);
    throw new Error(
      "El número de teléfono debe comenzar con '54' y tener al menos 12 dígitos."
    );
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    career,
    university,
    phoneNumber,
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
      phoneNumber: user.phoneNumber,
    });
  } else {
    res.status(400);
    throw new Error("La información del usuario es inválida");
  }
});

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
    role: req.user.role,
    phoneNumber: req.user.phoneNumber,
  };
  res.status(200).json(user);
});

// @desc   Get all users with role "invoiceReceiver"
// @route  GET api/v1/users/getAllInvoiceReceivers
// @acces  Public.

const getAllInvoiceReceivers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "invoiceReceiver" });
  res.status(200).json(users);
});

// @desc   Update user profile
// @route  PUT api/v1/users/profile
// @acces  Private.

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user);

  if (user) {
    // Check if the email to be updated already exists
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error("Ese email ya pertenece a un usuario existente.");
      }
    }

    // Check if the phone number to be updated already exists
    if (req.body.phoneNumber && req.body.phoneNumber !== user.phoneNumber) {
      const phoneNumberExists = await User.findOne({
        phoneNumber: req.body.phoneNumber,
      });
      if (phoneNumberExists) {
        res.status(400);
        throw new Error("Phone number already exists.");
      }
    }
    // Check if phoneNumber starts with "54" and has at least 12 digits
    if (
      !req.body.phoneNumber.startsWith("54") ||
      req.body.phoneNumber.replace(/\D/g, "").length < 12
    ) {
      res.status(400);
      throw new Error(
        "El número de teléfono debe comenzar con '54' y tener al menos 12 dígitos."
      );
    }

    // Update fields if provided in the request body
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.email) user.email = req.body.email;
    if (req.body.career) user.career = req.body.career;
    if (req.body.university) user.university = req.body.university;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      career: updatedUser.career,
      university: updatedUser.university,
      phoneNumber: updatedUser.phoneNumber,
      token: req.user.token,
      role: req.user.role,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado.");
  }
});

// @desc   Update user role
// @route  PUT api/v1/users/:id
// @acces  Public.

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role;

    const updatedUser = await user.save();

    res.status(200).json({
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado.");
  }
});
export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  getAllInvoiceReceivers,
};
