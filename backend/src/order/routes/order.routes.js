import express from "express";
import {
    createNewOrder,
    getAllOrders,
    getMyOrders,
    getSingleOrder,
    updateOrderStatus,
} from "../controllers/order.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();

// User routes
router.route("/new").post(auth, createNewOrder);
router.route("/myorders").get(auth, getMyOrders);
router.route("/:id").get(auth, getSingleOrder);

// Admin routes
router.route("/admin/all").get(auth, authByUserRole("admin"), getAllOrders);
router.route("/admin/:id").put(auth, authByUserRole("admin"), updateOrderStatus);

export default router;
