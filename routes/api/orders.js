import express from "express";
import { getAllOrdersCtrl, getOrdersCtrl, postOrderCtrl } from "../../controllers/orders.js";
import { authenticate } from "../../middlewares/authenticate.js";

const ordersRouter = express.Router();

ordersRouter.get("/", authenticate, getOrdersCtrl);
ordersRouter.get("/all", authenticate, getAllOrdersCtrl);
ordersRouter.post("/", authenticate, postOrderCtrl);

export default ordersRouter;
