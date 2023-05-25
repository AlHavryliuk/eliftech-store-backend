import express from "express";
import { getStoresCtrl } from "../../controllers/stores.js";

const storesRouter = express.Router();

storesRouter.get("/", getStoresCtrl);

export default storesRouter;
