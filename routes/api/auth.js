import express from "express";
import {
  getCurrentCtrl,
  loginCtrl,
  logoutCtrl,
  patchUserDataCtrl,
  registerCtrl,
} from "../../controllers/auth.js";
import { authenticate } from "../../middlewares/authenticate.js";
import { loginScheme, registerScheme } from "../../models/users.js";
import validateBody from "../../middlewares/validateBody.js";

export const authRouter = express.Router();

authRouter.post("/register", validateBody(registerScheme), registerCtrl);
authRouter.post("/login", validateBody(loginScheme), loginCtrl);
authRouter.post("/logout", authenticate, logoutCtrl);
authRouter.patch("/data", authenticate, patchUserDataCtrl);
authRouter.get("/current", authenticate, getCurrentCtrl);
