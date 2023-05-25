import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^\+\d{11,}$/;

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: emailRegex,
    unique: true,
  },
  phone: {
    type: String,
    minlength: 13,
    validate: {
      validator: (value) => phoneRegex.test(value),
      message: (props) => `${props.value} is not a valid phone number`,
    },
    required: [true, "Phone number is required"],
    unique: true,
  },
  token: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  role: {
    type: String,
    default: "user",
  },
});

export const registerScheme = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
  phone: Joi.string().pattern(phoneRegex).required(),
  address: Joi.string().required(),
});

export const loginScheme = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().pattern(emailRegex).required(),
});

export const emailScheme = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

userSchema.post("save", handleMongooseError);

export const Users = model("user", userSchema);
