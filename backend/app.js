import "./env.js";
import express from "express";
import cors from "cors";
import productRoutes from "./src/product/routes/product.routes.js";
import {
  errorHandlerMiddleware
} from "./middlewares/errorHandlerMiddleware.js";
import userRoutes from "./src/user/routes/user.routes.js";
import cookieParser from "cookie-parser";
import orderRoutes from "./src/order/routes/order.routes.js";

const app = express();

// CORS — must come before routes so preflight OPTIONS requests are handled
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// configure routes
app.use("/api/storefleet/product", productRoutes);
app.use("/api/storefleet/user", userRoutes);
app.use("/api/storefleet/order", orderRoutes);

// errorHandlerMiddleware
app.use(errorHandlerMiddleware);

export default app;
