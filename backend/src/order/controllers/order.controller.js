import {
  createNewOrderRepo,
  getAllOrdersRepo,
  getMyOrdersRepo,
  getSingleOrderRepo,
  updateOrderStatusRepo,
} from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

// POST /order/new — place a new order (auth user)
export const createNewOrder = async (req, res, next) => {
  try {
    const orderData = req.body;
    orderData.user = req.user._id;
    orderData.paidAt = new Date();
    const resp = await createNewOrderRepo(orderData);
    res.status(201).json({ success: true, msg: "Order placed!", order: resp });
  } catch (error) {
    return next(new ErrorHandler(400, error.message));
  }
};

// GET /order/admin/all — get all orders (admin only)
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await getAllOrdersRepo();
    const totalAmount = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    res.status(200).json({ success: true, orders, totalAmount });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// GET /order/myorders — get logged-in user's orders
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await getMyOrdersRepo(req.user._id);
    res.status(200).json({ success: true, orders });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// GET /order/:id — get single order by ID
export const getSingleOrder = async (req, res, next) => {
  try {
    const order = await getSingleOrderRepo(req.params.id);
    if (!order) return next(new ErrorHandler(404, "Order not found"));
    res.status(200).json({ success: true, order });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
};

// PUT /order/admin/:id — update order status (admin only)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) return next(new ErrorHandler(400, "Please provide a status"));
    const order = await updateOrderStatusRepo(req.params.id, status);
    res.status(200).json({ success: true, msg: "Order status updated", order });
  } catch (error) {
    return next(new ErrorHandler(400, error.message));
  }
};
