import ctrlWrapper from "../helpers/ctrlWrapper.js";
import { Stores } from "../models/stores.js";

const getStores = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const totalStores = await Stores.countDocuments({});
  const stores = await Stores.find({}, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  res.json({ stores, totalPages: Math.ceil(totalStores / limit) });
};

export const getStoresCtrl = ctrlWrapper(getStores);
