import OrderModel from "./order.schema.js";
import ProductModel from "../../product/model/product.schema.js";
import mongoose from "mongoose";

export const createNewOrderRepo = async (data) => {
  const session = await mongoose.startSession();
  let transactionCommitted = false;

  try {
    session.startTransaction();

    // Reduce the stock
    for (let order of data.orderedItems) {
      const product = await ProductModel.findById(order.product).session(session);

      if (!product) {
        throw new Error("Product not found: " + order.product);
      }

      product.stock -= order.quantity;
      if (product.stock < 0) {
        throw new Error("Not enough stock for " + product.name);
      }

      await product.save({ session });
    }

    // Create the order
    const order = new OrderModel(data);
    const resp = await order.save({ session });

    await session.commitTransaction();
    transactionCommitted = true;
    return resp;
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

// Get all orders (admin)
export const getAllOrdersRepo = async () => {
  return await OrderModel.find().populate("user", "name email");
};

// Get orders for a specific user
export const getMyOrdersRepo = async (userId) => {
  return await OrderModel.find({ user: userId });
};

// Get a single order by ID
export const getSingleOrderRepo = async (orderId) => {
  return await OrderModel.findById(orderId).populate("user", "name email");
};

// Update order status (admin)
export const updateOrderStatusRepo = async (orderId, status) => {
  const order = await OrderModel.findById(orderId);
  if (!order) throw new Error("Order not found");

  order.orderStatus = status;
  if (status === "Delivered") {
    order.deliveredAt = new Date();
  }

  return await order.save();
};

