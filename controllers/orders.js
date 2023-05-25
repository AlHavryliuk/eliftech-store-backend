import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { Orders } from "../models/orders.js";
import { Stores } from "../models/stores.js";

const getOrders = async (req, res) => {
  const { _id: userId } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const filter = {
    userId,
  };
  const totalOrders = await Orders.countDocuments({});
  const orders = await Orders.find(filter, "", {
    skip,
    limit,
  }).populate("storeId", "name");
  res.json({ orders, totalOrders: Math.ceil(totalOrders / limit) });
};

const postOrder = async (req, res) => {
  const { _id: userId } = req.user;
  const { storeId, items } = req.body;
  const store = await Stores.findById(storeId);
  if (!store) throw HttpError(400, "Unknown store");
  if (!items.length) throw HttpError(400, "Items is empty");
  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);
  const order = await Orders.create({ userId, storeId, items, totalPrice });
  res.status(201).json(order);
};

const getAllOrders = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const totalOrders = await Orders.countDocuments({});
  const orders = await Orders.find({}, "", {
    skip,
    limit,
  });
  res.status(201).json({ orders, totalOrders: Math.ceil(totalOrders / limit) });
};

export const getOrdersCtrl = ctrlWrapper(getOrders);
export const getAllOrdersCtrl = ctrlWrapper(getAllOrders);
export const postOrderCtrl = ctrlWrapper(postOrder);
