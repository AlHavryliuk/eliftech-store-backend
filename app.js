import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import storesRouter from "./routes/api/stores.js";
import { authRouter } from "./routes/api/auth.js";
import ordersRouter from "./routes/api/orders.js";

dotenv.config();
const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);
app.use(express.json());

app.use("/api/stores", storesRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
