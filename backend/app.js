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
if (!process.env.FRONTEND_URL) {
  console.warn(
    "⚠️  WARNING: FRONTEND_URL environment variable is not set. " +
    "CORS will block all cross-origin requests. " +
    "Set FRONTEND_URL in your Render environment variables."
  );
}

const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((url) => url.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. server-to-server, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: origin '${origin}' not allowed`));
  },
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS for all routes
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// configure routes
app.use("/api/storefleet/product", productRoutes);
app.use("/api/storefleet/user", userRoutes);
app.use("/api/storefleet/order", orderRoutes);

// errorHandlerMiddleware
app.use(errorHandlerMiddleware);

export default app;
