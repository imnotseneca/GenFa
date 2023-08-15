import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Por favor agrega tu nombre."],
    },
    lastName: {
      type: String,
      required: [true, "Por favor agrega tu apellido."],
    },
    email: {
      type: String,
      required: [true, "Por favor agrega tu email"],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        "El formato de email debe ser el siguiente: johndoe@example.com",
      ],
    },
    password: {
      type: String,
      required: [true, "Por favor agrega tu contraseña"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicture: {
      type: String,
      default: "https://img.freepik.com/free-icon/user_318-644324.jpg",
    },
    sanctions: [
      {
        reason: {
          type: String,
          required: [true, "Por favor agrega la razón de la sanción."],
          default: "",
        },
        description: {
          type: String,
          required: [true, "Por favor agrega la descripción de la sanción."],
          default: "",
        },
        amount: {
          type: Number,
          required: [true, "Por favor agrega el monto de la penalización."],
          default: 0,
        },
        date: {
          type: Date,
          required: [true, "Por favor agrega la fecha de la sanción."],
          default: Date.now(),
        },
      },
    ],
    penalties: [
      {
        reason: {
          type: String,
          required: [true, "Por favor agrega la razón de la penalización."],
          default: "",
        },
        description: {
          type: String,
          required: [
            true,
            "Por favor agrega la descripción de la penalización.",
          ],
          default: "",
        },
        amount: {
          type: Number,
          required: [true, "Por favor agrega el monto de la penalización."],
          default: 0,
        },
        date: {
          type: Date,
          required: [true, "Por favor agrega la fecha de la sanción."],
          default: Date.now(),
        },
      },
    ],
    dues: [
      {
        reason: {
          type: String,
          required: [true, "Por favor agrega la razón de la cuota."],
          default: "",
        },
        description: {
          type: String,
          required: [true, "Por favor agrega la descripción de la cuota."],
          default: "",
        },
        amount: {
          type: Number,
          required: [true, "Por favor agrega el monto de la cuota."],
          default: 0,
        },
        date: {
          type: Date,
          required: [true, "Por favor agrega la fecha de la sanción."],
          default: Date.now(),
        },
      },
    ],
    career: {
      type: String,
      required: [
        true,
        "Por favor agrega el nombre de la carrera que estás estudiando.",
      ],
    },
    university: {
      type: String,
      required: [
        true,
        "Por favor agrega el nombre de la universidad en la que estás estudiando.",
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next;
  } else {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.matchPasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
