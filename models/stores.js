import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const storesScheme = new Schema(
  {
    name: { type: String, required: true },
    backdrop: { type: String, required: true },
    foodList: { type: Array, default: [] },
  },
  { versionKey: false, timestamps: true }
);

storesScheme.post("save", handleMongooseError);

export const Stores = model("stores", storesScheme);
