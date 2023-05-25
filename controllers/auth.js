import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { Users } from "../models/users.js";

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (user) {
    throw HttpError(409, "Email is already registered");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await Users.create({
    ...req.body,
    password: hashPassword,
  });
  res.status(201).json({
    email: newUser.email,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  if (!user) throw HttpError(401, "Incorrect email or password");

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) throw HttpError(401, "Invalid password");
  const payload = { id: user.id };
  const { SECRET_KEY } = process.env;
  const { _id: id, name, address, phone, role } = user;
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "161h" });
  await Users.findByIdAndUpdate(id, { token });

  res.json({
    id,
    name,
    email,
    address,
    phone,
    role,
    token,
  });
};

const googleAuth = async (req, res) => {
  const { credential } = req.body;
  const decoded = jwt.decode(credential);
  if (!decoded) throw HttpError(401, "Invalid token");
  const { email, name } = decoded;
  const { SECRET_KEY } = process.env;
  const user = await Users.findOne({ email });

  if (!user) {
    const password = `${nanoid(4)}${name}`;
    const hashPassword = await bcrypt.hash(password, 10);
    await Users.create({
      email,
      name,
      password: hashPassword,
    });
    const { _id, role } = await Users.findOne({ email });
    const payload = { id: _id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "161h" });
    await Users.findByIdAndUpdate(_id, { token });
    res.json({
      id: _id,
      email,
      name,
      token,
      role,
    });
    return;
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "161h" });
  await Users.findByIdAndUpdate(user._id, { token });
  res.json({
    id: user._id,
    email,
    name,
    token,
    role: user.role,
  });
};

const logout = async (req, res) => {
  const { _id: id } = req.user;
  await Users.findByIdAndUpdate(id, { token: "" });
  res.json({
    message: "Logout successfully",
  });
};

const getCurrent = async (req, res) => {
  const { email } = req.user;
  res.json({
    email,
  });
};

const patchUserData = async (req, res) => {
  const { _id: id } = req.user;
  const { address = null, phone = null } = req.body;
  if (phone) {
    const phoneIsAlreadyAdded = await Users.findOne({ phone });
    if (phoneIsAlreadyAdded) throw HttpError(409, "Phone is already added");
    else {
      await Users.findByIdAndUpdate(id, { phone });
    }
  }
  if (address) {
    await Users.findByIdAndUpdate(id, { address });
  }
  const user = await Users.findById(id);
  res.status(201).json({
    address: user.address,
    phone: user.phone,
  });
};

export const registerCtrl = ctrlWrapper(register);
export const loginCtrl = ctrlWrapper(login);
export const getCurrentCtrl = ctrlWrapper(getCurrent);
export const logoutCtrl = ctrlWrapper(logout);
export const googleAuthCtrl = ctrlWrapper(googleAuth);
export const patchUserDataCtrl = ctrlWrapper(patchUserData);
