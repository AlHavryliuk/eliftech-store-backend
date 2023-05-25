import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleMongooseError } from "../helpers/handleMongooseError.js";

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    items: { type: Array, required: true },
    totalPrice: { type: Number },
  },
  { timestamps: true }
);

export const addOrderScheme = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  items: Joi.array().required(),
  totalPrice: Joi.number().required(),
});

orderSchema.post("save", handleMongooseError);

export const Orders = model("orders", orderSchema);
